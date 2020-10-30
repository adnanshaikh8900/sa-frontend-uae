package com.simplevat.rest.rolecontroller;


import com.simplevat.entity.Role;
import com.simplevat.entity.SimplevatModules;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.model.RoleRequestModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.rest.transactioncategorycontroller.TransactionCategoryModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.RoleService;
import com.simplevat.service.impl.RoleServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class RoleModuleRestHelper {

    private final Logger logger = LoggerFactory.getLogger(RoleModuleRestHelper.class);

    @Autowired
    RoleService roleService;

    @Autowired
    RoleRequestModel roleRequestModel;

    @Autowired
    RoleServiceImpl roleServiceImpl;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    public Role getEntity(RoleRequestModel roleRequestModel,  HttpServletRequest request) {

        if (roleRequestModel!= null) {

        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            Role role = roleService.findByPK(roleRequestModel.getRoleID());
           if(roleRequestModel.getRoleName()!=null)
               role.setRoleName(roleRequestModel.getRoleName());
           if(roleRequestModel.getRoleDescription()!=null)
               role.setRoleDescription(roleRequestModel.getRoleDescription());

            return role;
        }
        return null;
    }
    public List<ModuleResponseModel> getModuleList(Object simplevatModules){
        List<ModuleResponseModel> moduleResponseModelList = new ArrayList<>();

        if (simplevatModules != null) {
            for (SimplevatModules modules : (List<SimplevatModules>) simplevatModules) {
                ModuleResponseModel moduleResponseModel = new ModuleResponseModel();
                if (modules.getSimplevatModuleId()!=null){
                moduleResponseModel.setModuleId(modules.getSimplevatModuleId());
                }
                if (modules.getSimplevatModuleName()!=null){
                    moduleResponseModel.setModuleName(modules.getSimplevatModuleName());
                }
                if (modules.getParentModule()!=null){
                    moduleResponseModel.setParentModuleId(modules.getParentModule().getSimplevatModuleId());

                }
                moduleResponseModelList.add(moduleResponseModel);
            }
            }
        return moduleResponseModelList;
    }
}
