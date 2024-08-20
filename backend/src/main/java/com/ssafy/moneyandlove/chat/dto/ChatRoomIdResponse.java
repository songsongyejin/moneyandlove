package com.ssafy.moneyandlove.chat.dto;

import com.ssafy.moneyandlove.chat.domain.ChatRoom;

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

	public static ChatRoomIdResponse from(ChatRoom chatRoom) {
		return ChatRoomIdResponse.builder()
            .roomId(chatRoom.getId())
            .build();
	}
}
