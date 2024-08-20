package com.ssafy.moneyandlove.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class KakaoToken {
	private String access_token;
	private String token_type;
	private String refresh_token;
	private String id_token;
	private int expires_in;
	private int refresh_token_expires_in;
	private String scope;
}
