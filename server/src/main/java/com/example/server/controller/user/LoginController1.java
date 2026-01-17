// package com.example.server.controller.user;
//
// import com.example.server.DTO.NcmDTO;
// import com.example.server.controller.admin.CommonAdController;
// import com.example.server.controller.admin.ManagerUserController;
// import com.example.server.domain.Admin;
// import com.example.server.domain.Ncm;
// import com.example.server.domain.Resume;
// import com.example.server.domain.User;
// import com.example.server.repository.AdminRepository;
// import com.example.server.repository.NcmRepository;
// import com.example.server.repository.ResumeRepository;
// import com.example.server.service.*;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.*;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import
// org.springframework.security.web.context.HttpSessionSecurityContextRepository;
//
//
//
// import java.security.SecureRandom;
// import java.time.LocalDate;
// import java.util.List;
//
// @Controller
// @RequestMapping("/login")
// public class LoginController {
// @Autowired
// UserService userService;
// @Autowired
// LoginService loginService;
// @Autowired
// CommonAdController commonAdController;
// @Autowired
// NcmRepository ncmRepository;
// @Autowired
// ManagerUserController managerUserController;
// @Autowired
// private ResumeRepository resumeRepository;
// @Autowired
// SHA_256_password sha_256_password;
// @Autowired
// private AdminRepository adminRepository;
// @Autowired
// NcmService ncmService;
//
//
// // enter login
// @GetMapping("")
//// public String login() {
//// return "login";
//// }
//
// // check login user
// @PostMapping("/checkLogin")
// public void login(@RequestParam("username") String username,
// @RequestParam("password") String password,
// Model model,
// HttpSession session)
// {
////
//// User user = loginService.checkLoginUser(username, password);
//// if (user == null) {
//// Admin admin = loginService.checkLoginAdmin(username, password);
//// if (admin == null) {
//// model.addAttribute("message", "Sai tài khoản hoặc mật khẩu");
//// return "login";
//// } else {
//// UsernamePasswordAuthenticationToken auth = new
// UsernamePasswordAuthenticationToken(
//// admin.getUsername(), null, List.of(new
// SimpleGrantedAuthority("ROLE_ADMIN")));
//// SecurityContextHolder.getContext().setAuthentication(auth);
////
////
//// session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
//// SecurityContextHolder.getContext());
////
//// session.setAttribute("saveAdmin", admin);
//// return commonAdController.enterAdmin(model);
//// }
//// }
////
//// UsernamePasswordAuthenticationToken auth = new
// UsernamePasswordAuthenticationToken(
//// user.getUsername(), null, List.of(new
// SimpleGrantedAuthority("ROLE_USER")));
//// SecurityContextHolder.getContext().setAuthentication(auth);
////
//// session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
//// SecurityContextHolder.getContext());
////
//// session.setAttribute("saveUser", user);
//// // Lọc NCM theo người dùng và năm hiện tại
//// NcmDTO currentNcm = ncmService.getNcmByUserId(user.getId())
//// .stream()
//// .filter(ncm -> ncm.getYear() == LocalDate.now().getYear())
//// .findFirst()
//// .orElse(null);
////
//// // Đưa vào session nếu tồn tại
//// if (currentNcm != null) session.setAttribute("saveNcm", currentNcm);
//// return "redirect:/user";
// }
//
//
//
//
//
// // forgot password
// @GetMapping("/forgotPass")
// public String forgotPass() {
// return "/forgotPassword";
// }
//
// // send response to admin
// @PostMapping("/sendToAdmin")
// public String sendToAdmin(@RequestParam(name = "username") String username,
// Model model){
// User user = loginService.checkForgotPass(username);
// if(user != null){
// Resume resume = resumeRepository.findByIdUser(user.getId());
// model.addAttribute("message","Mật khẩu đã được gửi lại qua gmail của bạn, vui
// lòng kiểm tra để đăng nhập ");
// String pass =managerUserController.generateRandomPassword(8);
// managerUserController.sendPasswordForgotEmail(user.getUsername(),resume.getEmail(),pass);
// user.setPassword(pass);
// userService.save(user);
// return "login";
// }
//
// model.addAttribute("message","Không tồn tại mã này");
// return "/forgotPassword";
// }
// // logout in client
// @GetMapping("/logout")
// public String logout(HttpSession session){
// session.removeAttribute("saveUser");
// session.removeAttribute("saveNcm");
// session.removeAttribute("currentYear");
// session.removeAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
// return "redirect:/";
// }
// // logout in client
// @GetMapping("/logoutAdmin")
// public String logoutAdmin(HttpSession session){
// session.removeAttribute("saveAdmin");
// return "redirect:/admin";
// }
// }
