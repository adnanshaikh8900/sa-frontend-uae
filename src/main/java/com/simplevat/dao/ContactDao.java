package com.simplevat.dao;

import com.simplevat.entity.Contact;

import java.util.List;
import java.util.Optional;

/**
 * Created by mohsin on 3/3/2017.
 */
public interface ContactDao extends Dao<Integer, Contact> {

    public List<Contact> getAllContacts(Integer pageNo, Integer pageSize);

    public List<Contact> getContacts(Integer contactType, Integer pageNo, Integer pageSize);

    public List<Contact> getContacts(Integer contactType, final String searchQuery, Integer pageNo, Integer pageSize);

    public Optional<Contact> getContactByEmail(String Email);

    public void deleteByIds(List<Integer> ids);
}
