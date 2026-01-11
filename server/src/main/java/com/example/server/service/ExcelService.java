package com.example.server.service;

import java.util.List;

public interface ExcelService {

    byte[] exportExcelFile(List<Integer> userIds);
}
