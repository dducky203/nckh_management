package com.example.server.service;

import com.example.server.DTO.AllEventDto;
import com.example.server.domain.ResearchProposal;
import com.example.server.repository.ResearchProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class ResearchProposalService {
    @Autowired
    private ResearchProposalRepository researchProposalRepository;

    public String saveE(AllEventDto allEventDto){
        ResearchProposal researchProposal = allEventDto.getResearchProposal();
        researchProposalRepository.save(researchProposal);
        return "null";
    }

    public Optional<ResearchProposal> findById(Integer integer) {
        return researchProposalRepository.findById(integer);
    }

    @Deprecated
    public ResearchProposal getOne(Integer integer) {
        return researchProposalRepository.getOne(integer);
    }

    public boolean existsById(Integer integer) {
        return researchProposalRepository.existsById(integer);
    }

    public void deleteAllByIdInBatch(Iterable<Integer> integers) {
        researchProposalRepository.deleteAllByIdInBatch(integers);
    }

    public void deleteAllInBatch() {
        researchProposalRepository.deleteAllInBatch();
    }

    public ResearchProposal getReferenceById(Integer integer) {
        return researchProposalRepository.getReferenceById(integer);
    }

    public void flush() {
        researchProposalRepository.flush();
    }

    public <S extends ResearchProposal> S save(S entity) {
        return researchProposalRepository.save(entity);
    }

    public List<ResearchProposal> findAll(Sort sort) {
        return researchProposalRepository.findAll(sort);
    }

    public <S extends ResearchProposal> Optional<S> findOne(Example<S> example) {
        return researchProposalRepository.findOne(example);
    }

    public void deleteAll(Iterable<? extends ResearchProposal> entities) {
        researchProposalRepository.deleteAll(entities);
    }

    public <S extends ResearchProposal> S saveAndFlush(S entity) {
        return researchProposalRepository.saveAndFlush(entity);
    }

    public void deleteAllById(Iterable<? extends Integer> integers) {
        researchProposalRepository.deleteAllById(integers);
    }

    public <S extends ResearchProposal, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return researchProposalRepository.findBy(example, queryFunction);
    }

    public void deleteAll() {
        researchProposalRepository.deleteAll();
    }

    public Page<ResearchProposal> findAll(Pageable pageable) {
        return researchProposalRepository.findAll(pageable);
    }

    @Deprecated
    public ResearchProposal getById(Integer integer) {
        return researchProposalRepository.getById(integer);
    }

    public <S extends ResearchProposal> List<S> findAll(Example<S> example, Sort sort) {
        return researchProposalRepository.findAll(example, sort);
    }

    public <S extends ResearchProposal> boolean exists(Example<S> example) {
        return researchProposalRepository.exists(example);
    }

    public <S extends ResearchProposal> List<S> saveAllAndFlush(Iterable<S> entities) {
        return researchProposalRepository.saveAllAndFlush(entities);
    }

    public void deleteById(Integer integer) {
        researchProposalRepository.deleteById(integer);
    }

    public <S extends ResearchProposal> List<S> saveAll(Iterable<S> entities) {
        return researchProposalRepository.saveAll(entities);
    }

    public <S extends ResearchProposal> long count(Example<S> example) {
        return researchProposalRepository.count(example);
    }

    public void delete(ResearchProposal entity) {
        researchProposalRepository.delete(entity);
    }

    public <S extends ResearchProposal> List<S> findAll(Example<S> example) {
        return researchProposalRepository.findAll(example);
    }

    public void deleteAllInBatch(Iterable<ResearchProposal> entities) {
        researchProposalRepository.deleteAllInBatch(entities);
    }

    public List<ResearchProposal> findAll() {
        return researchProposalRepository.findAll();
    }

    public List<ResearchProposal> findAllById(Iterable<Integer> integers) {
        return researchProposalRepository.findAllById(integers);
    }

    public long count() {
        return researchProposalRepository.count();
    }

    @Deprecated
    public void deleteInBatch(Iterable<ResearchProposal> entities) {
        researchProposalRepository.deleteInBatch(entities);
    }

    public <S extends ResearchProposal> Page<S> findAll(Example<S> example, Pageable pageable) {
        return researchProposalRepository.findAll(example, pageable);
    }
}
