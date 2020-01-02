/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import com.simplevat.rest.contactController.*;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Employee;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.EmployeeService;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author admin
 */
@Component
public class EmployeeHelper {

	@Autowired
	CountryService countryService;

	@Autowired
	CurrencyService currencyService;
	
	@Autowired
	private EmployeeService employeeService; 

	public List<EmployeeListModel> getListModel(List<Employee> employeList) {

		List<EmployeeListModel> employeeListModels = new ArrayList<>();
		/*
		 * return EmployeeListModel.builder() .id(employee.getId())
		 * .email(employee.getEmail()) .firstName(employee.getFirstName())
		 * .middleName(employee.getMiddleName()) .lastName(employee.getLastName())
		 * .mobileNumber(employee.getMobileNumber()).build();
		 * 
		 */

		for (Employee employee : employeList) {

			EmployeeListModel empModel = new EmployeeListModel();

			empModel.setId(employee.getId());
			empModel.setFirstName(employee.getFirstName());
			empModel.setMiddleName(employee.getMiddleName());
			empModel.setLastName(employee.getLastName());
			empModel.setEmail(employee.getEmail());
			empModel.setDob(employee.getDob());
			empModel.setReferenceCode(employee.getReferenceCode());

			employeeListModels.add(empModel);
		}

		return employeeListModels;
	}

	public Employee getEntity(EmployeePersistModel employeePersistModel, Integer userId) {
		Employee employee = new Employee();
		employee.setId(employeePersistModel.getId());
		
		if(employeePersistModel.getId() != null) {
			employee = employeeService.findByPK(employeePersistModel.getId()); 
		}
		/*
		 * if (employeePersistModel.getCountryId() != null) {
		 * employee.setCountry(countryService.getCountry(employeePersistModel.
		 * getCountryId())); }
		 */
		employee.setEmail(employeePersistModel.getEmail());
		employee.setFirstName(employeePersistModel.getFirstName());
		employee.setMiddleName(employeePersistModel.getMiddleName());
		employee.setLastName(employeePersistModel.getLastName());
		// employee.setMobileNumber(employeePersistModel.getMobileNumber());
		// employee.setPostZipCode(employeePersistModel.getPostZipCode());
		// employee.setAddressLine1(employeePersistModel.getAddressLine1());
		// employee.setAddressLine2(employeePersistModel.getAddressLine2());
		// employee.setAddressLine3(employeePersistModel.getAddressLine3());
		if (employeePersistModel.getId() != null) {
			employee.setCreatedBy(userId);
			employee.setCreatedDate(LocalDateTime.now());
		} else {
			employee.setLastUpdatedBy(userId);
			employee.setLastUpdateDate(LocalDateTime.now());
		}

		employee.setTitle(employeePersistModel.getTitle());
		// employee.setReferalCode(employeePersistModel.getReferenceCode());
		employee.setPassword(employeePersistModel.getPassword());
		if (employeePersistModel.getDob() != null) {
			LocalDateTime dob = Instant.ofEpochMilli(employeePersistModel.getDob().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			employee.setDob(dob);
		}
		employee.setBillingEmail(employeePersistModel.getBillingEmail());
		employee.setPoBoxNumber(employeePersistModel.getPoBoxNumber());
		employee.setReferenceCode(employeePersistModel.getReferenceCode());
		employee.setVatRegistrationNo(employeePersistModel.getVatRegestationNo());
		if (employeePersistModel.getCurrencyCode() != null) {
			employee.setCurrency(currencyService.getCurrency(employeePersistModel.getCurrencyCode()));
		}

		return employee;
	}

	public EmployeeListModel getModel(Employee employee) {

		if (employee != null) {
			EmployeeListModel empModel = new EmployeeListModel();

			empModel.setId(employee.getId());
			empModel.setReferenceCode(employee.getReferenceCode());
			empModel.setTitle(employee.getTitle());
			empModel.setEmail(employee.getEmail());
			empModel.setFirstName(employee.getFirstName());
			empModel.setMiddleName(employee.getMiddleName());
			empModel.setLastName(employee.getLastName());
			empModel.setPassword(employee.getPassword());
			empModel.setDob(employee.getDob());
			empModel.setBillingEmail(employee.getBillingEmail());
			empModel.setPoBoxNumber(employee.getPoBoxNumber());
			empModel.setVatRegestationNo(employee.getVatRegistrationNo());
			if (employee.getCurrency() != null) {
				empModel.setCurrencyCode(employee.getCurrency().getCurrencyCode());
			}

			return empModel;
		}
		return null;
	}

}
