package com.ssafy.moneyandlove.gamehistory.dto;

import com.ssafy.moneyandlove.gamehistory.domain.GameHistory;
import com.ssafy.moneyandlove.gamehistory.domain.SelectType;
import com.ssafy.moneyandlove.user.domain.User;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class CreateGameHistoryRequest {
	private Long fromUserId;
	private Long toUserId;
	private SelectType fromSelectType;
	private SelectType toSelectType;

	public GameHistory toGameHistory(User fromUser, User toUser, CreateGameHistoryRequest createGameHistoryRequest) {
		return GameHistory.builder()
			.fromUser(fromUser)
			.toUser(toUser)
			.fromUserSelectType(createGameHistoryRequest.fromSelectType)
			.toUserSelectType(createGameHistoryRequest.toSelectType)
			.build();
	}
}
