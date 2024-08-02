package com.ssafy.moneyandlove.matching.application;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.face.domain.Face;
import com.ssafy.moneyandlove.face.repository.FaceRepository;
import com.ssafy.moneyandlove.matching.dto.MatchingUserRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchingService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final FaceRepository faceRepository;
	private static final String MATCHING_QUEUE = "matchingQueue";
	private List<Face> top30PercentFaces;

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
				System.out.println("Matched with user: " + matchedUser.getUserId());
				// isValidMatch(matchingUserRequest, matchedUser);
				return;
			}
			try {
				Thread.sleep(5000); // 5초 대기
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
				return;
			}
		}
		System.out.println("No match found within 3 minutes.");
	}

	public void addToQueue(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();

		//전체 대기 큐
		zSetOps.add(MATCHING_QUEUE, matchingUserRequest, System.currentTimeMillis());
	}

	public MatchingUserRequest randomMatch(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
		Set<Object> candidates = zSetOps.range(MATCHING_QUEUE, 0, -1);
		return findValidCandidate(matchingUserRequest, candidates, "random");
	}

	public MatchingUserRequest lovePositionMatch(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
		Set<Object> candidates = zSetOps.range(MATCHING_QUEUE, 0, -1);

		// Filter candidates to find those who selected the love position
		Set<Object> loveCandidates = candidates.stream()
			.map(obj -> (MatchingUserRequest) obj)
			.filter(candidate -> "love".equals(candidate.getPosition()))
			.collect(Collectors.toSet());

		return findValidCandidate(matchingUserRequest, loveCandidates, "love");
	}

	public MatchingUserRequest top30PercentMatch(MatchingUserRequest matchingUserRequest) {
		ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
		Set<Object> candidates = zSetOps.rangeByScore(MATCHING_QUEUE, 0, Double.MAX_VALUE);

		// Get all faces ordered by faceScore in descending order
		List<Face> allFaces = faceRepository.findAllOrderByFaceScoreDesc();
		int top30Index = (int) (allFaces.size() * 0.3);
		if (top30Index == 0) {
			top30Index = 1;
		}

		// Get the top 30% faces
		top30PercentFaces = allFaces.subList(0, top30Index);

		// Filter candidates who are in the top 30% faces
		List<MatchingUserRequest> validCandidates = candidates.stream()
			.map(obj -> (MatchingUserRequest) obj)
			.filter(candidate -> top30PercentFaces.stream()
				.anyMatch(face -> face.getUser().getId().equals(candidate.getUserId())))
			.collect(Collectors.toList());

		// If there are no valid candidates, return null
		if (validCandidates.isEmpty()) {
			return null;
		}

		// Select a random valid candidate
		int min = 0;
		int max = validCandidates.size() - 1;
		int randomIndex = (int) (Math.random() * (max - min + 1)) + min;

		MatchingUserRequest matchedUser = validCandidates.get(randomIndex);

		if (isValidMatch(matchingUserRequest, matchedUser, "top30")) {
			return matchedUser;
		}
		return null;
	}

	private MatchingUserRequest findValidCandidate(MatchingUserRequest user, Set<Object> candidates, String matchType) {
		for (Object candidateObj : candidates) {
			MatchingUserRequest candidate = (MatchingUserRequest) candidateObj;
			if (isValidMatch(user, candidate, matchType) && isValidMatch(candidate, user, matchType)) {
				redisTemplate.opsForZSet().remove(MATCHING_QUEUE, candidate);
				return candidate;
			}
		}
		return null;
	}

	private boolean isValidMatch(MatchingUserRequest matchingUserRequest, MatchingUserRequest candidate, String matchType) {
		// 양방향 조건 검사: 서로의 조건에 부합하는지 확인

		//여성 남성의 조건에 맞는지 검사
		if (!candidate.getGender().equals(matchingUserRequest.getGender())) {
			if ("random".equals(matchType)) {
				return true;
			} else if ("love".equals(matchType)) {
				return "love".equals(matchingUserRequest.getPosition()) && "love".equals(candidate.getPosition());
			} else if ("top30".equals(matchType)) {
				// 상위 30% 매칭 조건은 이미 별도로 처리되므로 여기서는 true를 반환
				return true;
			}
		}
		return false;
	}


}
