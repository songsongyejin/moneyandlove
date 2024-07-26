package com.ssafy.moneyandlove.friend.application;

import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.friend.dto.CreateFriendRequest;
import com.ssafy.moneyandlove.friend.repository.FriendRepository;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {

	private final FriendRepository friendRepository;

	public void addFrined(CreateFriendRequest createFriendRequest) {
		friendRepository.save();
	}
}
