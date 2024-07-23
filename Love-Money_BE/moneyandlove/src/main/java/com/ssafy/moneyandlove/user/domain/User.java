package com.ssafy.moneyandlove.user.domain;

import com.ssafy.moneyandlove.common.TimeBaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User extends TimeBaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long id;

	private String userLoginId;

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

}