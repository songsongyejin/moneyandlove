package com.ssafy.moneyandlove.chat.application;

import com.ssafy.moneyandlove.chat.dto.ChatRoomIdResponse;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomRequest;
import com.ssafy.moneyandlove.chat.repository.ChatRoomRepository;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomIdResponse findByFromUserIdAndToUserId(Long fromUserId, Long toUserID) {
        return ChatRoomIdResponse
                .from(chatRoomRepository
                        .findByFromUserIdAndToUserId(fromUserId, toUserID)
                        .orElseThrow(() -> new MoneyAndLoveException(ErrorType.CHATROOM_NOT_FOUND))
                        .getRoomId()
                );
    }

    public ChatRoomIdResponse save(CreateChatRoomRequest createChatRoomRequest) {
        return null;
    }
}
