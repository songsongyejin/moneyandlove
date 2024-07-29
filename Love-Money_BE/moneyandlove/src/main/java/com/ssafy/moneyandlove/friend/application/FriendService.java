package com.ssafy.moneyandlove.friend.application;

import java.util.List;
import java.util.stream.Collectors;

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

		Friend followingFriend = CreateFriendRequest.toFriend(follower, following);
		Friend followerFriend = CreateFriendRequest.toFriend(following, follower);

		friendRepository.save(followingFriend);
		friendRepository.save(followerFriend);
	}

	public User getFriend(Long friendId) {
		return userRepository.findById(friendId)
			.orElseThrow(()->new MoneyAndLoveException(ErrorType.FOLLOWER_NOT_FOUND));
	}

	public void deleteFriend(Long followerId, Long followingId) {
		friendRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
		friendRepository.deleteByFollowingIdAndFollowerId(followingId, followerId);
	}

	public List<User> getFriendListByFollowing(Long followingId) {
		User following = userRepository.findById(followingId)
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.FOLLOWING_NOT_FOUND));
		return friendRepository.findByFollowing(following).stream()
			.map(Friend::getFollower)
			.collect(Collectors.toList());
	}
}
