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
public class UserProfileUpdateRequest {

	private String email;
	private String nickname;
	private Gender gender;
	private long gamePoint;
	private String region;
	private String profileURL;

	public static User toUser(UserProfileUpdateRequest userProfileUpdateRequest) {
		return User.builder()
			.email(userProfileUpdateRequest.getEmail())
			.nickname(userProfileUpdateRequest.getNickname())
			.gender(userProfileUpdateRequest.getGender())
			.gamePoint(userProfileUpdateRequest.getGamePoint())
			.region(userProfileUpdateRequest.getRegion())
			.profileURL(userProfileUpdateRequest.getProfileURL())
			.build();
	}
}
