package com.ssafy.moneyandlove.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomIdResponse {

    private Long roomId;

    public static ChatRoomIdResponse from(Long roomId){
        return ChatRoomIdResponse.builder()
                .roomId(roomId)
                .build();
    }
}
