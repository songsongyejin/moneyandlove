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

@RestController
@RequiredArgsConstructor
@RequestMapping("/matching")
public class MatchingController {

	private final MatchingService matchingService;

	@PostMapping
	public ResponseEntity<?> match(@RequestBody MatchingUserRequest matchingUserRequest) {
		matchingService.match(matchingUserRequest);
		return ResponseEntity.ok().build();
	}

}
