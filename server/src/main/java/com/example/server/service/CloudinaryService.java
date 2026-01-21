package com.example.server.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    /**
     * Upload file/image to Cloudinary
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "auto"
                ));
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Delete file from Cloudinary
     */
    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Extract publicId from Cloudinary URL
     * Example URL: https://res.cloudinary.com/doslcoy82/image/upload/v1768747986/news-content/pmbffpzkpzzp6s9wcyvx.jpg
     * Returns: news-content/pmbffpzkpzzp6s9wcyvx
     */
    public String extractPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        
        // Find the position after "/upload/"
        int uploadIndex = url.indexOf("/upload/");
        if (uploadIndex == -1) {
            return null;
        }
        
        // Get everything after "/upload/v{version}/"
        String afterUpload = url.substring(uploadIndex + 8); // 8 = length of "/upload/"
        
        // Remove version (v1234567890/)
        int slashIndex = afterUpload.indexOf('/');
        if (slashIndex != -1) {
            afterUpload = afterUpload.substring(slashIndex + 1);
        }
        
        // Remove file extension
        int dotIndex = afterUpload.lastIndexOf('.');
        if (dotIndex != -1) {
            afterUpload = afterUpload.substring(0, dotIndex);
        }
        
        return afterUpload;
    }
}
