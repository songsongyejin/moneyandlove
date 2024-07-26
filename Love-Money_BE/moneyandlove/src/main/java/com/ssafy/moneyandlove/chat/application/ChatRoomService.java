package com.ssafy.moneyandlove.chat.application;

import com.ssafy.moneyandlove.chat.domain.ChatRoom;
import com.ssafy.moneyandlove.chat.dto.ChatRoomIdRequest;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomResponse;
import com.ssafy.moneyandlove.chat.repository.ChatRoomRepository;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public CreateChatRoomResponse findByFromUserIdAndToUserId(ChatRoomIdRequest chatRoomIdRequest) {
        Optional<ChatRoom> byFromUserIdAndToUserId = chatRoomRepository.findByFromUserIdAndToUserId(chatRoomIdRequest.getFromUserid(), chatRoomIdRequest.getToUserid());
        ChatRoom chatRoom = byFromUserIdAndToUserId
                .orElseThrow(() -> new MoneyAndLoveException(ErrorType.CHATROOM_NOT_FOUND));
        return CreateChatRoomResponse.from(chatRoom.getRoomId());
    }
}
