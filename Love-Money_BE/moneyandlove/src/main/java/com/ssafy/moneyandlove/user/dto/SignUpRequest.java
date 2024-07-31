package com.ssafy.moneyandlove.user.dto;

import com.ssafy.moneyandlove.user.domain.Gender;
import com.ssafy.moneyandlove.user.domain.User;

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

	public static User toUser(SignUpRequest signUpRequest){
		return User.builder()
			.kakaoId(signUpRequest.getKakaoId())
			.age(signUpRequest.getAge())
			.email(signUpRequest.getEmail())
			.nickname(signUpRequest.getNickname())
			.gender(signUpRequest.getGender())
			.gamePoint(signUpRequest.getGamePoint())
			.gender(signUpRequest.getGender())
			.region(signUpRequest.getRegion())
			.age(signUpRequest.getAge())
			.profileURL(signUpRequest.getProfileURL())
			.build();
	}
}
