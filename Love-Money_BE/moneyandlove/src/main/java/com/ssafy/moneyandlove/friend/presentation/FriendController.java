package com.ssafy.moneyandlove.friend.presentation;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.friend.application.FriendService;
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

	@GetMapping("{friendId}")
	public ResponseEntity<User> getFriend(@PathVariable Long friendId) {
		User friend = friendService.getFriend(friendId);
		return ResponseEntity.status(HttpStatus.OK).body(friend);
	}

	@DeleteMapping("{friendId}")
	public ResponseEntity<?> removeFriend(@PathVariable Long friendId, @LoginUser User followingUser) {
		friendService.deleteFriend(friendId, followingUser.getId());
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@GetMapping
	public ResponseEntity<List<User>> getFriendListByFollowing(@LoginUser User followingUser) {
		List<User> friends = friendService.getFriendListByFollowing(followingUser.getId());
		return ResponseEntity.ok(friends);
	}
}
