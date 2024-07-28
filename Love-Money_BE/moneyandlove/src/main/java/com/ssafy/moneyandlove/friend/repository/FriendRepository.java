package com.ssafy.moneyandlove.friend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.user.domain.User;

public interface FriendRepository extends JpaRepository<Friend, Long> {
	void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
	List<Friend> findByFollowing(User following);
}
