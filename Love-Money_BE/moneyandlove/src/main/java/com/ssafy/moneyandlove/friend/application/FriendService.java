package com.ssafy.moneyandlove.friend.application;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.moneyandlove.chat.domain.ChatRoom;
import com.ssafy.moneyandlove.chat.repository.ChatRoomRepository;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.friend.dto.CreateFriendRequest;
import com.ssafy.moneyandlove.friend.dto.FriendInfoResponse;
import com.ssafy.moneyandlove.friend.repository.FriendRepository;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {

	private final FriendRepository friendRepository;
	private final UserRepository userRepository;
	private final ChatRoomRepository chatRoomRepository;

	@Transactional
	public void addFriend(CreateFriendRequest createFriendRequest) {
		Long followerId = createFriendRequest.getFollowerId();
		Long followingId = createFriendRequest.getFollowingId();
		User follower = userRepository.findById(followerId)
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.FOLLOWER_NOT_FOUND));
		User following = userRepository.findById(followingId)
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.FOLLOWING_NOT_FOUND));

		// 중복 검사
		if (friendRepository.existsByFollowingAndFollower(followingId, followerId)) {
			throw new MoneyAndLoveException(ErrorType.FRIEND_ALREADY_EXISTS);
		}

		Friend friend = CreateFriendRequest.toFriend(follower, following);
		friendRepository.save(friend);

		//이미 저장된 채팅방 이름이 있다면 삭제 후 저장
		Optional<ChatRoom> existingChatRoom = chatRoomRepository.findChatRoomByUsers(follower.getId(), following.getId());
		if (existingChatRoom.isPresent()) {
			chatRoomRepository.delete(existingChatRoom.orElseThrow());
		}
		
		chatRoomRepository.save(ChatRoom.of(follower, following));
	}

	public User getFriend(Long friendId) {
		return userRepository.findById(friendId)
			.orElseThrow(()->new MoneyAndLoveException(ErrorType.FOLLOWER_NOT_FOUND));
	}

	public void deleteFriend(Long followerId, Long followingId) {
		friendRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
		friendRepository.deleteByFollowingIdAndFollowerId(followingId, followerId);
	}

	public List<FriendInfoResponse> getFriendListByFollowing(Long followingId) {
		return friendRepository.findFriendInfoByFollowingId(followingId);
	}
}
