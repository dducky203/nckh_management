package com.example.server.controller.admin;

import com.example.server.domain.Admin;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.repository.AdminRepository;
import com.example.server.repository.ResumeRepository;
import com.example.server.service.SHA_256_password;
import jakarta.servlet.http.HttpSession;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Controller
@RequestMapping("/ad/resume")
public class ResumeAdController {
    @Autowired
    AdminRepository adminRepository;
    @Autowired
    ResumeRepository resumeRepository;
    @Autowired
    SHA_256_password sha_256_password;

    // show resume by idAdmin
    @GetMapping("/{idAdmin}")
    public String resume(@PathVariable Integer idAdmin, Model model, HttpSession session) {

        model.addAttribute("resume",resumeRepository.findByIdAdmin(adminRepository.findById(idAdmin).get()));

        return "admin/resume/showResume";
    }

    // repair pass
    @GetMapping("/repairPass/{idAdmin}")
    public String repairPass(Model model, @PathVariable Integer idAdmin) {
        return "admin/resume/repairPass";
    }
    // save pass
    @PostMapping("/savePass/{idAdmin}")
    public String savePass(@PathVariable Integer idAdmin,
                           @RequestParam("pass1")String pass1,
                           @RequestParam("pass2")String pass2,Model model){
        if (!Objects.equals(pass1, pass2)){
            model.addAttribute("message","2 mật khẩu phải giống nhau");
            return "admin/resume/repairPass";
        }
        if (pass1.length() < 8  ) {
            model.addAttribute("message","mật khẩu phải ít nhất 8 kí tự ");
            return "admin/resume/repairPass";
        }
        Admin admin = adminRepository.findById(idAdmin).get();
        String passInput = SHA_256_password.GM_SHA_password(pass1);
        admin.setPassword(passInput);
        adminRepository.save(admin);
        return "redirect:/ad/resume/"+idAdmin;
    }

    // repair resume
    @GetMapping("/repair/{idAdmin}")
    public String repairResume(@PathVariable Integer idAdmin, Model model) {
        model.addAttribute("admin",adminRepository.findById(idAdmin));
        model.addAttribute("resume",resumeRepository.findByIdAdmin(adminRepository.findById(idAdmin).get()));
        return "admin/resume/repairResume";
    }
    // save resume
    @PostMapping("/save/{idAdmin}")
    public String saveResume(@PathVariable Integer idAdmin,
                             @RequestParam(name = "email") String email,
                             @RequestParam(name = "phone") String phone,
                             @RequestParam(name = "address")String address,
                             @RequestParam(name = "birthday") LocalDate birthday,
                             Model model) {
        model.addAttribute("admin",adminRepository.findById(idAdmin));
        model.addAttribute("resume",resumeRepository.findByIdAdmin(adminRepository.findById(idAdmin).get()));
        if (phone.length() != 10  ) {
            model.addAttribute("message","Số điện thoại phải 10 chữ số");
            return "admin/resume/repairResume";
        }
        if (phone.startsWith("01") || phone.startsWith("04")
                || phone.startsWith("06")) {
            model.addAttribute("message","Không đúng định dạng số điện thoại Việt Nam");
            return "admin/resume/repairResume";
        }
        Resume resume = resumeRepository.findByIdAdmin(adminRepository.findById(idAdmin).get());
        if (resume == null) {
            Resume resume1 = new Resume();
            resume1.setIdAdmin(adminRepository.findById(idAdmin).get());
            resume1.setEmail(email);
            resume1.setPhone(phone);
            resume1.setAddress(address);
            resume1.setBirthday(birthday);
            resumeRepository.save(resume1);
        }else {
            resume.setEmail(email);
            resume.setPhone(phone);
            resume.setAddress(address);
            resume.setBirthday(birthday);
            resumeRepository.save(resume);
        }
        return "redirect:/ad/resume/"+idAdmin;
    }
}
