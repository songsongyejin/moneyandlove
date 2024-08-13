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
	private String fromUserNickname;
	private String toUserNickname;
	private SelectType fromUserSelectType;
	private SelectType toUserSelectType;
	private LocalDateTime createdAt;

}
