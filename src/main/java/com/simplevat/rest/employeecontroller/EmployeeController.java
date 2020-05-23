package com.simplevat.rest.employeecontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.EmployeeFilterEnum;
import com.simplevat.entity.Employee;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.EmployeeService;

import io.swagger.annotations.ApiOperation;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Sonu
 *
 * @author saurabhg 2/1/2020
 */
@RestController
@RequestMapping(value = "/rest/employee")
public class EmployeeController {

	private final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private EmployeeHelper employeeHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get Product List")
	@GetMapping(value = "/getList")
	public ResponseEntity<PaginationResponseModel> getEmployeeList(EmployeeRequestFilterModel filterModel){

		try {

			Map<EmployeeFilterEnum, Object> filterDataMap = new EnumMap<>(EmployeeFilterEnum.class);
			filterDataMap.put(EmployeeFilterEnum.FIRST_NAME, filterModel.getName());
			filterDataMap.put(EmployeeFilterEnum.EMAIL, filterModel.getEmail());
			filterDataMap.put(EmployeeFilterEnum.DELETE_FLAG, false);

			PaginationResponseModel response = employeeService.getEmployeeList(filterDataMap, filterModel);
			if (response == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			} else {
				response.setData(employeeHelper.getListModel(response.getData()));
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@ApiOperation(value = "Delete Employee By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteEmployee(@RequestParam(value = "id") Integer id) {
		try {
			Employee employee = employeeService.findByPK(id);
			if (employee != null) {
				employee.setDeleteFlag(Boolean.TRUE);
				employeeService.update(employee, employee.getId());
			}
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
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
			logger.error(ERROR, e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Employee By ID")
	@GetMapping(value = "/getById")
	public ResponseEntity<EmployeeListModel> getEmployeeById(@RequestParam(value = "id") Integer id) {
		try {
			Employee employee = employeeService.findByPK(id);
			if (employee == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<>(employeeHelper.getModel(employee), HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Save new Employee")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@RequestBody EmployeePersistModel employeePersistModel, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		try {
			Employee employee = employeeHelper.getEntity(employeePersistModel, userId);
			employee.setCreatedBy(userId);
			employee.setCreatedDate(LocalDateTime.now());
			employee.setDeleteFlag(Boolean.FALSE);
			employeeService.persist(employee);
			return new ResponseEntity<>("Saaved Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Employee")
	@PostMapping(value = "/update")
	public ResponseEntity<String> update(@RequestBody EmployeePersistModel employeePersistModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Employee employee = employeeHelper.getEntity(employeePersistModel, userId);
			employee.setLastUpdateDate(LocalDateTime.now());
			employee.setLastUpdatedBy(userId);
			employeeService.update(employee);
			return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/getEmployeesForDropdown")
	public ResponseEntity<List<DropdownModel>> getEmployeesForDropdown() {
		return new ResponseEntity<>(employeeService.getEmployeesForDropdown(), HttpStatus.OK);
	}
}
