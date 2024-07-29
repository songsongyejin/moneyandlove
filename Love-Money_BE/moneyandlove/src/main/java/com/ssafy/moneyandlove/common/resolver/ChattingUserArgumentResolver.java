package com.ssafy.moneyandlove.common.resolver;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.user.domain.User;

import jakarta.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.MethodParameter;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Slf4j
@Component
public class ChattingUserArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.hasParameterAnnotation(LoginUser.class)
			&& User.class.isAssignableFrom(parameter.getParameterType());
	}

	@Override
	@Nullable
	public Object resolveArgument(MethodParameter parameter, Message<?> message) {
		Principal principal = SimpMessageHeaderAccessor.getUser(message.getHeaders());

		if (principal instanceof AbstractAuthenticationToken abstractAuthenticationToken) {
			return abstractAuthenticationToken.getPrincipal();
		}
		return User.builder().id(1L).build();
	}
}
