/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactController;

import com.simplevat.entity.Contact;
import com.simplevat.contact.model.ContactModel;
import org.springframework.stereotype.Component;

/**
 *
 * @author admin
 */
@Component
public class ContactHelper {

     public ContactListModel getListModel(Contact contact) {
        return ContactListModel.builder()
                .id(contact.getContactId())
                .contactType(contact.getContactType())
                .currencySymbol(contact.getCurrency().getCurrencySymbol())
                .email(contact.getEmail())
                .firstName(contact.getFirstName())
                .middleName(contact.getMiddleName())
                .lastName(contact.getLastName())
                .mobileNumber(contact.getMobileNumber()).build();
                
        
     }
    public ContactModel getContactModel(Contact contact) {
        ContactModel contactModel = new ContactModel();
//        contactModel.setContactId(contact.getContactId());
//        contactModel.setBillingEmail(contact.getBillingEmail());
//        contactModel.setCity(contact.getCity());
//        contactModel.setContractPoNumber(contact.getContractPoNumber());
//        contactModel.setCountry(contact.getCountry());
//        contactModel.setCurrency(contact.getCurrency());
//        contactModel.setEmail(contact.getEmail());
//        contactModel.setFirstName(contact.getFirstName());
//        contactModel.setInvoicingAddressLine1(contact.getInvoicingAddressLine1());
//        contactModel.setInvoicingAddressLine2(contact.getInvoicingAddressLine2());
//        contactModel.setInvoicingAddressLine3(contact.getInvoicingAddressLine3());
//        contactModel.setLanguage(contact.getLanguage());
//        contactModel.setLastName(contact.getLastName());
//        contactModel.setMiddleName(contact.getMiddleName());
//        contactModel.setMobileNumber(contact.getMobileNumber());
//        contactModel.setOrganization(contact.getOrganization());
//        contactModel.setPoBoxNumber(contact.getPoBoxNumber());
//        contactModel.setPostZipCode(contact.getPostZipCode());
//        contactModel.setStateRegion(contact.getStateRegion());
//        contactModel.setTelephone(contact.getTelephone());
//        contactModel.setTitle(contact.getTitle());
//        contactModel.setVatRegistrationNumber(contact.getVatRegistrationNumber());
//        contactModel.setVersionNumber(contact.getVersionNumber());
//        contactModel.setCreatedBy(contact.getCreatedBy());
//        contactModel.setCreatedDate(contact.getCreatedDate());
//        contactModel.setLastUpdateDate(contact.getLastUpdateDate());
//        contactModel.setLastUpdatedBy(contact.getLastUpdatedBy());
//        contactModel.setDeleteFlag(contact.getDeleteFlag());
//        contactModel.setContactCode(contact.getContactId());
        return contactModel;
    }

    public Contact getContact(ContactModel contactModel) {
        Contact contact = new Contact();
//        contact.setContactId(contactModel.getContactId());
//        contact.setBillingEmail(contactModel.getBillingEmail());
//        contact.setCity(contactModel.getCity());
//        contact.setContractPoNumber(contactModel.getContractPoNumber());
//        contact.setCountry(contactModel.getCountry());
//        contact.setCurrency(contactModel.getCurrency());
//        contact.setEmail(contactModel.getEmail());
//        contact.setFirstName(contactModel.getFirstName());
//        contact.setInvoicingAddressLine1(contactModel.getInvoicingAddressLine1());
//        contact.setInvoicingAddressLine2(contactModel.getInvoicingAddressLine2());
//        contact.setInvoicingAddressLine3(contactModel.getInvoicingAddressLine3());
//        contact.setLanguage(contactModel.getLanguage());
//        contact.setLastName(contactModel.getLastName());
//        contact.setMiddleName(contactModel.getMiddleName());
//        contact.setMobileNumber(contactModel.getMobileNumber());
//        contact.setOrganization(contactModel.getOrganization());
//        contact.setPoBoxNumber(contactModel.getPoBoxNumber());
//        contact.setPostZipCode(contactModel.getPostZipCode());
//        contact.setStateRegion(contactModel.getStateRegion());
//        contact.setTelephone(contactModel.getTelephone());
//        contact.setTitle(contactModel.getTitle());
//        contact.setVatRegistrationNumber(contactModel.getVatRegistrationNumber());
//        contact.setVersionNumber(contactModel.getVersionNumber());
//        contact.setCreatedBy(contactModel.getCreatedBy());
//        contact.setCreatedDate(contactModel.getCreatedDate());
//        contact.setLastUpdateDate(contactModel.getLastUpdateDate());
//        contact.setLastUpdatedBy(contactModel.getLastUpdatedBy());
//        contact.setDeleteFlag(contactModel.getDeleteFlag());
        return contact;
    }

//    public ContactViewModel getContactViewModel(ContactView contactView) {
//        ContactViewModel contactViewModel = new ContactViewModel();
//        if (contactView.getContactId() != 0) {
//            contactViewModel.setContactId(contactView.getContactId());
//        }
//        if (contactView.getEmail() != null && !contactView.getEmail().isEmpty()) {
//            contactViewModel.setEmail(contactView.getEmail());
//        }
//        if (contactView.getFirstName() != null && !contactView.getFirstName().isEmpty()) {
//            contactViewModel.setFirstName(contactView.getFirstName());
//        }
//        if (contactView.getLastName() != null && !contactView.getLastName().isEmpty()) {
//            contactViewModel.setLastName(contactView.getLastName());
//        }
//        if (contactView.getMiddleName() != null && !contactView.getMiddleName().isEmpty()) {
//            contactViewModel.setMiddleName(contactView.getMiddleName());
//        }
//        if (contactView.getOrganization() != null && !contactView.getOrganization().isEmpty()) {
//            contactViewModel.setOrganization(contactView.getOrganization());
//        }
//        if (contactView.getTelephone() != null && !contactView.getTelephone().isEmpty()) {
//            contactViewModel.setTelephone(contactView.getTelephone());
//        }
//        if (contactView.getNextDueDate() != null) {
//            contactViewModel.setNextDueDate(contactView.getNextDueDate());
//        }
//        if (contactView.getTitle() != null && !contactView.getTitle().isEmpty()) {
//            contactViewModel.setTitle(contactView.getTitle());
//        }
//        if (contactView.getCurrencySymbol() != null && !contactView.getCurrencySymbol().isEmpty()) {
//            contactViewModel.setCurrencySymbol(contactView.getCurrencySymbol());
//        }
//        if (contactView.getDueAmount() != null) {
//            contactViewModel.setDueAmount(contactView.getDueAmount());
//        }
//
//        if (contactView.getContactType() != 0) {
//            if (contactView.getContactType() != 3) {
//                for (ContactType contactType : ContactUtil.contactTypeList()) {
//                    if (contactType.getId().equals(contactView.getContactType())) {
//                        contactViewModel.setContactType(contactType);
//                    }
//                }
//            } else {
//                contactViewModel.setContactType(new ContactType(ContactTypeConstant.EMPLOYEE, "Employee"));
//            }
//
//        }
//        return contactViewModel;
//    }
}
