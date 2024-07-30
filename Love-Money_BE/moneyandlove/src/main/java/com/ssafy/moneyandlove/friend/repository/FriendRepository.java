package com.ssafy.moneyandlove.friend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.user.domain.User;

public interface FriendRepository extends JpaRepository<Friend, Long> {
	void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
	void deleteByFollowingIdAndFollowerId(Long followingId, Long followerId);
	List<Friend> findByFollowing(User following);
	@Query("SELECT COUNT(f) > 0 FROM Friend f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
	boolean existsByFollowingAndFollower(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
}
