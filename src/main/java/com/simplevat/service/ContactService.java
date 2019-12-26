package com.simplevat.service;

import com.simplevat.entity.Contact;
import java.util.List;
import java.util.Optional;

/**
 * Created by mohsin on 3/3/2017.
 */
public abstract class ContactService extends SimpleVatService<Integer, Contact> {
    
    public abstract List<Contact> getAllContacts(Integer pageNo, Integer pageSize);

    public abstract List<Contact> getContacts(Integer contactType, Integer pageIndex, Integer noOfRecorgs);

    public abstract List<Contact> getContacts(Integer contactType, final String searchQuery, Integer pageNo, Integer pageSize);

    public abstract Optional<Contact> getContactByEmail(String Email);

    public abstract void deleleByIds(List<Integer> ids);

}
