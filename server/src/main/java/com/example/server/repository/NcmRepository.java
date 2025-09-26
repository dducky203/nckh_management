package com.example.server.repository;

import com.example.server.DTO.NcmDTO;
import com.example.server.domain.Group;
import com.example.server.domain.Ncm;
import com.example.server.domain.User;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.xml.validation.Validator;
import java.util.List;

public interface NcmRepository extends JpaRepository<Ncm, Integer> {

    // get all
    @Query (value = SQL.GET_ALL_USER_IN_NCM,nativeQuery = true)
    List<Ncm> getAllUserInNcm(int year,Integer groupId);
    // detail user in ncm
    @Query(value = SQL.DETAIL_USER_IN_NCM,nativeQuery = true)
    List<Object[]> getDetailUserInNcm(Integer idUser);

    @Query(value = SQL.DETAIL_USER_IN_NCM,nativeQuery = true)
    List<Ncm> getDetailUserInNcms(Integer idUser);

    // distint user in ncm by idUser
    @Query(value = SQL.DISTINT_USER_IN_NCM_BY_ID_USER,nativeQuery = true)
    Ncm distintUserInNcm(Integer idUser);

    @Query(value = SQL.GET_ALL_EVENT_IN_NCM,nativeQuery = true)
    List<String> findDistinctActivityNamesByGroup(Integer groupId);


    List<Ncm> findByIdGroup_Id(int groupId);

    List<Ncm> findByIdGroupId(Integer groupId);


    boolean existsByIdUserAndIdGroupAndYear(User idUser, Group idGroup,Integer year);
}
