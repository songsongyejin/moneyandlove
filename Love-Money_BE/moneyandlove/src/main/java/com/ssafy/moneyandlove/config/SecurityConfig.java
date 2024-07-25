package com.ssafy.moneyandlove.config;

import com.ssafy.moneyandlove.user.service.CustomOAuth2UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;

	@Autowired
	public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
		this.customOAuth2UserService = customOAuth2UserService;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.httpBasic(httpBasic -> httpBasic.disable())
			.formLogin(formLogin -> formLogin.disable())
			.csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화 (람다식 사용)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/**").permitAll()
				.anyRequest().authenticated()
			)
			.oauth2Login(oauth2 -> oauth2
				.userInfoEndpoint(userInfo -> userInfo
					.userService(customOAuth2UserService)
				)
				.defaultSuccessUrl("/loginSuccess")
				.failureUrl("/loginFailure")
			);

		return http.build();
	}
}