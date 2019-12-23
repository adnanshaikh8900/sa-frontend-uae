package com.simplevat.service;

import com.simplevat.entity.Contact;
import com.simplevat.enums.ContactTypeEnum;
import java.util.List;
import java.util.Optional;

/**
 * Created by mohsin on 3/3/2017.
 */
public abstract class ContactService extends SimpleVatService<Integer, Contact> {

    public abstract List<Contact> getContacts(ContactTypeEnum contactTypeEnum, Integer pageIndex, Integer noOfRecorgs);

    public abstract List<Contact> getContacts(ContactTypeEnum contactTypeEnum, final String searchQuery, int ContactType);

    public abstract Optional<Contact> getContactByEmail(String Email);

    public abstract void deleleByIds(List<Integer> ids);

}
