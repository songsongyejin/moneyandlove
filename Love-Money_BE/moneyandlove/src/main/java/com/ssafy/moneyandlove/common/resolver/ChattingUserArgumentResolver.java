package com.ssafy.moneyandlove.common.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.common.jwt.JwtProvider;
import com.ssafy.moneyandlove.user.domain.User;

import io.jsonwebtoken.Claims;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChattingUserArgumentResolver implements HandlerMethodArgumentResolver {

	private final static String HEADER_AUTHORIZATION = "Authorization";
	private final static String TOKEN_PREFIX = "Bearer ";

	private final JwtProvider jwtProvider;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.hasParameterAnnotation(LoginUser.class)
			&& User.class.isAssignableFrom(parameter.getParameterType());
	}

	@Override
	@Nullable
	public Object resolveArgument(MethodParameter parameter, Message<?> message) {

		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		String authorizationHeader = accessor.getFirstNativeHeader(HEADER_AUTHORIZATION);
		String token = getAccessToken(authorizationHeader);

		Claims claims = jwtProvider.validateToken(token);
		Authentication authentication = jwtProvider.getAuthentication(token);
		return authentication.getPrincipal();
	}

	private String getAccessToken(String authorizationHeader) {
		if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
			return authorizationHeader.substring(TOKEN_PREFIX.length());
		}
		return null;
	}
}
