package com.ssafy.moneyandlove.friend.dto;

import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class CreateFriendRequest {
	private Long followingId;
	private Long followerId;

	private  CreateFriendRequest(){}

	private CreateFriendRequest(Long followingId, Long followerId){
		this.followerId = followerId;
		this.followingId = followingId;
	}

	// DTO -> Entity
	public static Friend toFriend(User follower, User following){
		return Friend.builder().follower(follower).following(following).build();
	}
}
