package com.ssafy.moneyandlove.common.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.logging.LogLevel;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorType {

	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "E404", "사용자를 찾을 수 없습니다.", LogLevel.DEBUG),
	DEFAULT_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E500", "An unexpected error has occurred.", LogLevel.ERROR),
	FOLLOWER_NOT_FOUND(HttpStatus.NOT_FOUND, "E300", "팔로워 사용자를 찾을 수 없습니다.", LogLevel.DEBUG),
	FOLLOWING_NOT_FOUND(HttpStatus.NOT_FOUND, "E301", "팔로잉 사용자를 찾을 수 없습니다.", LogLevel.DEBUG),
	CHATROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "E404", "채팅방을 찾을 수 없습니다.", LogLevel.DEBUG);

	private final HttpStatus status;

	private final String code;

	private final String message;

	private final LogLevel logLevel;

}