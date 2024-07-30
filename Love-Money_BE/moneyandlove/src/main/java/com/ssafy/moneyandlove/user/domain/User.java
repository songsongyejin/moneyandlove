package com.ssafy.moneyandlove.user.domain;

import com.ssafy.moneyandlove.common.TimeBaseEntity;
import com.ssafy.moneyandlove.user.dto.SignUpRequest;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends TimeBaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	@Column(unique = true, nullable = false)
	private Long kakaoId;

	@Column(unique = true, nullable = false)
	private String email;

	private String nickname;

	@Enumerated(EnumType.STRING)
	private Gender gender;

	private long gamePoint;

	private String region;

	private int age;

	@Column(name = "profile_url")
	private String profileURL;

	public static User from(SignUpRequest signUpRequest){
		return User.builder()
			.kakaoId(signUpRequest.getKakaoId())
			.age(signUpRequest.getAge())
			.email(signUpRequest.getEmail())
			.nickname(signUpRequest.getNickname())
			.gender(signUpRequest.getGender())
			.gamePoint(signUpRequest.getGamePoint())
			.gender(signUpRequest.getGender())
			.region(signUpRequest.getRegion())
			.age(signUpRequest.getAge())
			.profileURL(signUpRequest.getProfileURL())
			.build();
	}
}
