package com.ssafy.moneyandlove.user.dto;

import com.ssafy.moneyandlove.user.domain.Gender;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class UserProfileResponse {

	private String email;
	private String nickname;
	private Gender gender;
	private long gamePoint;
	private String region;
	private String profileURL;

	public static UserProfileResponse from(User user) {
		return UserProfileResponse.builder()
			.email(user.getEmail())
			.nickname(user.getNickname())
			.gender(user.getGender())
			.gamePoint(user.getGamePoint())
			.region(user.getRegion())
			.profileURL(user.getProfileURL())
			.build();
	}
}
