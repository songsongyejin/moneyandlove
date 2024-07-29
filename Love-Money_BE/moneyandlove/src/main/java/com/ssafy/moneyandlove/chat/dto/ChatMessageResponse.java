package com.ssafy.moneyandlove.chat.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.*;

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
}
