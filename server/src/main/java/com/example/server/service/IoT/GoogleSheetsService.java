package com.example.server.service.IoT;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleSheetsService {

    private final Sheets sheetsService;

    public GoogleSheetsService() throws GeneralSecurityException, IOException {
        // Đọc file credentials.json từ resources
        InputStream credentialsStream = getClass().getClassLoader().getResourceAsStream("credentials.json");

        if (credentialsStream == null) {
            throw new FileNotFoundException("Google credentials file not found in classpath.");
        }

        // Xác thực và xây dựng Sheets service
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
                .createScoped(List.of(SheetsScopes.SPREADSHEETS_READONLY));

        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);


        this.sheetsService = new Sheets.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                requestInitializer)
                .setApplicationName("Google Sheets API Spring Boot")
                .build();
    }

    public List<List<Object>> readSheetData(String spreadsheetId, String range) throws IOException {
        ValueRange response = sheetsService.spreadsheets().values()
                .get(spreadsheetId, range)
                .execute();

        return response.getValues();
    }
}


