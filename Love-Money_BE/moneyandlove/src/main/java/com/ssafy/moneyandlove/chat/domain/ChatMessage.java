package com.ssafy.moneyandlove.chat.domain;

import com.ssafy.moneyandlove.chat.dto.ChatMessageRequest;
import com.ssafy.moneyandlove.chat.dto.ChatMessageResponse;
import com.ssafy.moneyandlove.common.TimeBaseEntity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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

    public static ChatMessage of(Long senderId, ChatMessageRequest chatMessageRequest) {
        return ChatMessage.builder()
                .roomId(chatMessageRequest.getRoomId())
                .senderId(senderId)
                .message(chatMessageRequest.getMessage())
                .build();
    }

	public ChatMessageResponse toChatMessageResponse(){
		return ChatMessageResponse.builder()
			.roomId(roomId)
			.senderId(senderId)
			.message(message)
			.createdAt(createdAt).build();
	}
}
