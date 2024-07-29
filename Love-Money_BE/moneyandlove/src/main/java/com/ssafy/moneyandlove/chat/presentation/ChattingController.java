package com.ssafy.moneyandlove.chat.presentation;

import com.ssafy.moneyandlove.chat.application.ChatRoomService;
import com.ssafy.moneyandlove.chat.domain.ChatMessage;
import com.ssafy.moneyandlove.chat.dto.ChatMessageRequest;
import com.ssafy.moneyandlove.chat.dto.ChatRoomIdResponse;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomRequest;
import com.ssafy.moneyandlove.chat.repository.ChatMessageRepository;
import com.ssafy.moneyandlove.chat.repository.ChatRoomRepository;
import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChattingController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomService chatRoomService;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/send/{chatRoomId}")
    public void chat(@DestinationVariable String chatRoomId, @LoginUser User loginUser, @Payload ChatMessageRequest chatMessageRequest) {
        log.info("{}", loginUser.getId());
        ChatMessage chatMessage = chatMessageRepository.save(ChatMessage.of(loginUser.getId(), chatMessageRequest));
        log.info("{}",chatMessage);
        simpMessagingTemplate.convertAndSend("/chat/receive/" + chatRoomId, chatMessage.toChatMessageResponse());
    }

    @GetMapping("/room")
    public ChatRoomIdResponse getChatRoomId(@LoginUser User loginUser, @RequestParam Long toUserId) {
        log.info("fromUserId {} , toUserId {}", loginUser.getId(), toUserId);
        return chatRoomService.findByFromUserIdAndToUserId(loginUser.getId(), toUserId);
    }

    @PostMapping("/room")
    public ChatRoomIdResponse createChatRoom(@LoginUser User loginUser, @RequestBody CreateChatRoomRequest createChatRoomRequest) {
        log.info("{}", createChatRoomRequest);
        return chatRoomService.save(loginUser, createChatRoomRequest);
    }
}
