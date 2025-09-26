package com.example.server.DTO;

import com.example.server.domain.Ncm;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
@Setter
@Getter
public class NcmListWrapper {
    private List<NcmDTO> ncmList = new ArrayList<>();
}
