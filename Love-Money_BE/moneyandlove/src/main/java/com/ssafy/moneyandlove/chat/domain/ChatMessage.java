package com.ssafy.moneyandlove.chat.domain;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import com.ssafy.moneyandlove.common.TimeBaseEntity;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection  = "chat_message")
public class ChatMessage {

	@Id
	private String roomId;
	private Long senderId;
	private String message;
}
