/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.projectcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.ProjectFilterEnum;
import com.simplevat.entity.Project;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.ProjectService;

import io.swagger.annotations.ApiOperation;

import com.simplevat.security.JwtTokenUtil;
import java.io.IOException;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
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

/**
 *
 * @author Sonu
 *
 *         Modified by saurabh 26/12/19
 */
@RestController
@RequestMapping(value = "/rest/project")
public class ProjectController implements Serializable {

	private final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

	@Autowired
	private ProjectService projectService;

	@Autowired
	private ProjectRestHelper projectRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get Project By ID")
	@GetMapping(value = "/getProjectById")
	public ResponseEntity getProductById(@RequestParam(value = "id") Integer id) {
		Project project = projectService.findByPK(id);
		if (project == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(projectRestHelper.getRequestModel(project), HttpStatus.OK);
		}

	}

	@ApiOperation(value = "Get Project List")
	@GetMapping(value = "/getList")
	public ResponseEntity getProductList(ProjectRequestFilterModel filterModel, HttpServletRequest request) {
		Map<ProjectFilterEnum, Object> filterDataMap = new HashMap();
		filterDataMap.put(ProjectFilterEnum.USER_ID, filterModel.getUserId());
		filterDataMap.put(ProjectFilterEnum.PROJECT_ID, filterModel.getProjectId());
		filterDataMap.put(ProjectFilterEnum.PROJECT_NAME, filterModel.getProjectName());
		filterDataMap.put(ProjectFilterEnum.VAT_REGISTRATION_NUMBER, filterModel.getVatRegistrationNumber());
		filterDataMap.put(ProjectFilterEnum.REVENUE_BUDGET, filterModel.getRevenueBudget());
		filterDataMap.put(ProjectFilterEnum.EXPENSE_BUDGET, filterModel.getExpenseBudget());
		filterDataMap.put(ProjectFilterEnum.DELETE_FLAG, filterModel.isDeleteFlag());
		filterDataMap.put(ProjectFilterEnum.ORDER_BY, ORDERBYENUM.DESC);

		PaginationResponseModel response = projectService.getProjectList(filterDataMap, filterModel);
		if (response == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		response.setData(projectRestHelper.getListModel(response.getData()));
		return new ResponseEntity(response, HttpStatus.OK);
	}

	@GetMapping(value = "/getProjectsForDropdown")
	public ResponseEntity getContactsForDropdown() throws IOException {
		List<DropdownModel> dropdownModels = projectService.getProjectsForDropdown();
		return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
	}

	@ApiOperation(value = "Delete Project By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteProject(@RequestParam(value = "id") Integer id) throws Exception {
		try {
			Project project = projectService.findByPK(id);

			if (project == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			} else {
				project.setDeleteFlag(Boolean.TRUE);
				projectService.update(project);
				return new ResponseEntity<>(HttpStatus.OK);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Delete Project in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteProjects(@RequestBody DeleteModel ids) throws Exception {
		try {
			projectService.deleteByIds(ids.getIds());
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@PostMapping(value = "/save")
	public ResponseEntity saveProject(@RequestBody ProjectRequestModel projectRequestModel, HttpServletRequest request)
			throws Exception {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		Project project = projectRestHelper.getEntity(projectRequestModel);
		project.setCreatedBy(userId);
		project.setCreatedDate(LocalDateTime.now());
		projectService.persist(project);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@ApiOperation(value = "Update Product")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody ProjectRequestModel projectRequestModel, HttpServletRequest request) {
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		Project project = projectRestHelper.getEntity(projectRequestModel);
		project.setLastUpdateDate(LocalDateTime.now());
		project.setLastUpdateBy(userId);
		projectService.update(project);
		return new ResponseEntity(HttpStatus.OK);
	}

}
