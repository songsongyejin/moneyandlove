package com.ssafy.moneyandlove.friend.presentation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.friend.application.FriendService;
import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.friend.dto.CreateFriendRequest;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/friends")
public class FriendController {

	private final FriendService friendService;

	@PostMapping
	public ResponseEntity<?> createFriend(@RequestBody CreateFriendRequest createFriendRequest) {
		friendService.addFriend(createFriendRequest);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

}
