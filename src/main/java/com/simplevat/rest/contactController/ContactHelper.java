/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.contactController;

import com.simplevat.entity.Contact;
import com.simplevat.enums.ContactTypeEnum;
import com.simplevat.service.ContactService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author admin
 */
@Component
public class ContactHelper {

    @Autowired
    ContactService contactService;

    @Autowired
    CountryService countryService;

    @Autowired
    CurrencyService currencyService;

    public ContactListModel getListModel(Contact contact) {
        return ContactListModel.builder()
                .id(contact.getContactId())
                .contactType(contact.getContactType())
                .currencySymbol(contact.getCurrency() != null ? contact.getCurrency().getCurrencySymbol() : null)
                .email(contact.getEmail())
                .firstName(contact.getFirstName())
                .middleName(contact.getMiddleName())
                .lastName(contact.getLastName())
                .contactTypeString(contact.getContactType() != null ? ContactTypeEnum.getContactTypeByValue(contact.getContactType()) : null)
                .mobileNumber(contact.getMobileNumber()).build();

    }

    public Contact getEntity(ContactPersistModel contactPersistModel, Integer userId) {
        Contact contact = new Contact();
        if (contactPersistModel.getContactId() != null) {
            contact = contactService.findByPK(contactPersistModel.getContactId());
            contact.setContactId(contactPersistModel.getContactId());
        }
        contact.setContactType(contactPersistModel.getContactType());
        contact.setContractPoNumber(contactPersistModel.getContractPoNumber());
        if (contactPersistModel.getCountryId() != null) {
            contact.setCountry(countryService.getCountry(contactPersistModel.getCountryId()));
        }
        if (contactPersistModel.getCurrencyCode() != null) {
            contact.setCurrency(currencyService.getCurrency(contactPersistModel.getCurrencyCode()));
        }
        contact.setEmail(contactPersistModel.getEmail());
        contact.setFirstName(contactPersistModel.getFirstName());
        contact.setMiddleName(contactPersistModel.getMiddleName());
        contact.setLastName(contactPersistModel.getLastName());
        contact.setAddressLine1(contactPersistModel.getAddressLine1());
        contact.setAddressLine2(contactPersistModel.getAddressLine2());
        contact.setAddressLine3(contactPersistModel.getAddressLine3());
        contact.setMobileNumber(contactPersistModel.getMobileNumber());
        contact.setOrganization(contactPersistModel.getOrganization());
        contact.setPoBoxNumber(contactPersistModel.getPoBoxNumber());
        contact.setBillingEmail(contactPersistModel.getBillingEmail());
        contact.setState(contactPersistModel.getState());
        contact.setCity(contactPersistModel.getCity());
        contact.setPostZipCode(contactPersistModel.getPostZipCode());
        contact.setTelephone(contactPersistModel.getTelephone());
        contact.setVatRegistrationNumber(contactPersistModel.getVatRegistrationNumber());
        return contact;
    }

    public ContactPersistModel getContactPersistModel(Contact contact) {
        ContactPersistModel.ContactPersistModelBuilder builder = ContactPersistModel.builder()
                .contactId(contact.getContactId())
                .contactType(contact.getContactType())
                .contractPoNumber(contact.getContractPoNumber())
                .email(contact.getEmail())
                .firstName(contact.getFirstName())
                .middleName(contact.getMiddleName())
                .lastName(contact.getLastName())
                .mobileNumber(contact.getMobileNumber())
                .organization(contact.getOrganization())
                .poBoxNumber(contact.getPoBoxNumber())
                .postZipCode(contact.getPostZipCode())
                .billingEmail(contact.getBillingEmail())
                .state(contact.getState())
                .city(contact.getCity())
                .addressLine1(contact.getAddressLine1())
                .addressLine2(contact.getAddressLine2())
                .addressLine3(contact.getAddressLine3())
                .telephone(contact.getTelephone())
                .vatRegistrationNumber(contact.getVatRegistrationNumber());
        if (contact.getCountry() != null) {
            builder.countryId(contact.getCountry().getCountryCode());
        }
        if (contact.getCurrency() != null) {
            builder.currencyCode(contact.getCurrency().getCurrencyCode());
        }

        return builder.build();
    }

}
