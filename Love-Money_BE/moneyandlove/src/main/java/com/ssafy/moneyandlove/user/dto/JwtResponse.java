package com.ssafy.moneyandlove.user.dto;

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

	public static JwtResponse from(String token){
		return JwtResponse.builder()
			.token(token)
			.build();
	}
}
