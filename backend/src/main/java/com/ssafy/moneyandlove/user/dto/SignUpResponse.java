package com.ssafy.moneyandlove.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class SignUpResponse {

	private Long kakaoId;
	private String profileURL;
	private boolean isSigned;

	public static SignUpResponse from(KakaoAccount kakaoAccount){
		return SignUpResponse.builder()
			.kakaoId(kakaoAccount.getId())
			.profileURL(kakaoAccount.getProfileImage())
			.build();
	}
}
