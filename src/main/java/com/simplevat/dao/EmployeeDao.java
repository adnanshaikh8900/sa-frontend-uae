package com.simplevat.dao;

import com.simplevat.entity.Employee;
import com.simplevat.rest.DropdownModel;

import java.util.List;
import java.util.Optional;

public interface EmployeeDao extends Dao<Integer, Employee> {

    public List<DropdownModel> getEmployeesForDropdown();
    
    public List<Employee> getEmployees(Integer pageNo, Integer pageSize);

    public List<Employee> getEmployees(final String searchQuery, Integer pageNo, Integer pageSize);

    public Optional<Employee> getEmployeeByEmail(String email);
}
