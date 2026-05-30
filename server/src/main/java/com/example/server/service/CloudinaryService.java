package com.example.server.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private static final String DELIVERY_HOST = "https://res.cloudinary.com/";

    private final Cloudinary cloudinary;
    private final String cloudName;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudName = cloudName;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    /**
     * Upload file lên Cloudinary, trả URL dạng ngắn:
     * https://res.cloudinary.com/{cloud}/{folder}/{id}.{ext}
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "auto"
                ));
        return toShortDeliveryUrl(uploadResult);
    }

    /**
     * URL phục vụ: https://res.cloudinary.com/doslcoy82/research-groups/150001/abc.pdf
     */
    public String toShortDeliveryUrl(Map<?, ?> uploadResult) {
        if (uploadResult == null) {
            return null;
        }
        String publicId = (String) uploadResult.get("public_id");
        if (publicId == null || publicId.isBlank()) {
            Object secure = uploadResult.get("secure_url");
            return secure != null ? secure.toString() : null;
        }
        String format = (String) uploadResult.get("format");
        if (format == null || format.isBlank()) {
            format = "jpg";
        }
        return DELIVERY_HOST + cloudName + "/" + publicId + "." + format;
    }

    public void deleteFile(String publicId) throws IOException {
        deleteFile(publicId, null);
    }

    public void deleteFile(String publicId, String resourceType) throws IOException {
        if (publicId == null || publicId.isBlank()) {
            return;
        }
        Map<?, ?> params = resourceType != null && !resourceType.isBlank()
                ? ObjectUtils.asMap("resource_type", resourceType)
                : ObjectUtils.emptyMap();
        cloudinary.uploader().destroy(publicId, params);
    }

    /**
     * Xóa file theo URL (hỗ trợ cả URL ngắn và URL /upload/ chuẩn).
     */
    public void deleteFileByUrl(String url) throws IOException {
        String publicId = extractPublicIdFromUrl(url);
        if (publicId == null) {
            return;
        }
        String resourceType = guessResourceTypeFromUrl(url);
        deleteFile(publicId, resourceType);
    }

    /**
     * Lấy public_id từ URL Cloudinary (dạng ngắn hoặc /upload/).
     */
    public String extractPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }

        int uploadIndex = url.indexOf("/upload/");
        if (uploadIndex != -1) {
            String afterUpload = url.substring(uploadIndex + 8);
            int slashIndex = afterUpload.indexOf('/');
            if (slashIndex != -1 && afterUpload.startsWith("v")) {
                afterUpload = afterUpload.substring(slashIndex + 1);
            }
            return stripExtension(afterUpload);
        }

        String prefix = DELIVERY_HOST + cloudName + "/";
        if (url.startsWith(prefix)) {
            return stripExtension(url.substring(prefix.length()));
        }

        String genericPrefix = "res.cloudinary.com/";
        int hostIdx = url.indexOf(genericPrefix);
        if (hostIdx != -1) {
            String afterHost = url.substring(hostIdx + genericPrefix.length());
            int firstSlash = afterHost.indexOf('/');
            if (firstSlash != -1 && firstSlash < afterHost.length() - 1) {
                return stripExtension(afterHost.substring(firstSlash + 1));
            }
        }

        return null;
    }

    private static String stripExtension(String path) {
        if (path == null) {
            return null;
        }
        int dotIndex = path.lastIndexOf('.');
        if (dotIndex > 0) {
            return path.substring(0, dotIndex);
        }
        return path;
    }

    private static String guessResourceTypeFromUrl(String url) {
        if (url == null) {
            return null;
        }
        String lower = url.toLowerCase();
        if (lower.contains("/raw/upload/")) {
            return "raw";
        }
        if (lower.contains("/video/upload/")) {
            return "video";
        }
        if (lower.endsWith(".pdf") || lower.endsWith(".doc") || lower.endsWith(".docx")
                || lower.endsWith(".xls") || lower.endsWith(".xlsx") || lower.endsWith(".ppt")
                || lower.endsWith(".pptx") || lower.endsWith(".zip")) {
            return "raw";
        }
        return "image";
    }
}
