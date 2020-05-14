package com.simplevat.dao.impl;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.UserDao;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.persistence.Query;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.entity.User;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import java.util.ArrayList;
import javax.persistence.TypedQuery;
import org.springframework.transaction.annotation.Transactional;

@Repository(value = "userDao")
public class UserDaoImpl extends AbstractDao<Integer, User> implements UserDao {

	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

	public Optional<User> getUserByEmail(String emailAddress) {
		Query query = this.getEntityManager().createQuery("SELECT u FROM User AS u WHERE u.userEmail =:email");
		query.setParameter("email", emailAddress);
		List resultList = query.getResultList();
		if (CollectionUtils.isNotEmpty(resultList) && resultList.size() == 1) {
			return Optional.of((User) resultList.get(0));
		}
		return Optional.empty();
	}

	public User getUserEmail(String emailAddress) {
		TypedQuery<User> query = this.getEntityManager()
				.createQuery("SELECT u FROM User AS u WHERE u.userEmail =:email", User.class);
		query.setParameter("email", emailAddress);
		List<User> resultList = query.getResultList();
		if (resultList != null && !resultList.isEmpty()) {
			return resultList.get(0);
		} else {
			return null;
		}
	}

	@Override
	public boolean getUserByEmail(String usaerName, String password) {
		TypedQuery<User> query = getEntityManager().createQuery(
				"SELECT u FROM User u WHERE u.userEmail =:userEmail AND u.password =:password", User.class);
		query.setParameter("userEmail", usaerName);
		query.setParameter("password", password);
		User user = query.getSingleResult();
		return user != null;
	}

	@Override
	public List<User> getAllUserNotEmployee() {
		TypedQuery<User> query = this.getEntityManager()
				.createQuery("SELECT u FROM User AS u WHERE u.employeeId IS NULL", User.class);
		List<User> resultList = query.getResultList();
		if (resultList != null && !resultList.isEmpty()) {
			return resultList;
		} else {
			return new ArrayList<>();
		}
	}

	@Override
	@Transactional
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				User user = findByPK(id);
				user.setDeleteFlag(Boolean.TRUE);
				update(user);
			}
		}
	}

	@Override
	public PaginationResponseModel getUserList(Map<UserFilterEnum, Object> filterMap, PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(dataTableUtil.getColName(paginationModel.getSortingCol(), DatatableSortingFilterConstant.USER));
		return new PaginationResponseModel(this.getResultCount(dbFilters),
				this.executeQuery(dbFilters, paginationModel));
	}
}
