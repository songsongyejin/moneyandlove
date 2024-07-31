package com.ssafy.moneyandlove.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.jwt.JwtProvider;
import com.ssafy.moneyandlove.user.dto.JwtResponse;
import com.ssafy.moneyandlove.user.dto.KakaoAccount;
import com.ssafy.moneyandlove.user.dto.KakaoToken;
import com.ssafy.moneyandlove.user.dto.SignUpRequest;
import com.ssafy.moneyandlove.user.dto.SignUpResponse;
import com.ssafy.moneyandlove.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;
	private final JwtProvider jwtProvider;

	@GetMapping("/login/oauth2/callback")
	public ResponseEntity<?> kakaoCallback(@RequestParam("code") String code) {
		log.info("code is {}", code);
		KakaoToken kakaoAccessToken = userService.getKakaoAccessToken(code);
		log.info("kakaoAccessToken is {}", kakaoAccessToken);
		KakaoAccount kakaoInfo = userService.getKaKaoInfo(kakaoAccessToken);
		log.info("kaKaoInfo is {}", kakaoInfo);
		if (userService.isSigned(kakaoInfo)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(userService.findByKakaoId(kakaoInfo));
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(SignUpResponse.from(kakaoInfo));
	}

	@PostMapping("/user")
	public ResponseEntity<?> sign(@RequestBody SignUpRequest signUpRequest) {
		JwtResponse token = userService.save(signUpRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(token);
	}
}