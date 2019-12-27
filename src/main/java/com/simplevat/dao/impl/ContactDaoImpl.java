package com.simplevat.dao.impl;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ContactDao;
import com.simplevat.entity.Contact;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.contactController.ContactRequestFilterModel;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import org.apache.commons.collections4.CollectionUtils;

/**
 * Created by mohsin on 3/3/2017.
 */
@Repository(value = "contactDao")
public class ContactDaoImpl extends AbstractDao<Integer, Contact> implements ContactDao {

    @Override
    public List<DropdownModel> getContactForDropdown(Integer contactType) {
        List<DropdownModel> empSelectItemModels = getEntityManager()
                .createNamedQuery("contactForDropdown", DropdownModel.class)
                .setParameter("contactType", contactType)
                .getResultList();
        return empSelectItemModels;
    }

    @Override
    public List<Contact> getContacts(ContactRequestFilterModel filterModel, Integer pageNo, Integer pageSize) {
        TypedQuery<Contact> typedQuery = getEntityManager().createNamedQuery("contactsByType", Contact.class);
        if (filterModel.getContactType() != null) {
            typedQuery.setParameter("contactType", filterModel.getContactType());
        }
        if (filterModel.getName() != null) {
            typedQuery.setParameter("firstName", filterModel.getName());
        }
        if (filterModel.getContactType() != null) {
            typedQuery.setParameter("email", filterModel.getEmail());
        }
        typedQuery.setMaxResults(pageSize);
        typedQuery.setFirstResult(pageNo * pageSize);
        return typedQuery.getResultList();
    }

    @Override
    public List<Contact> getAllContacts(Integer pageNo, Integer pageSize) {
        List<Contact> contacts = getEntityManager().createNamedQuery("allContacts", Contact.class)
                .setMaxResults(pageSize)
                .setFirstResult(pageNo * pageSize).getResultList();
        return contacts;
    }

    @Override
    public List<Contact> getContacts(Integer contactType, final String searchQuery, Integer pageNo, Integer pageSize) {
        List<Contact> contacts = getEntityManager()
                .createNamedQuery("Contact.contactsByName", Contact.class)
                .setParameter("name", "%" + searchQuery + "%")
                .setParameter("contactType", contactType)
                .setMaxResults(pageSize)
                .setFirstResult(pageNo * pageSize).getResultList();
        return contacts;
    }

    @Override
    public Optional<Contact> getContactByEmail(String Email) {
        Query query = getEntityManager()
                .createNamedQuery("Contact.contactByEmail", Contact.class)
                .setParameter("email", Email);
        List resultList = query.getResultList();
        if (CollectionUtils.isNotEmpty(resultList) && resultList.size() == 1) {
            return Optional.of((Contact) resultList.get(0));
        }
        return Optional.empty();
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                Contact contact = findByPK(id);
                contact.setDeleteFlag(Boolean.TRUE);
                update(contact);
            }
        }
    }

}
