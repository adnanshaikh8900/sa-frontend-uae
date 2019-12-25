package com.simplevat.service.impl;

import com.simplevat.dao.ContactDao;
import com.simplevat.dao.Dao;
import com.simplevat.entity.Contact;
import com.simplevat.service.ContactService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by mohsin on 3/3/2017.
 */
@Service("contactService")
@Transactional
public class ContactServiceImpl extends ContactService {
    
    @Autowired
    private ContactDao contactDao;
    
    @Override
    public List<Contact> getContacts(Integer contactType, Integer pageIndex, Integer noOfRecorgs) {
        return this.contactDao.getContacts(contactType, pageIndex, noOfRecorgs);
    }
    
    @Override
    public List<Contact> getContacts(Integer contactType, final String searchQuery) {
        return contactDao.getContacts(contactType, searchQuery);
    }
    
    @Override
    public Dao<Integer, Contact> getDao() {
        return this.contactDao;
    }
    
    @Override
    public Optional<Contact> getContactByEmail(String Email) {
        return contactDao.getContactByEmail(Email);
    }
    
    @Override
    public void deleleByIds(List<Integer> ids) {
        contactDao.deleteByIds(ids);
    }
}
