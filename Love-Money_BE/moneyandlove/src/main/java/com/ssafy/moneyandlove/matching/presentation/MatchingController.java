package com.ssafy.moneyandlove.matching.presentation;

import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.matching.application.MatchingService;
import com.ssafy.moneyandlove.matching.dto.MatchingUserRequest;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/matching")
public class MatchingController {

	private final MatchingService matchingService;

	@PostMapping
	public ResponseEntity<Map<String, Object>> match(@RequestBody MatchingUserRequest matchingUserRequest, @LoginUser User loginUser) {
		matchingUserRequest.putUserId(loginUser.getId());

		Future<Map<String, Object>> response = matchingService.startMatching(matchingUserRequest);
		try {
			Map<String, Object> result = response.get();
			return ResponseEntity.ok(result);
		} catch (InterruptedException | ExecutionException e) {
			// 에러 처리 로직
			return ResponseEntity.status(601).body(Map.of("status", "error", "message", e.getMessage()));
		}
	}

	@PutMapping
	public ResponseEntity<?> cancleMatch(@RequestBody MatchingUserRequest matchingUserRequest, @LoginUser User loginUser){
		matchingUserRequest.putUserId(loginUser.getId());
		matchingService.cancleMatching(matchingUserRequest);
		return ResponseEntity.ok().build();
	}

}
