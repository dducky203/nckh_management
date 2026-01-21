//package com.example.server.controller.admin;
//
//import com.example.server.controller.user.EmailController;
//import com.example.server.controller.user.EventDetailController;
//import com.example.server.controller.user.FileController;
//import com.example.server.domain.*;
//import com.example.server.repository.*;
//import com.example.server.service.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//import java.util.stream.Collectors;
//import java.util.stream.IntStream;
//
//@Controller
//@RequestMapping("/ad/statistics")
//public class StatisticsController {
//    @Autowired
//    ConferenceRepository conferenceRepository;
//    @Autowired
//    FileService fileService;
//    @Autowired
//    EventRepository eventRepository;
//    @Autowired
//    UserRepository userRepository;
//    @Autowired
//    ApprovedResearchTaskRepository approvedResearchTaskRepository;
//    @Autowired
//    ConferencePaperRepository conferencePaperRepository;
//    @Autowired
//    ExpertPresentationRepository expertPresentationRepository;
//    @Autowired
//    InternationalPaperRepository internationalPaperRepository;
//    @Autowired
//    MinistryTaskRepository ministryTaskRepository;
//    @Autowired
//    OverviewPaperRepository overviewPaperRepository;
//    @Autowired
//    ResearchAdvisoryCouncilRepository advisoryCouncilRepository;
//    @Autowired
//    ResearchProposalRepository researchProposalRepository;
//    @Autowired
//    SeminarRepository seminarRepository;
//    @Autowired
//    StudentResearchGuidanceRepository guidanceRepository;
//    @Autowired
//    VietnamesePaperRepository vietnamesePaperRepository;
//    @Autowired
//    PageService pageService;
//    @Autowired
//    EventService eventService;
//    @Autowired
//    ConferenceService conferenceService;
//    @Autowired
//    FileController fileController;
//    @Autowired
//    RoomService roomService;
//    @Autowired
//    ApprovedResearchTaskService approvedResearchTaskService;
//    @Autowired
//    ConferencePaperService conferencePaperService;
//    @Autowired
//    ExpertPresentationService expertPresentationService;
//    @Autowired
//    InternationalPaperService internationalPaperService;
//    @Autowired
//    MinistryTaskService ministryTaskService;
//    @Autowired
//    OverviewPaperService overviewPaperService;
//    @Autowired
//    ResearchAdvisoryCouncilService researchAdvisoryCouncilService;
//    @Autowired
//    ResearchProposalService researchProposalService;
//    @Autowired
//    SeminarService seminarService;
//    @Autowired
//    VietnamesePaperService vietnamesePaperService;
//    @Autowired
//    GuestRepository guestRepository;
//    @Autowired
//    MemberRepository memberRepository;
//    @Autowired
//    StudentResearchGuidanceService studentResearchGuidanceService;
//    @Autowired
//    EmailController emailController;
//    @Autowired
//    private ResumeRepository resumeRepository;
//    @Autowired
//    private RoomRepository roomRepository;
//    @Autowired
//    private TypeOfCriterionRepository typeOfCriterionRepository;
//    @Autowired
//    private ResearchAdvisoryCouncilRepository researchAdvisoryCouncilRepository;
//    @Autowired
//    EventDetailController eventDetailController;
//
//
//    // statistics
//    @PostMapping("/postStatistics")
//    public String yearStatistics(@RequestParam int year, Model model) {
//        model.addAttribute("year", year);
//        model.addAttribute("statistics", eventDetailController.getStats(year));
//        return "admin/index";
//    }
//    // show all event by (month - year)
//    @GetMapping("/showEvByMonth/{month}/{year}")
//    public String showEvByMonth(Model model,
//                                @PathVariable int month,
//                                @PathVariable int year,
//                                @RequestParam("page") Optional<Integer> page,
//                                @RequestParam("size") Optional<Integer> size) {
//        model.addAttribute("month",month);
//        model.addAttribute("year", year);
//        model.addAttribute("statistics", eventDetailController.getStats(year));
//        int currentPage = page.orElse(1); // số trang
//        int pageSize = size.orElse(10); // số event trên 1 trang
//        model.addAttribute("pageSize", pageSize);
//        Page<Event> productPage = pageService.findPaginatedByMonth(PageRequest.of(currentPage - 1, pageSize),month,year);
//        model.addAttribute("events", productPage);
//        int totalPages = productPage.getTotalPages();
//        if (totalPages > 0) {
//            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
//                    .boxed()
//                    .collect(Collectors.toList());
//            model.addAttribute("pageNumbers", pageNumbers);
//            model.addAttribute("maxPageNumber",pageNumbers.size());
//        }
//        return "admin/index";
//    }
//    // show detail event
//    public void modelEventDetail(Integer idEvent, Model model){
//        Optional<Event> event = eventRepository.findById(idEvent);
//        model.addAttribute("event", eventRepository.findByIdEvent(idEvent));
//        model.addAttribute("creator",userRepository.findByIdUser(event.get().getCreator()));
//        model.addAttribute("rooms",roomService.findAll());
//        //guest
//        List<Guest> guests = guestRepository.findByEventId(idEvent);
//        StringBuilder guestE = new StringBuilder();
//        for (Guest guest : guests) {
//            User user = guest.getUser();
//            if (user != null){
//                guestE.append(", ").append(user.getName());
//            }
//
//        }
//        model.addAttribute("guests", guests);
//        model.addAttribute("guestNames", guestE.toString().replaceFirst(", ", ""));
//        model.addAttribute("countGuest",guestRepository.countGuest(idEvent).getCountGuest());
//        // member
//        List<Member> members = memberRepository.findByEventId(idEvent);
//        StringBuilder memberE = new StringBuilder();
//        for (Member member : members) {
//            User user = member.getUser();
//            if (user != null){
//                memberE.append(", ").append(user.getName());
//            }
//
//        }
//        model.addAttribute("members", members);
//        model.addAttribute("memberNames", memberE.toString().replaceFirst(", ", ""));
//        model.addAttribute("countMember",memberRepository.countMember(idEvent).getCountMember());
//        List<Guest> guestList = guestRepository.findByEventId(idEvent);
//        List<Member> memberList = memberRepository.findByEventId(idEvent);
//
//        model.addAttribute("guestIdsString", guests.stream()
//                .map(g -> String.valueOf(g.getUser().getId()))
//                .collect(Collectors.joining(",")));
//
//        model.addAttribute("memberIdsString", members.stream()
//                .map(m -> String.valueOf(m.getUser().getId()))
//                .collect(Collectors.joining(",")));
//
//
//// Lấy ra tên hoặc ID + tên của user tương ứng
//        List<User> guestUsers = guestList.stream()
//                .map(guest -> userRepository.findById(guest.getUser().getId()).orElse(null))
//                .filter(Objects::nonNull)
//                .collect(Collectors.toList());
//
//        List<User> memberUsers = memberList.stream()
//                .map(member -> userRepository.findById(member.getUser().getId()).orElse(null))
//                .filter(Objects::nonNull)
//                .collect(Collectors.toList());
//
//        model.addAttribute("guestUsers", guestUsers);
//        model.addAttribute("memberUsers", memberUsers);
//
//        // cac chi tiet event
//        model.addAttribute("conferences", conferenceRepository.findByIdEvent(idEvent));
//        model.addAttribute("approvedResearchTask", approvedResearchTaskRepository.findByIdEvent(idEvent));
//        model.addAttribute("conferencePaper", conferencePaperRepository.findByIdEvent(idEvent));
//        model.addAttribute("expertPresentation", expertPresentationRepository.findByIdEvent(idEvent));
//        model.addAttribute("internationalPaper", internationalPaperRepository.findByIdEvent(idEvent));
//        model.addAttribute("ministryTask",ministryTaskRepository.findByIdEvent(idEvent));
//        model.addAttribute("overviewPaper",overviewPaperRepository.findByIdEvent(idEvent));
//        model.addAttribute("advisoryCouncil",advisoryCouncilRepository.findByIdEvent(idEvent));
//        model.addAttribute("researchProposal",researchProposalRepository.findByIdEvent(idEvent));
//        model.addAttribute("seminar",seminarRepository.findByIdEvent(idEvent));
//        model.addAttribute("studentResearchGuidance",guidanceRepository.findByIdEvent(idEvent));
//        model.addAttribute("vietnamPaper",vietnamesePaperRepository.findByIdEvent(idEvent));
//    }
//    // detail event in admin (while see or create event)
//    @GetMapping("/detailE/{idEvent}")
//    public String detailE(@PathVariable Integer idEvent, Model model) {
//        modelEventDetail(idEvent,model);
//        Event event = eventRepository.findByIdEvent(idEvent);
//        TypeOfCriterion typeOfCriterion = typeOfCriterionRepository.getTypeOfCriterionByOS(event.getIdOperatingStandard2());
//        model.addAttribute("typeOfCriterion", typeOfCriterion);
//        return "admin/event/eventDetail";
//    }
//    // remove event (is_delete event =>2)
//    @GetMapping("/remove/{idEvent}")
//    public String remove(@PathVariable Integer idEvent, Model model) throws IOException {
//        Event event = eventRepository.findByIdEvent(idEvent);
//        event.setIsDelete(2);
//        eventRepository.save(event);
//        return "redirect:/ad/statistics/detailE/" + idEvent;
//    }
//}
