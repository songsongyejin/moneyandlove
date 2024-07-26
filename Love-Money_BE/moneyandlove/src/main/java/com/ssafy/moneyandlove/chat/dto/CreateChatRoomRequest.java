package com.ssafy.moneyandlove.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CreateChatRoomRequest {

    private String roomId;
    private Long fromUserId;
    private Long toUserId;
}
