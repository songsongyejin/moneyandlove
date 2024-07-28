package com.ssafy.moneyandlove.friend.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.friend.dto.CreateFriendRequest;
import com.ssafy.moneyandlove.friend.repository.FriendRepository;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {

	private final FriendRepository friendRepository;
	private final UserRepository userRepository;

	@Transactional
	public void addFriend(CreateFriendRequest createFriendRequest) {
		User follower = userRepository.findById(createFriendRequest.getFollowerId())
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.FOLLOWER_NOT_FOUND));
		User following = userRepository.findById(createFriendRequest.getFollowingId())
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.FOLLOWING_NOT_FOUND));

		Friend friend = CreateFriendRequest.toFriend(follower, following);
		friendRepository.save(friend);
	}

	public User getFriend(Long friendId) {
		return userRepository.findById(friendId)
			.orElseThrow(()->new MoneyAndLoveException(ErrorType.FOLLOWER_NOT_FOUND));
	}

	public void deleteFriend(Long followerId, Long followingId) {
		friendRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
	}

}
