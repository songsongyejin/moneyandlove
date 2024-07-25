package com.ssafy.moneyandlove.chat.dto;

import com.ssafy.moneyandlove.chat.domain.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateChatRoomResponse {

    private String roomId;

    public static CreateChatRoomResponse of(String roomId){
        return CreateChatRoomResponse.builder()
            .roomId(roomId)
            .build();
    }
}
