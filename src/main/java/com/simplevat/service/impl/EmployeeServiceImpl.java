package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.EmployeeFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.EmployeeDao;
import com.simplevat.entity.Employee;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.EmployeeService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Uday on 26/12/2019.
 */
@Service("employeeService")
@Transactional
public class EmployeeServiceImpl extends EmployeeService {

    @Autowired
    private EmployeeDao employeeDao;
    
    @Override
    public List<DropdownModel> getEmployeesForDropdown() {
        return employeeDao.getEmployeesForDropdown();
    }

    @Override
    public List<Employee> getEmployees(Integer pageNo, Integer pageSize) {
        return employeeDao.getEmployees(pageNo, pageSize);
    }

    @Override
    public List<Employee> getEmployees(String searchQuery, Integer pageNo, Integer pageSize) {
        return employeeDao.getEmployees(searchQuery, pageNo, pageSize);
    }

    @Override
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeDao.getEmployeeByEmail(email);
    }

    @Override
    protected Dao<Integer, Employee> getDao() {
        return this.employeeDao;
    }
    
    @Override
    public PaginationResponseModel getEmployeeList(Map<EmployeeFilterEnum, Object> filterMap,PaginationModel paginationModel){
    	return employeeDao.getEmployeeList( filterMap,paginationModel);
    }

	@Override
	public void deleteByIds(ArrayList<Integer> ids) {
		employeeDao. deleteByIds(ids);
	}

}
