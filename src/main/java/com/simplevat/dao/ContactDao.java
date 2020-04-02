package com.simplevat.dao;

import com.simplevat.constant.dbfilter.ContactFilterEnum;
import com.simplevat.entity.Contact;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.contactcontroller.ContactRequestFilterModel;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Created by mohsin on 3/3/2017.
 */
public interface ContactDao extends Dao<Integer, Contact> {

    public List<DropdownModel> getContactForDropdown(Integer contactType);

    public List<Contact> getAllContacts(Integer pageNo, Integer pageSize);
    
    public PaginationResponseModel getContactList(Map<ContactFilterEnum, Object> filterDataMap,PaginationModel paginationModel);

    public List<Contact> getContacts(ContactRequestFilterModel filterModel, Integer pageNo, Integer pageSize);

    public List<Contact> getContacts(Integer contactType, final String searchQuery, Integer pageNo, Integer pageSize);

    public Optional<Contact> getContactByEmail(String email);

    public void deleteByIds(List<Integer> ids);
}
