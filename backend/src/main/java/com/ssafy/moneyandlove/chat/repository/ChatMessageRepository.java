package com.ssafy.moneyandlove.chat.repository;

import com.ssafy.moneyandlove.chat.domain.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findAllByRoomId(Long roomId);
}
