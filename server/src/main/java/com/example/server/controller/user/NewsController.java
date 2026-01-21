package com.example.server.controller.user;

import com.example.server.domain.Event;
import com.example.server.domain.News;
import com.example.server.domain.NewsImage;
import com.example.server.domain.User;
import com.example.server.repository.*;
import com.example.server.service.BreadcrumbService;
import com.example.server.service.CloudinaryService;
import com.example.server.service.FileService;
import com.example.server.service.LikeNewsService;
import com.example.server.service.PageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/news")
public class NewsController {
    @Autowired
    CloudinaryService cloudinaryService;
    @Autowired
    FileService  fileService;
    @Autowired
    UserRepository UserRepository;
    @Autowired
    NewsImageRepository NewsImageRepository;
    @Autowired
    NewsRepository newsRepository;
    @Autowired
    private NewsImageRepository newsImageRepository;
    @Autowired
    PageService pageService;
    @Autowired
    LikeNewsController likeNewsController;
    @Autowired
    LikeNewsService likeNewsService;
    @Autowired
    LikeNewsRepository likeNewsRepository;
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    BreadcrumbService breadcrumbService;
    @Autowired
    CommonController commonController;

//    show news
    @GetMapping("/showNews")
    public String news(Model model,
                       @RequestParam("page") Optional<Integer> page,
                       @RequestParam("size") Optional<Integer> size) {
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
        // duong dan cho nguoi dung
        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbShowNews()); // gửi ra view
        // end breadcrumb
        showNewsApi(model,page,size);
        return "/user/news/showNews";
    }
//    show news
    public void showNewsApi(Model model,
                            @RequestParam("page") Optional<Integer> page,
                            @RequestParam("size") Optional<Integer> size){
        // phân trang
        int currentPage = page.orElse(1); // số trang
        int pageSize = size.orElse(10); // số event trên 1 trang
        model.addAttribute("pageSize", pageSize);
        Page<News> productPage = pageService.findPaginatedNews(PageRequest.of(currentPage - 1, pageSize));
        model.addAttribute("news", productPage);
        int totalPages = productPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber",pageNumbers.size());
        }
    }
    // detail news
    @GetMapping("/detailNews/{idNews}")
    public String detailNews(Model model,
                             @PathVariable("idNews")Integer idNews,
                             HttpSession session){

        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
        News news = newsRepository.findById(idNews).orElse(null);
        assert news != null;
        if (news.getContent() != null) {
            String formatted = news.getContent().replace("–", "<br><span class='indent'>–");
            formatted += "</span>"; // đóng thẻ cuối cùng nếu cần
            news.setContent(formatted);
        }
        model.addAttribute("news", news);
        List<NewsImage> newsImages = newsImageRepository.findNewsImageByIdNews(news);
        model.addAttribute("newsImages", newsImages);
        model.addAttribute("likeCount", likeNewsRepository.countByIdNews(news.getId()));

        return "/user/news/detailNews";
    }

    // create news
    @GetMapping("/createNews")
    public String createNews(Model model) {

        return "/user/news/createNews";
    }

    @PostMapping("/saveNews/{idUser}")
    public String saveNews(@PathVariable int idUser, Model model,
                           @RequestParam("title") String title,
                           @RequestParam("content") String content,
                           @RequestParam("images") MultipartFile[] images) {
        System.out.println("Tiêu đề: " + title);
        System.out.println("Nội dung: " + content);
        // create news
        News news = new News();
        news.setTitle(title);
        news.setContent(content);
        news.setTime(LocalDateTime.now());
        news.setStatus(1);
        news.setUser(UserRepository.findById(idUser).get());
        newsRepository.save(news);
        // Xử lý upload file image lên Cloudinary
        for (MultipartFile file : images) {
            if (!file.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadFile(file, "news");
                    System.out.println("Đã upload lên Cloudinary: " + imageUrl);
                    
                    NewsImage newsImage = new NewsImage();
                    newsImage.setImageName(imageUrl);  // Lưu URL thay vì tên file
                    newsImage.setIdNews(news);
                    newsImageRepository.save(newsImage);
                } catch (IOException e) {
                    System.err.println("Lỗi upload ảnh: " + e.getMessage());
                }
            }
        }

        return "redirect:/news/yourNews/"+idUser;
    }
    // your news
    @GetMapping("/yourNews/{idUser}")
    public String yourNews(Model model, @PathVariable Integer idUser,
                           @RequestParam("page") Optional<Integer> page,
                           @RequestParam("size") Optional<Integer> size) {
        User user = UserRepository.findById(idUser).orElse(null);
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
        // duong dan cho nguoi dung
        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbNews()); // gửi ra view
        // end breadcrumb

        // phân trang
        int currentPage = page.orElse(1); // số trang
        int pageSize = size.orElse(10); // số event trên 1 trang
        model.addAttribute("pageSize", pageSize);
        Page<News> productPage = pageService.findPaginatedYourNews(PageRequest.of(currentPage - 1, pageSize),user);
        model.addAttribute("news", productPage);
        int totalPages = productPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber",pageNumbers.size());
        }
        return "/user/news/yourNews";
    }

    // manager news
    @GetMapping("/managerNews")
    public String managerNews(Model model,
                              @RequestParam("page") Optional<Integer> page,
                              @RequestParam("size") Optional<Integer> size) {
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
        // duong dan cho nguoi dung
        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbShowNewsInU_Power1()); // gửi ra view
        // end breadcrumb

        // phân trang
        int currentPage = page.orElse(1); // số trang
        int pageSize = size.orElse(10); // số event trên 1 trang
        model.addAttribute("pageSize", pageSize);
        Page<News> productPage = pageService.findPaginatedNews(PageRequest.of(currentPage - 1, pageSize));
        model.addAttribute("news", productPage);
        int totalPages = productPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber",pageNumbers.size());
        }
        return "/user/manager/managerNews";
    }
    // manager detail News
    @GetMapping("/managerDetailNews/{idNews}")
    public String managerDetailNews(Model model, @PathVariable Integer idNews){
        managerDetailNewsApi(model,idNews);
        return "/user/manager/managerDetailNews";
    }
    // api manager detail News
    public void managerDetailNewsApi(Model model, @PathVariable Integer idNews){
        News news = newsRepository.findById(idNews).orElse(null);
        assert news != null;
        if (news.getContent() != null) {
            String formatted = news.getContent().replace("–", "<br><span class='indent'>–");
            formatted += "</span>"; // đóng thẻ cuối cùng nếu cần
            news.setContent(formatted);
        }
        model.addAttribute("news", news);
        List<NewsImage> newsImages = newsImageRepository.findNewsImageByIdNews(news);
        model.addAttribute("newsImages", newsImages);
        model.addAttribute("likeCount", likeNewsRepository.countByIdNews(news.getId()));
    }

    // browse news (duyet tin tuc)
    @GetMapping("/browseNews/{idNews}")
    public String browseNews(@PathVariable Integer idNews) {
        browseNewsApi(idNews);
        return "redirect:/news/managerDetailNews/{idNews}";
    }
    // api browse news
    public void browseNewsApi(Integer idNews){
        News news = newsRepository.findById(idNews).orElse(null);
        assert news != null;
        news.setStatus(2);
        newsRepository.save(news);
    }
    // repair news
    @GetMapping("/repairNews/{idNews}")
    public String repairNews(@PathVariable Integer idNews,Model model) {
        repairNesApi(idNews,model);
        return "/user/news/repairNews";
    }
    // api repairNews
    public void repairNesApi(Integer idNews,Model model){
        News news = newsRepository.findById(idNews).orElse(null);
        assert news != null;
        List<NewsImage> newsImages = newsImageRepository.findNewsImageByIdNews(news);
        model.addAttribute("news", news);
        model.addAttribute("newsImages", newsImages);
    }
    // save repaired News
    @PostMapping("/saveRepairedNews/{idNews}")
    public String saveRepairedNews(@PathVariable int idNews,
                                   @RequestParam("title") String title,
                                   @RequestParam("content") String content,
                                   @RequestParam("images") MultipartFile[] images,
                                   @RequestParam(value = "deletedImageIds", required = false) String deletedImageIds) {
        apiSaveRepairedNews(idNews, title, content, images, deletedImageIds);
        return "redirect:/news/detailNews/" + idNews;
    }
//    api save repair news
    public void apiSaveRepairedNews(int idNews,String title, String content, MultipartFile[] images,String deletedImageIds){
        News news = newsRepository.findById(idNews).orElse(null);
        assert news != null;
        news.setTitle(title);
        news.setContent(content);
        newsRepository.save(news);

        // Xóa ảnh nếu có
        if (deletedImageIds != null && !deletedImageIds.isEmpty()) {
            List<Integer> idsToDelete = Arrays.stream(deletedImageIds.split(","))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            
            // Xóa ảnh trên Cloudinary trước khi xóa khỏi DB
            for (Integer imageId : idsToDelete) {
                newsImageRepository.findById(imageId).ifPresent(newsImage -> {
                    try {
                        cloudinaryService.deleteFile(newsImage.getImageName());
                    } catch (IOException e) {
                        System.err.println("Lỗi xóa ảnh: " + e.getMessage());
                    }
                });
            }

            newsImageRepository.deleteAllById(idsToDelete);
        }

        // Thêm ảnh mới lên Cloudinary
        for (MultipartFile file : images) {
            if (!file.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadFile(file, "news");
                    
                    NewsImage newsImage = new NewsImage();
                    newsImage.setImageName(imageUrl);  // Lưu URL thay vì tên file
                    newsImage.setIdNews(news);
                    newsImageRepository.save(newsImage);
                } catch (IOException e) {
                    System.err.println("Lỗi upload ảnh: " + e.getMessage());
                }
            }
        }
    }
}
