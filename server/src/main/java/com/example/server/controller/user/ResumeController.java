package com.example.server.controller.user;

import com.example.server.DTO.NcmDTO;
import com.example.server.DTO.NcmListWrapper;
import com.example.server.domain.BreadcrumbItem;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.repository.*;
import com.example.server.service.BreadcrumbService;
import com.example.server.service.NcmService;
import com.example.server.service.SHA_256_password;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("/user/resume")
public class ResumeController {
    @Autowired
    ResumeRepository resumeRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    TypeOfCriterionRepository  typeOfCriterionRepository;
    @Autowired
    BreadcrumbService breadcrumbService;
    @Autowired
    NcmController ncmController;
    @Autowired
    CommonController commonController;
    @Autowired
    SHA_256_password sha_256_password;


    // show resume by idUser
    @GetMapping("/{idUser}")
    public String resume(@PathVariable Integer idUser, Model model, HttpSession session) {
        // call menu
        commonController.allTypeOfCriteria(model,typeOfCriterionRepository);
//        model.addAttribute("user",userRepository.findByIdUser(idUser));
        model.addAttribute("resume",resumeRepository.findByIdUser(idUser));
        //      Lưu vào session

        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbForType(null,false,false,true,false)); // gửi ra view
        // end breadcrumb

        ncmController.detailNcm(idUser,model,LocalDate.now().getYear());
        return "user/resume/showResume";
    }
    // repair resume
    @GetMapping("/repair/{idUser}")
    public String repairResume(@PathVariable Integer idUser, Model model) {
        model.addAttribute("user",userRepository.findByIdUser(idUser));
        model.addAttribute("resume",resumeRepository.findByIdUser(idUser));
        return "user/resume/repairResume";
    }
    // save resume
    @PostMapping("/save/{idUser}")
    public String saveResume(@PathVariable Integer idUser,
                             @RequestParam(name = "email") String email,
                             @RequestParam(name = "phone") String phone,
                             @RequestParam(name = "address")String address,
                             @RequestParam(name = "birthday") LocalDate birthday,
                             Model model) {
        model.addAttribute("user",userRepository.findByIdUser(idUser));
        model.addAttribute("resume",resumeRepository.findByIdUser(idUser));
        if (phone.length() != 10  ) {
            model.addAttribute("message","Số điện thoại phải 10 chữ số");
            return "user/resume/repairResume";
        }
        if (phone.startsWith("01") || phone.startsWith("04")
                || phone.startsWith("06")) {
            model.addAttribute("message","Không đúng định dạng số điện thoại Việt Nam");
            return "user/resume/repairResume";
        }
        Resume resume = resumeRepository.findByIdUser(idUser);
        if (resume == null){
            resume = new Resume();
            resume.setIdUser(userRepository.findByIdUser(idUser));
            resume.setCode(userRepository.findByIdUser(idUser).getUsername());
            resume.setEmail(email);
            resume.setPhone(phone);
            resume.setAddress(address);
            resume.setBirthday(birthday);
            resumeRepository.save(resume);
        }else {
            resume.setEmail(email);
            resume.setPhone(phone);
            resume.setAddress(address);
            resume.setBirthday(birthday);
            resumeRepository.save(resume);
        }

        return "redirect:/user/resume/"+idUser;
    }
    // repair pass
    @GetMapping("/repairPass/{idUser}")
    public String repairPass(Model model, @PathVariable Integer idUser) {
        return "user/resume/repairPass";
    }
    @PostMapping("/savePass/{idUser}")
    public String savePass(@PathVariable Integer idUser,
                           @RequestParam("pass1")String pass1,
                           @RequestParam("pass2")String pass2,Model model){
        if (!Objects.equals(pass1, pass2)){
            model.addAttribute("message","2 mật khẩu phải giống nhau");
            return "user/resume/repairPass";
        }
        if (pass1.length() < 8  ) {
            model.addAttribute("message","mật khẩu phải ít nhất 8 kí tự ");
            return "user/resume/repairPass";
        }
        User user =userRepository.findByIdUser(idUser);
        String passInput = SHA_256_password.GM_SHA_password(pass1);
        user.setPassword(passInput);
        userRepository.save(user);
        return "redirect:/user/resume/"+idUser;
    }
}