package com.ssafy.moneyandlove.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateChatRoomResponse {

    private String roomId;

    public static CreateChatRoomResponse from(String roomId){
        return CreateChatRoomResponse.builder()
            .roomId(roomId)
            .build();
    }
}
