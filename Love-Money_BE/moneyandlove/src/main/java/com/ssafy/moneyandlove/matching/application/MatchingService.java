package com.ssafy.moneyandlove.matching.application;

import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import com.ssafy.moneyandlove.face.application.FaceService;
import com.ssafy.moneyandlove.matching.dto.MatchingUserResponse;
import com.ssafy.moneyandlove.user.service.UserService;
import jakarta.annotation.PreDestroy;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.matching.dto.MatchingUserRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchingService {

	private final RedisTemplate<String, Object> redisTemplate;
	private final FaceService faceService;
	private final UserService userService;
	private static final String MATCHING_QUEUE = "matchingQueue";
	private static final String MATCHING_RESULT_PREFIX = "matchingResult:";

	private final ExecutorService executorService = Executors.newCachedThreadPool();


	public Future<Map<String, Object>> startMatching(MatchingUserRequest matchingUserRequest) {
		Long userId = matchingUserRequest.getUserId();
		matchingUserRequest.putGenderFromUser(userService.getGender(userId));
		matchingUserRequest.putFaceScoreFromFace(faceService.getFaceScoreByUserId(userId));
		return executorService.submit(() -> match(matchingUserRequest));
	}

	@PreDestroy
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

	public Map<String, Object> match(MatchingUserRequest matchingUserRequest) {
		Map<String, Object> response = new HashMap<>();
		Long userId = matchingUserRequest.getUserId();

		// 매칭 상태 확인
		if (checkMatchingStatus(response, userId)) {
			return response;
		}

		addToQueue(matchingUserRequest);

		//3분동안 매칭 대기
		long endTime = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(3);

		while (System.currentTimeMillis() < endTime) {
			// 매칭 상태 확인
			if (checkMatchingStatus(response, userId)) {
				return response;
			}

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
				MatchingUserResponse fromUser = userService.getUserDetails(matchingUserRequest.getUserId(), matchingUserRequest.getPosition(), matchingUserRequest.getMatchType());
				MatchingUserResponse toUser = userService.getUserDetails(matchedUser.getUserId(), matchedUser.getPosition(), matchedUser.getMatchType());
				response.put("status", "success");
				response.put("fromUser", fromUser);
				response.put("toUser", toUser);

				// 매칭 상태 저장
				saveMatchingResult(matchingUserRequest.getUserId(), matchedUser.getUserId(), fromUser, toUser);

				return response;
			}
			try {
				Thread.sleep(5000); // 5초 대기
			} catch (InterruptedException e) {
				// 현재 스레드의 인터럽트 상태를 복구하고 메서드를 종료
				Thread.currentThread().interrupt();
				// 인터럽트 발생 시 대기 큐에서 사용자 제거
				redisTemplate.opsForZSet().remove(MATCHING_QUEUE, matchingUserRequest);
				response.put("status", "interrupted");
				break;
			}
		}
		// No match found within 3 minutes.
		//deleteFromQue
		redisTemplate.opsForZSet().remove(MATCHING_QUEUE, matchingUserRequest);
		response.put("status", "timeout");
		return response;
    }

	private void saveMatchingResult(Long userId1, Long userId2, MatchingUserResponse fromUser, MatchingUserResponse toUser) {
		String matchKey = generateMatchKey(userId1, userId2);
		Map<String, Object> matchInfo = new HashMap<>();
		matchInfo.put("fromUser", fromUser);
		matchInfo.put("toUser", toUser);

		//화상 채팅이랑 세션 참가할 고유한 UUID 만들어서 줘야 함.
		String uuid =  UUID.randomUUID().toString();
		matchInfo.put("sessionId", uuid);

		// Redis에 매칭 결과 저장 및 TTL 설정 (예: 10분)
		redisTemplate.opsForValue().set(matchKey, matchInfo, 10, TimeUnit.MINUTES);
	}

	private String generateMatchKey(Long userId1, Long userId2) {
		return userId1 < userId2 ? MATCHING_RESULT_PREFIX + userId1 + "-" + userId2 : MATCHING_RESULT_PREFIX + userId2 + "-" + userId1;
	}

	private boolean checkMatchingStatus(Map<String, Object> response, Long userId) {
		Set<String> matchKeys = redisTemplate.keys(MATCHING_RESULT_PREFIX + "*");
		for (String matchKey : matchKeys) {
			if (matchKey.contains(userId.toString())) {
				// 이미 매칭된 사용자 정보 반환
				Map<String, Object> matchInfo = (Map<String, Object>) redisTemplate.opsForValue().get(matchKey);
				response.put("status", "success");
				response.put("fromUser", matchInfo.get("toUser"));
				response.put("toUser", matchInfo.get("fromUser"));
				response.put("sessionId", matchInfo.get("sessionId"));
				return true;
			}
		}
		return false;
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
		Set<Long> top30PercentUserIds = faceService.getTop30PercentFaceUserIds();

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

		String candidateMatchingType = candidate.getMatchType();
		String userPosition = matchingUserRequest.getPosition();

		if (!candidate.getGender().equals(matchingUserRequest.getGender())) {
			/*
			* 이전에 매칭되었던 사람인지 체크하는 로직
			* */

			if(candidateMatchingType.equals("love")&&userPosition.equals("money")) {
				return false;
			}else if(candidateMatchingType.equals("top30")){
				Set<Long> top30PercentUserIds = faceService.getTop30PercentFaceUserIds();
				return top30PercentUserIds.contains(matchingUserRequest.getUserId());
			}
			return true;
		}
		return false;
	}


}