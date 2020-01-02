/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ContactFilterEnum;
import com.simplevat.entity.Contact;
import com.simplevat.rest.DropdownModel;
import com.simplevat.service.ContactService;
import com.simplevat.security.JwtTokenUtil;
import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    public ResponseEntity getContactList(ContactRequestFilterModel filterModel, HttpServletRequest request) throws IOException {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        try {
            Map<ContactFilterEnum, Object> filterDataMap = new HashMap();
            filterDataMap.put(ContactFilterEnum.CONTACT_TYPE, filterModel.getContactType());
            filterDataMap.put(ContactFilterEnum.NAME, filterModel.getName());
            filterDataMap.put(ContactFilterEnum.EMAIL, filterModel.getEmail());
            filterDataMap.put(ContactFilterEnum.DELETE_FLAG, false);
            filterDataMap.put(ContactFilterEnum.USER_ID, userId);
            List<ContactListModel> contactListModels = new ArrayList<>();
            List<Contact> contactList = contactService.getContactList(filterDataMap);
            if (contactList == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            contactList.forEach(contact -> contactListModels.add(contactHelper.getListModel(contact)));
            return new ResponseEntity<>(contactListModels, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/getContactsForDropdown")
    public ResponseEntity getContactsForDropdown(@RequestParam(name = "contactType", required = false) Integer contactType) throws IOException {
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
            return new ResponseEntity<>(contact, HttpStatus.OK);
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
