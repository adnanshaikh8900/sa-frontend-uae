package com.simplevat.rest.rolecontroller;

import com.simplevat.entity.Role;
import com.simplevat.entity.RoleModuleRelation;
import com.simplevat.entity.SimplevatModules;
import com.simplevat.model.RoleRequestModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.RoleModuleRelationService;
import com.simplevat.service.RoleModuleService;
import com.simplevat.service.RoleService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping("rest/roleModule")
public class RoleModuleController {
    private final Logger logger = LoggerFactory.getLogger(RoleModuleController.class);
    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    RoleModuleRelationService roleModuleRelationService;

    @Autowired
    RoleModuleService roleModuleService;

    @Autowired
    RoleService roleService;

    @Autowired
    RoleModuleRestHelper roleModuleRestHelper;

    @ApiOperation(value = "Get Module List")
    @GetMapping(value = "/getListForAllRoles")
    public ResponseEntity getModuleList(){
//        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest();
        List<ModuleResponseModel> response  = new ArrayList<>();
        List<RoleModuleRelation> modulesList=roleModuleRelationService.getListOfSimplevatModulesForAllRoles();
        if (modulesList != null) {
            response = roleModuleRestHelper.getModuleListForAllRoles(modulesList);
        }
        return new ResponseEntity (response, HttpStatus.OK);

    }

    @ApiOperation(value = "Get Module List")
    @GetMapping(value = "/getList")
    public ResponseEntity getModuleList(HttpServletRequest request, Integer roleCode){
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        List<ModuleResponseModel> response  = new ArrayList<>();
        List<SimplevatModules> modulesList=roleModuleService.getListOfSimplevatModules();
        if (modulesList != null) {
            response = roleModuleRestHelper.getModuleList(modulesList);
        }
        return new ResponseEntity (response, HttpStatus.OK);

      }

    @ApiOperation(value = "Get Module List By RoleCode")
    @GetMapping(value = "/getModuleListByRoleCode")
    public ResponseEntity getModuleListByRoleCode(@RequestParam int roleCode){
        List<ModuleResponseModel> response  = new ArrayList<>();
        List<SimplevatModules> modulesList=roleModuleService.getModuleListByRoleCode(roleCode);
        if (modulesList != null) {
            response = roleModuleRestHelper.getModuleList(modulesList);
        }
        return new ResponseEntity (response, HttpStatus.OK);

    }

    @ApiOperation(value = "Add New User Role")
    @PostMapping(value = "/save")
    public ResponseEntity<String> save(@RequestBody RoleRequestModel roleRequestModel,
                                       HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

            Role role = new Role();
            role.setDefaultFlag('N');
            role.setDeleteFlag(false);
            role.setVersionNumber(1);
            role.setRoleName(roleRequestModel.getRoleName());
            role.setRoleDescription(roleRequestModel.getRoleDescription());
            role.setCreatedBy(userId);
            role.setCreatedDate(new Date());
            roleService.persist(role);
            List<Integer> roleModuleIdList = roleRequestModel.getModuleListIds();
            if (roleModuleIdList!=null){
                for (Integer moduleId:roleModuleIdList){
                    SimplevatModules simplevatModule =roleModuleService.findByPK(moduleId);
                    RoleModuleRelation roleModuleRelation = new RoleModuleRelation();
                    roleModuleRelation.setRole(role);
                    roleModuleRelation.setSimplevatModule(simplevatModule);
                    roleModuleRelationService.persist(roleModuleRelation);
                }

            }
            return new ResponseEntity<>("Saved successful",HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ERROR, e);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiOperation(value = "Update Role")
    @PostMapping(value = "/update")
    public ResponseEntity<String> update(@RequestBody RoleRequestModel roleRequestModel,
                                         HttpServletRequest request) {
    Role role = null;
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            role = roleModuleRestHelper.getEntity(roleRequestModel,request);
            roleService.update(role);
            List<Integer> roleModuleIdList = roleRequestModel.getModuleListIds();
            if (roleModuleIdList!=null){
                for (Integer moduleId:roleModuleIdList){
                    SimplevatModules simplevatModule =roleModuleService.findByPK(moduleId);
                    RoleModuleRelation roleModuleRelation = new RoleModuleRelation();
                    roleModuleRelation.setRole(role);
                    roleModuleRelation.setSimplevatModule(simplevatModule);
                    roleModuleRelationService.persist(roleModuleRelation);
                }
            }
            return new ResponseEntity<>("Updated successful",HttpStatus.OK);
        } catch (Exception e) {
            logger.info("NO DATA FOUND = INTERNAL_SERVER_ERROR");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation(value = "Delete Role")
    @DeleteMapping(value = "/delete")
    public ResponseEntity<String> deleteUser(@RequestParam(value = "roleCode") Integer roleCode) {
        Role role = roleService.findByPK(roleCode);
        try {
            if (role == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                role.setDeleteFlag(true);
                roleService.update(role);

            }
            return new ResponseEntity<>("Deleted Successful",HttpStatus.OK);

        } catch (Exception e) {
            logger.error("Error", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }


}

