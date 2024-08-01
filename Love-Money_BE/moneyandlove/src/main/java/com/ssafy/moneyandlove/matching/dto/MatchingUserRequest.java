package com.ssafy.moneyandlove.matching.dto;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class MatchingUserRequest implements Serializable {
	private Long id;
	private String gender;
	private int faceScore;
	private String position;
	private String matchType;
}
