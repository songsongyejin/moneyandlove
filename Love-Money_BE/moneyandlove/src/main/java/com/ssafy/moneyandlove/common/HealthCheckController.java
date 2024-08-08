package com.ssafy.moneyandlove.common;

import com.ssafy.moneyandlove.common.error.ErrorType;
import com.ssafy.moneyandlove.common.exception.MoneyAndLoveException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

	@GetMapping("/health")
	public ResponseEntity<?> healthCheck() {
		return ResponseEntity.ok("ok");
	}

	@GetMapping("/error-check")
	public ResponseEntity<?> errorCheck() {
		throw new MoneyAndLoveException(ErrorType.DEFAULT_ERROR);
	}
}
