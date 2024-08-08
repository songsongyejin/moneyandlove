package com.ssafy.moneyandlove.chat.dto;

import java.time.LocalDateTime;

import com.ssafy.moneyandlove.chat.domain.ChatMessage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ChatMessageResponse {

    private Long roomId;
    private Long senderId;
    private String message;
    private LocalDateTime createdAt;

    public static ChatMessageResponse from(ChatMessage chatMessage){
        return ChatMessageResponse.builder()
            .roomId(chatMessage.getRoomId())
            .senderId(chatMessage.getSenderId())
            .message(chatMessage.getMessage())
            .createdAt(chatMessage.getCreatedAt())
            .build();
    }

}
