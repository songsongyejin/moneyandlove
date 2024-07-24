package com.ssafy.moneyandlove.user.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // 여기서 카카오에서 받아온 정보를 처리합니다.
        System.out.println("User attributes: " + oauth2User.getAttributes());

        // 필요한 정보 추출
        String id = oauth2User.getAttribute("id").toString();
        String nickname = ((Map<String, Object>) oauth2User.getAttribute("properties")).get("nickname").toString();
        String profileImage = ((Map<String, Object>) oauth2User.getAttribute("properties")).get("profile_image").toString();

        System.out.println("ID: " + id);
        System.out.println("Nickname: " + nickname);
        System.out.println("Profile Image: " + profileImage);

        // 여기서 사용자 정보를 데이터베이스에 저장하거나 업데이트할 수 있습니다.

        return oauth2User;
    }
}