package com.ssafy.moneyandlove.chat.presentation;

import com.ssafy.moneyandlove.chat.domain.ChatMessage;
import com.ssafy.moneyandlove.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatHistoryController {

    private final ChatMessageRepository chatMessageRepository;

    @GetMapping("/chat/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestParam String roomId) {
        log.info(roomId);
        List<ChatMessage> messages = chatMessageRepository.findAllByRoomId(roomId);
        return ResponseEntity.ok(messages);
    }
}