package com.ssafy.moneyandlove.common;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.moneyandlove.common.error.ErrorResponse;
import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalControllerAdvice {

	private final ObjectMapper objectMapper;

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

	@ExceptionHandler(HttpClientErrorException.class)
	public ResponseEntity<Map<String, String>> handleHttpClientErrorException(HttpClientErrorException ex) {
		Map<String, String> response = new HashMap<>();

		try {
			JsonNode jsonNode = objectMapper.readTree(ex.getResponseBodyAsString());
			response.put("error_code", jsonNode.path("error_code").asText());
			response.put("error", jsonNode.path("error").asText());
			response.put("error_description", jsonNode.path("error_description").asText());
		} catch (IOException e) {
			response.put("error", "JSON_PARSE_ERROR");
			response.put("error_description", e.getMessage());
			response.put("error_code", "500");
		}

		return new ResponseEntity<>(response, ex.getStatusCode());
	}
}
