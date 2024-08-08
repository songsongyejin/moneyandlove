package com.ssafy.moneyandlove.gamehistory.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssafy.moneyandlove.gamehistory.domain.GameHistory;
import com.ssafy.moneyandlove.gamehistory.domain.SelectType;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@Builder
public class ReadGameHistoryResponse {
	private Long gameHistoryId;
	private Long fromUserId;
	private Long toUserId;
	private SelectType fromUserSelectType;
	private SelectType toUserSelectType;
	private LocalDateTime createdAt;

	public static ReadGameHistoryResponse from(GameHistory gameHistory){
		return ReadGameHistoryResponse.builder()
			.createdAt(gameHistory.getCreatedAt())
			.fromUserId(gameHistory.getFromUser().getId())
			.toUserId(gameHistory.getToUser().getId())
			.gameHistoryId(gameHistory.getId())
			.fromUserSelectType(gameHistory.getFromUserSelectType())
			.toUserSelectType(gameHistory.getToUserSelectType()).build();
	}
}
