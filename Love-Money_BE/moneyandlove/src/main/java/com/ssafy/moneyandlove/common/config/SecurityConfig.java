package com.ssafy.moneyandlove.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.moneyandlove.common.filter.JwtAuthenticateFilter;
import com.ssafy.moneyandlove.common.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

	private final JwtProvider jwtProvider;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(AbstractHttpConfigurer::disable)
			.cors(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.logout(AbstractHttpConfigurer::disable)
			.headers(c -> c.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable).disable())
			.sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/health", "/user/login", "/user/sign").permitAll() // '/user' 경로와 그 하위 경로는 허용
				.requestMatchers("/chat/**", "/friends/**", "/attendance/**").authenticated()
				.anyRequest().authenticated() // 다른 모든 요청은 인증 요구
			)
			.addFilterBefore(new JwtAuthenticateFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
