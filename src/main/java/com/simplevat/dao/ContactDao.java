package com.simplevat.dao;

import com.simplevat.entity.Contact;
import com.simplevat.enums.ContactTypeEnum;

import java.util.List;
import java.util.Optional;

/**
 * Created by mohsin on 3/3/2017.
 */
public interface ContactDao extends Dao<Integer, Contact> {

    public List<Contact> getContacts(ContactTypeEnum contactTypeEnum, Integer pageNo, Integer pageSize);
    
    public List<Contact> getContacts(ContactTypeEnum contactTypeEnum, final String searchQuery, int contactType);

    public Optional<Contact> getContactByEmail(String Email);

    public void deleteByIds(List<Integer> ids);
}
