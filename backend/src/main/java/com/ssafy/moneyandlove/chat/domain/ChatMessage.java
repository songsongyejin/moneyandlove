package com.ssafy.moneyandlove.chat.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "chat_message")
@CompoundIndex(name = "idx_room_created", def = "{'roomId': 1, 'createdAt': -1}")
public class ChatMessage {

	@Id
	private String id;

	private Long roomId;
	private Long senderId;
	private String message;

	@CreatedDate
	private LocalDateTime createdAt;
}
