package com.ssafy.moneyandlove.chat.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
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
public class ChatMessage {

    @Id
    private Long roomId;
    private Long senderId;
    private String message;

	@CreatedDate
	private LocalDateTime createdAt;
}
