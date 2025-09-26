package com.example.server.service.IoT;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SheetReaderService {

    @Autowired
    private GoogleSheetsService googleSheetsService;

//    public List<List<Object>> readSheetData(String spreadsheetId, String range) throws Exception {
//        Sheets service = googleSheetsService.getSheetsService();
//        ValueRange response = service.spreadsheets().values()
//                .get(spreadsheetId, range)
//                .execute();
//        return response.getValues();
//    }
}

