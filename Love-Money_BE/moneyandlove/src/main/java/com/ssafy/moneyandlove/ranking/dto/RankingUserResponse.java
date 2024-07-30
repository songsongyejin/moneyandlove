package com.ssafy.moneyandlove.ranking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Builder
public class RankingUserResponse {
	private String nickName;
	private String montage;
	private Long rankPoint;

	// 기본 생성자
	public RankingUserResponse() {}

	public RankingUserResponse(String nickName, String montage, Long rankPoint) {
		this.nickName = nickName;
		this.montage = montage;
		this.rankPoint = rankPoint;
	}

}
