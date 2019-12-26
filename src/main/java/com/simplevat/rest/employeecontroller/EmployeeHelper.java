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
import java.time.LocalDateTime;
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

    public EmployeeListModel getListModel(Employee employee) {
        return EmployeeListModel.builder()
                .id(employee.getId())
                .email(employee.getEmail())
                .firstName(employee.getFirstName())
                .middleName(employee.getMiddleName())
                .lastName(employee.getLastName())
                .mobileNumber(employee.getMobileNumber()).build();

    }

    public Employee getEntity(EmployeePersistModel employeePersistModel, Integer userId) {
        Employee employee = new Employee();
        employee.setId(employeePersistModel.getId());
        if (employeePersistModel.getCountryId() != null) {
            employee.setCountry(countryService.getCountry(employeePersistModel.getCountryId()));
        }

        employee.setEmail(employeePersistModel.getEmail());
        employee.setFirstName(employeePersistModel.getFirstName());
        employee.setMiddleName(employeePersistModel.getMiddleName());
        employee.setLastName(employeePersistModel.getLastName());
        employee.setMobileNumber(employeePersistModel.getMobileNumber());
        employee.setPostZipCode(employeePersistModel.getPostZipCode());
        employee.setAddressLine1(employeePersistModel.getAddressLine1());
        employee.setAddressLine2(employeePersistModel.getAddressLine2());
        employee.setAddressLine3(employeePersistModel.getAddressLine3());
        if (employeePersistModel.getId() != null) {
            employee.setCreatedBy(userId);
            employee.setCreatedDate(LocalDateTime.now());
        } else {
            employee.setLastUpdatedBy(userId);
            employee.setLastUpdateDate(LocalDateTime.now());
        }
        return employee;
    }

    public EmployeePersistModel getEmployeePersistModel(Employee employee) {
        EmployeePersistModel.EmployeePersistModelBuilder builder = EmployeePersistModel.builder()
                .id(employee.getId())
                .email(employee.getEmail())
                .firstName(employee.getFirstName())
                .middleName(employee.getMiddleName())
                .lastName(employee.getLastName())
                .mobileNumber(employee.getMobileNumber())
                .postZipCode(employee.getPostZipCode())
                .addressLine1(employee.getAddressLine1())
                .addressLine2(employee.getAddressLine2())
                .addressLine3(employee.getAddressLine3());

        if (employee.getCountry() != null) {
            builder.countryId(employee.getCountry().getCountryCode());
        }

        return builder.build();
    }

}
