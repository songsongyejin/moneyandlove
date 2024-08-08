package com.ssafy.moneyandlove.chat.dto;

import com.ssafy.moneyandlove.chat.domain.ChatMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChatMessageRequest {

    private Long roomId;
    private String message;

    public ChatMessage toChatMessage(Long senderId) {
        return ChatMessage.builder()
            .roomId(roomId)
            .senderId(senderId)
            .message(message)
            .build();
    }
}
