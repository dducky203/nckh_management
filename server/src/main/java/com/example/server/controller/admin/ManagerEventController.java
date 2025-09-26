package com.example.server.controller.admin;

import com.example.server.domain.Event;
import com.example.server.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/ad/event")
public class ManagerEventController {
    @Autowired
    PageService pageService;

    // show All event
    @GetMapping("/showAllEvManagement")
    public String showAllEvManagementAd( Model model,
                                      @RequestParam("page") Optional<Integer> page,
                                      @RequestParam("size") Optional<Integer> size) throws IOException {
        // Phân trang xem/tao event
        int currentPage = page.orElse(1); // curren page
        int pageSize = size.orElse(10); // number event in page
        model.addAttribute("pageSize", pageSize);

        Page<Event> eventPage = pageService.findAllPaginated(PageRequest.of(currentPage - 1, pageSize));
        model.addAttribute("events", eventPage);

        // count all page
        int totalPages = eventPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber", totalPages);
        }
        return "admin/event/showEvent";
    }

    // show event with status == 2
    @GetMapping("/showEvManagement")
    public String showEvManagementAd( Model model,
                                    @RequestParam("page") Optional<Integer> page,
                                    @RequestParam("size") Optional<Integer> size) throws IOException {
        // Phân trang xem/tao event
        int currentPage = page.orElse(1); // curren page
        int pageSize = size.orElse(10); // number event in page
        model.addAttribute("pageSize", pageSize);

        Page<Event> eventPage = pageService.findPaginatedEvManagement(PageRequest.of(currentPage - 1, pageSize));
        model.addAttribute("events", eventPage);

        // count all page
        int totalPages = eventPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber", totalPages);
        }
        return "admin/event/showEvStatus2";
    }

}
