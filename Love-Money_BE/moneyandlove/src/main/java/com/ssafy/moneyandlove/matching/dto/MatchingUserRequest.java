package com.ssafy.moneyandlove.matching.dto;

import java.io.Serializable;
import java.util.Objects;

import com.ssafy.moneyandlove.user.domain.Gender;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class MatchingUserRequest implements Serializable {
	private Long userId;
	private String gender;
	private Integer faceScore;
	private String position;
	private String matchType;

    public void putUserId(Long userId) {
		this.userId = userId;
    }
	public void putGenderFromUser(Gender gender) {
		this.gender = gender.toString();
	}
	public void putFaceScoreFromFace(int faceScore) {
		this.faceScore = faceScore;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		MatchingUserRequest that = (MatchingUserRequest) o;
		return userId.equals(that.userId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(userId);
	}
}
