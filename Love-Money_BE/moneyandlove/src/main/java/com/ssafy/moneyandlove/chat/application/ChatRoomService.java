package com.ssafy.moneyandlove.chat.application;

import com.ssafy.moneyandlove.chat.domain.ChatRoom;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomRequest;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomResponse;
import com.ssafy.moneyandlove.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public CreateChatRoomResponse findByFromUserIdAndToUserId (CreateChatRoomRequest chatRoomRequest){
        Optional<ChatRoom> byFromUserIdAndToUserId = chatRoomRepository.findByFromUserIdAndToUserId(chatRoomRequest.getFromUserid(), chatRoomRequest.getToUserid());
        ChatRoom chatRoom = byFromUserIdAndToUserId.orElseThrow();
        return CreateChatRoomResponse.of(chatRoom.getRoomId());
    }
}
