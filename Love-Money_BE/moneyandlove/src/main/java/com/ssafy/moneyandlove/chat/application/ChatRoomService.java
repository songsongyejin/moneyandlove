package com.ssafy.moneyandlove.chat.application;

import com.ssafy.moneyandlove.chat.domain.ChatRoom;
import com.ssafy.moneyandlove.chat.dto.ChatRoomIdResponse;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomRequest;
import com.ssafy.moneyandlove.chat.repository.ChatRoomRepository;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatRoomIdResponse findByFromUserIdAndToUserId(Long fromUserId, Long toUserID) {
        Optional<ChatRoom> chatRoom = chatRoomRepository.findChatRoomByUsers(fromUserId, toUserID);
        return ChatRoomIdResponse.from(chatRoom.orElseThrow(() -> new MoneyAndLoveException(ErrorType.CHATROOM_NOT_FOUND)).getId());
    }

    public ChatRoomIdResponse save(User loginUser, CreateChatRoomRequest createChatRoomRequest) {
        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findChatRoomByUsers(loginUser.getId(), createChatRoomRequest.getToUserId());
        if (existingChatRoom.isPresent()) {
            return ChatRoomIdResponse.from(existingChatRoom.orElseThrow().getId());
        }

        User fromUser = userRepository.findById(loginUser.getId())
                .orElseThrow(() -> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
        User toUser = userRepository.findById(createChatRoomRequest.getToUserId())
                .orElseThrow(() -> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
        ChatRoom chatRoom = chatRoomRepository.save(ChatRoom.builder().fromUser(fromUser).toUser(toUser).build());

        return ChatRoomIdResponse.from(chatRoom.getId());
    }
}
