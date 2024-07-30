package com.ssafy.moneyandlove.user.dto;

import com.ssafy.moneyandlove.user.domain.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SignUpRequest {

	private Long kakaoId;
	private String email;
	private String nickname;
	private Gender gender;
	private long gamePoint;
	private String region;
	private int age;
	private String profileURL;
}
