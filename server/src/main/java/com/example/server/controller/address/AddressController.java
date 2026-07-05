package com.example.server.controller.address;

import com.example.server.DTO.address.ProvinceDTO;
import com.example.server.DTO.address.WardDTO;
import com.example.server.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/address")
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/provinces")
    public ResponseEntity<List<ProvinceDTO>> getProvinces() {
        return ResponseEntity.ok(addressService.getAllProvinces());
    }

    @GetMapping("/provinces/{code}/wards")
    public ResponseEntity<List<WardDTO>> getWardsByProvince(@PathVariable("code") String provinceCode) {
        return ResponseEntity.ok(addressService.getWardsByProvinceCode(provinceCode));
    }
}
