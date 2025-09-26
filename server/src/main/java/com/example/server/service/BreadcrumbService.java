package com.example.server.service;

import com.example.server.domain.BreadcrumbItem;
import com.example.server.domain.OperatingStandards2;
import com.example.server.domain.TypeOfCriterion;
import com.example.server.repository.OperatingStandard2Repository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BreadcrumbService {
    @Autowired
    TypeOfCriterionService typeOfCriterionService;
    @Autowired
    OperatingStandard2Repository operatingStandard2Repository;

    public List<BreadcrumbItem> getBreadcrumbForType(Integer typeId,
                                                     boolean showEvManager,
                                                     boolean statistics,
                                                     boolean resume,
                                                     boolean managerUser) {

        List<BreadcrumbItem> breadcrumbs = new ArrayList<>();

        breadcrumbs.add(new BreadcrumbItem("Trang chủ", "/"));
        if (typeId!=null){
            Optional<TypeOfCriterion> type = typeOfCriterionService.findById(typeId);
            breadcrumbs.add(new BreadcrumbItem(type.get().getName(), null)); // Trang hiện tại
        }
        if (showEvManager) breadcrumbs.add(new BreadcrumbItem("Quản lý sự kiện", null));
        if (statistics) breadcrumbs.add(new BreadcrumbItem("Thống kê",null));
        if (resume) breadcrumbs.add(new BreadcrumbItem("Hồ sơ",null));
        if (managerUser) breadcrumbs.add(new BreadcrumbItem("Quản lý nhân sự",null));

        return breadcrumbs;
    }
    // your news
    public List<BreadcrumbItem> getBreadcrumbNews() {

        List<BreadcrumbItem> breadcrumbs = new ArrayList<>();
        breadcrumbs.add(new BreadcrumbItem("Trang chủ", "/"));
        breadcrumbs.add(new BreadcrumbItem("Tin tức của bạn ", null)); // Trang hiện tại

        return breadcrumbs;
    }
    // show news
    public List<BreadcrumbItem> getBreadcrumbShowNews() {

        List<BreadcrumbItem> breadcrumbs = new ArrayList<>();
        breadcrumbs.add(new BreadcrumbItem("Trang chủ", "/"));
        breadcrumbs.add(new BreadcrumbItem("Tin tức", null)); // Trang hiện tại

        return breadcrumbs;
    }
    // show news in user have power ==1
    public List<BreadcrumbItem> getBreadcrumbShowNewsInU_Power1() {

        List<BreadcrumbItem> breadcrumbs = new ArrayList<>();
        breadcrumbs.add(new BreadcrumbItem("Trang chủ", "/"));
        breadcrumbs.add(new BreadcrumbItem("Quản lý tin tức", null)); // Trang hiện tại

        return breadcrumbs;
    }
    // filter by name
    public List<BreadcrumbItem> getBreadcrumbFilter(Integer typeId,Integer idOperatingStandard2) {

        List<BreadcrumbItem> breadcrumbs = new ArrayList<>();

        breadcrumbs.add(new BreadcrumbItem("Trang chủ", "/"));
        if (typeId!=null){
            Optional<TypeOfCriterion> type = typeOfCriterionService.findById(typeId);
            breadcrumbs.add(new BreadcrumbItem(type.get().getName(), null)); // Trang hiện tại
        }
        if (idOperatingStandard2!=null){
            Optional<OperatingStandards2> op = operatingStandard2Repository.findById(idOperatingStandard2);
            breadcrumbs.add(new BreadcrumbItem(op.get().getName(), null)); // Trang hiện tại
        }

        return breadcrumbs;
    }
}
