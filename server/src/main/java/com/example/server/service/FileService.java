package com.example.server.service;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;

@Service
public class FileService {
    @Autowired
    HttpServletRequest request;
    // nơi lưu
    private final Path rootLocation;

    public FileService(){
        this.rootLocation = Paths.get("E:\\Documents\\SpringBoot\\KLTN\\src\\main\\resources\\static\\file");
    }

    public FileService(Path rootLocation) {
        this.rootLocation = rootLocation;
    }
    // Dùng @Value để lấy đường dẫn từ application.properties
    public FileService(@Value("${file.upload-dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
    }

    public String readFile(String filename) throws IOException {
        ClassPathResource resource = new ClassPathResource("static/file/" + filename);
        try (InputStream inputStream = resource.getInputStream()) {
            if (filename.endsWith(".docx")) {
                return readDocx(inputStream);
            } else if (filename.endsWith(".pdf")) {
                return readPdf(inputStream);
            } else if (filename.endsWith(".pptx")) {
                return readPptx(inputStream);
            } else {
                return "Định dạng file không được hỗ trợ.";
            }
        }
    }
    private String readDocx(InputStream inputStream) throws IOException {
        XWPFDocument document = new XWPFDocument(inputStream);
        StringBuilder content = new StringBuilder();
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            String text = paragraph.getText().trim();
            if (!text.isEmpty()) {
                content.append(text).append("\n");
            }
        }
        return content.toString();
    }
    private String readPdf(InputStream inputStream) throws IOException {
        PDDocument document = PDDocument.load(inputStream);
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        document.close();
        return text;
    }
    private String readPptx(InputStream inputStream) throws IOException {
        XMLSlideShow ppt = new XMLSlideShow(inputStream);
        StringBuilder content = new StringBuilder();
        for (XSLFSlide slide : ppt.getSlides()) {
            for (XSLFShape shape : slide.getShapes()) {
                if (shape instanceof XSLFTextShape) {
                    XSLFTextShape textShape = (XSLFTextShape) shape;
                    content.append(textShape.getText()).append("\n");
                }
            }
        }
        return content.toString();
    }



    public void store(MultipartFile file) {
        try {

            Path destinationFile = this.rootLocation.resolve(
                            Paths.get(file.getOriginalFilename()))
                    .normalize().toAbsolutePath();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }
    public File save(MultipartFile file, String path){
        if (file.isEmpty()){
            File dir= new File(request.getServletContext().getRealPath(path));
            if (!dir.exists()){
                dir.mkdirs();
            }
            try{
                File saveFile = new File(dir,file.getOriginalFilename());
                file.transferTo(saveFile);
                return saveFile;
            } catch (Exception e){
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String saveFile(MultipartFile file, String folderName) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Không có file để tải lên.");
        }

        // Tạo thư mục nếu chưa có
        Path folderPath = rootLocation.resolve(folderName);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath); // Tạo thư mục nếu chưa có
        }

        // Tạo đường dẫn file và lưu
        Path targetLocation = folderPath.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        Files.copy(file.getInputStream(), targetLocation);

        return targetLocation.toString();
    }
//    public void saveImage(MultipartFile file) {
//        try {
//
//            Path destinationFile = this.rootLocation.resolve(
//                            Paths.get(file.getOriginalFilename()))
//                    .normalize().toAbsolutePath();
//
//            try (InputStream inputStream = file.getInputStream()) {
//                Files.copy(inputStream, destinationFile,
//                        StandardCopyOption.REPLACE_EXISTING);
//            }
//        }
//        catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
}
