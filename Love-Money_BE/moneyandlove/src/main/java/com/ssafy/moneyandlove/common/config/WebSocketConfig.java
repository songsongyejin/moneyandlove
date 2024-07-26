package com.ssafy.moneyandlove.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
//웹소켓 활성화 어노테이션
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

}
