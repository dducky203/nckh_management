package com.example.server.controller.admin;

import com.example.server.controller.user.NewsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Controller
@RequestMapping("/ad/managerNews")
public class ManagerNewsController {
    @Autowired
    NewsController newsController;

    // show all news
    @GetMapping("")
    public String news(Model model,
                       @RequestParam("page") Optional<Integer> page,
                       @RequestParam("size") Optional<Integer> size) {
        newsController.showNewsApi(model,page,size);
        return "/admin/news/managerNews";
    }
    // detail news
    @GetMapping("/detail/{idNews}")
    public String managerDetailNews(Model model, @PathVariable Integer idNews){
        newsController.managerDetailNewsApi(model,idNews);
        return "/admin/news/detailNews";
    }
    // browse news
    @GetMapping("/browseNews/{idNews}")
    public String browseNews(@PathVariable Integer idNews) {
        newsController.browseNewsApi(idNews);
        return "redirect:/ad/managerNews/detail/"+idNews;
    }
    // repair news
    @GetMapping("/repairNews/{idNews}")
    public String repairNews(@PathVariable Integer idNews,Model model) {
        newsController.repairNesApi(idNews,model);
        return "/admin/news/repairNews";
    }
    // save repaired News
    @PostMapping("/saveRepairedNews/{idNews}")
    public String saveRepairedNews(@PathVariable int idNews,
                                   @RequestParam("title") String title,
                                   @RequestParam("content") String content,
                                   @RequestParam("images") MultipartFile[] images,
                                   @RequestParam(value = "deletedImageIds", required = false) String deletedImageIds) {
        newsController.apiSaveRepairedNews(idNews, title, content, images, deletedImageIds);
        return "redirect:/ad/managerNews/detail/"+idNews;
    }
}
