package com.simplevat.dao;

import com.simplevat.constant.RoleCode;
import com.simplevat.entity.SimplevatModules;

import java.util.List;

public interface RoleModuleDao extends Dao<Integer,SimplevatModules > {

public List<SimplevatModules> getListOfSimplevatModules();
public List<SimplevatModules> getModuleListByRoleCode(Integer roleCode);
}
