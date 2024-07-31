package com.ssafy.moneyandlove.friend.dto;

import com.ssafy.moneyandlove.user.domain.Gender;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class FriendInfoResponse {
	private Long followerId;
	private String nickname;
	private int age;
	private String gender;
	private String img;

	public FriendInfoResponse(Long followerId, String nickname, int age, Gender gender, String img) {
		this.followerId = followerId;
		this.nickname = nickname;
		this.age = age;
		this.gender = gender != null ? gender.name() : null;
		this.img = img;
	}
}
