package com.simplevat.service;


import com.simplevat.entity.SimplevatModules;

import java.util.List;

public abstract class RoleModuleService extends SimpleVatService<Integer, SimplevatModules> {

    public abstract List<SimplevatModules> getListOfSimplevatModules();

    public abstract List<SimplevatModules> getModuleListByRoleCode(Integer roleCode);
}
