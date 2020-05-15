package com.simplevat.dao.impl;

import com.simplevat.constant.CommonConstant;
import com.simplevat.constant.CommonColumnConstants;
import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.ContactFilterEnum;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ContactDao;
import com.simplevat.entity.Contact;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.contactcontroller.ContactRequestFilterModel;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
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

	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

	@Override
	public List<DropdownModel> getContactForDropdown(Integer contactType) {
		String query = "SELECT new " + CommonConstant.DROPDOWN_MODEL_PACKAGE
				+ "(c.contactId , CONCAT(c.firstName, ' ', c.middleName, ' ', c.lastName)) "
				+ " FROM Contact c where c.deleteFlag = FALSE ";
		if (contactType != null && !contactType.toString().isEmpty()) {
			query += " and c.contactType = :contactType ";
		}
		query += " order by c.firstName, c.lastName ";
		TypedQuery<DropdownModel> typedQuery = getEntityManager().createQuery(query, DropdownModel.class);
		if (contactType != null && !contactType.toString().isEmpty()) {
			typedQuery.setParameter(CommonColumnConstants.CONTACT_TYPE, contactType);
		}
		return typedQuery.getResultList();
	}

	@Override
	public List<Contact> getContacts(ContactRequestFilterModel filterModel, Integer pageNo, Integer pageSize) {
		TypedQuery<Contact> typedQuery = getEntityManager().createNamedQuery(CommonColumnConstants.CONTACT_BY_TYPE, Contact.class);
		if (filterModel.getContactType() != null) {
			typedQuery.setParameter(CommonColumnConstants.CONTACT_TYPE, filterModel.getContactType());
		}
		if (filterModel.getName() != null) {
			typedQuery.setParameter(CommonColumnConstants.FIRST_NAME, filterModel.getName());
		}
		if (filterModel.getEmail() != null) {
			typedQuery.setParameter(CommonColumnConstants.EMAIL, filterModel.getEmail());
		}
		typedQuery.setMaxResults(pageSize);
		typedQuery.setFirstResult(pageNo * pageSize);
		return typedQuery.getResultList();
	}

	@Override
	public PaginationResponseModel getContactList(Map<ContactFilterEnum, Object> filterDataMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList<>();
		filterDataMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(dataTableUtil.getColName(paginationModel.getSortingCol(), DatatableSortingFilterConstant.CONTACT));
		return new PaginationResponseModel(this.getResultCount(dbFilters),
				this.executeQuery(dbFilters, paginationModel));
	}

	@Override
	public List<Contact> getAllContacts(Integer pageNo, Integer pageSize) {
		return getEntityManager().createNamedQuery(CommonColumnConstants.ALL_CONTACT, Contact.class).setMaxResults(pageSize)
				.setFirstResult(pageNo * pageSize).getResultList();
	}

	@Override
	public List<Contact> getContacts(Integer contactType, final String searchQuery, Integer pageNo, Integer pageSize) {
		return getEntityManager().createNamedQuery(CommonColumnConstants.CONTACT_BY_NAMES, Contact.class)
				.setParameter(CommonColumnConstants.NAME, "%" + searchQuery + "%").setParameter(CommonColumnConstants.CONTACT_TYPE, contactType)
				.setMaxResults(pageSize).setFirstResult(pageNo * pageSize).getResultList();
	}

	@Override
	public Optional<Contact> getContactByEmail(String email) {
		Query query = getEntityManager().createNamedQuery(CommonColumnConstants.CONTACT_BY_EMAIL, Contact.class).setParameter("email",
				email);
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
