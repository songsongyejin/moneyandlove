package com.ssafy.moneyandlove.common.config;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.common.resolver.ChattingUserArgumentResolver;
import com.ssafy.moneyandlove.user.domain.User;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.MethodParameter;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.List;

@Configuration
//웹소켓 활성화 어노테이션
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {

		//클라이언트에서 메세지를 보낼 때 url에 붙여야할 preix
		config.setApplicationDestinationPrefixes("/chat");
		//클라이언트가 구독한 url
		config.enableSimpleBroker("/chat/receive");

	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/websocket")
			.setAllowedOriginPatterns("*")
			.withSockJS();
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
		argumentResolvers.add(chattingUserArgumentResolver());
	}

	HandlerMethodArgumentResolver chattingUserArgumentResolver() {
		return new ChattingUserArgumentResolver();
	}
}
