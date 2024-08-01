package com.ssafy.moneyandlove.common.error;

import org.springframework.boot.logging.LogLevel;
import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorType {

	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "E404", "사용자를 찾을 수 없습니다.", LogLevel.DEBUG),
	DEFAULT_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E500", "An unexpected error has occurred.", LogLevel.ERROR),
	FOLLOWER_NOT_FOUND(HttpStatus.NOT_FOUND, "E300", "팔로워 사용자를 찾을 수 없습니다.", LogLevel.DEBUG),
	FOLLOWING_NOT_FOUND(HttpStatus.NOT_FOUND, "E301", "팔로잉 사용자를 찾을 수 없습니다.", LogLevel.DEBUG),
	CHATROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "C404", "채팅방을 찾을 수 없습니다.", LogLevel.DEBUG),
	RANKING_USER_NOT_FOUND(HttpStatus.NOT_FOUND, "E100", "랭커 정보를 조회할 수 없습니다.", LogLevel.DEBUG),
	RANKING_NOT_FOUND(HttpStatus.NOT_FOUND, "E101", "사용자의 랭킹 정보를 조회할 수 없습니다.", LogLevel.DEBUG),
	FRIEND_ALREADY_EXISTS(HttpStatus.CONFLICT, "E303", "이미 존재하는 친구입니다.", LogLevel.DEBUG),
	FACE_NOT_FOUND(HttpStatus.NOT_FOUND, "E200", "사용자의 이미지 정보를 조회할 수 없습니다.", LogLevel.DEBUG),
	TOKEN_NOT_EXIST(HttpStatus.UNAUTHORIZED,"T401", "토큰이 없습니다",LogLevel.DEBUG);

	private final HttpStatus status;

	private final String code;

	private final String message;

	private final LogLevel logLevel;

}
