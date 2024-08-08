package com.ssafy.moneyandlove.ranking.dto;

import java.util.List;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class RankingResponse {
	private List<RankingUserResponse> rankList;
	private RankingUserResponse myRank;

	public RankingResponse(List<RankingUserResponse> rankList, RankingUserResponse myRank) {
		this.rankList = rankList;
		this.myRank = myRank;
	}

}
