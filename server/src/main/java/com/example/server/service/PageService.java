package com.example.server.service;

import com.example.server.domain.Conference;
import com.example.server.domain.Event;
import com.example.server.domain.News;
import com.example.server.domain.User;
import com.example.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PageService {
    @Autowired
    EventRepository eventRepository;
    @Autowired
    ConferenceRepository conferenceRepository;
    @Autowired
    ApprovedResearchTaskRepository approvedResearchTaskRepository;
    @Autowired
    ConferencePaperRepository conferencePaperRepository;
    @Autowired
    ExpertPresentationRepository expertPresentationRepository;
    @Autowired
    NcmService ncmService;
    @Autowired
    NewsRepository newsRepository;

    // getAll at admin
    public Page<Event> findAllPaginated(Pageable pageable) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.findAll().size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.findAll().size());
            list = eventRepository.findAll().subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.findAll().size());
        return coursePage;
    }

    // phan trang phia show ev by month/year
    public Page<Event> findPaginatedByMonth(Pageable pageable,int month,int year) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.findByMonth(month,year).size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.findByMonth(month,year).size());
            list = eventRepository.findByMonth(month,year).subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.findByMonth(month,year).size());
        return coursePage;
    }

    // phan trang phia user co power 1 2 5 khi qlyu ev
    public Page<Event> findPaginated(Pageable pageable) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.showALlEvent().size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.showALlEvent().size());
            list = eventRepository.showALlEvent().subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.showALlEvent().size());
        return coursePage;
    }
    // phan trang phia commonController
    public Page<Event> findPaginatedStatus2(Pageable pageable) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.showALlEventStatus2().size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.showALlEventStatus2().size());
            list = eventRepository.showALlEventStatus2().subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.showALlEventStatus2().size());
        return coursePage;
    }

    // tim kiem theo type od criteria (phan trang)
    public Page<Event> findPaginatedByCriteria(Pageable pageable,Integer idTypeOfCriteria) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.findByCriteria(idTypeOfCriteria).size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.findByCriteria(idTypeOfCriteria).size());
            list = eventRepository.findByCriteria(idTypeOfCriteria).subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.findByCriteria(idTypeOfCriteria).size());
        return coursePage;
    }

    // tim kiem theo ten su kien (phan trang)
    public Page<Event> findPaginatedByNameOp(Pageable pageable,Integer idOperatingStandard2) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.findByName(idOperatingStandard2).size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.findByName(idOperatingStandard2).size());
            list = eventRepository.findByName(idOperatingStandard2).subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.findByName(idOperatingStandard2).size());
        return coursePage;
    }

    // phan trang phia user(xem/tao ev)
    public Page<Event> findPaginatedEv(Pageable pageable,Integer idUser) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.findToIdUser(idUser).size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.findToIdUser(idUser).size());
            list = eventRepository.findToIdUser(idUser).subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.findToIdUser(idUser).size());
        return coursePage;
    }

    // phan trang phia user co power == 1||2||5(qly ev)
    public Page<Event> findPaginatedEvManagement(Pageable pageable) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (eventRepository.getEventsByStatus1().size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, eventRepository.getEventsByStatus1().size());
            list = eventRepository.getEventsByStatus1().subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                eventRepository.getEventsByStatus1().size());
        return coursePage;
    }

    // phan trang phia user(norm statistics)
    public Page<Event> findPaginatedEvOnNcmStatistics(Pageable pageable,Integer idUser,int year) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<Event> list = List.of();

        if (ncmService.getEventsParticipatedByUser(idUser,year).size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, ncmService.getEventsParticipatedByUser(idUser,year).size());
            list = ncmService.getEventsParticipatedByUser(idUser,year).subList(startItem, toIndex);
        }

        Page<Event> coursePage = new PageImpl<Event>(
                list,
                PageRequest.of(currentPage, pageSize),
                ncmService.getEventsParticipatedByUser(idUser,year).size());
        return coursePage;
    }

    // phan trang phia show news
    public Page<News> findPaginatedNews(Pageable pageable) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<News> list = List.of();

        if (newsRepository.findAll().size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, newsRepository.findAll().size());
            list = newsRepository.findAll().subList(startItem, toIndex);
        }

        Page<News> coursePage = new PageImpl<News>(
                list,
                PageRequest.of(currentPage, pageSize),
                newsRepository.findAll().size());
        return coursePage;
    }

    // phan trang phia your news
    public Page<News> findPaginatedYourNews(Pageable pageable, User user) {
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<News> list = List.of();

        if (newsRepository.findByUser(user).size() < startItem) {
            list = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, newsRepository.findByUser(user).size());
            list = newsRepository.findByUser(user).subList(startItem, toIndex);
        }

        Page<News> coursePage = new PageImpl<News>(
                list,
                PageRequest.of(currentPage, pageSize),
                newsRepository.findByUser(user).size());
        return coursePage;
    }
}
