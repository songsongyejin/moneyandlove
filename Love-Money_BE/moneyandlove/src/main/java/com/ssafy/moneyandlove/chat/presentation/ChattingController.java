package com.ssafy.moneyandlove.chat.presentation;

import com.ssafy.moneyandlove.chat.application.ChatRoomService;
import com.ssafy.moneyandlove.chat.domain.ChatMessage;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomRequest;
import com.ssafy.moneyandlove.chat.dto.CreateChatRoomResponse;
import com.ssafy.moneyandlove.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChattingController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomService chatRoomService;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat/messages/{chatRoomId}")
    public void chat(@DestinationVariable String chatRoomId, @Payload ChatMessage chatMessage) {
        log.info("{}", chatMessage);
        chatMessageRepository.save(chatMessage);
        simpMessagingTemplate.convertAndSend("/receive/chat/room/" + chatRoomId, chatMessage);
    }

    @PostMapping("/room")
    public CreateChatRoomResponse getChatRoomId(@RequestBody CreateChatRoomRequest chatRoomRequest) {
        log.info("{}", chatRoomRequest);
        return chatRoomService.findByFromUserIdAndToUserId(chatRoomRequest);
    }
}
