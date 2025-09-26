package com.example.server.controller.user;

import com.example.server.DTO.EventBannerDTO;
import com.example.server.DTO.NcmListWrapper;
import com.example.server.DTO.RemainingEventDTO;
import com.example.server.domain.*;
import com.example.server.projection.IOperatingStandard;
import com.example.server.repository.*;
import com.example.server.service.BreadcrumbService;
import com.example.server.service.EventService;
import com.example.server.service.PageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("")
public class CommonController {
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    OperatingStandardRepository operatingStandardRepository;
    @Autowired
    ConferenceRepository conferenceRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    PageService pageService;
    @Autowired
    EventService eventService;
    @Autowired
    private SeminarRepository seminarRepository;
    @Autowired
    private ResearchAdvisoryCouncilRepository researchAdvisoryCouncilRepository;
    @Autowired
    private ExpertPresentationRepository expertPresentationRepository;
    @Autowired
    NcmRepository NcmRepository;
    @Autowired
    BreadcrumbService breadcrumbService;
    @Autowired
    GroupRepository groupRepository;

    public void allTypeOfCriteria(Model model, TypeOfCriterionRepository typeOfCriterionRepository) {
        List<TypeOfCriterion> allTypeOfCriterion = typeOfCriterionRepository.getAllTypeOfCriterion();
// Lọc theo isEvent
        List<TypeOfCriterion> eventTypes = allTypeOfCriterion.stream()
                .filter(TypeOfCriterion::isEvent)
                .collect(Collectors.toList());

        List<TypeOfCriterion> nonEventTypes = allTypeOfCriterion.stream()
                .filter(t -> !t.isEvent())
                .collect(Collectors.toList());
// Add vào model
        model.addAttribute("eventTypes", eventTypes);
        model.addAttribute("nonEventTypes", nonEventTypes);


    }

    public void getTop5Events(Model model) {
        LocalDate releaseDate = LocalDate.now();
        List<Event> events = eventRepository.getTop5Events();

        List<Event> upcomingEvents = new ArrayList<>();
        List<EventBannerDTO> bannerDTOs = new ArrayList<>();

        for (Event event : events) {
            if (event.getDateOfEvent().isAfter(releaseDate)) {
                upcomingEvents.add(event);

                String image = null;

                Conference conf = conferenceRepository.findByIdEvent(event.getId());
                if (conf != null && conf.getImage() != null) image = conf.getImage();

                Seminar sem = seminarRepository.findByIdEvent(event.getId());
                if (image == null && sem != null && sem.getSeminarPhoto() != null) image = sem.getSeminarPhoto();

                ResearchAdvisoryCouncil council = researchAdvisoryCouncilRepository.findByIdEvent(event.getId());
                if (image == null && council != null && council.getImage() != null) image = council.getImage();

                ExpertPresentation ex = expertPresentationRepository.findByIdEvent(event.getId());
                if (image == null && ex != null && ex.getSeminarPhoto() != null) image = ex.getSeminarPhoto();

                // 👉 Lấy thời gian đếm ngược từ remainingEvents
                LocalDateTime dateTimeOfEvent = null;
                for (RemainingEventDTO r : eventService.getRemainingEvents()) {
                    if (r.getId().equals(event.getId())) {
                        dateTimeOfEvent = r.getDateTimeOfEvent();
                        break;
                    }
                }

                if (image != null && dateTimeOfEvent != null) {
                    bannerDTOs.add(new EventBannerDTO(event, image, dateTimeOfEvent));
                }
            }
        }
        model.addAttribute("bannerDTOs", bannerDTOs);

    }

    // get user
    @GetMapping(value = {"/" ,"/user"})
    public String enterUser(Model model,
                            @RequestParam("page") Optional<Integer> page,
                            @RequestParam("size") Optional<Integer> size,
                            HttpSession  session) throws IOException {
//      breadcrumb
        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbForType(null,false,false,false,false)); // gửi ra view
        // end breadcrumb

        allTypeOfCriteria(model, typeOfCriterionRepository); // lay toan bo nckh and event
        getTop5Events(model); // lay top5 upcoming event
        model.addAttribute("remainingEvents",eventService.getRemainingEvents());// remaining time of event

        // phân trang cho trang chủ
        int currentPage = page.orElse(1); // số trang
        int pageSize = size.orElse(10); // số event trên 1 trang
        model.addAttribute("pageSize", pageSize);
        Page<Event> productPage = pageService.findPaginatedStatus2(PageRequest.of(currentPage - 1, pageSize));
        model.addAttribute("events", productPage);
        int totalPages = productPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber",pageNumbers.size());
        }

        // session year
        int currentYear = LocalDate.now().getYear();
        session.setAttribute("currentYear", currentYear);
        return "user/index";
    }
    // introduce
    @GetMapping("/intro")
    public String intro(Model model){
        model.addAttribute("groups",groupRepository.findAll());
        return "/user/introduce";
    }




}
