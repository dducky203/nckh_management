package com.example.server.service;

import com.example.server.DTO.address.ProvinceDTO;
import com.example.server.DTO.address.WardDTO;
import com.example.server.domain.Province;
import com.example.server.domain.Resume;
import com.example.server.domain.Ward;
import com.example.server.repository.ProvinceRepository;
import com.example.server.repository.WardRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;

    public AddressService(ProvinceRepository provinceRepository, WardRepository wardRepository) {
        this.provinceRepository = provinceRepository;
        this.wardRepository = wardRepository;
    }

    public List<ProvinceDTO> getAllProvinces() {
        return provinceRepository.findAllByOrderByNameAsc().stream()
                .map(this::toProvinceDTO)
                .toList();
    }

    public List<WardDTO> getWardsByProvinceCode(String provinceCode) {
        if (provinceCode == null || provinceCode.isBlank()) {
            return List.of();
        }

        String normalizedCode = provinceCode.trim();
        List<Ward> wards = wardRepository.findByProvinceCodeOrderByNameAsc(normalizedCode);

        if (wards.isEmpty() && normalizedCode.matches("\\d+")) {
            String padded = String.format("%02d", Integer.parseInt(normalizedCode));
            if (!padded.equals(normalizedCode)) {
                wards = wardRepository.findByProvinceCodeOrderByNameAsc(padded);
            }
        }

        return wards.stream()
                .map(this::toWardDTO)
                .toList();
    }

    public void applyAddressToResume(Resume resume, String provinceCode, String wardCode,
                                     String addressDetail, String legacyAddress) {
        resume.setProvinceCode(blankToNull(provinceCode));
        resume.setWardCode(blankToNull(wardCode));
        resume.setAddressDetail(blankToNull(addressDetail));

        if (hasStructuredAddress(resume)) {
            resume.setAddress(buildFullAddress(
                    resume.getAddressDetail(),
                    resume.getWardCode(),
                    resume.getProvinceCode()));
        } else if (legacyAddress != null) {
            resume.setAddress(legacyAddress.trim());
        } else if (resume.getAddress() == null) {
            resume.setAddress("");
        }
    }

    public String buildFullAddress(String addressDetail, String wardCode, String provinceCode) {
        List<String> parts = new ArrayList<>();

        if (addressDetail != null && !addressDetail.isBlank()) {
            parts.add(addressDetail.trim());
        }

        findWard(wardCode).ifPresent(ward -> {
            String wardLabel = ward.getFullName() != null ? ward.getFullName() : ward.getName();
            if (wardLabel != null && !wardLabel.isBlank()) {
                parts.add(wardLabel);
            }
        });

        findProvince(provinceCode).ifPresent(province -> {
            String provinceLabel = province.getFullName() != null ? province.getFullName() : province.getName();
            if (provinceLabel != null && !provinceLabel.isBlank()) {
                parts.add(provinceLabel);
            }
        });

        return parts.isEmpty() ? "" : String.join(" - ", parts);
    }

    private boolean hasStructuredAddress(Resume resume) {
        return (resume.getProvinceCode() != null && !resume.getProvinceCode().isBlank())
                || (resume.getWardCode() != null && !resume.getWardCode().isBlank());
    }

    private Optional<Province> findProvince(String provinceCode) {
        if (provinceCode == null || provinceCode.isBlank()) {
            return Optional.empty();
        }
        Optional<Province> province = provinceRepository.findById(provinceCode.trim());
        if (province.isPresent()) {
            return province;
        }
        if (provinceCode.trim().matches("\\d+")) {
            return provinceRepository.findById(String.format("%02d", Integer.parseInt(provinceCode.trim())));
        }
        return Optional.empty();
    }

    private Optional<Ward> findWard(String wardCode) {
        if (wardCode == null || wardCode.isBlank()) {
            return Optional.empty();
        }
        return wardRepository.findById(wardCode.trim());
    }

    private ProvinceDTO toProvinceDTO(Province province) {
        return new ProvinceDTO(
                province.getCode(),
                province.getName(),
                province.getFullName() != null ? province.getFullName() : province.getName());
    }

    private WardDTO toWardDTO(Ward ward) {
        return new WardDTO(
                ward.getCode(),
                ward.getName(),
                ward.getFullName() != null ? ward.getFullName() : ward.getName(),
                ward.getProvinceCode());
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
