package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.DTO.RemainingEventDTO;
import com.example.server.domain.Event;
import com.example.server.domain.Time;
import com.example.server.projection.IEvent;
import com.example.server.repository.EventRepository;
import com.example.server.repository.TImeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    TImeRepository timeRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // count tgian sap dien ra su kien
    public List<RemainingEventDTO> getRemainingEvents() {
        List<IEvent> events = eventRepository.getUpcomingEvents();
        List<Integer> timeIds = events.stream()
                .map(IEvent::getStartTime)
                .collect(Collectors.toList());

        Map<Integer, LocalTime> timeMap = timeRepository.findAllById(timeIds)
                .stream()
                .collect(Collectors.toMap(Time::getId, Time::getTime));

        List<RemainingEventDTO> dtos = new ArrayList<>();
        for (IEvent e : events) {
            LocalTime time = timeMap.get(e.getStartTime());
            if (time != null) {
                RemainingEventDTO dto = new RemainingEventDTO();
                dto.setId(e.getId());
                dto.setName(e.getEventName());
                dto.setDate(e.getDateOfEvent());
                dto.setTime(time);
                dtos.add(dto);
            }
        }
        return dtos;
    }


    public Map<Integer, Long> getMonthlyStats(int year) {
        List<Object[]> rawStats = eventRepository.countEventsPerMonth(year);

        Map<Integer, Long> result = new LinkedHashMap<>();

        // Khởi tạo từ tháng 1 → 12, mặc định 0
        for (int i = 1; i <= 12; i++) {
            result.put(i, 0L);
        }

        for (Object[] row : rawStats) {
            Integer month = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            result.put(month, count);
        }
        return result;
    }
    public String saveE(AllEventDto allEventDto) {
        Event event = allEventDto.getEvent();
        // ktra trung lap room
        List<Event> events = eventRepository.findAll();
        for (Event e : events) {
            if (e.getId() != event.getId()) {
                if (Objects.equals(String.valueOf(e.getDateOfEvent()), String.valueOf(event.getDateOfEvent()))) { // ss date of event
                    if (Objects.equals(e.getIdRoom(), event.getIdRoom())){ // ss event room
                        // so sánh tiết cùng 1 phòng để không trùng lặp
                        if ((event.getStartTime() < e.getStartTime() && event.getEndTime() > e.getStartTime()) ||  // Event mới bắt đầu trước và kết thúc sau sự kiện cũ bắt đầu
                                (event.getStartTime() < e.getEndTime() && event.getEndTime() > e.getEndTime()) ||    // Event mới bắt đầu trước và kết thúc sau sự kiện cũ kết thúc
                                (event.getStartTime() == e.getStartTime() || event.getEndTime() == e.getEndTime())) { // Event mới có thời gian bắt đầu hoặc kết thúc giống sự kiện cũ
                            return "Sự kiện trùng thời gian với sự kiện khác trong cùng phòng vào cùng ngày." +
                                    "Hãy đổi phòng tổ chức sự kiện khác hoặc thay đổi lại tiết bắt đầu và tiết kết thúc";
                        }
                    }

                }
            }
        }
        if (event.getStartTime() != null && event.getEndTime() != null) {
            if (event.getStartTime() > event.getEndTime() || event.getStartTime() == event.getEndTime()){
                return "Tiết bắt đầu phải nhỏ hơn tiết kết thúc.";
            }
            if (event.getStartTime() < 0){
                return "Bạn đang để tiết bắt đầu là số âm.";
            }
        }
        // Kiểm tra xem đối tượng Event có ID không (đã tồn tại trong CSDL chưa)
        if (event.getId() != null) {
            // Nếu có ID, nghĩa là đây là cập nhật, không phải tạo mới
            eventRepository.save(event);
            return "null";
        } else {
            return "Lỗi khi lưu.";
        }
    }
    public String createE(AllEventDto allEventDto) {
        Event event = allEventDto.getEvent();

        // Kiểm tra ID: nếu đã có ID thì không tạo mới
//        if (event.getId() != null) {
//            return "Không thể tạo sự kiện mới với ID đã tồn tại.";
//        }
//        event.setCreateDate(LocalDate.now());
        // Kiểm tra tiết bắt đầu và kết thúc
        if (event.getStartTime()!= null && event.getEndTime()!= null){
            if (event.getStartTime() >= event.getEndTime()) {
                return "Tiết bắt đầu phải nhỏ hơn tiết kết thúc.";
            }
            if (event.getStartTime() < 0) {
                return "Bạn đang để tiết bắt đầu là số âm.";
            }

            // Kiểm tra trùng lịch trong cùng phòng và cùng ngày
            List<Event> events = eventRepository.findAll();
            for (Event e : events) {
                if (Objects.equals(String.valueOf(e.getDateOfEvent()), String.valueOf(event.getDateOfEvent()))) {
                    if (Objects.equals(e.getIdRoom(), event.getIdRoom())) {
                        if ((event.getStartTime() < e.getStartTime() && event.getEndTime() > e.getStartTime()) ||
                                (event.getStartTime() < e.getEndTime() && event.getEndTime() > e.getEndTime()) ||
                                (event.getStartTime() == e.getStartTime() || event.getEndTime() == e.getEndTime())) {
                            return "Sự kiện trùng thời gian với sự kiện khác trong cùng phòng vào cùng ngày. " +
                                    "Hãy đổi phòng tổ chức sự kiện khác hoặc thay đổi lại tiết bắt đầu và tiết kết thúc.";
                        }
                    }
                }
            }
        }

        // Tạo mới sự kiện
        eventRepository.save(event);
        return "null";
    }
    public Event getReferenceById(Integer integer) {
        return eventRepository.getReferenceById(integer);
    }

    public void flush() {
        eventRepository.flush();
    }

    public long count() {
        return eventRepository.count();
    }

    @Deprecated
    public Event getById(Integer integer) {
        return eventRepository.getById(integer);
    }

    public <S extends Event> Page<S> findAll(Example<S> example, Pageable pageable) {
        return eventRepository.findAll(example, pageable);
    }

    public <S extends Event> List<S> findAll(Example<S> example, Sort sort) {
        return eventRepository.findAll(example, sort);
    }

    @Deprecated
    public Event getOne(Integer integer) {
        return eventRepository.getOne(integer);
    }

    public void deleteById(Integer integer) {
        eventRepository.deleteById(integer);
    }

    public void delete(Event entity) {
        eventRepository.delete(entity);
    }

    public <S extends Event> boolean exists(Example<S> example) {
        return eventRepository.exists(example);
    }

    public void deleteAllInBatch() {
        eventRepository.deleteAllInBatch();
    }

    public <S extends Event> long count(Example<S> example) {
        return eventRepository.count(example);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        eventRepository.deleteAllByIdInBatch(integers);
    }

    public void deleteAll(Iterable<? extends Event> entities) {
        eventRepository.deleteAll(entities);
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public void deleteAllInBatch(Iterable<Event> entities) {
        eventRepository.deleteAllInBatch(entities);
    }

    public Event  save(Event event) {
        return eventRepository.save(event);
    }



    public <S extends Event> Optional<S> findOne(Example<S> example) {
        return eventRepository.findOne(example);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        eventRepository.deleteAllById(integers);
    }

    public <S extends Event, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return eventRepository.findBy(example, queryFunction);
    }

    @Deprecated
    public void deleteInBatch(Iterable<Event> entities) {
        eventRepository.deleteInBatch(entities);
    }

    public List<Event> findAllById(Iterable<Integer> integers) {
        return eventRepository.findAllById(integers);
    }

    public List<Event> findAll(Sort sort) {
        return eventRepository.findAll(sort);
    }

    public Optional<Event> findById(Integer integer) {
        return eventRepository.findById(integer);
    }

    public <S extends Event> List<S> saveAllAndFlush(Iterable<S> entities) {
        return eventRepository.saveAllAndFlush(entities);
    }

    public Page<Event> findAll(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    public void deleteAll() {
        eventRepository.deleteAll();
    }

    public <S extends Event> List<S> saveAll(Iterable<S> entities) {
        return eventRepository.saveAll(entities);
    }

    public <S extends Event> List<S> findAll(Example<S> example) {
        return eventRepository.findAll(example);
    }

    public boolean existsById(Integer integer) {
        return eventRepository.existsById(integer);
    }

    public <S extends Event> S saveAndFlush(S entity) {
        return eventRepository.saveAndFlush(entity);
    }
}
