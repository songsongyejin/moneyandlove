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
	private Long chatRoomId;

	public FriendInfoResponse(Long followerId, String nickname, int age, Gender gender, String img, Long chatRoomId) {
		this.followerId = followerId;
		this.nickname = nickname;
		this.age = age;
		this.gender = gender != null ? gender.name() : null;
		this.img = img;
		this.chatRoomId = chatRoomId;
	}
}
