package com.ssafy.moneyandlove.friend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.moneyandlove.friend.domain.Friend;
import com.ssafy.moneyandlove.friend.dto.FriendInfoResponse;

public interface FriendRepository extends JpaRepository<Friend, Long> {
	void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
	void deleteByFollowingIdAndFollowerId(Long followingId, Long followerId);

	@Query("SELECT new com.ssafy.moneyandlove.friend.dto.FriendInfoResponse(f.follower.id, f.follower.nickname, f.follower.age, f.follower.gender, f.follower.profileURL, cr.id) " +
		"FROM Friend f " +
		"LEFT JOIN ChatRoom cr ON (f.follower.id = cr.fromUser.id AND f.following.id = cr.toUser.id) OR (f.follower.id = cr.toUser.id AND f.following.id = cr.fromUser.id) " +
		"WHERE f.following.id = :followingId")
	List<FriendInfoResponse> findFriendInfoByFollowingId(@Param("followingId") Long followingId);

	@Query("SELECT COUNT(f) > 0 FROM Friend f WHERE f.follower.id = :followerId AND f.following.id = :followingId")
	boolean existsByFollowingAndFollower(@Param("followingId") Long followingId, @Param("followerId") Long followerId);
}
