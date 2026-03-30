package com.ssafy.moneyandlove.chat.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.ssafy.moneyandlove.chat.domain.ChatMessage;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

	List<ChatMessage> findByRoomIdAndCreatedAtBeforeOrderByCreatedAtDesc(Long roomId, LocalDateTime cursor,
		Pageable pageable);
}
