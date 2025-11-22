package com.example.server.service;

import com.example.server.DTO.MemberActivityRow;
import com.example.server.DTO.NcmDTO;
import com.example.server.domain.*;
import com.example.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class NcmService {
    @Autowired
    NcmRepository ncmRepository;
    @Autowired
    OperatingStandard2Repository operatingStandard2Repository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    GuestRepository guestRepository;
    @Autowired
    RoleOfEventRepository roleOfEventRepository;
    @Autowired
    GroupRepository groupRepository;
    @Autowired
    MinistryTaskRepository ministryTaskRepository;

    public float calculateTotalNormForUser(Integer idUser) {
        List<NcmDTO> ncm = getNcmByUserId(idUser);
        float totalNorm = 0;
        for (NcmDTO ncmItem : ncm) {
            int setRoleOfEvent = 0;
            if (ncmItem.getRoleOfActivity() == null) {
                setRoleOfEvent = 4;
            }

            float norm = ncmItem.getNorm();
            for (OperatingStandards2 operatingStandards2 : operatingStandard2Repository.findAll()) {
                if (ncmItem.getIdOperatingStandard() == operatingStandards2.getId()) {
                    List<RoleOfEvent> roleOfEvents = roleOfEventRepository
                            .findByOperatingStandards2(operatingStandards2);
                    for (RoleOfEvent roleOfEvent : roleOfEvents) {
                        if (roleOfEvent.getRoleOfEvent() == ncmItem.getRoleOfActivity()) {
                            totalNorm += roleOfEvent.getNorm() * norm;
                            System.out.println(
                                    operatingStandards2.getName() + " : " + roleOfEvent.getNorm() + " * " + norm);
                        }
                        if (setRoleOfEvent == 4 && roleOfEvent.getRoleOfEvent() == 4) {
                            totalNorm += roleOfEvent.getNorm() * norm;
                            System.out.println(
                                    operatingStandards2.getName() + " : " + roleOfEvent.getNorm() + " * " + norm);

                        }
                    }

                }
            }
        }

        return totalNorm;
    }

    public List<String> getDistinctActivitiesByGroup(int groupId) {
        List<Ncm> ncmList = ncmRepository.findByIdGroup_Id(groupId);
        return ncmList.stream()
                .map(ncm -> {
                    OperatingStandards2 os = ncm.getIdOperatingStandard();
                    if (os == null)
                        return null;
                    String catalog = os.getCatalog() != null ? os.getCatalog().trim() : "";
                    String name = os.getName() != null ? os.getName().trim() : "";
                    return catalog + " - " + name;
                })
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<MemberActivityRow> buildMemberActivityTable(List<Ncm> ncmList, List<String> allActivities) {
        Map<User, List<Ncm>> grouped = ncmList.stream()
                .collect(Collectors.groupingBy(Ncm::getIdUser));

        List<MemberActivityRow> result = new ArrayList<>();

        for (Map.Entry<User, List<Ncm>> entry : grouped.entrySet()) {
            User user = entry.getKey();
            List<Ncm> userNcmList = entry.getValue();

            // Tạo map hoạt động mặc định là 0.0
            Map<String, Double> activityMap = new LinkedHashMap<>();
            for (String activityName : allActivities) {
                activityMap.put(activityName.trim(), 0.0);
            }

            for (Ncm ncm : userNcmList) {
                OperatingStandards2 os = ncm.getIdOperatingStandard();
                if (os == null)
                    continue;

                String catalog = os.getCatalog() != null ? os.getCatalog().trim() : "";
                String name = os.getName() != null ? os.getName().trim() : "";
                String actName = (catalog + " - " + name).trim();

                Float norm = ncm.getNorm();
                if (activityMap.containsKey(actName)) {
                    activityMap.put(actName, norm != null ? norm.doubleValue() : 0.0);
                }
            }

            String role = getRoleName(userNcmList.get(0).getRoleOfTeam());
            System.out.println("✅ User: " + user.getName() + " | Norms: " + activityMap);
            result.add(new MemberActivityRow(user.getName(), role, activityMap));
        }

        return result;
    }

    private Map<String, Double> initActivityMap(List<String> activityNames) {
        Map<String, Double> map = new LinkedHashMap<>();
        for (String name : activityNames) {
            map.put(name.trim(), 0.0); // default 0.0
        }
        return map;
    }

    private String getRoleName(Integer roleOfTeam) {
        if (roleOfTeam == null)
            return "";
        return switch (roleOfTeam) {
            case 1 -> "Trưởng nhóm";
            case 2 -> "Thư ký";
            case 3 -> "Thành viên";
            default -> "";
        };
    }

    public List<Event> getDistinctEventsByGroup(int groupId) {
        List<Ncm> ncmList = ncmRepository.findByIdGroup_Id(groupId);
        Set<Event> distinctEvents = new HashSet<>();

        for (Ncm ncm : ncmList) {
            if (ncm.getIdOperatingStandard() != null) {
                List<Event> events = eventRepository.findAll();
                for (Event event : events) {
                    if (event.getIdOperatingStandard2() == ncm.getIdOperatingStandard().getId()) {
                        distinctEvents.add(event);
                    }
                }

            }
        }

        return new ArrayList<>(distinctEvents);
    }

    // tác giả chính= (1/3+2/(3*n))* số tiết, n là số tác giả của sản phẩm
    public float normStatistics(Integer os2Id, Integer idUser, int year,
            Set<Integer> ncmEventIds,
            Map<Integer, List<Member>> membersMap,
            Map<Integer, MinistryTask> taskMap,
            float ncmFactor) {

        OperatingStandards2 os2 = operatingStandard2Repository.findById(os2Id).orElse(null);
        if (os2 == null)
            return 0;

        List<RoleOfEvent> roleEvents = roleOfEventRepository.findByOperatingStandards2(os2);
        if (roleEvents.isEmpty())
            return 0;

        RoleOfEvent roleOfEvent = roleEvents.get(0);
        float baseNorm = roleOfEvent.getNorm() != null ? roleOfEvent.getNorm() : 0;
        int roleCode = roleOfEvent.getRoleOfEvent();

        List<Event> events = eventRepository.getEvByOS2AndYear(os2Id, year);
        float totalNorm = 0;

        for (Event event : events) {
            int eventId = event.getId();
            // tính những ev có status "upcoming" hoặc "completed" && isDelete==1
            Event eventCheck = eventRepository.findByIdEvent(eventId);
            if (("upcoming".equals(eventCheck.getStatus()) || "completed".equals(eventCheck.getStatus())) &&
                    eventCheck.getIsDelete() == 1) {

                List<Member> members = membersMap.getOrDefault(eventId, new ArrayList<>());
                int numAuthors = members.size();
                boolean isMember = members.stream().anyMatch(m -> m.getUser().getId().equals(idUser));
                if (!isMember)
                    continue;

                float userNorm = 0;

                if (os2.getIdTypeOfCriteria().getId() == 10) {
                    MinistryTask task = taskMap.get(eventId);
                    if (task == null)
                        continue;

                    if (roleCode == 1 && task.getTaskLead() != null && task.getTaskLead().getId().equals(idUser)) {
                        userNorm = baseNorm;
                    } else if (roleCode == 2 && task.getSecretary() != null
                            && task.getSecretary().getId().equals(idUser)) {
                        userNorm = baseNorm;
                    } else if (roleCode == 3) {
                        userNorm = baseNorm;
                    } else {
                        continue;
                    }
                } else {
                    if (ncmEventIds.contains(eventId) && numAuthors > 0) {
                        userNorm = (1f / 3f + 2f / (3f * numAuthors)) * baseNorm * ncmFactor;
                    } else {
                        switch (roleCode) {
                            case 1:
                            case 2:
                            case 4:
                                userNorm = baseNorm;
                                break;
                            case 3:
                                userNorm = numAuthors > 0 ? baseNorm / numAuthors : 0;
                                break;
                            default:
                                userNorm = 0;
                        }
                    }
                }

                totalNorm += userNorm;
            }

        }

        return totalNorm;
    }

    // get all user atend event
    public List<Event> getEventsParticipatedByUser(Integer userId, int year) {
        List<Member> memberEntries = memberRepository.findByUserId(userId);
        List<Guest> guestEntries = guestRepository.findByUserId(userId);

        Set<Integer> eventIds = new HashSet<>();

        for (Member member : memberEntries) {
            eventIds.add(member.getEvent().getId());
        }

        for (Guest guest : guestEntries) {
            eventIds.add(guest.getEvent().getId());
        }

        if (eventIds.isEmpty()) {
            return Collections.emptyList();
        }

        // Lấy tất cả sự kiện người dùng tham gia
        List<Event> events = eventRepository.findAllById(eventIds);

        // Lọc theo năm của dateOfEvent, status "upcoming" hoặc "completed", isDelete==1
        return events.stream()
                .filter(
                        event -> event.getDateOfEvent() != null &&
                                event.getDateOfEvent().getYear() == year &&
                                event.getIsDelete() == 1 &&
                                ("upcoming".equals(event.getStatus()) || "completed".equals(event.getStatus())))
                .collect(Collectors.toList());
    }

    public List<NcmDTO> getNcmByUserId(Integer userId) {
        List<Object[]> rows = ncmRepository.getDetailUserInNcm(userId);

        return rows.stream()
                .map(r -> new NcmDTO(
                        r[0] == null ? null : ((Number) r[0]).intValue(), // id
                        r[1] == null ? null : ((Number) r[1]).intValue(), // idUser
                        r[2] == null ? null : ((Number) r[2]).intValue(), // roleOfTeam
                        r[3] == null ? null : ((Number) r[3]).floatValue(), // norm
                        r[4] == null ? null : ((Number) r[4]).intValue(), // idOperatingStandard
                        r[5] == null ? null : ((Number) r[5]).intValue(), // roleOfActivity đã fix null
                        r[6] == null ? null : new Group(((Number) r[6]).intValue()), // idGroup
                        (String) r[7], // name
                        r[8] == null ? null : ((String) r[8]).trim(), // catalog
                        r[9] == null ? null : ((Number) r[9]).intValue(), // year
                        r[10] == null ? null : ((Number) r[10]).intValue() // year

                ))
                .collect(Collectors.toList());
    }

    public void flush() {
        ncmRepository.flush();
    }

    public <S extends Ncm> S saveAndFlush(S entity) {
        return ncmRepository.saveAndFlush(entity);
    }

    public <S extends Ncm> List<S> saveAllAndFlush(Iterable<S> entities) {
        return ncmRepository.saveAllAndFlush(entities);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Ncm> entities) {
        ncmRepository.deleteInBatch(entities);
    }

    public void deleteAllInBatch(Iterable<Ncm> entities) {
        ncmRepository.deleteAllInBatch(entities);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        ncmRepository.deleteAllByIdInBatch(integers);
    }

    public void deleteAllInBatch() {
        ncmRepository.deleteAllInBatch();
    }

    @Deprecated
    public Ncm getOne(Integer integer) {
        return ncmRepository.getOne(integer);
    }

    @Deprecated
    public Ncm getById(Integer integer) {
        return ncmRepository.getById(integer);
    }

    public Ncm getReferenceById(Integer integer) {
        return ncmRepository.getReferenceById(integer);
    }

    public <S extends Ncm> List<S> findAll(Example<S> example) {
        return ncmRepository.findAll(example);
    }

    public <S extends Ncm> List<S> findAll(Example<S> example, Sort sort) {
        return ncmRepository.findAll(example, sort);
    }

    public <S extends Ncm> List<S> saveAll(Iterable<S> entities) {
        return ncmRepository.saveAll(entities);
    }

    public List<Ncm> findAll() {
        return ncmRepository.findAll();
    }

    public List<Ncm> findAllById(Iterable<Integer> integers) {
        return ncmRepository.findAllById(integers);
    }

    public <S extends Ncm> S save(S entity) {
        return ncmRepository.save(entity);
    }

    public Optional<Ncm> findById(Integer integer) {
        return ncmRepository.findById(integer);
    }

    public boolean existsById(Integer integer) {
        return ncmRepository.existsById(integer);
    }

    public long count() {
        return ncmRepository.count();
    }

    public void deleteById(Integer integer) {
        ncmRepository.deleteById(integer);
    }

    public void delete(Ncm entity) {
        ncmRepository.delete(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        ncmRepository.deleteAllById(integers);
    }

    public void deleteAll(Iterable<? extends Ncm> entities) {
        ncmRepository.deleteAll(entities);
    }

    public void deleteAll() {
        ncmRepository.deleteAll();
    }

    public List<Ncm> findAll(Sort sort) {
        return ncmRepository.findAll(sort);
    }

    public Page<Ncm> findAll(Pageable pageable) {
        return ncmRepository.findAll(pageable);
    }

    public <S extends Ncm> Optional<S> findOne(Example<S> example) {
        return ncmRepository.findOne(example);
    }

    public <S extends Ncm> Page<S> findAll(Example<S> example, Pageable pageable) {
        return ncmRepository.findAll(example, pageable);
    }

    public <S extends Ncm> long count(Example<S> example) {
        return ncmRepository.count(example);
    }

    public <S extends Ncm> boolean exists(Example<S> example) {
        return ncmRepository.exists(example);
    }

    public <S extends Ncm, R> R findBy(Example<S> example,
            Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return ncmRepository.findBy(example, queryFunction);
    }
}
