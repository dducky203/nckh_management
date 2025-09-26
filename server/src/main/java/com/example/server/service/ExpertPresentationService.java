package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.Conference;
import com.example.server.domain.ExpertPresentation;
import com.example.server.repository.ExpertPresentationRepository;
import org.apache.xmlbeans.impl.xb.xsdschema.Public;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class ExpertPresentationService {
    @Autowired
    private ExpertPresentationRepository expertPresentationRepository;

//    public String saveE(AllEventDto allEventDto){
//        ExpertPresentation expertPresentation =allEventDto.getExpertPresentation();
//        expertPresentationRepository.save(expertPresentation);
//        return "null";
//    }
    public String saveE(AllEventDto allEventDto) {
        ExpertPresentation ep = allEventDto.getExpertPresentation();
        Integer idEvent = ep.getIdEvent(); // hoặc id phù hợp

        ExpertPresentation currentData = expertPresentationRepository.findByIdEvent(idEvent);
        if (currentData == null) {
            // Nếu là tạo mới, thì lưu thẳng
            expertPresentationRepository.save(ep);
        } else {
            // Cập nhật từng field nếu có dữ liệu mới, giữ nguyên nếu không có
            if (ep.getPresentationFile() != null && !ep.getPresentationFile().isEmpty()) {
                currentData.setPresentationFile(ep.getPresentationFile());
            }

            if (ep.getMinutesOfMeeting() != null && !ep.getMinutesOfMeeting().isEmpty()) {
                currentData.setMinutesOfMeeting(ep.getMinutesOfMeeting());
            }

            if (ep.getSeminarPhoto() != null && !ep.getSeminarPhoto().isEmpty()) {
                currentData.setSeminarPhoto(ep.getSeminarPhoto());
            }

            expertPresentationRepository.save(currentData);
        }

        return "null";
    }


    public <S extends ExpertPresentation> Optional<S> findOne(Example<S> example) {
        return expertPresentationRepository.findOne(example);
    }

    public void deleteAllInBatch(Iterable<ExpertPresentation> entities) {
        expertPresentationRepository.deleteAllInBatch(entities);
    }

    public <S extends ExpertPresentation> S save(S entity) {
        return expertPresentationRepository.save(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        expertPresentationRepository.deleteAllById(integers);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        expertPresentationRepository.deleteAllByIdInBatch(integers);
    }

    public void delete(ExpertPresentation entity) {
        expertPresentationRepository.delete(entity);
    }

    public <S extends ExpertPresentation> List<S> saveAll(Iterable<S> entities) {
        return expertPresentationRepository.saveAll(entities);
    }

    public void deleteAll() {
        expertPresentationRepository.deleteAll();
    }

    public void deleteAllInBatch() {
        expertPresentationRepository.deleteAllInBatch();
    }

    public <S extends ExpertPresentation> boolean exists(Example<S> example) {
        return expertPresentationRepository.exists(example);
    }

    @Deprecated
    public ExpertPresentation getOne(Integer integer) {
        return expertPresentationRepository.getOne(integer);
    }

    public List<ExpertPresentation> findAll(Sort sort) {
        return expertPresentationRepository.findAll(sort);
    }

    public void deleteAll(Iterable<? extends ExpertPresentation> entities) {
        expertPresentationRepository.deleteAll(entities);
    }

    public <S extends ExpertPresentation, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return expertPresentationRepository.findBy(example, queryFunction);
    }

    @Deprecated
    public ExpertPresentation getById(Integer integer) {
        return expertPresentationRepository.getById(integer);
    }

    public Page<ExpertPresentation> findAll(Pageable pageable) {
        return expertPresentationRepository.findAll(pageable);
    }

    public <S extends ExpertPresentation> Page<S> findAll(Example<S> example, Pageable pageable) {
        return expertPresentationRepository.findAll(example, pageable);
    }

    public void flush() {
        expertPresentationRepository.flush();
    }

    public ExpertPresentation getReferenceById(Integer integer) {
        return expertPresentationRepository.getReferenceById(integer);
    }

    public Optional<ExpertPresentation> findById(Integer integer) {
        return expertPresentationRepository.findById(integer);
    }

    public <S extends ExpertPresentation> S saveAndFlush(S entity) {
        return expertPresentationRepository.saveAndFlush(entity);
    }

    public <S extends ExpertPresentation> long count(Example<S> example) {
        return expertPresentationRepository.count(example);
    }

    public boolean existsById(Integer integer) {
        return expertPresentationRepository.existsById(integer);
    }

    public List<ExpertPresentation> findAllById(Iterable<Integer> integers) {
        return expertPresentationRepository.findAllById(integers);
    }

    public <S extends ExpertPresentation> List<S> findAll(Example<S> example) {
        return expertPresentationRepository.findAll(example);
    }

    public long count() {
        return expertPresentationRepository.count();
    }

    public <S extends ExpertPresentation> List<S> saveAllAndFlush(Iterable<S> entities) {
        return expertPresentationRepository.saveAllAndFlush(entities);
    }

    public void deleteById(Integer integer) {
        expertPresentationRepository.deleteById(integer);
    }

    public List<ExpertPresentation> findAll() {
        return expertPresentationRepository.findAll();
    }

    public <S extends ExpertPresentation> List<S> findAll(Example<S> example, Sort sort) {
        return expertPresentationRepository.findAll(example, sort);
    }

    @Deprecated
    public void deleteInBatch(Iterable<ExpertPresentation> entities) {
        expertPresentationRepository.deleteInBatch(entities);
    }
}
