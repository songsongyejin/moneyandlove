package com.ssafy.moneyandlove.ranking.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UpdateRankingRequest {

	private Long rankPoint;

	private UpdateRankingRequest(){}
	private UpdateRankingRequest(Long rankPoint){
		this.rankPoint = rankPoint;
	}

}
