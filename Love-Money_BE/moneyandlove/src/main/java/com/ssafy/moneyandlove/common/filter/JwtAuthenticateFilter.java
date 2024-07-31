package com.ssafy.moneyandlove.common.filter;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.common.jwt.JwtProvider;

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
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		log.info("request is {}", request);

		String authorizationHeader = request.getHeader(HEADER_AUTHORIZATION);
		if(authorizationHeader == null){
			throw new MoneyAndLoveException(ErrorType.USER_NOT_FOUND);
		}
		log.info("authorize {}", authorizationHeader);
		String token = getAccessToken(authorizationHeader);
		log.info("token is {}", token);
		doFilter(request, response, filterChain);
	}

	private String getAccessToken(String authorizationHeader) {
		if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
			return authorizationHeader.substring(TOKEN_PREFIX.length());
		}
		return null;
	}
}
