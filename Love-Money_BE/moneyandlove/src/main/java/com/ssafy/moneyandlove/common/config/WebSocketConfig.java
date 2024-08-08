package com.ssafy.moneyandlove.common.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.ssafy.moneyandlove.common.resolver.ChattingUserArgumentResolver;

import lombok.RequiredArgsConstructor;

@Configuration
//웹소켓 활성화 어노테이션
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final ChattingUserArgumentResolver chattingUserArgumentResolver;

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
		return chattingUserArgumentResolver;
	}
}
