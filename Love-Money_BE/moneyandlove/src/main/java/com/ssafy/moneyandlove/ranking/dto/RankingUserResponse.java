package com.ssafy.moneyandlove.ranking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class RankingUserResponse {
	private Long rankingId;
	private String nickName;
	private String montage;
	private Long rankPoint;
	private Long rankNumber;

	// 기본 생성자
	public RankingUserResponse() {}

	public RankingUserResponse(Long rankingId, String nickName, String montage, Long rankPoint) {
		this.rankingId = rankingId;
		this.nickName = nickName;
		this.montage = montage;
		this.rankPoint = rankPoint;
	}

	public void putRankNumber(Long rankNumber) {
		this.rankNumber = rankNumber;
	}

}
