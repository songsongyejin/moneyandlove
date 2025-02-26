package com.ssafy.moneyandlove.common.interceptor;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.common.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class AuthChannelInterceptor implements ChannelInterceptor {

	private final static String HEADER_AUTHORIZATION = "Authorization";
	private final static String TOKEN_PREFIX = "Bearer ";

	private final JwtProvider jwtProvider;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
		if (accessor == null) {
			return message;
		}

		log.info("Stomp Command: {}", accessor.getCommand());

		if (StompCommand.CONNECT.equals(accessor.getCommand())) {
			handleConnect(accessor);
		}

		return message;
	}

	private void handleConnect(StompHeaderAccessor accessor) {
		String authHeader = accessor.getFirstNativeHeader(HEADER_AUTHORIZATION);
		if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
			return;
		}

		String token = authHeader.substring(TOKEN_PREFIX.length());
		log.info("Received token: {}", token);

		try {
			jwtProvider.validateToken(token);
			Authentication authentication = jwtProvider.getAuthentication(token);
			accessor.setUser(authentication);
		} catch (MoneyAndLoveException e) {
			throw new MoneyAndLoveException(e.getErrorType());
		}
	}
}