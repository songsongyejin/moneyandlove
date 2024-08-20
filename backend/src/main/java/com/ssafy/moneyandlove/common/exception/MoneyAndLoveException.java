package com.ssafy.moneyandlove.common.exception;

import com.ssafy.moneyandlove.common.error.ErrorType;
import lombok.Getter;

@Getter
public class MoneyAndLoveException extends RuntimeException {

    private final ErrorType errorType;

    public MoneyAndLoveException(ErrorType errorType) {
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
