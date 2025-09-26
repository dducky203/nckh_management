package com.example.server.DTO;

import com.example.server.domain.Group;
import com.example.server.domain.OperatingStandard;
import com.example.server.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NcmDTO {
    private Integer id;
    private Integer idUser;
    private Integer roleOfTeam;
    private Integer idOperatingStandard;
    private Float norm;
    private Integer roleOfActivity;
    private Group idGroup;
    private String name;
    private String catalog;
    private Integer year;
    private Integer status;

public NcmDTO(Integer id, Integer idUser, Integer roleOfTeam, Float norm,
              Integer idOperatingStandard, Integer roleOfActivity,
              Group idGroup, String name, String catalog,Integer year,Integer status) {
    this.id = id;
    this.idUser = idUser;
    this.roleOfTeam = roleOfTeam;
    this.norm = norm;
    this.idOperatingStandard = idOperatingStandard;
    this.roleOfActivity = roleOfActivity;
    this.idGroup = idGroup;
    this.name = name;
    this.catalog = catalog == null ? null : catalog.trim();
    this.year = year;
    this.status = status;
}


    private Boolean deleted = false;

}
