package com.ssafy.moneyandlove.common.filter;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.moneyandlove.user.application.UserService;
import com.ssafy.moneyandlove.user.dto.JwtResponse;
import com.ssafy.moneyandlove.user.dto.KakaoAccount;
import com.ssafy.moneyandlove.user.dto.KakaoToken;
import com.ssafy.moneyandlove.user.dto.SignUpResponse;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class OAuthLoginFilter extends OncePerRequestFilter {

	private final UserService userService;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		String code = request.getParameter("code");
		log.info("Received code: {}", code);

		KakaoToken kakaoAccessToken = userService.getKakaoAccessToken(code);
		log.info("Kakao access token: {}", kakaoAccessToken);

		KakaoAccount kakaoInfo = userService.getKaKaoInfo(kakaoAccessToken);
		log.info("Kakao account info: {}", kakaoInfo);

		Object result;
		if (userService.isSigned(kakaoInfo)) {
			result = userService.findByKakaoId(kakaoInfo);
			ResponseCookie jwtCookie = ResponseCookie.from("token", ((JwtResponse)result).getToken())
				.httpOnly(true)
				.secure(false)
				.path("/")
				.maxAge(Duration.ofDays(30))
				.sameSite("Strict")
				.build();
			response.addHeader("Set-Cookie", jwtCookie.toString());
		} else {
			result = SignUpResponse.from(kakaoInfo);
		}

		response.setStatus(HttpStatus.OK.value());
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(objectMapper.writeValueAsString(result));
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		String[] includePath = {"/api/user/login"};
		String path = request.getRequestURI();
		return Arrays.stream(includePath).noneMatch(path::startsWith);
	}
}
