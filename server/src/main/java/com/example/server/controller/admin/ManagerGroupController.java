package com.example.server.controller.admin;

import com.example.server.DTO.MemberActivityRow;
import com.example.server.DTO.NcmDTO;
import com.example.server.DTO.NcmListWrapper;
import com.example.server.controller.user.CommonController;
import com.example.server.controller.user.NcmController;
import com.example.server.domain.*;
import com.example.server.repository.*;
import com.example.server.service.NcmService;
import com.example.server.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/ad/managerGroup")
public class ManagerGroupController {
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
    GroupRepository  groupRepository;
    @Autowired
    NcmController ncmController;
    @Autowired
    MinistryTaskRepository ministryTaskRepository;


    @GetMapping("/{idGroup}")
    public String managerGroup(@RequestParam(required = false,value = "year") Integer yearParam,
                               @PathVariable int idGroup, Model model) {
        int currentYear = LocalDate.now().getYear();
        int year = (yearParam != null) ? yearParam : currentYear;
        model.addAttribute("year", year);
        model.addAttribute("currentYear", currentYear);
        model.addAttribute("group", groupRepository.findById(idGroup));

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

        return "admin/group/managerGroup";
    }

    // remove user : status => 2
    @GetMapping("/remove/{idUser}/{year}")
    public String removeUser(@PathVariable int idUser,
                             Model model,
                             @PathVariable(value = "year",required = false)Integer yearParam) {
        int currentYear = LocalDate.now().getYear();
        int year = (yearParam != null) ? yearParam : currentYear;
        List<Ncm> ncms = ncmRepository.getDetailUserInNcms(idUser);
        for (Ncm ncm : ncms) {
            if (ncm.getYear() == year){
                ncm.setStatus(2);
                ncmRepository.save(ncm);
            }
        }
        return "redirect:/ad/managerGroup/"+idUser;
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

        return "redirect:/ad/managerGroup/" + idGroup;
    }

    //    repair user in ncm
    @GetMapping("/userInGroup/{idGroup}/{idUser}/{year}")
    public String detailUserInNcm(@PathVariable Integer idUser,
                                  Model model,
                                  @PathVariable Integer idGroup,
                                  @PathVariable(value = "year",required = false) Integer yearParam) {
        int currentYear = LocalDate.now().getYear();
        int year = (yearParam != null) ? yearParam : currentYear;
        ncmController.detailNcm(idUser,model,year);
        model.addAttribute("distintUserInNcm",ncmRepository.distintUserInNcm(idUser));
        return "admin/group/detailUserInNcm";
    }
    // save
    @PostMapping("/updateList/{idGroup}/{idUser}")
    public String updateNcmList(@PathVariable Integer idUser,
                                @ModelAttribute NcmListWrapper ncmListWrapper,
                                Model model, Principal principal,
                                @PathVariable Integer idGroup,
                                @RequestParam(value = "roleOfTeam")Integer roleOfTeam) {
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
            ncmController.detailNcm(idUser,model,LocalDate.now().getYear());
            return "admin/group/detailUserInNcm";
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
                    existing.setRoleOfTeam(roleOfTeam);
                    existing.setStatus(1);
                    existing.setIdGroup(groupRepository.findById(idGroup).get());
                    existing.setNorm(ncm.getNorm());
                    existing.setRoleOfActivity(ncm.getRoleOfActivity());
                    ncmRepository.save(existing);
                }
            } else {
                Ncm newNcm = new Ncm();
                newNcm.setIdUser(userRepository.findByIdUser(ncm.getIdUser()));
                OperatingStandards2 operatingStandards2 = operatingStandard2Repository.findOperatingStandards2ById(ncm.getIdOperatingStandard());
                newNcm.setIdOperatingStandard(operatingStandards2);
                newNcm.setNorm(ncm.getNorm());
                newNcm.setRoleOfTeam(roleOfTeam);
                newNcm.setRoleOfActivity(ncm.getRoleOfActivity());
                newNcm.setYear(LocalDate.now().getYear());
                newNcm.setIdGroup(groupRepository.findById(idGroup).get());
                newNcm.setStatus(1);
                ncmRepository.save(newNcm);
            }
        }

        return "redirect:/ad/managerGroup/"+idGroup;
    }

    // create group
    @GetMapping("/createGroup")
    public String createGroup(Model model) {
        return "admin/group/createGroup";
    }
    @PostMapping("/createGroup")
    public String createGroup(
            @RequestParam("groupName") String groupName,
            Model model
    ) {
        // Kiểm tra trùng tên nhóm
        if (groupRepository.existsByGroupName(groupName)) {
            model.addAttribute("message", "Tên nhóm đã tồn tại.");
            return "admin/group/createGroup";
        }
        // Tạo nhóm mới
        Group group = new Group();
        group.setGroupName(groupName);
//        group.setCreatedAt(LocalDate.now());
        group.setStatus(1);
        groupRepository.save(group);
        return "redirect:/ad/managerUser/manager";
    }

    //  group detail
    @GetMapping("/detail/{groupId}")
    public String detail(Model model, @PathVariable Integer groupId) {
        List<Ncm> ncmList = ncmRepository.findByIdGroupId(groupId);
        List<OperatingStandards2> allActivities = operatingStandard2Repository.findAll();

        List<MemberActivityRow> memberRows = ncmService.buildMemberActivityTable(ncmList,ncmService.getDistinctActivitiesByGroup(groupId));


        model.addAttribute("memberRows", memberRows);
        model.addAttribute("ncmEvents", ncmService.getDistinctActivitiesByGroup(groupId));
        return "admin/group/detail";
    }


    @GetMapping("/statistics/pie/{idGroup}")
    public String statistics(Model model, @PathVariable Integer idGroup,
                             @RequestParam(value = "year", required = false) Integer yearParam) {

        int currentYear = LocalDate.now().getYear();
        int year = (yearParam != null) ? yearParam : currentYear;

        model.addAttribute("year", year);
        model.addAttribute("idGroup", idGroup);
        model.addAttribute("group", groupRepository.findById(idGroup).get());

        List<Ncm> ncmList = ncmRepository.getAllUserInNcm(year,idGroup);

        int full = 0, partial = 0, low = 0;
        List<User> fullList = new ArrayList<>();
        List<User> partialList = new ArrayList<>();
        List<User> lowList = new ArrayList<>();

        // Chuẩn bị dữ liệu dùng chung
        Set<Integer> ncmEventIds = ncmService.getDistinctEventsByGroup(idGroup)
                .stream().map(Event::getId).collect(Collectors.toSet());
        List<Event> allEvents = eventRepository.findAllByYear(year); // cần có hàm này
        Set<Integer> allEventIds = allEvents.stream().map(Event::getId).collect(Collectors.toSet());

        Map<Integer, List<Member>> membersMap = memberRepository.findAllByEventIdIn(allEventIds)
                .stream().collect(Collectors.groupingBy(m -> m.getEvent().getId()));
        Map<Integer, MinistryTask> taskMap = ministryTaskRepository.findByIdEventIn(allEventIds)
                .stream().collect(Collectors.toMap(MinistryTask::getIdEvent, t -> t));

        List<OperatingStandards2> operatingStandards2s = operatingStandard2Repository.findAll();

        for (Ncm ncm : ncmList) {
            if (!ncm.getIdGroup().getId().equals(idGroup)) continue;

            Integer userId = ncm.getIdUser().getId();

            // Gọi detail để lấy totalNorm đã tính sẵn
            float totalNorm = ncmService.calculateTotalNormForUser(userId);

            if ( totalNorm == 0) {
                low++;
                continue;
            }

            // Tính actualNorm
            float ncmFactor = (ncm.getNorm() != null) ? ncm.getNorm() : 1;
            float actualNorm = 0;

            for (OperatingStandards2 os2 : operatingStandards2s) {
                float norm = ncmService.normStatistics(
                        os2.getId(), userId, year, ncmEventIds, membersMap, taskMap, ncmFactor
                );
                actualNorm += norm;
            }

            System.out.printf("👤 %s (ID: %d): %.2f / %.2f tiết%n", ncm.getIdUser().getName(), userId, actualNorm, totalNorm);
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) continue;
            if (actualNorm >= totalNorm) {
                full++;
                fullList.add(user);
            } else if (actualNorm >= 0.5 * totalNorm) {
                partial++;
                partialList.add(user);
            } else {
                low++;
                lowList.add(user);
            }
        }

        model.addAttribute("full", full);
        model.addAttribute("partial", partial);
        model.addAttribute("low", low);
        model.addAttribute("fullList", fullList);
        model.addAttribute("partialList", partialList);
        model.addAttribute("lowList", lowList);
        model.addAttribute("total", full + partial + low);

        return "admin/group/pieChartView";
    }


    // add member of last year
    @GetMapping("/addMemberLY/{idGroup}")
    public String addMemberLY(@PathVariable Integer idGroup, Model model) {
        int year = LocalDate.now().getYear();

        //Lấy danh sách NCM của nhóm trong năm trước và năm nay
        List<Ncm> ncmsLastYear = ncmRepository.getAllUserInNcm(year - 1, idGroup);
        List<Ncm> ncmsThisYear = ncmRepository.getAllUserInNcm(year, idGroup);

        // Lấy danh sách ID người dùng đã có trong năm nay
        Set<Integer> userIdsThisYear = ncmsThisYear.stream()
                .map(ncm -> ncm.getIdUser().getId())
                .collect(Collectors.toSet());

        // Lọc người năm trước chưa có trong năm nay
        List<Ncm> filteredNcm = new ArrayList<>();
        for (Ncm ncm : ncmsLastYear) {
            int userId = ncm.getIdUser().getId();
            if (!userIdsThisYear.contains(userId)) {
                filteredNcm.add(ncm);
            }
        }

        // Gửi dữ liệu ra giao diện
        Group group = groupRepository.findById(idGroup).orElse(null);
        if (group != null) {
            model.addAttribute("year", year);
            model.addAttribute("ncm", filteredNcm);
            model.addAttribute("group", group);
        } else {
            model.addAttribute("error", "Không tìm thấy nhóm!");
        }

        return "/admin/group/addMember";
    }


    @PostMapping("/saveAddMemberLY/{idGroup}")
    public String saveAddMemberLY(@PathVariable Integer idGroup,
                                  @RequestParam List<Integer> idUsers,
                                  Model model) {
        // Xác định năm hiện tại
        int year = LocalDate.now().getYear();

        // Lấy đối tượng nhóm
        Optional<Group> optionalGroup = groupRepository.findById(idGroup);
        Group group = optionalGroup.get();

        // Chuẩn bị dữ liệu để quay lại trang thêm
        model.addAttribute("year", year);
        model.addAttribute("group", group);
        model.addAttribute("ncm", ncmRepository.getAllUserInNcm(year - 1, idGroup));

        // Lặp qua danh sách người dùng để thêm vào nhóm
        for (Integer userId : idUsers) {
            // Kiểm tra nếu người dùng đã tồn tại trong nhóm thì bỏ qua
            boolean exists = ncmRepository.existsByIdUserAndIdGroupAndYear(
                    userRepository.findByIdUser(userId),
                    groupRepository.findById(idGroup).get(),
                    year);
            if (!exists) {
                List<Ncm> ncmList = ncmRepository.getDetailUserInNcms(userId);
                for (Ncm ncm : ncmList) {
                    Ncm ncm1 = new Ncm();
                    ncm1.setRoleOfTeam(ncm.getRoleOfTeam());
                    ncm1.setIdUser(userRepository.findById(userId).get());
                    ncm1.setIdGroup(groupRepository.findById(idGroup).get());
                    ncm1.setRoleOfActivity(ncm.getRoleOfActivity());
                    ncm1.setNorm(ncm.getNorm());
                    ncm1.setIdOperatingStandard(ncm.getIdOperatingStandard());
                    ncm1.setStatus(1);
                    ncm1.setYear(year);
                    ncmRepository.save(ncm1);
                }
            }
        }
        return "redirect:/ad/managerGroup/"+idGroup;
    }

}
