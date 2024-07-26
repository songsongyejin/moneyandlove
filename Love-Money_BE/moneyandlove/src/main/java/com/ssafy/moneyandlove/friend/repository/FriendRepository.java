package com.ssafy.moneyandlove.friend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.moneyandlove.friend.domain.Friend;

public interface FriendRepository extends JpaRepository<Friend, Long> {

}
