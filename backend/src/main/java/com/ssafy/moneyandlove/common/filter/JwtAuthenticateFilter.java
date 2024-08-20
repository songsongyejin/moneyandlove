package com.ssafy.moneyandlove.common.filter;

import java.io.IOException;
import java.util.Arrays;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.moneyandlove.common.error.ErrorResponse;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.common.jwt.JwtProvider;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticateFilter extends OncePerRequestFilter {

	private final static String HEADER_AUTHORIZATION = "Authorization";
	private final static String TOKEN_PREFIX = "Bearer ";

	private final JwtProvider jwtProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		String authorizationHeader = request.getHeader(HEADER_AUTHORIZATION);
		String token = getAccessToken(authorizationHeader);
		log.info("uri: {} JWT : {}",request.getRequestURI(),token);
		try {
			Claims claims = jwtProvider.validateToken(token);
			log.info("loginUser: {}", claims.get("id"));
			Authentication authentication = jwtProvider.getAuthentication(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			filterChain.doFilter(request, response);
		} catch (MoneyAndLoveException ex) {
			jwtExceptionHandler(response, ex.getErrorType());
		} catch (Exception ex) {
			jwtExceptionHandler(response, ErrorType.TOKEN_INVALID);
		}
	}

	private String getAccessToken(String authorizationHeader) {
		if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
			return authorizationHeader.substring(TOKEN_PREFIX.length());
		}
		return null;
	}

	// 토큰에 대한 오류가 발생했을 때, 커스터마이징해서 Exception 처리 값을 클라이언트에게 알려준다.
	public void jwtExceptionHandler(HttpServletResponse response, ErrorType error) throws IOException {
		response.setStatus(error.getStatus().value());
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		String errorResponse = new ObjectMapper().writeValueAsString(ErrorResponse.of(error));
		response.getWriter().write(errorResponse);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		String[] excludePath = {"/health", "/api/user/sign", "/api/user/login", "/api/websocket"};
		String path = request.getRequestURI();
		return Arrays.stream(excludePath).anyMatch(path::startsWith);
	}
}
