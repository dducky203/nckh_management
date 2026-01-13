package com.example.server.exception;


import lombok.Getter;

import java.io.IOException;

@Getter
public class ExcelValidationException extends IOException {
    private final byte[] errorFileContent;
    private final String errorFileName;

    public ExcelValidationException(String message, byte[] errorFileContent, String errorFileName) {
        super(message);
        this.errorFileContent = errorFileContent;
        this.errorFileName = errorFileName;
    }
}