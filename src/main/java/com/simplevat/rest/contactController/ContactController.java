/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.ContactTypeConstant;
import com.simplevat.entity.Contact;
import com.simplevat.service.ContactService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.LanguageService;
import com.simplevat.service.TitleService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.rest.PaginationModel;
import com.simplevat.security.JwtTokenUtil;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/rest/contact")
public class ContactController implements Serializable {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactHelper contactHelper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

//    private int totalEmployees;
//
//    private int totalVendors;
//
//    private int totalCustomers;
//
//    private int totalContacts;
//
//
//    private void contactCountByType(ContactViewModel contactViewModel) {
//        totalEmployees = 0;
//        totalCustomers = 0;
//        totalVendors = 0;
//        totalContacts = 0;
//        if (contactViewModel.getContactType() != null) {
//            if (contactViewModel.getContactType().getId() == ContactTypeConstant.EMPLOYEE) {
//                totalEmployees++;
//            } else if (contactViewModel.getContactType().getId() == ContactTypeConstant.CUSTOMER) {
//                totalCustomers++;
//            } else {
//                totalVendors++;
//            }
//        }
//        totalContacts++;
//    }
    @GetMapping(value = "/getSupplierList")
    public ResponseEntity getSupplierList(PaginationModel paginationModel) throws IOException {
        if (paginationModel == null) {
            paginationModel = new PaginationModel();
        }
        List<ContactListModel> contactListModels = new ArrayList<>();
        List<Contact> contactList = contactService.getContacts(ContactTypeConstant.SUPPLIER, paginationModel.getPageNo(), paginationModel.getPageSize());
        contactList.forEach(contact -> contactListModels.add(contactHelper.getListModel(contact)));
        return new ResponseEntity<>(contactListModels, HttpStatus.OK);
    }

    @GetMapping(value = "/getCustomerList")
    public ResponseEntity getCustomerList(PaginationModel paginationModel) {
        List<ContactListModel> contactListModels = new ArrayList<>();
        List<Contact> contactList = contactService.getContacts(ContactTypeConstant.CUSTOMER, paginationModel.getPageNo(), paginationModel.getPageSize());
        contactList.forEach(cobtact -> contactListModels.add(contactHelper.getListModel(cobtact)));
        return new ResponseEntity<>(contactList, HttpStatus.OK);
    }

    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody Contact contact, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        try {
            if (contact.getContactId() != null && contact.getContactId() > 0) {
                contactService.update(contact);
                contact.setLastUpdatedBy(userId);
            } else {
                contact.setCreatedBy(userId);
                contactService.persist(contact);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        }
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity delete(@RequestParam(value = "id") Integer id, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        Contact contact1 = contactService.findByPK(id);
        if (contact1 == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        contact1.setDeleteFlag(Boolean.TRUE);
        contact1.setLastUpdatedBy(userId);
        contactService.update(contact1);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @DeleteMapping(value = "/deletes")
    public ResponseEntity deletes(@RequestBody DeleteModel ids, HttpServletRequest request) {

        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        try {
            contactService.deleleByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
