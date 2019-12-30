/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Contact;
import com.simplevat.rest.DropdownModel;
import com.simplevat.service.ContactService;
import com.simplevat.rest.PaginationModel;
import com.simplevat.security.JwtTokenUtil;
import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;
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

    @GetMapping(value = "/getContactList")
    public ResponseEntity getContactList(PaginationModel paginationModel, ContactRequestFilterModel contactRequestFilterModel) throws IOException {
        if (paginationModel == null) {
            paginationModel = new PaginationModel();
        }
        List<ContactListModel> contactListModels = new ArrayList<>();
        List<Contact> contactList;
        if (contactRequestFilterModel == null || contactRequestFilterModel.getContactType() == null) {
            contactList = contactService.getAllContacts(paginationModel.getPageNo(), paginationModel.getPageSize());
        } else {
            contactList = contactService.getContacts(contactRequestFilterModel, paginationModel.getPageNo(), paginationModel.getPageSize());
        }
        contactList.forEach(contact -> contactListModels.add(contactHelper.getListModel(contact)));
        return new ResponseEntity<>(contactListModels, HttpStatus.OK);
    }

    @GetMapping(value = "/getContactsForDropdown")
    public ResponseEntity getContactsForDropdown(@RequestParam("contactType") Integer contactType) throws IOException {
        List<DropdownModel> dropdownModels = contactService.getContactForDropdown(contactType);
        return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
    }

    @GetMapping(value = "/getContactById")
    public ResponseEntity getContactById(@RequestParam("contactId") Integer contactId) throws IOException {
        ContactPersistModel contactPersistModel = contactHelper.getContactPersistModel(contactService.findByPK(contactId));
        return new ResponseEntity<>(contactPersistModel, HttpStatus.OK);
    }

    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody ContactPersistModel contactPersistModel, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        try {
            Contact contact = contactHelper.getEntity(contactPersistModel, userId);
            contact.setCreatedBy(userId);
            contact.setCreatedDate(LocalDateTime.now());
            contact.setDeleteFlag(false);
            contactService.persist(contact);
            return new ResponseEntity<>(contact,HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @PostMapping(value = "/update")
    public ResponseEntity update(@RequestBody ContactPersistModel contactPersistModel, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        try {
            if (contactPersistModel.getContactId() != null && contactPersistModel.getContactId() > 0) {
                Contact contact = contactHelper.getEntity(contactPersistModel, userId);
                contact.setLastUpdatedBy(userId);
                contact.setLastUpdateDate(LocalDateTime.now());
                contactService.update(contact);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity delete(@RequestParam(value = "id") Integer id, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        Contact contact = contactService.findByPK(id);
        if (contact == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        contact.setDeleteFlag(Boolean.TRUE);
        contact.setLastUpdatedBy(userId);
        contactService.update(contact);
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
