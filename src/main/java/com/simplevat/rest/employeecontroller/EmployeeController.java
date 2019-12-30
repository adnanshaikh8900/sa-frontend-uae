/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import com.simplevat.entity.Employee;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.DropdownModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.EmployeeService;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
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

    @GetMapping(value = "/getEmployeeList")
    public ResponseEntity getEmployeeList(PaginationModel paginationModel) throws IOException {
        if (paginationModel == null) {
            paginationModel = new PaginationModel();
        }
        List<EmployeeListModel> employeeListModels = new ArrayList<>();
        List<Employee> employeeList = employeeService.getEmployees(paginationModel.getPageNo(), paginationModel.getPageSize());
        employeeList.forEach(employee -> employeeListModels.add(employeeHelper.getListModel(employee)));
        return new ResponseEntity<>(employeeListModels, HttpStatus.OK);
    }
    
    @GetMapping(value = "/getEmployeesForDropdown")
    public ResponseEntity getEmployeesForDropdown() throws IOException {
        List<DropdownModel> dropdownModels = employeeService.getEmployeesForDropdown();
        return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
    }

    @GetMapping(value = "/getEmployeeById")
    public ResponseEntity getContactById(@RequestParam("employeeId") Integer employeeId) throws IOException {
        EmployeePersistModel employeePersistModel = employeeHelper.getEmployeePersistModel(employeeService.findByPK(employeeId));
        return new ResponseEntity<>(employeePersistModel, HttpStatus.OK);
    }

    @GetMapping(value = "/getEmployeeByEmailId")
    public ResponseEntity getContactById(@RequestParam("emailId") String emailId) throws IOException {
        Optional<Employee> optional = employeeService.getEmployeeByEmail(emailId);
        if (optional.isPresent()) {
            EmployeePersistModel employeePersistModel = employeeHelper.getEmployeePersistModel(employeeService.getEmployeeByEmail(emailId).get());
            return new ResponseEntity<>(employeePersistModel, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    
    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody EmployeePersistModel employeePersistModel, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        try {
            if (employeePersistModel.getId() != null && employeePersistModel.getId() > 0) {
                employeeService.update(employeeHelper.getEntity(employeePersistModel, userId));
            } else {
                employeeService.persist(employeeHelper.getEntity(employeePersistModel, userId));
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
