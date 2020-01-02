package com.simplevat.dao.impl;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.EmployeeFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.EmployeeDao;
import com.simplevat.entity.Employee;
import com.simplevat.rest.DropdownModel;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.persistence.Query;
import org.apache.commons.collections4.CollectionUtils;

/**
 * Created by Uday on 26/12/2019.
 */
@Repository(value = "employeeDao")
public class EmployeeDaoImpl extends AbstractDao<Integer, Employee> implements EmployeeDao {

	@Override
	public List<DropdownModel> getEmployeesForDropdown() {
		List<DropdownModel> empSelectItemModels = getEntityManager()
				.createNamedQuery("employeesForDropdown", DropdownModel.class).getResultList();
		return empSelectItemModels;
	}

	@Override
	public List<Employee> getEmployees(String searchQuery, Integer pageNo, Integer pageSize) {
		List<Employee> employees = getEntityManager().createNamedQuery("employeesByName", Employee.class)
				.setParameter("name", "%" + searchQuery + "%").setMaxResults(pageSize).setFirstResult(pageNo * pageSize)
				.getResultList();
		return employees;
	}

	@Override
	public List<Employee> getEmployees(Integer pageNo, Integer pageSize) {
		List<Employee> employees = getEntityManager().createNamedQuery("allEmployees", Employee.class)
				.setMaxResults(pageSize).setFirstResult(pageNo * pageSize).getResultList();
		return employees;
	}

	@Override
	public Optional<Employee> getEmployeeByEmail(String email) {
		Query query = getEntityManager().createNamedQuery("employeeByEmail", Employee.class).setParameter("email",
				email);
		List resultList = query.getResultList();
		if (CollectionUtils.isNotEmpty(resultList) && resultList.size() == 1) {
			return Optional.of((Employee) resultList.get(0));
		}
		return Optional.empty();
	}

	@Override
	public List<Employee> getEmployeeList(Map<EmployeeFilterEnum, Object> filterMap) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		List<Employee> empList = this.executeQuery(dbFilters);
		return empList;

	}

	@Override
	public void deleteByIds(ArrayList<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Employee employee = findByPK(id);
				employee.setDeleteFlag(Boolean.TRUE);
				update(employee);
			}
		}
	}

}
