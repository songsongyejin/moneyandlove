package com.ssafy.moneyandlove.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class UserController {

    @Value("${oauth2.client-id}")
    private String clientId;

    @Value("${oauth2.client-secret}")
    private String clientSecret;

    @Value("${oauth2.redirect-uri}")
    private String redirectUri;

    @GetMapping("/login/oauth2")
    public ResponseEntity<String> kakaoCallback(@RequestParam("code") String code) {
        log.info("code is {}", code);
        // 1. 액세스 토큰 얻기
        String accessToken = getAccessToken(code);
        log.info("accessToken is {}", accessToken);
        // 2. 사용자 정보 얻기
        return ResponseEntity.ok(getUserInfo(accessToken));
    }

    private String getAccessToken(String code) {
        RestTemplate rt = new RestTemplate();

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

        ResponseEntity<Map> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }
    //https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=5f5c8c06e4b41de351c85a775ab50b40&redirect_uri=http://localhost:3000/login/oauth2/callback
    private String getUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
                new HttpEntity<>(headers);

        ResponseEntity<Map> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                Map.class
        );

        return response.getBody().toString();
    }
}