package com.ssafy.moneyandlove.common.error;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {

	private final String code;
	private final String message;

	public static ErrorResponse of(ErrorType errorType) {
		return ErrorResponse
			.builder()
			.code(errorType.getCode())
			.message(errorType.getMessage())
			.build();
	}
}
