/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.projectcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ProjectFilterEnum;
import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Project;
import com.simplevat.entity.Title;
import com.simplevat.rest.contactController.ContactHelper;
import com.simplevat.service.ContactService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.TitleService;

import io.swagger.annotations.ApiOperation;

import com.simplevat.contact.model.ContactModel;
import com.simplevat.security.JwtTokenUtil;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
 * Modified by saurabh 26/12/19
 */
@RestController
@RequestMapping(value = "/rest/project")
public class ProjectController implements Serializable {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProjectRestHelper projectRestHelper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @ApiOperation(value = "Get Project List")
    @PostMapping(value = "/getList")
    public ResponseEntity getProductList(ProjectRequestFilterModel filterModel, HttpServletRequest request) {
        Map<ProjectFilterEnum, Object> filterDataMap = new HashMap();
        filterDataMap.put(ProjectFilterEnum.USER_ID, filterModel.getUserId());
        filterDataMap.put(ProjectFilterEnum.PROJECT_ID, filterModel.getProductId());
        filterDataMap.put(ProjectFilterEnum.PROJECT_NAME, filterModel.getProjectName());
        filterDataMap.put(ProjectFilterEnum.DELETE_FLAG, filterModel.isDeleteFlag());
        List<Project> products = projectService.getProjectList(filterDataMap);
        if (products == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(projectRestHelper.getListModel(products), HttpStatus.OK);
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
            e.printStackTrace();
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
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(value = "/save")
    public ResponseEntity saveProject(@RequestBody Project project, HttpServletRequest request)
            throws Exception {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        if (project.getProjectId() != null && project.getProjectId() > 0) {
            project.setLastUpdateBy(userId);
            project.setLastUpdateDate(LocalDateTime.now());
            projectService.update(project);
        } else {
            project.setCreatedBy(userId);
            project.setCreatedDate(LocalDateTime.now());
            projectService.persist(project);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
