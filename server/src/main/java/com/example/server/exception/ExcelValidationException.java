package com.example.server.exception;

public class ExcelValidationException extends RuntimeException {
  public ExcelValidationException(String message) {
    super(message);
  }
}
