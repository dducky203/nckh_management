package com.example.server.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExcelService {
    byte[] exportExcelFile(List<Integer> userIds) ;

}
