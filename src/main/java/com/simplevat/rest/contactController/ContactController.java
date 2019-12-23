/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Contact;
import com.simplevat.service.ContactService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.LanguageService;
import com.simplevat.service.TitleService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.constant.ContactTypeConstant;
import com.simplevat.contact.model.ContactModel;
import com.simplevat.contact.model.ContactViewModel;
import com.simplevat.enums.ContactTypeEnum;
import com.simplevat.rest.PaginationModel;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
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
    private CountryService countryService;

    @Autowired
    private LanguageService languageService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private TitleService titleService;

    @Autowired
    private UserServiceNew userServiceNew;

    @Autowired
    private ContactHelper contactHelper;

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
    public ResponseEntity getSupplierList(@RequestBody PaginationModel paginationModel) {
        List<ContactListModel> contactListModels = new ArrayList<>();
        List<Contact> contactList = contactService.getContacts(ContactTypeEnum.SUPPLIER, paginationModel.getPageNo(), paginationModel.getPageSize());
        contactList.forEach(cobtact -> contactListModels.add(contactHelper.getListModel(cobtact)));
        return new ResponseEntity<>(contactList, HttpStatus.OK);
    }

     @GetMapping(value = "/getCustomerList")
    public ResponseEntity getCustomerList(@RequestBody PaginationModel paginationModel) {
        List<ContactListModel> contactListModels = new ArrayList<>();
        List<Contact> contactList = contactService.getContacts(ContactTypeEnum.CUSTOMER, paginationModel.getPageNo(), paginationModel.getPageSize());
        contactList.forEach(cobtact -> contactListModels.add(contactHelper.getListModel(cobtact)));
        return new ResponseEntity<>(contactList, HttpStatus.OK);
    }

    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody Contact contact, @RequestParam(value = "id") Integer id) {
        try {
            if (contact.getId() != null && contact.getId() > 0) {
                contactService.update(contact);
            } else {
                contact.setCreatedBy(1);
                contactService.persist(contact);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        }
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity delete(@RequestParam(value = "id") Integer id) {
        Contact contact1 = contactService.findByPK(id);
        if (contact1 == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        contact1.setDeleteFlag(Boolean.TRUE);
        contactService.update(contact1);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @DeleteMapping(value = "/deletes")
    public ResponseEntity deletes(@RequestBody DeleteModel ids) {
        try {
            contactService.deleleByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
