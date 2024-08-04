package com.ssafy.moneyandlove.matching.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.matching.application.MatchingService;
import com.ssafy.moneyandlove.matching.dto.MatchingUserRequest;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@RestController
@RequiredArgsConstructor
@RequestMapping("/matching")
public class MatchingController {

	private final MatchingService matchingService;

	@PostMapping
	public ResponseEntity<Map<String, Object>> match(@RequestBody MatchingUserRequest matchingUserRequest, @PathVariable Long userId) {
		matchingUserRequest.putUserId(userId);

		Future<Map<String, Object>> response = matchingService.startMatching(matchingUserRequest);
		try {
			Map<String, Object> result = response.get();
			if(result.get("status").equals("success")) {
				//화상 채팅이랑 세션 참가할 고유한 UUID 만들어서 줘야 함.
				String uuid =  UUID.randomUUID().toString();
				result.put("sessionId", uuid);
			}
			return ResponseEntity.ok(result);
		} catch (InterruptedException | ExecutionException e) {
			// 에러 처리 로직
			return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
		}
	}

}
