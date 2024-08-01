package com.ssafy.moneyandlove.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.user.domain.User;
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
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping
	public ResponseEntity<?> kakaoCallback(@RequestParam("code") String code) {
		log.info("code is {}", code);
		KakaoToken kakaoAccessToken = userService.getKakaoAccessToken(code);
		log.info("kakaoAccessToken is {}", kakaoAccessToken);
		KakaoAccount kakaoInfo = userService.getKaKaoInfo(kakaoAccessToken);
		log.info("kaKaoInfo is {}", kakaoInfo);
		if (userService.isSigned(kakaoInfo)) {
			return ResponseEntity.status(HttpStatus.OK).body(userService.findByKakaoId(kakaoInfo));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(SignUpResponse.from(kakaoInfo));
	}

	@PostMapping
	public ResponseEntity<?> sign(@RequestBody SignUpRequest signUpRequest) {
		JwtResponse token = userService.save(signUpRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(token);
	}

	@DeleteMapping
	public ResponseEntity<?> withdrawal(@LoginUser User loginUser){
		log.info("userId {}",loginUser.getId());
		userService.withdrawal(loginUser);
		return ResponseEntity.status(HttpStatus.OK).body("탈퇴 완료");
	}

	@GetMapping("/my")
	public ResponseEntity<?> findById(@LoginUser User loginUser) {
		log.info("userId {}",loginUser.getId());
		return ResponseEntity.status(HttpStatus.OK).body(userService.findById(loginUser));
	}
}