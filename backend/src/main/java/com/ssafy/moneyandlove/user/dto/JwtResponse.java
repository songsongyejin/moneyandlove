package com.ssafy.moneyandlove.user.dto;

import com.ssafy.moneyandlove.user.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {

	private String token;
	private boolean isSigned;
	private Long userId;

	public static JwtResponse from(String token, boolean isSigned, User user){
		return JwtResponse.builder()
			.token(token)
			.isSigned(isSigned)
			.userId(user.getId())
			.build();
	}
}
