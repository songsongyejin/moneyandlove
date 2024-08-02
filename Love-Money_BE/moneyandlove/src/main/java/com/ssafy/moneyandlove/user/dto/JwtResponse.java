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
	private boolean isSigned;

	public static JwtResponse from(String token, boolean isSigned){
		return JwtResponse.builder()
			.token(token)
			.isSigned(isSigned)
			.build();
	}
}
