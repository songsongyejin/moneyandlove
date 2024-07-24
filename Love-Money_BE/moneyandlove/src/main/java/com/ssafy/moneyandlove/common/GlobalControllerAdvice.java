package com.ssafy.moneyandlove.common;

import com.ssafy.moneyandlove.common.error.ErrorResponse;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalControllerAdvice {

	@ExceptionHandler(MoneyAndLoveException.class)
	public ResponseEntity<ErrorResponse> handleCoreApiException(MoneyAndLoveException e) {
		switch (e.getErrorType().getLogLevel()) {
			case ERROR -> log.error("MoneyAndLoveException : {}", e.getMessage(), e);
			case WARN -> log.warn("MoneyAndLoveException : {}", e.getMessage(), e);
			default -> log.info("MoneyAndLoveException : {}", e.getMessage(), e);
		}
		return new ResponseEntity<>(ErrorResponse.of(e.getErrorType()), e.getErrorType().getStatus());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception e) {
		log.error("Exception : {}", e.getMessage(), e);
		return new ResponseEntity<>(ErrorResponse.of(ErrorType.DEFAULT_ERROR), ErrorType.DEFAULT_ERROR.getStatus());
	}
}
