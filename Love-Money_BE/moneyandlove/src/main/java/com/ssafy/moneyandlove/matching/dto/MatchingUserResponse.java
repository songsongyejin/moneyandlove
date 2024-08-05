package com.ssafy.moneyandlove.matching.dto;

import com.ssafy.moneyandlove.user.domain.Gender;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class MatchingUserResponse {
    private Long userId;
    private String nickname;
    private String profileURL;
    private Integer age;
    private String gender;
    private String firstPosition;
    private String matchingMode;

    public MatchingUserResponse() {
        // 기본 생성자
    }

    public MatchingUserResponse(Long userId, String nickname, String profileURL, Integer age, Gender gender, String firstPosition, String matchingMode) {
        this.userId = userId;
        this.nickname = nickname;
        this.profileURL = profileURL;
        this.age = age;
        this.gender = gender != null ? gender.name() : null;
        this.firstPosition = firstPosition;
        this.matchingMode = matchingMode;
    }

}
