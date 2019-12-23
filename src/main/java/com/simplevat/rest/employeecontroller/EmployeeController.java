/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Role;
import com.simplevat.entity.Title;
import com.simplevat.entity.User;
import com.simplevat.helper.ContactHelper;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.RoleService;
import com.simplevat.service.TitleService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.constant.ContactTypeConstant;
import com.simplevat.constant.RoleCode;
import com.simplevat.contact.model.ContactModel;
import java.io.IOException;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
@RequestMapping(value = "/rest/employee")
public class EmployeeController implements Serializable {

    @Autowired
    private UserServiceNew userServiceNew;

    @Autowired
    private TitleService titleService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private CompanyService companyService;

    private Contact selectedContact = new Contact();

    private ContactHelper contactHelper = new ContactHelper();

    @GetMapping(value = "/getuser")
    public ResponseEntity getUser() {
        List<User> users = userServiceNew.getAllUserNotEmployee();
        if (users != null) {
            return new ResponseEntity(users, HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping(value = "/gettitle")
    public ResponseEntity getTitle(@RequestParam(value = "titleStr") String titleStr) {
        List<Title> titleSuggestion = new ArrayList<>();
        List<Title> titles = titleService.getTitles();
        Iterator<Title> titleIterator = titles.iterator();

        while (titleIterator.hasNext()) {
            Title title = titleIterator.next();
            if (title.getTitleDescription() != null
                    && !title.getTitleDescription().isEmpty()
                    && title.getTitleDescription().toUpperCase().contains(titleStr.toUpperCase())) {
                titleSuggestion.add(title);
            }
        }

        return new ResponseEntity(titleSuggestion, HttpStatus.OK);
    }

    @Deprecated
    @GetMapping(value = "/getcurrencycode")
    public ResponseEntity getCurrency() {
        try {
            List<Currency> currencies = currencyService.getCurrencies();
            if (currencies != null && !currencies.isEmpty()) {
                return new ResponseEntity(currencies, HttpStatus.OK);
            } else {
                return new ResponseEntity(currencies, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(value = "/saveuser")
    public ResponseEntity createOrUpdateEmployee(@RequestBody ContactModel contactModel, @RequestParam("id") Integer id) throws IOException {
        Optional<User> optionalUser = userServiceNew.getUserByEmail(contactModel.getEmail());
        String message = "";
        Boolean isPresent = false;
        User user = null;
        if (contactModel.getNonEmployeeUser() != null) {
            isPresent = false;
            user = contactModel.getNonEmployeeUser();
        } else {
            isPresent = optionalUser.isPresent();
            user = new User();
        }
        if (!isPresent) {
            selectedContact = contactHelper.getContact(contactModel);
            if (contactModel.getNonEmployeeUser() != null) {
                selectedContact.setEmail(contactModel.getNonEmployeeUser().getUserEmail());
            }
//            selectedContact.setContactType(ContactTypeConstant.EMPLOYEE);
            if (selectedContact.getContactId() != null && selectedContact.getContactId() > 0) {
                contactService.update(selectedContact);
            } else {
                selectedContact.setCreatedBy(id);
                contactService.persist(selectedContact);
            }
            setUserData(user, selectedContact, id, contactModel);
            if (contactModel.getNonEmployeeUser() != null) {
                userServiceNew.update(user);
            } else {
                userServiceNew.persist(user);
            }
            contactModel = new ContactModel();
            return new ResponseEntity("Employee saved successfully ", HttpStatus.OK);
        } else {

            return new ResponseEntity("Email already present", HttpStatus.OK);

        }

    }

    private void setUserData(User user, Contact contact, Integer id, ContactModel contactModel) {

        if (contactModel.getNonEmployeeUser() == null) {
            User user1 = userServiceNew.findByPK(id);
            user.setCompany(user1.getCompany());
            user.setCreatedBy(user1.getUserId());
            user.setCreatedDate(LocalDateTime.now());
            user.setDeleteFlag(Boolean.FALSE);
            user.setIsActive(Boolean.TRUE);
            user.setUserEmail(contactModel.getEmail());
            user.setPassword((new BCryptPasswordEncoder()).encode(contactModel.getPassword()));
        }
        user.setDateOfBirth(Instant.ofEpochMilli(contactModel.getDob() != null ? contactModel.getDob().getTime() : (new Date()).getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
        user.setEmployeeId(contact);
        user.setFirstName(contact.getFirstName());
        user.setLastName(contact.getLastName());
        Role role = roleService.findByPK(RoleCode.EMPLOYEE.getCode());
        user.setRole(role);

    }
}
