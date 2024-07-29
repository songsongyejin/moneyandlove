package com.ssafy.moneyandlove.chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.moneyandlove.chat.domain.ChatRoom;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

	@Query("SELECT cr FROM ChatRoom cr WHERE (cr.fromUser.id = :userId1 AND cr.toUser.id = :userId2) OR (cr.fromUser.id = :userId2 AND cr.toUser.id = :userId1)")
	Optional<ChatRoom> findChatRoomByUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
