package com.ssafy.moneyandlove.matching.application;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.face.repository.FaceRepository;
import com.ssafy.moneyandlove.matching.dto.MatchingUserRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchingService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final FaceRepository faceRepository;
	private static final String MATCHING_QUEUE = "matchingQueue";
	private static final String TOP_30_PERCENT_FACES_CACHE = "top30PercentFaces";

	private final ExecutorService executorService = Executors.newCachedThreadPool();

	public void startMatching(MatchingUserRequest matchingUserRequest) {
		executorService.submit(() -> match(matchingUserRequest));
	}

	public void stop() {
		executorService.shutdown();
		try {
			if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
				executorService.shutdownNow();
			}
		} catch (InterruptedException e) {
			executorService.shutdownNow();
		}
	}

	public void match(MatchingUserRequest matchingUserRequest) {
		addToQueue(matchingUserRequest);

		//5분동안 매칭 대기
		long endTime = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(5);

		while (System.currentTimeMillis() < endTime) {
			MatchingUserRequest matchedUser = null;
			switch (matchingUserRequest.getMatchType()) {
				case "random":
					matchedUser = randomMatch(matchingUserRequest);
					break;
				case "love":
					matchedUser = lovePositionMatch(matchingUserRequest);
					break;
				case "top30":
					matchedUser = top30PercentMatch(matchingUserRequest);
					break;
				default:
					throw new MoneyAndLoveException(ErrorType.MATCHING_TYPE_NOT_SUPPORTED);
			}

			if (matchedUser != null) {
				//successMatch
				System.out.println("Matched with user: " + matchedUser.getUserId());
				return;
			}
			try {
				Thread.sleep(5000); // 5초 대기
			} catch (InterruptedException e) {
				// 현재 스레드의 인터럽트 상태를 복구하고 메서드를 종료
				Thread.currentThread().interrupt();
				break;
			}
		}
		// No match found within 5 minutes.
		//deleteFromQue
		redisTemplate.opsForZSet().remove(MATCHING_QUEUE, matchingUserRequest);
	}

	@Cacheable(value = TOP_30_PERCENT_FACES_CACHE)
	public Set<Long> getTop30PercentFaceUserIds() {
		List<Long> allUserIds = faceRepository.findAllUserIdsOrderByFaceScoreDesc();
		int top30Index = (int) (allUserIds.size() * 0.3);
		if (top30Index == 0) {
			top30Index = 1;
		}
		return allUserIds.subList(0, top30Index).stream().collect(Collectors.toCollection(LinkedHashSet::new));
	}

	public void addToQueue(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();

		//전체 대기 큐
		zSetOps.add(MATCHING_QUEUE, matchingUserRequest, System.currentTimeMillis());
	}

	public MatchingUserRequest randomMatch(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
		Set<Object> candidates = zSetOps.range(MATCHING_QUEUE, 0, -1);
		return findValidCandidate(matchingUserRequest, candidates);
	}

	public MatchingUserRequest lovePositionMatch(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
		Set<Object> candidates = zSetOps.range(MATCHING_QUEUE, 0, -1);

		// Filter candidates to find those who selected the love position
		Set<Object> loveCandidates = candidates.stream()
				.map(obj -> (MatchingUserRequest) obj)
				.filter(candidate -> "love".equals(candidate.getPosition()))
				.collect(Collectors.toCollection(LinkedHashSet::new));

		return findValidCandidate(matchingUserRequest, loveCandidates);
	}

	public MatchingUserRequest top30PercentMatch(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
		Set<Object> candidates = zSetOps.range(MATCHING_QUEUE, 0, -1);

		// Get the top 30% faces
		Set<Long> top30PercentUserIds = getTop30PercentFaceUserIds();

		// Filter candidates who are in the top 30% faces
		Set<Object> top30Candidates = candidates.stream()
			.map(obj -> (MatchingUserRequest) obj)
			.filter(candidate -> top30PercentUserIds.contains(candidate.getUserId()))
			.collect(Collectors.toCollection(LinkedHashSet::new));

		return findValidCandidate(matchingUserRequest, top30Candidates);

	}

	private MatchingUserRequest findValidCandidate(MatchingUserRequest matchingUserRequest, Set<Object> candidates) {
		for (Object candidateObj : candidates) {
			MatchingUserRequest candidate = (MatchingUserRequest) candidateObj;
			if (isValidMatch(matchingUserRequest, candidate)) {
				redisTemplate.opsForZSet().remove(MATCHING_QUEUE, candidate);
				redisTemplate.opsForZSet().remove(MATCHING_QUEUE, matchingUserRequest); //user도 지워야 함
				return candidate;
			}
		}
		return null;
	}

	private boolean isValidMatch(MatchingUserRequest matchingUserRequest, MatchingUserRequest candidate) {
		// Bidirectional condition check
		// 1. 여성<-->남성인지 체크
		// 2. 이전에 매칭되었던 사람인지 체크
		// 3. 상대방의 조건에 내가 부합하는지 체크

		String userMatchingType = matchingUserRequest.getMatchType();
		String candidateMatchingType = candidate.getMatchType();
		String userPosition = matchingUserRequest.getPosition();
		String candidatePosition = candidate.getPosition();

		if (!candidate.getGender().equals(matchingUserRequest.getGender())) {
			/*
			* 이전에 매칭되었던 사람인지 체크하는 로직
			* */

			if(candidateMatchingType.equals("love")&&userPosition.equals("money")) {
				return false;
			}else if(candidateMatchingType.equals("top30")){
				Set<Long> top30PercentUserIds = getTop30PercentFaceUserIds();
				return top30PercentUserIds.contains(matchingUserRequest.getUserId());
			}
			return true;
		}
		return false;
	}


}
