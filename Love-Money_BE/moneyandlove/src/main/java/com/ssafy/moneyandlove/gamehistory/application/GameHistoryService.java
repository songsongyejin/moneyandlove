package com.ssafy.moneyandlove.gamehistory.application;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.gamehistory.domain.GameHistory;
import com.ssafy.moneyandlove.gamehistory.dto.CreateGameHistoryRequest;
import com.ssafy.moneyandlove.gamehistory.dto.ReadGameHistoryResponse;
import com.ssafy.moneyandlove.gamehistory.repository.GameHistoryRepository;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameHistoryService {
	private final GameHistoryRepository gameHistoryRepository;
	private final UserRepository userRepository;

	public void createGameHistory(CreateGameHistoryRequest createGameHistoryRequest) {
		User fromUser = userRepository.findById(createGameHistoryRequest.getFromUserId())
			.orElseThrow(()-> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));

		User toUser = userRepository.findById(createGameHistoryRequest.getToUserId())
			.orElseThrow(()-> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));

		GameHistory gameHistory = createGameHistoryRequest.toGameHistory(fromUser, toUser, createGameHistoryRequest);
		gameHistoryRepository.save(gameHistory);
	}

	public List<ReadGameHistoryResponse> readAllGameHistory(Long fromUserId) {
		List<GameHistory> gameHistories = gameHistoryRepository.findByFromUserId(fromUserId);
		return gameHistories.stream()
			.map(ReadGameHistoryResponse::from)
			.collect(Collectors.toList());
	}
}
