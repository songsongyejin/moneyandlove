package com.ssafy.moneyandlove.friend.dto;

import com.ssafy.moneyandlove.friend.domain.Friend;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
public class CreateFriendRequest {
	private Long followingId;
	private Long followerId;

	private CreateFriendRequest(Long followingId, Long followerId){
		this.followerId = followerId;
		this.followingId = followingId;
	}

	//DTO -> Entity
	public static Friend toFriend(Long followingId, Long followerId){
		return Friend.builder().follower(followerId).following(followingId).build();
	}
}
