package com.simplevat.service;

import com.simplevat.constant.dbfilter.EmployeeFilterEnum;
import com.simplevat.entity.Employee;
import com.simplevat.rest.DropdownModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public abstract class EmployeeService extends SimpleVatService<Integer, Employee> {

    public abstract List<DropdownModel> getEmployeesForDropdown();

    public abstract List<Employee> getEmployees(Integer pageNo, Integer pageSize);

    public abstract List<Employee> getEmployees(final String searchQuery, Integer pageNo, Integer pageSize);

    public abstract Optional<Employee> getEmployeeByEmail(String email);

    public abstract List<Employee> getEmployeeList(Map<EmployeeFilterEnum, Object> filterMap);

    public abstract void deleteByIds(ArrayList<Integer> ids);
}
