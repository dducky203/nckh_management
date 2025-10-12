package com.example.server.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ErrorException extends RuntimeException {
    private final HttpStatus status;

    public ErrorException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

}
