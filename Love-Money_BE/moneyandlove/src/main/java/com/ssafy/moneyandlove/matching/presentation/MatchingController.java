package com.ssafy.moneyandlove.matching.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.matching.application.MatchingService;
import com.ssafy.moneyandlove.matching.dto.MatchingUserRequest;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@RestController
@RequiredArgsConstructor
@RequestMapping("/matching")
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

}
