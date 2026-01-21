//package com.example.server.controller.user;
//
//import com.example.server.DTO.AllEventDto;
//import com.example.server.domain.*;
//import com.example.server.projection.IOperatingStandard;
//import com.example.server.repository.*;
//import com.example.server.service.*;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.util.StringUtils;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.Arrays;
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Controller
//@RequestMapping("/createE")
//public class CreateEventController {
//    @Autowired
//    TypeOfCriterionRepository typeOfCriterionRepository;
//    @Autowired
//    OperatingStandardRepository operatingStandardRepository;
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
//    StudentResearchGuidanceService guidanceService;
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
//    EventDetailController eventDetailController;
//    @Autowired
//    OperatingStandard2Repository operatingStandard2Repository;
//    @Autowired
//    CommonController commonController;
//    @Autowired
//    private RoomRepository roomRepository;
//    @Autowired
//    ActiveInCouncilRepository activeInCouncilRepository;
//    @Autowired
//    ActiveInCouncilService activeInCouncilService;
//
//    // select type of event
//    @GetMapping("/selectE")
//    public String selectE(Model model, HttpSession session) {
//        commonController.allTypeOfCriteria(model, typeOfCriterionRepository);
//        List<OperatingStandards2> operatingStandards2 = operatingStandard2Repository.findAll();
//        model.addAttribute("operatingStandards2", operatingStandards2);
//        session.removeAttribute("operatingStandardId");
//        return "user/createEvent/selectEvent";
//    }
//
//    public void modelEventDetail(Integer operatingStandardId2, Model model) {
//        Optional<OperatingStandards2> operatingStandardOpt = operatingStandard2Repository
//                .findById(operatingStandardId2);
//
//        if (operatingStandardOpt.isPresent()) {
//            OperatingStandards2 operatingStandard = operatingStandardOpt.get();
//            int typeId = operatingStandard.getIdTypeOfCriteria().getId();
//            int operatingStandardId = operatingStandard.getIdOperatingStandard().getId();
//            String currentType = "";
//
//            switch (typeId) {
//                case 1:
//                    currentType = "seminar";
//                    break;
//                case 2:
//                    currentType = "conferences";//
//                    break;
//                case 3:
//                    currentType = "internationalPaper";//
//                    break;
//                case 4:
//                    currentType = "vietnamPaper"; //
//                    break;
//                case 5:
//                    currentType = "conferencePaper";//
//                    break;
//
//                case 6:
//                    currentType = "overviewPaper";//
//                    break;
//
//                case 11:
//                    currentType = "activeInCouncil";
//                    break;
//                // case 8:
//                // break;
//                case 9:
//                    currentType = "researchProposal"; //
//                    break;
//                case 10:
//                    if (Arrays.asList(25, 26, 27, 28).contains(operatingStandardId2)) { // neu id OS2 == 25 26 27 28
//                        currentType = "ministryTask";
//                    } else if (operatingStandardId == 29) {
//                        currentType = "studentResearchGuidance";//
//                    } else if (operatingStandardId == 33) {
//                        currentType = "approvedResearchTask";//
//                    }
//                    break;
//                case 7:
//                    currentType = "advisoryCouncil";//
//                    break;
//                case 12:
//                    currentType = "expertPresentation";//
//                    break;
//                default:
//                    currentType = "unknown";
//            }
//            model.addAttribute("rooms", roomService.findAll());
//            model.addAttribute("currentType", currentType);
//        }
//    }
//
//    public void dtoEventDetail(Integer idEvent, Model model) {
//        AllEventDto allEventDto = new AllEventDto();
//        model.addAttribute("allEventDto", allEventDto);
//    }
//
//    public void eventDetail(Integer operatingStandardId2, Model model) {
//        dtoEventDetail(operatingStandardId2, model);
//        modelEventDetail(operatingStandardId2, model);
//    }
//
//    @GetMapping("/informationEvent/{idTypeOfCriteria}/{operatingStandardId2}")
//    public String informationEvent(Model model,
//            @PathVariable Integer operatingStandardId2,
//            @PathVariable Integer idTypeOfCriteria,
//            HttpSession session) {
//        eventDetail(operatingStandardId2, model);
//        model.addAttribute("typeOfCriteria", typeOfCriterionRepository.findById(idTypeOfCriteria).get());
//        session.removeAttribute("operatingStandardId2");
//        session.setAttribute("operatingStandardId2", operatingStandardId2);
//        return "/user/createEvent/createEvent";
//    }
//
//    // save event
//    @PostMapping("/saveE/{operatingStandardId2}")
//    public String saveE(@PathVariable Integer operatingStandardId2,
//            @ModelAttribute AllEventDto allEventDto,
//            Model model,
//            @RequestParam("minutesOfMeeting") MultipartFile minutesOfMeeting,
//            @RequestParam("presentationFiles") MultipartFile presentationFiles,
//            @RequestParam("nameAllEventDto") String nameAllEventDto,
//            @RequestParam("imageEvent") MultipartFile imageEvent,
//            @RequestParam("guestNames") String guestNamesRaw,
//            @RequestParam("memberNames") String memberNamesRaw,
//            @RequestParam("guestIds") String guestIdsRaw,
//            @RequestParam("memberIds") String memberIdsRaw,
//            HttpSession session) throws IOException {
//
//        // information
//        eventDetail(operatingStandardId2, model);
//        model.addAttribute("typeOfCriteria",
//                typeOfCriterionRepository.findById(
//                        operatingStandard2Repository.findById(operatingStandardId2).get().getIdTypeOfCriteria().getId())
//                        .get());
//        session.removeAttribute("operatingStandardId2");
//        session.setAttribute("operatingStandardId2", operatingStandardId2);
//        //
//
//        eventDetail(operatingStandardId2, model);
//        // model.addAttribute("typeOfCriteria",
//        // typeOfCriterionRepository.findById(idTypeOfCriteria).get());
//        session.removeAttribute("operatingStandardId2");
//        session.setAttribute("operatingStandardId2", operatingStandardId2);
//        // Xử lý upload file minutes
//        String minutesName = null;
//        if (!minutesOfMeeting.isEmpty()) {
//            minutesName = StringUtils.cleanPath(Objects.requireNonNull(minutesOfMeeting.getOriginalFilename()));
//            String minutesResult = fileController.handleFileUpload(minutesOfMeeting);
//            if (!"null".equals(minutesResult)) {
//                model.addAttribute("message", minutesResult);
//                eventDetail(operatingStandardId2, model);
//                return "user/createEvent/createEvent";
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
//                eventDetail(operatingStandardId2, model);
//                return "user/createEvent/createEvent";
//            }
//        }
//        // Xử lý upload file image
//        String imageName = null;
//        if (!imageEvent.isEmpty()) {
//            imageName = StringUtils.cleanPath(Objects.requireNonNull(imageEvent.getOriginalFilename()));
//            fileService.store(imageEvent);
//        }
//        // call user -> creator
//        User user = (User) session.getAttribute("saveUser");
//
//        // save main event information
//        String eventResult = eventService.createE(allEventDto);
//        Event event = allEventDto.getEvent();
//        event.setCreator(user.getId());
//        event.setIdOperatingStandard2(operatingStandardId2);
//        // save event.getIdRoom if user not chose (default == 1)
//        if (event.getIdRoom() == null) {
//            event.setIdRoom(roomRepository.findById(1).get());
//        }
//        event.setStatus("pending"); // Chờ duyệt
//        event.setIsDelete(1);
//        eventRepository.save(event);
//        if (!"null".equals(eventResult)) {
//            model.addAttribute("message", eventResult);
//            eventDetail(operatingStandardId2, model);
//            return "user/createEvent/createEvent";
//        }
//
//        // Phân loại xử lý theo loại sự kiện
//        switch (nameAllEventDto) {
//            case "conference": {
//                String confResult = conferenceService.saveE(allEventDto);
//                if (!"null".equals(confResult)) {
//                    model.addAttribute("message", confResult);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//
//                Conference conf = allEventDto.getConference();
//                if (minutesName != null)
//                    conf.setMinutesOfMeeting(minutesName);
//                if (presentationName != null)
//                    conf.setPresentationFiles(presentationName);
//                if (imageName != null)
//                    conf.setImage(imageName);
//                conf.setIdEvent(event.getId());
//                conferenceRepository.save(conf);
//                break;
//            }
//            case "activeInCouncil": {
//                String activeInCouncil = activeInCouncilService.saveE(allEventDto);
//                if (!"null".equals(activeInCouncil)) {
//                    model.addAttribute("message", activeInCouncil);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//
//                ActiveInCouncil conf = allEventDto.getActiveInCouncil();
//                if (minutesName != null)
//                    conf.setMinutesOfMeeting(minutesName);
//                if (presentationName != null)
//                    conf.setPresentationFile(presentationName);
//                if (imageName != null)
//                    conf.setImage(imageName);
//                conf.setIdEvent(event.getId());
//                activeInCouncilRepository.save(conf);
//                break;
//            }
//            case "approvedResearchTask": {
//                String artResult = approvedResearchTaskService.saveE(allEventDto);
//                ApprovedResearchTask approvedResearchTask = allEventDto.getApprovedResearchTask();
//                approvedResearchTask.setIdEvent(event.getId());
//                approvedResearchTaskRepository.save(approvedResearchTask);
//                if (!"null".equals(artResult)) {
//                    model.addAttribute("message", artResult);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "conferencePaper": {
//                String paperResult = conferencePaperService.saveE(allEventDto);
//                if (!"null".equals(paperResult)) {
//                    model.addAttribute("message", paperResult);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//
//                ConferencePaper paper = allEventDto.getConferencePaper();
//                paper.setIdEvent(event.getId());
//                if (presentationName != null)
//                    paper.setConferenceProceedingsFile(presentationName);
//                conferencePaperRepository.save(paper);
//                break;
//            }
//            case "expertPresentation": {
//                String epResult = expertPresentationService.saveE(allEventDto);
//                if (!"null".equals(epResult)) {
//                    model.addAttribute("message", epResult);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                ExpertPresentation ep = allEventDto.getExpertPresentation();
//                ep.setIdEvent(event.getId());
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
//                InternationalPaper ip = allEventDto.getInternationalPaper();
//                ip.setIdEvent(event.getId());
//                ip.setStatus(3);
//                internationalPaperRepository.save(ip);
//                if (!"null".equals(iPaper)) {
//                    model.addAttribute("message", iPaper);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "ministryTask": {
//                String ministry = ministryTaskService.saveE(allEventDto);
//                MinistryTask ministryTask = allEventDto.getMinistryTask();
//                ministryTask.setIdEvent(event.getId());
//                ministryTaskRepository.save(ministryTask);
//                if (!"null".equals(ministry)) {
//                    model.addAttribute("message", ministry);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "overviewPaper": {
//                String ovp = overviewPaperService.saveE(allEventDto);
//                OverviewPaper overviewPaper = allEventDto.getOverviewPaper();
//                overviewPaper.setIdEvent(event.getId());
//                overviewPaperRepository.save(overviewPaper);
//                if (!"null".equals(ovp)) {
//                    model.addAttribute("message", ovp);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "researchAdvisoryCouncil": {
//                String rsc = researchAdvisoryCouncilService.saveE(allEventDto);
//                ResearchAdvisoryCouncil researchAdvisoryCouncil = allEventDto.getResearchAdvisoryCouncil();
//                researchAdvisoryCouncil.setIdEvent(event.getId());
//                if (imageName != null)
//                    researchAdvisoryCouncil.setImage(imageName);
//                researchAdvisoryCouncilService.save(researchAdvisoryCouncil);
//                if (!"null".equals(rsc)) {
//                    model.addAttribute("message", rsc);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "researchProposal": {
//                String rp = researchProposalService.saveE(allEventDto);
//                ResearchProposal researchProposal = allEventDto.getResearchProposal();
//                researchProposal.setIdEvent(event.getId());
//                researchProposalService.save(researchProposal);
//                if (!"null".equals(rp)) {
//                    model.addAttribute("message", rp);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "seminar": {
//                String seminar = seminarService.saveE(allEventDto);
//                if (!"null".equals(seminar)) {
//                    model.addAttribute("message", seminar);
//                    return "user/createEvent/createEvent";
//                }
//                Seminar seminar1 = allEventDto.getSeminar();
//                if (presentationName != null)
//                    seminar1.setPresentationFile(presentationName);
//                if (minutesName != null)
//                    seminar1.setMinutesOfMeeting(minutesName);
//                if (imageName != null)
//                    seminar1.setSeminarPhoto(imageName);
//                seminar1.setIdEvent(allEventDto.getEvent().getId());
//                seminarRepository.save(seminar1);
//                break;
//            }
//            case "studentResearchGuidance": {
//                String vp = guidanceService.saveE(allEventDto);
//                StudentResearchGuidance guidance = allEventDto.getStudentResearchGuidance();
//                guidance.setIdEvent(event.getId());
//                guidanceRepository.save(guidance);
//                if (!"null".equals(vp)) {
//                    model.addAttribute("message", vp);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            case "vietnamesePaper": {
//                String vp = vietnamesePaperService.saveE(allEventDto);
//                VietnamesePaper vietnamesePaper = allEventDto.getVietnamesePaper();
//                vietnamesePaper.setIdEvent(event.getId());
//                vietnamesePaperRepository.save(vietnamesePaper);
//                if (!"null".equals(vp)) {
//                    model.addAttribute("message", vp);
//                    eventDetail(operatingStandardId2, model);
//                    return "user/createEvent/createEvent";
//                }
//                break;
//            }
//            default:
//                model.addAttribute("message", "Loại sự kiện không hợp lệ.");
//                return "user/createEvent/createEvent";
//        }
//        // Lưu khách mời và thành viên
//        eventDetailController.saveUsers(guestIdsRaw, event.getId(), true); // true cho guest
//        eventDetailController.saveUsers(memberIdsRaw, event.getId(), false); // false cho member
//        session.removeAttribute("operatingStandardId");
//
//        return "redirect:/event/showE/" + user.getId();
//    }
//}
