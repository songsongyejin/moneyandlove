package com.ssafy.moneyandlove.user.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoAccount {

	private Long id;
	private String nickname;
	private String profileImage;

	@JsonProperty("properties")
	private void unpackNested(Map<String, Object> properties) {
		this.nickname = (String) properties.get("nickname");
		this.profileImage = (String) properties.get("profile_image");
	}
}
