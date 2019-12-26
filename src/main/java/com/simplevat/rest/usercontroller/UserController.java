/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.usercontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.contact.model.UserModel;
import com.simplevat.entity.Mail;
import com.simplevat.entity.MailEnum;
import com.simplevat.entity.Role;
import com.simplevat.entity.User;
import com.simplevat.integration.MailIntegration;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ConfigurationService;
import com.simplevat.service.RoleService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.constant.EmailConstant;
import com.simplevat.utils.FileHelper;
import com.simplevat.utils.MailConfigurationModel;
import com.simplevat.utils.MailUtility;
import java.io.File;
import java.io.Serializable;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.internet.MimeMultipart;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/user")
public class UserController implements Serializable {

    @Autowired
    private UserServiceNew userService;

    @Autowired
    private FileHelper fileUtility;

    @Autowired
    private RoleService roleService;

    @Autowired
    private ConfigurationService configurationService;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private boolean isEmailPresent = false;

    @GetMapping(value = "/getuserlist")
    private ResponseEntity<List<User>> getUserList() {
        List<User> userList = null;
        try {
            userList = userService.findAll();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(userList, HttpStatus.OK);
    }

    @DeleteMapping(value = "/deleteuser")
    public ResponseEntity deleteUser(@RequestParam(value = "id") Integer id) {
        User user = userService.findByPK(id);
        if (user == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);

        } else {
            user.setDeleteFlag(true);
            userService.update(user);

        }
        return new ResponseEntity(HttpStatus.OK);

    }

    @DeleteMapping(value = "/deleteusers")
    public ResponseEntity deleteUsers(@RequestBody DeleteModel ids) {
        try {
            userService.deleteByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping(value = "/edituser")
    public ResponseEntity<User> editUser(@RequestParam(value = "id") Integer id) {
        User user = null;
        try {
            user = userService.findByPK(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(user, HttpStatus.OK);

    }

    @GetMapping(value = "/getrole")
    public ResponseEntity<List<Role>> comoleteRole() {
        List<Role> roles = roleService.getRoles();
        if (roles != null) {
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
    
    @GetMapping(value = "/current")
    public ResponseEntity<User> currentUser(HttpServletRequest request) {
        try {
        	Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        	User user = userService.findByPK(userId);
        	return new ResponseEntity<>(user, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
    }

    @PostMapping(value = "/saveuser")
    public ResponseEntity save(@RequestBody UserModel selectedUser, @RequestParam("id") Integer id) {
        boolean isUserNew = true;
        User user1 = userService.findByPK(id);
        String password = selectedUser.getPassword();
        if (selectedUser.getUserId() != null) {
            User user = userService.getUserEmail(selectedUser.getUserEmail());
            isUserNew = user == null || !user.getUserId().equals(selectedUser.getUserId());
        }
        if (isUserNew) {
            Optional<User> userOptional = userService.getUserByEmail(selectedUser.getUserEmail());
            if (userOptional.isPresent()) {
                isEmailPresent = true;
                return new ResponseEntity<>("Email Id already Exist", HttpStatus.OK);
            }
        }
        if (!isEmailPresent) {
            try {

                if (password != null && !password.trim().isEmpty()) {
                    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                    String encodedPassword = passwordEncoder.encode(password);
                    selectedUser.setPassword(encodedPassword);
                }
                User user = new User();
                BeanUtils.copyProperties(selectedUser, user);
                user.setCompany(user1.getCompany());
                user.setCreatedBy(user1.getUserId());
                user.setLastUpdatedBy(user1.getUserId());
                if (user.getUserId() == null) {
                    userService.persist(user);
                    sendNewUserMail(user, password);
                    return new ResponseEntity("User Profile saved successfully", HttpStatus.CREATED);
                } else {
                    userService.update(user, user.getUserId());
                    return new ResponseEntity("User Profile updated successfully", HttpStatus.CREATED);
                }
            } catch (Exception ex) {
                Logger.getLogger(UserController.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    private String sendNewUserMail(User user, String passwordToMail) {
        final String NEW_USER_EMAIL_TEMPLATE_FILE = "emailtemplate/new-user-created-template.html";
        try {
            MailEnum mailEnum = MailEnum.NEW_USER_CREATED;
            String recipientName = user.getFirstName();
            String url = "http://" + System.getenv("SIMPLEVAT_SUBDOMAIN") + "." + System.getenv("SIMPLEVAT_ENVIRONMENT") + ".simplevat.com";
            String userMail = user.getUserEmail();
            Object[] args = {recipientName, url, userMail, passwordToMail};
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource(NEW_USER_EMAIL_TEMPLATE_FILE).getFile());
            String pathname = file.getAbsolutePath();
            MessageFormat msgFormat = new MessageFormat(fileUtility.readFile(pathname));
            MimeMultipart mimeMultipart = fileUtility.getMessageBody(msgFormat.format(args));
            String[] email = {userMail};
            MailConfigurationModel mailDefaultConfigurationModel = MailUtility.getEMailConfigurationList(configurationService.getConfigurationList());
            sendActivationMail(mailEnum, mimeMultipart, mailDefaultConfigurationModel.getMailusername(), email);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void sendActivationMail(MailEnum mailEnum, MimeMultipart mimeMultipart, String userName, String[] senderMailAddress) {
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Mail mail = new Mail();
                    mail.setFrom(userName);
                    mail.setFromName(EmailConstant.ADMIN_EMAIL_SENDER_NAME);
                    mail.setTo(senderMailAddress);
                    mail.setSubject(mailEnum.getSubject());
                    MailIntegration.sendHtmlEmail(mimeMultipart, mail, MailUtility.getJavaMailSender(configurationService.getConfigurationList()));
                } catch (Exception ex) {
                    java.util.logging.Logger.getLogger(UserController.class
                            .getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        t.start();
    }
}
