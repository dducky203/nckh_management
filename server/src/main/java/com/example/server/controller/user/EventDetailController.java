//package com.example.server.controller.user;
//
//import com.example.server.DTO.AllEventDto;
//import com.example.server.domain.*;
//import com.example.server.repository.*;
//import com.example.server.service.*;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.util.StringUtils;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.time.LocalDate;
//import java.util.*;
//import java.util.stream.Collectors;
//import java.util.stream.IntStream;
//
//@Controller
//@RequestMapping("/event")
//public class EventDetailController {
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
//    BreadcrumbService breadcrumbService;
//    @Autowired
//    CommonController commonController;
//    @Autowired
//    ActiveInCouncilRepository activeInCouncilRepository;
//    @Autowired
//    ActiveInCouncilService activeInCouncilService;
//    @Autowired
//    TImeRepository timeRepository;
//
//    // show detail event
//    public void modelEventDetail(Integer idEvent, Model model) {
//        Optional<Event> event = eventRepository.findById(idEvent);
//        model.addAttribute("event", eventRepository.findByIdEvent(idEvent));
//        model.addAttribute("time", timeRepository.findAll());
//        model.addAttribute("creator", userRepository.findByIdUser(event.get().getCreator()));
//        model.addAttribute("rooms", roomService.findAll());
//        // guest
//        List<Guest> guests = guestRepository.findByEventId(idEvent);
//        StringBuilder guestE = new StringBuilder();
//        for (Guest guest : guests) {
//            User user = guest.getUser();
//            if (user != null) {
//                guestE.append(", ").append(user.getName());
//            }
//
//        }
//        model.addAttribute("guests", guests);
//        model.addAttribute("guestNames", guestE.toString().replaceFirst(", ", ""));
//        model.addAttribute("countGuest", guestRepository.countGuest(idEvent).getCountGuest());
//        // member
//        List<Member> members = memberRepository.findByEventId(idEvent);
//        StringBuilder memberE = new StringBuilder();
//        for (Member member : members) {
//            User user = member.getUser();
//            if (user != null) {
//                memberE.append(", ").append(user.getName());
//            }
//
//        }
//        model.addAttribute("members", members);
//        model.addAttribute("memberNames", memberE.toString().replaceFirst(", ", ""));
//        model.addAttribute("countMember", memberRepository.countMember(idEvent).getCountMember());
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
//        // Lấy ra tên hoặc ID + tên của user tương ứng
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
//        model.addAttribute("ministryTask", ministryTaskRepository.findByIdEvent(idEvent));
//        model.addAttribute("overviewPaper", overviewPaperRepository.findByIdEvent(idEvent));
//        model.addAttribute("advisoryCouncil", advisoryCouncilRepository.findByIdEvent(idEvent));
//        model.addAttribute("researchProposal", researchProposalRepository.findByIdEvent(idEvent));
//        model.addAttribute("seminar", seminarRepository.findByIdEvent(idEvent));
//        model.addAttribute("studentResearchGuidance", guidanceRepository.findByIdEvent(idEvent));
//        model.addAttribute("vietnamPaper", vietnamesePaperRepository.findByIdEvent(idEvent));
//        model.addAttribute("activeInCouncil", activeInCouncilRepository.findByIdEvent(idEvent));
//    }
//
//    public void dtoEventDetail(Integer idEvent, Model model) {
//        AllEventDto allEventDto = new AllEventDto();
//        allEventDto.setEvent(eventRepository.findByIdEvent(idEvent));
//        allEventDto.setConference(conferenceRepository.findByIdEvent(idEvent));
//        allEventDto.setApprovedResearchTask(approvedResearchTaskRepository.findByIdEvent(idEvent));
//        allEventDto.setConferencePaper(conferencePaperRepository.findByIdEvent(idEvent));
//        allEventDto.setExpertPresentation(expertPresentationRepository.findByIdEvent(idEvent));
//        allEventDto.setInternationalPaper(internationalPaperRepository.findByIdEvent(idEvent));
//        allEventDto.setMinistryTask(ministryTaskRepository.findByIdEvent(idEvent));
//        allEventDto.setResearchAdvisoryCouncil(advisoryCouncilRepository.findByIdEvent(idEvent));
//        allEventDto.setResearchProposal(researchProposalRepository.findByIdEvent(idEvent));
//        allEventDto.setSeminar(seminarRepository.findByIdEvent(idEvent));
//        allEventDto.setStudentResearchGuidance(guidanceRepository.findByIdEvent(idEvent));
//        allEventDto.setVietnamesePaper(vietnamesePaperRepository.findByIdEvent(idEvent));
//        allEventDto.setActiveInCouncil(activeInCouncilRepository.findByIdEvent(idEvent));
//
//        model.addAttribute("allEventDto", allEventDto);
//    }
//
//    @GetMapping("/detail/{idEvent}")
//    public String detail(@PathVariable Integer idEvent, Model model) {
//        // call menu
//        commonController.allTypeOfCriteria(model, typeOfCriterionRepository);
//        modelEventDetail(idEvent, model);
//        return "user/eventDetail/detail";
//    }
//
//    // read presentation file
//    @GetMapping("/preFile/{idEvent}")
//    public String preFile(@PathVariable int idEvent, Model model) throws IOException {
//        if (conferenceRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("presentationFile",
//                    fileService.readFile(conferenceRepository.findByIdEvent(idEvent).getPresentationFiles()));
//        }
//        if (advisoryCouncilRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("presentationFile",
//                    fileService.readFile(advisoryCouncilRepository.findByIdEvent(idEvent).getDocumentTemplate()));
//        }
//        if (conferencePaperRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("presentationFile", fileService
//                    .readFile(conferencePaperRepository.findByIdEvent(idEvent).getConferenceProceedingsFile()));
//        }
//        if (expertPresentationRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("presentationFile",
//                    fileService.readFile(expertPresentationRepository.findByIdEvent(idEvent).getPresentationFile()));
//        }
//        if (seminarRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("presentationFile",
//                    fileService.readFile(seminarRepository.findByIdEvent(idEvent).getPresentationFile()));
//        }
//        if (activeInCouncilRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("presentationFile",
//                    fileService.readFile(activeInCouncilRepository.findByIdEvent(idEvent).getPresentationFile()));
//        }
//        return "user/eventDetail/presentationFile";
//    }
//
//    // read minutes of meeting
//    @GetMapping("/minutesOfMeeting/{idEvent}")
//    public String minutesOfMeeting(Model model, @PathVariable Integer idEvent) throws IOException {
//        if (conferenceRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("minutesOfMeeting",
//                    fileService.readFile(conferenceRepository.findByIdEvent(idEvent).getMinutesOfMeeting()));
//        }
//        if (expertPresentationRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("minutesOfMeeting",
//                    fileService.readFile(expertPresentationRepository.findByIdEvent(idEvent).getMinutesOfMeeting()));
//        }
//        if (seminarRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("minutesOfMeeting",
//                    fileService.readFile(seminarRepository.findByIdEvent(idEvent).getMinutesOfMeeting()));
//        }
//        if (advisoryCouncilRepository.findByIdEvent(idEvent) != null) {
//            model.addAttribute("minutesOfMeeting",
//                    fileService.readFile(activeInCouncilRepository.findByIdEvent(idEvent).getMinutesOfMeeting()));
//        }
//        return "user/eventDetail/minutesOfMeeting";
//    }
//
//    // show event to user
//    @GetMapping("/showE/{idUser}")
//    public String showE(@PathVariable Integer idUser, Model model,
//            @RequestParam("page") Optional<Integer> page,
//            @RequestParam("size") Optional<Integer> size) throws IOException {
//        // Phân trang xem/tao event
//        int currentPage = page.orElse(1); // curren page
//        int pageSize = size.orElse(10); // number event in page
//        // User user = userRepository.findByIdUser(idUser);
//        // count all page
//        Page<Event> eventPage = null;
//        model.addAttribute("pageSize", pageSize);
//        eventPage = pageService.findPaginatedEv(PageRequest.of(currentPage - 1, pageSize), idUser);
//        model.addAttribute("events", eventPage);
//        int totalPages = eventPage.getTotalPages();
//        if (totalPages > 0) {
//            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
//                    .boxed()
//                    .collect(Collectors.toList());
//            model.addAttribute("pageNumbers", pageNumbers);
//            model.addAttribute("maxPageNumber", totalPages);
//        }
//        return "user/event/showEvent";
//    }
//
//    // detail event in user (while see or create event)
//    @GetMapping("/detailE/{idEvent}")
//    public String detailE(@PathVariable Integer idEvent, Model model) {
//        // call menu
//        commonController.allTypeOfCriteria(model, typeOfCriterionRepository);
//
//        modelEventDetail(idEvent, model);
//        Event event = eventRepository.findByIdEvent(idEvent);
//        TypeOfCriterion typeOfCriterion = typeOfCriterionRepository
//                .getTypeOfCriterionByOS(event.getIdOperatingStandard2());
//        model.addAttribute("typeOfCriterion", typeOfCriterion);
//        return "user/event/eventDetail";
//    }
//
//    // remove event (is_delete event =>2)
//    @GetMapping("/remove/{idEvent}")
//    public String remove(@PathVariable Integer idEvent, Model model) throws IOException {
//        Event event = eventRepository.findByIdEvent(idEvent);
//        event.setIsDelete(2);
//        eventRepository.save(event);
//        return "redirect:/event/eventDetail/" + idEvent;
//    }
//
//    // repair event in user (while see or create event)
//    @GetMapping("/repairE/{idEvent}")
//    public String repairE(@PathVariable Integer idEvent, Model model) {
//        Event event = eventRepository.findByIdEvent(idEvent);
//        TypeOfCriterion typeOfCriterion = typeOfCriterionRepository
//                .getTypeOfCriterionByOS(event.getIdOperatingStandard2());
//        model.addAttribute("typeOfCriterion", typeOfCriterion);
//
//        modelEventDetail(idEvent, model);
//
//        // model.addAttribute("ty")
//        dtoEventDetail(idEvent, model);
//        return "user/event/repairEvent";
//    }
//
//    // save event
//    @PostMapping("/saveE/{idEvent}")
//    public String saveE(@ModelAttribute AllEventDto allEventDto,
//            @PathVariable Integer idEvent,
//            Model model,
//            @RequestParam("minutesOfMeeting") MultipartFile minutesOfMeeting,
//            @RequestParam("presentationFiles") MultipartFile presentationFiles,
//            @RequestParam("nameAllEventDto") String nameAllEventDto,
//            @RequestParam("imageEvent") MultipartFile imageEvent,
//            @RequestParam("guestNames") String guestNamesRaw,
//            @RequestParam("memberNames") String memberNamesRaw,
//            @RequestParam("guestIds") String guestIdsRaw,
//            @RequestParam("memberIds") String memberIdsRaw) throws IOException {
//
//        modelEventDetail(idEvent, model);
//        Event event = eventRepository.findByIdEvent(idEvent);
//        TypeOfCriterion typeOfCriterion = typeOfCriterionRepository
//                .getTypeOfCriterionByOS(event.getIdOperatingStandard2());
//        model.addAttribute("typeOfCriterion", typeOfCriterion);
//
//        // Xử lý upload file minutes
//        String minutesName = null;
//        if (!minutesOfMeeting.isEmpty()) {
//            minutesName = StringUtils.cleanPath(Objects.requireNonNull(minutesOfMeeting.getOriginalFilename()));
//            String minutesResult = fileController.handleFileUpload(minutesOfMeeting);
//            if (!"null".equals(minutesResult)) {
//                model.addAttribute("message", minutesResult);
//                return "user/event/repairEvent";
//            }
//        }
//
//        // Xử lý upload file presentation
//        String presentationName = null;
//        if (!presentationFiles.isEmpty()) {
//            presentationName = StringUtils.cleanPath(Objects.requireNonNull(presentationFiles.getOriginalFilename()));
//            String presentationResult = fileController.handleFileUpload(presentationFiles);
//            if (!"null".equals(presentationResult)) {
//                model.addAttribute("message", presentationResult);
//                return "user/event/repairEvent";
//            }
//        }
//        // Xử lý upload file image
//        String imageName = null;
//        if (!imageEvent.isEmpty()) {
//            imageName = StringUtils.cleanPath(Objects.requireNonNull(imageEvent.getOriginalFilename()));
//            fileService.store(imageEvent);
//        }
//
//        // Lưu thông tin event chính
//        String eventResult = eventService.saveE(allEventDto);
//        if (!"null".equals(eventResult)) {
//            model.addAttribute("message", eventResult);
//            return "user/event/repairEvent";
//        }
//
//        // Phân loại xử lý theo loại sự kiện
//        switch (nameAllEventDto) {
//            case "conference": {
//                String confResult = conferenceService.saveE(allEventDto);
//                if (!"null".equals(confResult)) {
//                    model.addAttribute("message", confResult);
//                    return "user/event/repairEvent";
//                }
//
//                Conference conf = conferenceRepository.findByIdEvent(idEvent);
//                if (minutesName != null)
//                    conf.setMinutesOfMeeting(minutesName);
//                if (presentationName != null)
//                    conf.setPresentationFiles(presentationName);
//                if (imageName != null)
//                    conf.setImage(imageName);
//                conferenceRepository.save(conf);
//                break;
//            }
//            case "activeInCouncil": {
//                String active = activeInCouncilService.saveE(allEventDto);
//                if (!"null".equals(active)) {
//                    model.addAttribute("message", active);
//                    return "user/event/repairEvent";
//                }
//
//                ActiveInCouncil conf = activeInCouncilRepository.findByIdEvent(idEvent);
//                if (minutesName != null)
//                    conf.setMinutesOfMeeting(minutesName);
//                if (presentationName != null)
//                    conf.setPresentationFile(presentationName);
//                if (imageName != null)
//                    conf.setImage(imageName);
//                activeInCouncilRepository.save(conf);
//                break;
//            }
//            case "approvedResearchTask": {
//                String artResult = approvedResearchTaskService.saveE(allEventDto);
//                if (!"null".equals(artResult)) {
//                    model.addAttribute("message", artResult);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            case "conferencePaper": {
//                String paperResult = conferencePaperService.saveE(allEventDto);
//                if (!"null".equals(paperResult)) {
//                    model.addAttribute("message", paperResult);
//                    return "user/event/repairEvent";
//                }
//
//                ConferencePaper paper = conferencePaperRepository.findByIdEvent(idEvent);
//                if (presentationName != null) {
//                    paper.setConferenceProceedingsFile(presentationName);
//                    conferencePaperRepository.save(paper);
//                }
//                break;
//            }
//            case "expertPresentation": {
//                String epResult = expertPresentationService.saveE(allEventDto);
//                if (!"null".equals(epResult)) {
//                    model.addAttribute("message", epResult);
//                    return "user/event/repairEvent";
//                }
//                ExpertPresentation ep = expertPresentationRepository.findByIdEvent(idEvent);
//                if (presentationName != null)
//                    ep.setPresentationFile(presentationName);
//                if (minutesName != null)
//                    ep.setMinutesOfMeeting(minutesName);
//                if (imageName != null)
//                    ep.setSeminarPhoto(imageName);
//                expertPresentationRepository.save(ep);
//                break;
//            }
//            case "internationalPaper": {
//                String iPaper = internationalPaperService.saveE(allEventDto);
//                if (!"null".equals(iPaper)) {
//                    model.addAttribute("message", iPaper);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            case "ministryTask": {
//                String ministry = ministryTaskService.saveE(allEventDto);
//                if (!"null".equals(ministry)) {
//                    model.addAttribute("message", ministry);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            case "overviewPaper": {
//                String ovp = overviewPaperService.saveE(allEventDto);
//                if (!"null".equals(ovp)) {
//                    model.addAttribute("message", ovp);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            case "researchAdvisoryCouncil": {
//                String rac = researchAdvisoryCouncilService.saveE(allEventDto);
//                if (!"null".equals(rac)) {
//                    model.addAttribute("message", rac);
//                    return "user/event/repairEvent";
//                }
//                ResearchAdvisoryCouncil researchAdvisoryCouncil = researchAdvisoryCouncilRepository
//                        .findByIdEvent(idEvent);
//                if (presentationName != null)
//                    researchAdvisoryCouncil.setDocumentTemplate(presentationName);
//                if (imageName != null)
//                    researchAdvisoryCouncil.setImage(imageName);
//                researchAdvisoryCouncilRepository.save(researchAdvisoryCouncil);
//                break;
//            }
//            case "researchProposal": {
//                String rp = researchProposalService.saveE(allEventDto);
//                if (!"null".equals(rp)) {
//                    model.addAttribute("message", rp);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            case "seminar": {
//                String seminar = seminarService.saveE(allEventDto);
//                if (!"null".equals(seminar)) {
//                    model.addAttribute("message", seminar);
//                    return "user/event/repairEvent";
//                }
//                Seminar seminar1 = seminarRepository.findByIdEvent(idEvent);
//                if (presentationName != null)
//                    seminar1.setPresentationFile(presentationName);
//                if (minutesName != null)
//                    seminar1.setMinutesOfMeeting(minutesName);
//                if (imageName != null)
//                    seminar1.setSeminarPhoto(imageName);
//                seminarRepository.save(seminar1);
//                break;
//            }
//            case "studentResearchGuidance": {
//                String srg = studentResearchGuidanceService.saveE(allEventDto);
//                if (!"null".equals(srg)) {
//                    model.addAttribute("message", srg);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            case "vietnamesePaper": {
//                String vp = vietnamesePaperService.saveE(allEventDto);
//                if (!"null".equals(vp)) {
//                    model.addAttribute("message", vp);
//                    return "user/event/repairEvent";
//                }
//                break;
//            }
//            default:
//                model.addAttribute("message", "Loại sự kiện không hợp lệ.");
//                return "user/event/repairEvent";
//        }
//        // Lưu khách mời và thành viên
//        saveUsers(guestIdsRaw, idEvent, true); // true cho guest
//        saveUsers(memberIdsRaw, idEvent, false); // false cho member
//
//        return "redirect:/event/detailE/" + idEvent;
//    }
//
//    // Phương thức hỗ trợ xử lý và lưu danh sách khách mời hoặc thành viên
//    public void saveUsers(String idsRaw, Integer eventId, boolean isGuest) {
//        List<Integer> ids = Arrays.stream(idsRaw.split(","))
//                .map(String::trim)
//                .filter(id -> !id.isEmpty())
//                .filter(id -> id.matches("\\d+"))
//                .map(Integer::parseInt)
//                .collect(Collectors.toList());
//
//        for (Integer userId : ids) {
//            User user = userRepository.findByIdUser(userId);
//            // send email to user
//            Event event = eventRepository.findByIdEvent(eventId);
//            Resume resume = resumeRepository.findByIdUser(user.getId());
//            String subject = "Lời mời tham dự sự kiện khoa CNTT VNUA";
//            if (event.getIdRoom() != null) {
//                Room room = roomRepository.getReferenceById(event.getIdRoom().getId());
//                String bodyGuest = "Khoa công nghệ thông tin kính mời ông/bà " + user.getName() + " làm khách mời\n" +
//                        "Tham gia sự kiện '" + event.getEventName() + "' \n" +
//                        "Diễn ra tại " + room.getRoomName() + ", " + room.getAddress() + "\n" +
//                        "Thời gian diễn ra " + event.getStartTime() + " --- " + event.getEndTime() + "\n" +
//                        "Ngày diễn ra sự kiện " + event.getDateOfEvent() + "\n";
//                String bodyMember = "Khoa công nghệ thông tin kính mời ông/bà " + user.getName()
//                        + "  làm thành viên của nhóm \n" +
//                        "Tham gia sự kiện '" + event.getEventName() + "' \n" +
//                        "Diễn ra tại " + room.getRoomName() + ", " + room.getAddress() + "\n" +
//                        "Thời gian diễn ra " + event.getStartTime() + " --- " + event.getEndTime() + "\n" +
//                        "Ngày diễn ra sự kiện " + event.getDateOfEvent() + "\n";
//                if (!guestRepository.existsByUserIdAndEventId(user.getId(), eventId) && isGuest) {
//                    emailController.sendEmail(resume.getEmail(), subject, bodyGuest);
//                }
//                if (!memberRepository.existsByUserIdAndEventId(user.getId(), eventId) && !isGuest) {
//                    emailController.sendEmail(resume.getEmail(), subject, bodyMember);
//                }
//            } else {
//                String body = "Khoa công nghệ thông tin kính mời ông/bà " + user.getName()
//                        + "  làm thành viên của nhóm \n" +
//                        "Tham gia sự kiện '" + event.getEventName() + "' \n" +
//                        "Thời gian diễn ra " + event.getStartTime() + " --- " + event.getEndTime() + "\n" +
//                        "Ngày diễn ra sự kiện " + event.getDateOfEvent() + "\n";
//                if (!guestRepository.existsByUserIdAndEventId(user.getId(), eventId) && isGuest) {
//                    emailController.sendEmail(resume.getEmail(), subject, body);
//                }
//                if (!memberRepository.existsByUserIdAndEventId(user.getId(), eventId) && !isGuest) {
//                    emailController.sendEmail(resume.getEmail(), subject, body);
//                }
//            }
//
//            // end send email
//            if (user != null) {
//                if (isGuest) {
//                    boolean exists = guestRepository.existsByUserIdAndEventId(userId, eventId);
//                    if (!exists) {
//                        Guest guest = new Guest();
//                        guest.setEvent(eventRepository.findByIdEvent(eventId));
//                        guest.setUser(user);
//                        guestRepository.save(guest);
//                    }
//                } else {
//                    boolean exists = memberRepository.existsByUserIdAndEventId(userId, eventId);
//                    if (!exists) {
//                        Member member = new Member();
//                        member.setEvent(eventRepository.findByIdEvent(eventId));
//                        member.setUser(user);
//                        memberRepository.save(member);
//                    }
//                }
//            } else {
//                System.out.println("User vs ID " + userId + " khong ton tai.");
//            }
//        }
//    }
//
//    // Xóa khách mời
//    @PostMapping("/removeGuest/{eventId}/{userId}")
//    public String removeGuest(@PathVariable("eventId") Integer eventId,
//            @PathVariable("userId") Integer userId,
//            Model model) {
//        Event event = eventRepository.findById(eventId).orElse(null);
//        User user = userRepository.findById(userId).orElse(null);
//        if (event != null) {
//            // Tìm khách mời trong sự kiện và xóa
//            Guest guest = guestRepository.findByEventAndUser(event, user);
//            if (guest != null) {
//                guestRepository.delete(guest);
//                model.addAttribute("message", "Khách mời đã được xóa thành công.");
//            } else {
//                model.addAttribute("message", "Không tìm thấy khách mời.");
//            }
//        }
//        return "redirect:/event/detailE/" + eventId;
//    }
//
//    // Xóa thành viên
//    @PostMapping("/removeMember/{eventId}/{userId}")
//    public String removeMember(@PathVariable("eventId") Integer eventId,
//            @PathVariable("userId") Integer userId,
//            Model model) {
//        Event event = eventRepository.findById(eventId).orElse(null);
//        User user = userRepository.findById(userId).orElse(null);
//        if (event != null) {
//            // Tìm thành viên trong sự kiện và xóa
//            Member member = memberRepository.findByEventAndUser(event, user);
//            if (member != null) {
//                memberRepository.delete(member);
//                model.addAttribute("message", "Thành viên đã được xóa thành công.");
//            } else {
//                model.addAttribute("message", "Không tìm thấy thành viên.");
//            }
//        }
//        return "redirect:/event/detailE/" + eventId;
//    }
//
//    // api count event per month
//    @GetMapping("/events-per-month")
//    public Map<Integer, Long> getStats(@RequestParam int year) {
//        return eventService.getMonthlyStats(year);
//    }
//
//    @GetMapping("/statistics")
//    public String statistics(Model model, HttpSession session) {
//        // call menu
//        commonController.allTypeOfCriteria(model, typeOfCriterionRepository);
//        int year = LocalDate.now().getYear();
//        model.addAttribute("year", year);
//        model.addAttribute("statistics", getStats(year));
//        // path user
//        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbForType(null, false, true, false, false)); // gửi
//                                                                                                                    // ra
//                                                                                                                    // view
//        // end breadcrumb
//        return "user/statistics/showStatistics";
//    }
//
//    @PostMapping("/postStatistics")
//    public String yearStatistics(@RequestParam int year, Model model) {
//        model.addAttribute("year", year);
//        model.addAttribute("statistics", getStats(year));
//        return "user/statistics/showStatistics";
//    }
//
//    // show all event by (month - year)
//    @GetMapping("/showEvByMonth/{month}/{year}")
//    public String showEvByMonth(Model model,
//            @PathVariable int month,
//            @PathVariable int year,
//            @RequestParam("page") Optional<Integer> page,
//            @RequestParam("size") Optional<Integer> size) {
//        model.addAttribute("month", month);
//        model.addAttribute("year", year);
//        model.addAttribute("statistics", getStats(year));
//        int currentPage = page.orElse(1); // số trang
//        int pageSize = size.orElse(10); // số event trên 1 trang
//        model.addAttribute("pageSize", pageSize);
//        Page<Event> productPage = pageService.findPaginatedByMonth(PageRequest.of(currentPage - 1, pageSize), month,
//                year);
//        model.addAttribute("events", productPage);
//        int totalPages = productPage.getTotalPages();
//        if (totalPages > 0) {
//            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
//                    .boxed()
//                    .collect(Collectors.toList());
//            model.addAttribute("pageNumbers", pageNumbers);
//            model.addAttribute("maxPageNumber", pageNumbers.size());
//        }
//        // model.addAttribute("events",eventRepository.findByMonth(month,year));
//        return "user/statistics/showStatistics";
//    }
//
//    // show event to user
//    @GetMapping("/showEvManagement")
//    public String showEvManagement(Model model,
//            @RequestParam("page") Optional<Integer> page,
//            @RequestParam("size") Optional<Integer> size,
//            HttpSession session) throws IOException {
//        // call menu
//        commonController.allTypeOfCriteria(model, typeOfCriterionRepository);
//        // Phân trang xem/tao event
//        int currentPage = page.orElse(1); // curren page
//        int pageSize = size.orElse(10); // number event in page
//        model.addAttribute("pageSize", pageSize);
//
//        // duong dan cho nguoi dung
//
//        Page<Event> eventPage = pageService.findPaginatedEvManagement(PageRequest.of(currentPage - 1, pageSize));
//        model.addAttribute("events", eventPage);
//
//        // count all page
//        int totalPages = eventPage.getTotalPages();
//        if (totalPages > 0) {
//            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
//                    .boxed()
//                    .collect(Collectors.toList());
//            model.addAttribute("pageNumbers", pageNumbers);
//            model.addAttribute("maxPageNumber", totalPages);
//        }
//        // Lưu vào session
//        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbForType(null, true, false, false, false)); // gửi
//                                                                                                                    // ra
//                                                                                                                    // view
//        // end breadcrumb
//        return "user/event/showEvent";
//    }
//
//    // if power user == 1 || 2 || 5 => qly duyet ev
//    @GetMapping("/status1/{idEvent}")
//    public String management(Model model, @PathVariable Integer idEvent) {
//        Event event = eventRepository.findById(idEvent).orElse(null);
//        assert event != null;
//        // Kiểm tra ngày để set status phù hợp
//        java.time.LocalDate today = java.time.LocalDate.now();
//        if (event.getDateOfEvent() != null && event.getDateOfEvent().isBefore(today)) {
//            event.setStatus("completed");
//        } else {
//            event.setStatus("upcoming");
//        }
//        eventRepository.save(event);
//        return "redirect:/event/detailE/" + idEvent;
//    }
//}
