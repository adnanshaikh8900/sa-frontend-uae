package com.simplevat.service.impl;

import com.simplevat.dao.Dao;
import com.simplevat.dao.RoleModuleDao;
import com.simplevat.entity.Role;
import com.simplevat.entity.SimplevatModules;
import com.simplevat.service.RoleModuleService;
import com.simplevat.service.SimpleVatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("roleModuleService")
public class RoleModuleServiceImpl extends RoleModuleService {

@Autowired
RoleModuleDao roleModuleDao;
    @Override
    public List<SimplevatModules> getListOfSimplevatModules() {
      return   roleModuleDao.getListOfSimplevatModules();
    }
    @Override
    public  List<SimplevatModules> getModuleListByRoleCode(Integer roleCode){
        return  roleModuleDao.getModuleListByRoleCode(roleCode);
    }
    @Override
    public Dao<Integer, SimplevatModules> getDao() {

        return roleModuleDao;
    }
}


