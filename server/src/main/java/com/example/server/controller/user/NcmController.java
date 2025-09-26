package com.example.server.controller.user;

import com.example.server.DTO.NcmDTO;
import com.example.server.DTO.NcmListWrapper;
import com.example.server.domain.*;
import com.example.server.repository.*;
import com.example.server.service.NcmService;
import com.example.server.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/ncm")
public class NcmController {
    @Autowired
    NcmRepository ncmRepository;
    @Autowired
    OperatingStandard2Repository operatingStandard2Repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    GuestRepository guestRepository;
    @Autowired
    NcmService ncmService;
    @Autowired
    PageService pageService;
    @Autowired
    RoleOfEventRepository roleOfEventRepository;
    @Autowired
    CommonController commonController;
    @Autowired
    GroupRepository groupRepository;
    @Autowired
    MinistryTaskRepository ministryTaskRepository;
    //
    @GetMapping("/showNcmNotUser/{groupId}")
    public String showNcmNotUser(Model model, @PathVariable Integer groupId) {
        int year = LocalDate.now().getYear();
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);

        if (!model.containsAttribute("ncmListWrapper")) {
            model.addAttribute("ncmListWrapper", new NcmListWrapper());
        }
        model.addAttribute("operatingStandard",operatingStandard2Repository.findAll());
        model.addAttribute("ncm",ncmRepository.getAllUserInNcm(year,groupId));
        List<Integer> existingUserIds = ncmRepository.getAllUserInNcm(year,groupId).stream()
                .map(ncmItem -> ncmItem.getIdUser().getId())
                .collect(Collectors.toList());
        model.addAttribute("existingUserIds", existingUserIds);
        model.addAttribute("allUsers",userRepository.findAll());
        return "user/ncm/showNcmNotUser";
    }


    // get all user in ncm
    @GetMapping("/group/{idGroup}")
    public String ncm(@RequestParam(required = false,value = "year") Integer yearParam,Model model, @PathVariable Integer idGroup) {
        int currentYear = LocalDate.now().getYear();
        int year = (yearParam != null) ? yearParam : currentYear;
        model.addAttribute("year",year);
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);

        if (!model.containsAttribute("ncmListWrapper")) {
            model.addAttribute("ncmListWrapper", new NcmListWrapper());
        }
        model.addAttribute("operatingStandard",operatingStandard2Repository.findAll());
        model.addAttribute("ncm",ncmRepository.getAllUserInNcm(year,idGroup));
        List<Integer> existingUserIds = ncmRepository.getAllUserInNcm(year,idGroup).stream()
                .map(ncmItem -> ncmItem.getIdUser().getId())
                .collect(Collectors.toList());
        model.addAttribute("existingUserIds", existingUserIds);
        model.addAttribute("allUsers",userRepository.findAll());

        model.addAttribute("group", groupRepository.findById(idGroup));
        return "user/ncm/showNcm";
    }

    public void detailNcm(@PathVariable Integer idUser, Model model,Integer yearParam){
        List<NcmDTO> ncm =  ncmService.getNcmByUserId(idUser);

        int year = (yearParam !=null) ? yearParam : LocalDate.now().getYear();

        model.addAttribute("operatingStandard",operatingStandard2Repository.findAll());

        NcmListWrapper wrapper = new NcmListWrapper();
        wrapper.setNcmList(ncm);
        model.addAttribute("ncmListWrapper", wrapper);
        model.addAttribute("ncm",ncm);
        model.addAttribute("userNcm",ncmRepository.distintUserInNcm(idUser));
        model.addAttribute("user",userRepository.findByIdUser(idUser));
        float totalNorm = 0;
        for (NcmDTO ncmItem : ncm) {
            int setRoleOfEvent = 0;
            if (ncmItem.getYear() == year && ncmItem.getStatus()==1){
                if (ncmItem.getRoleOfActivity() == null) { setRoleOfEvent= 4;}

                float norm = ncmItem.getNorm();
                for (OperatingStandards2 operatingStandards2 : operatingStandard2Repository.findAll()) {
                    if (ncmItem.getIdOperatingStandard()== operatingStandards2.getId()){
                        List<RoleOfEvent> roleOfEvents = roleOfEventRepository.findByOperatingStandards2(operatingStandards2);
                        for (RoleOfEvent roleOfEvent : roleOfEvents) {
                            if (roleOfEvent.getRoleOfEvent() == ncmItem.getRoleOfActivity()){
                                totalNorm += roleOfEvent.getNorm()*norm;
                                System.out.println(operatingStandards2.getName()+" : "+roleOfEvent.getNorm() + " * " + norm );
                            }
                            if (setRoleOfEvent==4 && roleOfEvent.getRoleOfEvent() == 4){
                                totalNorm += roleOfEvent.getNorm()*norm;
                                System.out.println(operatingStandards2.getName()+" : "+roleOfEvent.getNorm() + " * " + norm );

                            }
                        }

                    }
                }
            }

        }
        model.addAttribute("totalNorm", totalNorm);
    }

//    repair user in ncm
    @GetMapping("/{idGroup}/{idUser}")
    public String detailUserInNcm(@PathVariable Integer idUser, Model model,
                                  @PathVariable Integer idGroup,
                                  @RequestParam(value = "year",required = false)Integer yearParam) {
        Integer year = (yearParam != null) ? yearParam : LocalDate.now().getYear();
        model.addAttribute("year",year);
        detailNcm(idUser,model,year);
        return "user/ncm/detailUserInNcm";
    }
    // save
    @PostMapping("/updateList/{idGroup}/{idUser}")
    public String updateNcmList(@PathVariable Integer idUser,
                                @ModelAttribute NcmListWrapper ncmListWrapper,
                                Model model, Principal principal, @PathVariable Integer idGroup) {
        Set<String> duplicateCheck = new HashSet<>();
        List<String> errorMessages = new ArrayList<>();

        for (NcmDTO ncm : ncmListWrapper.getNcmList()) {
            if (Boolean.TRUE.equals(ncm.getDeleted())) continue;
            String role = (ncm.getRoleOfActivity() == null ||ncm.getRoleOfActivity().toString().isBlank()) ? "NONE" : ncm.getRoleOfActivity().toString().trim();
            String key = ncm.getIdOperatingStandard() + "-" + role;
            System.out.println("keyyyyyyyyyyyyyyyyyyyyyyyyyyy "+key);
            if (!duplicateCheck.add(key)) {
                errorMessages.add("Trùng vai trò cho cùng một tiêu chuẩn hoạt động ( "+ncm.getCatalog()+" - " + ncm.getName() + ")");
            }
        }

        if (!errorMessages.isEmpty()) {
            model.addAttribute("errors", errorMessages);
            detailNcm(idUser,model,LocalDate.now().getYear());
            return "user/ncm/detailUserInNcm";
        }

        for (NcmDTO ncm : ncmListWrapper.getNcmList()) {
            if (Boolean.TRUE.equals(ncm.getDeleted())) {
                if (ncm.getId() != null) {
                    ncmRepository.deleteById(ncm.getId());
                }
                continue;
            }

            if (ncm.getId() != null) {
                Optional<Ncm> optional = ncmRepository.findById(ncm.getId());
                if (optional.isPresent()) {
                    Ncm existing = optional.get();
                    existing.setYear(LocalDate.now().getYear());
                    existing.setStatus(1);
                    existing.setIdGroup(groupRepository.findById(idGroup).get());
                    existing.setNorm(ncm.getNorm());
                    existing.setRoleOfActivity(ncm.getRoleOfActivity());
                    ncmRepository.save(existing);
                }
            } else {
                Ncm newNcm = new Ncm();
                newNcm.setIdUser(userRepository.findByIdUser(ncm.getIdUser()));
                newNcm.setRoleOfTeam(ncm.getRoleOfTeam());
                OperatingStandards2 operatingStandards2 = operatingStandard2Repository.findOperatingStandards2ById(ncm.getIdOperatingStandard());
                newNcm.setIdOperatingStandard(operatingStandards2);
                newNcm.setNorm(ncm.getNorm());
                newNcm.setRoleOfActivity(ncm.getRoleOfActivity());
                newNcm.setYear(LocalDate.now().getYear());
                newNcm.setIdGroup(groupRepository.findById(idGroup).get());
                newNcm.setStatus(1);
                ncmRepository.save(newNcm);
            }
        }

        return "redirect:/user/manager";
    }

    @PostMapping("/saveCreateUser/{idGroup}")
    public String saveCreateUser(
            @RequestParam("userId") Integer userId,
            @RequestParam("role") Integer role,
            @RequestParam("idOperatingStandards") List<Integer> idOperatingStandards,
            @RequestParam("norms") List<Float> norms,
            @RequestParam("roleOfActivities") List<String> roleOfActivitiesRaw,
            @PathVariable Integer idGroup) {
        System.out.println("idOperatingStandards = " + idOperatingStandards);
        System.out.println("norms = " + norms);
        System.out.println("roleOfActivitiesRaw = " + roleOfActivitiesRaw);

        int size = idOperatingStandards.size();

        for (int i = 0; i < size; i++) {
            Integer standardId = idOperatingStandards.get(i);
            Float norm = norms.get(i);

            // Xử lý roleOfActivity có thể null
            String rawRole = (roleOfActivitiesRaw.size() > i) ? roleOfActivitiesRaw.get(i) : null;
            Integer roleOfActivity = null;
            if (rawRole != null && !rawRole.isBlank()) {
                try {
                    roleOfActivity = Integer.parseInt(rawRole);
                } catch (NumberFormatException e) {
                    System.out.println("Không thể parse roleOfActivity tại index " + i + ": " + rawRole);
                    roleOfActivity = null;
                }
            }

            Ncm ncm = new Ncm();
            ncm.setIdUser(userRepository.findByIdUser(userId));
            ncm.setRoleOfActivity(roleOfActivity); // Cho phép null
            ncm.setNorm(norm);
            ncm.setRoleOfTeam(role);
            ncm.setIdOperatingStandard(operatingStandard2Repository.findOperatingStandards2ById(standardId));
            ncm.setIdGroup(groupRepository.findById(idGroup).orElseThrow(() -> new RuntimeException("Group không tồn tại")));
            ncm.setStatus(1);
            ncm.setYear(LocalDate.now().getYear());

            ncmRepository.save(ncm);
        }

        return "redirect:/ncm/group/"+idGroup;
    }
    // norm statistics in NCM user
    @GetMapping("/normStatistics/{idUser}/{year}")
    public String normStatistics(@PathVariable Integer idUser,
                                 Model model,
                                 @PathVariable int year,
                                 @RequestParam("page") Optional<Integer> page,
                                 @RequestParam("size") Optional<Integer> size) {
        // detail ncm : call total norm
        detailNcm(idUser,model,year);
        //
        List<OperatingStandards2> operatingStandards2s = operatingStandard2Repository.findAll();
        List<Double> norms = new ArrayList<>();
        double totalNorm = 0;
        int idGroup = 1; // Hoặc nhận từ request

// 1. Chuẩn bị dữ liệu dùng chung
        Set<Integer> ncmEventIds = ncmService.getDistinctEventsByGroup(idGroup)
                .stream().map(Event::getId).collect(Collectors.toSet());

        List<Event> allEvents = eventRepository.findAllByYear(year);
        Set<Integer> allEventIds = allEvents.stream().map(Event::getId).collect(Collectors.toSet());

// 2. Load tất cả members theo event
        Map<Integer, List<Member>> membersMap = memberRepository.findAllByEventIdIn(allEventIds)
                .stream().collect(Collectors.groupingBy(m -> m.getEvent().getId()));

// 3. Load tất cả MinistryTasks theo event
        Map<Integer, MinistryTask> taskMap = ministryTaskRepository.findByIdEventIn(allEventIds)
                .stream().collect(Collectors.toMap(MinistryTask::getIdEvent, t -> t));

// 4. Hệ số chuẩn NCM của user
        Ncm ncm = ncmRepository.distintUserInNcm(idUser);
        float ncmFactor = (ncm != null && ncm.getNorm() != null) ? ncm.getNorm() : 1;

// 5. Bắt đầu thống kê
        StringBuilder debugLog = new StringBuilder("--------- Thống kê số tiết:\n");

        for (OperatingStandards2 os2 : operatingStandards2s) {
            float norm = ncmService.normStatistics(os2.getId(), idUser, year, ncmEventIds, membersMap, taskMap, ncmFactor);
            norms.add((double) norm);
            totalNorm += norm;

            String catalog = os2.getCatalog() != null ? os2.getCatalog().trim() : "";
            String name = os2.getName() != null ? os2.getName().trim() : "";
            String label = catalog + " - " + name;

            debugLog.append("++ ").append(label)
                    .append(" : số tiết tính được: ").append(norm)
                    .append("\n");
        }

        debugLog.append("=> Tổng số tiết: ").append(totalNorm);
        System.out.println(debugLog);

        model.addAttribute("norms", norms);
        model.addAttribute("totalNorm_", totalNorm);


        // events that user attend
        // Phân trang xem/tao event
        int currentPage = page.orElse(1); // curren page
        int pageSize = size.orElse(10); // number event in page
        User user = userRepository.findByIdUser(idUser);
        // count all page
        Page<Event> eventPage = null;
        model.addAttribute("pageSize", pageSize);
        eventPage = pageService.findPaginatedEvOnNcmStatistics(PageRequest.of(currentPage - 1, pageSize), idUser,year);
        model.addAttribute("events", eventPage);

        int totalPages = eventPage.getTotalPages();
        if (totalPages > 0) {
            List<Integer> pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
            model.addAttribute("pageNumbers", pageNumbers);
            model.addAttribute("maxPageNumber", totalPages);
        }
        model.addAttribute("year", year);
        return "/user/ncm/ncmStatistics";
    }
    @GetMapping("/normStatistics/{idUser}")
    public String redirectToYearPage(@PathVariable Integer idUser, @RequestParam int year) {
        return "redirect:/ncm/normStatistics/" + idUser + "/" + year;
    }




//    remove user in ncm

}
