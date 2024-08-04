package com.ssafy.moneyandlove.user.service;

import java.util.Optional;

import com.ssafy.moneyandlove.matching.dto.MatchingUserResponse;
import com.ssafy.moneyandlove.user.domain.Gender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;
import com.ssafy.moneyandlove.common.jwt.JwtProvider;
import com.ssafy.moneyandlove.ranking.application.RankingService;
import com.ssafy.moneyandlove.user.domain.User;
import com.ssafy.moneyandlove.user.dto.JwtResponse;
import com.ssafy.moneyandlove.user.dto.KakaoAccount;
import com.ssafy.moneyandlove.user.dto.KakaoToken;
import com.ssafy.moneyandlove.user.dto.SignUpRequest;
import com.ssafy.moneyandlove.user.dto.UserProfileResponse;
import com.ssafy.moneyandlove.user.dto.UserProfileUpdateRequest;
import com.ssafy.moneyandlove.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

	private final UserRepository userRepository;
	private final RankingService rankingService;
	private final JwtProvider jwtProvider;

	@Value("${oauth2.client-id}")
	private String clientId;

	@Value("${oauth2.client-secret}")
	private String clientSecret;

	@Value("${oauth2.redirect-uri}")
	private String redirectUri;

	public KakaoToken getKakaoAccessToken(String code) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("redirect_uri", redirectUri);
		params.add("code", code);
		params.add("client_secret", clientSecret);

		HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
			new HttpEntity<>(params, headers);

		RestTemplate rt = new RestTemplate();
		ResponseEntity<String> accessTokenResponse = rt.exchange(
			"https://kauth.kakao.com/oauth/token",
			HttpMethod.POST,
			kakaoTokenRequest,
			String.class
		);

		// JSON Parsing (-> KakaoTokenDto)
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		KakaoToken kakaoToken = null;
		try {
			kakaoToken = objectMapper.readValue(accessTokenResponse.getBody(), KakaoToken.class);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return kakaoToken;
	}

	public KakaoAccount getKaKaoInfo(KakaoToken kakaoToken) {
		RestTemplate rt = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + kakaoToken.getAccess_token());
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

		HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);

		ResponseEntity<String> response = rt.exchange(
			"https://kapi.kakao.com/v2/user/me",
			HttpMethod.POST,
			kakaoProfileRequest,
			String.class
		);

		// JSON Parsing (-> kakaoAccountDto)
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		KakaoAccount kakaoAccount = null;
		try {
			kakaoAccount = objectMapper.readValue(response.getBody(), KakaoAccount.class);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return kakaoAccount;
	}

	public boolean isSigned(KakaoAccount kakaoAccount) {
		return userRepository.findByKakaoId(kakaoAccount.getId()).isPresent();
	}

	@Transactional
	public JwtResponse save(SignUpRequest signUpRequest) {
		User user = userRepository.save(SignUpRequest.toUser(signUpRequest));
		rankingService.createRanking(user.getId());
		return JwtResponse.from(jwtProvider.makeToken(user));
	}

	public JwtResponse findByKakaoId(KakaoAccount kakaoAccount) {
		User user = userRepository
			.findByKakaoId(kakaoAccount.getId())
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
		return JwtResponse.from(jwtProvider.makeToken(user));
	}

	@Transactional
	public void withdrawal(User loginUser) {
		Optional<User> user = userRepository.findById(loginUser.getId());
		userRepository.delete(user.orElseThrow(() -> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND)));
	}

	public UserProfileResponse findById(User loginUser) {
		Optional<User> user = userRepository.findById(loginUser.getId());
		return UserProfileResponse.from(user.orElseThrow(() -> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND)));
	}

	@Transactional
	public void update(User loginUser, UserProfileUpdateRequest userProfileUpdateRequest) {
		User user = userRepository.findById(loginUser.getId())
			.orElseThrow(() -> new MoneyAndLoveException(ErrorType.USER_NOT_FOUND));
		user.updateProfile(userProfileUpdateRequest.getNickname(), userProfileUpdateRequest.getRegion(),
			userProfileUpdateRequest.getProfileURL());
	}

	public MatchingUserResponse getUserDetails(Long userId, String firstPosition, String matchType) {
		return userRepository.findUserDetailsById(userId, firstPosition, matchType);
	}

	public Gender getGender(Long userId){
		return userRepository.findGenderByUserId(userId);
	}
}
