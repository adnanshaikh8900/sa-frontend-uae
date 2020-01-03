/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.EmployeeFilterEnum;
import com.simplevat.entity.Employee;
import com.simplevat.rest.DropdownModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.EmployeeService;

import io.swagger.annotations.ApiOperation;

import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 *
 * @author saurabhg 2/1/2020
 */
@RestController
@RequestMapping(value = "/rest/employee")
public class EmployeeController implements Serializable {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeHelper employeeHelper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @ApiOperation(value = "Get Product List")
    @GetMapping(value = "/getList")
    public ResponseEntity getEmployeeList(EmployeeRequestFilterModel filterModel) throws IOException {

        try {

            Map<EmployeeFilterEnum, Object> filterDataMap = new HashMap<EmployeeFilterEnum, Object>();
            filterDataMap.put(EmployeeFilterEnum.FIRST_NAME, filterModel.getName());
            filterDataMap.put(EmployeeFilterEnum.EMAIL, filterModel.getEmail());
            filterDataMap.put(EmployeeFilterEnum.DELETE_FLAG, false);

            List<Employee> employeeList = employeeService.getEmployeeList(filterDataMap);
            if (employeeList == null) {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(employeeHelper.getListModel(employeeList), HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @ApiOperation(value = "Delete Employee By ID")
    @DeleteMapping(value = "/delete")
    public ResponseEntity deleteEmployee(@RequestParam(value = "id") Integer id) {
        try {
            Employee employee = employeeService.findByPK(id);
            if (employee != null) {
                employee.setDeleteFlag(Boolean.TRUE);
                employeeService.update(employee, employee.getId());
            }
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Delete Employee in Bulk")
    @DeleteMapping(value = "/deletes")
    public ResponseEntity deleteProducts(@RequestBody DeleteModel ids) {
        try {
            employeeService.deleteByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @ApiOperation(value = "Get Employee By ID")
    @GetMapping(value = "/getById")
    public ResponseEntity getEmployeeById(@RequestParam(value = "id") Integer id) {
        try {
            Employee employee = employeeService.findByPK(id);
            if (employee == null) {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(employeeHelper.getModel(employee), HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Save new Employee")
    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody EmployeePersistModel employeePersistModel, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        try {
            Employee employee = employeeHelper.getEntity(employeePersistModel, userId);
            employee.setCreatedBy(userId);
            employee.setCreatedDate(LocalDateTime.now());
            employee.setDeleteFlag(Boolean.FALSE);
            employeeService.persist(employee);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Update Employee")
    @PostMapping(value = "/update")
    public ResponseEntity update(@RequestBody EmployeePersistModel employeePersistModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            Employee employee = employeeHelper.getEntity(employeePersistModel, userId);
            employee.setLastUpdateDate(LocalDateTime.now());
            employee.setLastUpdatedBy(userId);
            employeeService.update(employee);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/getEmployeesForDropdown")
    public ResponseEntity getEmployeesForDropdown() throws IOException {
        List<DropdownModel> dropdownModels = employeeService.getEmployeesForDropdown();
        return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
    }

//    @Deprecated
//    @GetMapping(value = "/getEmployeeById")
//    public ResponseEntity getContactById(@RequestParam("employeeId") Integer employeeId) throws IOException {
//        EmployeeListModel employeePersistModel = employeeHelper.getModel(employeeService.findByPK(employeeId));
//        return new ResponseEntity<>(employeePersistModel, HttpStatus.OK);
//    }
//
//    @Deprecated
//    @GetMapping(value = "/getEmployeeByEmailId")
//    public ResponseEntity getContactById(@RequestParam("emailId") String emailId) throws IOException {
//        Optional<Employee> optional = employeeService.getEmployeeByEmail(emailId);
//        if (optional.isPresent()) {
//            EmployeeListModel employeePersistModel = employeeHelper
//                    .getModel(employeeService.getEmployeeByEmail(emailId).get());
//            return new ResponseEntity<>(employeePersistModel, HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
}
