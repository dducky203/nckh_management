package com.example.server.controller.user;

import com.example.server.domain.*;
import com.example.server.repository.EventRepository;
import com.example.server.repository.OperatingStandard2Repository;
import com.example.server.repository.OperatingStandardRepository;
import com.example.server.repository.TypeOfCriterionRepository;
import com.example.server.service.BreadcrumbService;
import com.example.server.service.PageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/filter")
public class FilterController {
    @Autowired
    OperatingStandardRepository operatingStandardRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    PageService pageService;
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    BreadcrumbService breadcrumbService;
    @Autowired
    private OperatingStandard2Repository operatingStandard2Repository;
    @Autowired
    CommonController commonController;


    // filter by type of criteria
    @GetMapping("/type/{idTypeOfCriteria}")
    public String filter(@PathVariable int idTypeOfCriteria, Model model,
                         @RequestParam("page") Optional<Integer> page,
                         @RequestParam("size") Optional<Integer> size, HttpSession  session) {
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
        // duong dan cho nguoi dung
        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbForType(idTypeOfCriteria,false,false,false,false)); // gửi ra view
        // end breadcrumb

        //
        List<OperatingStandards2> operatingStandards2s = operatingStandard2Repository.findAll();
        model.addAttribute("operatingStandards2", operatingStandards2s);
//        TypeOfCriterion typeOfCriterion = typeOfCriterionRepository.findById(idTypeOfCriteria).get();
//        List<OperatingStandard> operatingStandard = operatingStandardRepository.findByCriteria(idTypeOfCriteria);
        int currentPage = page.orElse(1); // số trang
        int pageSize = size.orElse(10); // số event trên 1 trang
        model.addAttribute("pageSize", pageSize);
        Page<Event> productPage = pageService.findPaginatedByCriteria(PageRequest.of(currentPage - 1, pageSize),idTypeOfCriteria);
        model.addAttribute("events", productPage);
        int totalPages = productPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber",pageNumbers.size());
        }

        return "user/filter/filterByType";
    }

    // filter by operating standard => event
    @GetMapping("/operatingStandard/{idTypeOfCriteria}/{idOperatingStandard2}")
    public String filter(
            @PathVariable("idOperatingStandard2") Integer idOperatingStandard2,
            Model model,
            @RequestParam("page") Optional<Integer> page,
            @RequestParam("size") Optional<Integer> size,
            @PathVariable Integer idTypeOfCriteria) {
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
        // duong dan cho nguoi dung
        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbFilter(idTypeOfCriteria,idOperatingStandard2)); // gửi ra view
        // end breadcrumb
        //

        model.addAttribute("operatingStandard2", operatingStandard2Repository.findById(idOperatingStandard2));
        List<OperatingStandards2> operatingStandards2 = operatingStandard2Repository.findAll();
        model.addAttribute("operatingStandards2", operatingStandards2);
//        model.addAttribute("events", eventRepository.findByName(idOperatingStandard));
        // phân trang cho trang chủ
        int currentPage = page.orElse(1); // số trang
        int pageSize = size.orElse(10); // số event trên 1 trang
        model.addAttribute("pageSize", pageSize);
        Page<Event> productPage = pageService.findPaginatedByNameOp(PageRequest.of(currentPage - 1, pageSize),idOperatingStandard2);
        model.addAttribute("events", productPage);
        int totalPages = productPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber",pageNumbers.size());
        }
        return "user/filter/filterByName";
    }
}
