package com.ssafy.moneyandlove.gamehistory.presentation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.moneyandlove.common.annotation.LoginUser;
import com.ssafy.moneyandlove.gamehistory.application.GameHistoryService;
import com.ssafy.moneyandlove.gamehistory.dto.CreateGameHistoryRequest;
import com.ssafy.moneyandlove.gamehistory.dto.ReadGameHistoryResponse;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/game-history")
@RequiredArgsConstructor
public class GameHistoryController {
	private final GameHistoryService gameHistoryService;

	@PostMapping()
	public ResponseEntity<?> createGameHistory(@RequestBody CreateGameHistoryRequest createGameHistoryRequest) {
		gameHistoryService.createGameHistory(createGameHistoryRequest);
		return ResponseEntity.ok().build();
	}

	@GetMapping
	public ResponseEntity<?> readAllGameHistory(@LoginUser User loginUser) {
		List<ReadGameHistoryResponse>gameHistoryList = gameHistoryService.readAllGameHistory(loginUser.getId());
		Map<String, List<ReadGameHistoryResponse>> map = new HashMap<>();
		map.put("gameHistories", gameHistoryList);
		return ResponseEntity.ok(map);
	}

	@GetMapping("/{gameHistoryId}")
	public ResponseEntity<?> readDetailGameHistory(@PathVariable Long gameHistoryId) {
		ReadGameHistoryResponse readDetailGameHistory = gameHistoryService.readDetailGameHistory(gameHistoryId);
		Map<String, List<ReadGameHistoryResponse>> map = new HashMap<>();
		return ResponseEntity.ok(readDetailGameHistory);
	}
}
