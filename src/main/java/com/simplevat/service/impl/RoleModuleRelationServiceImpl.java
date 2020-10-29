package com.simplevat.service.impl;


import com.simplevat.dao.Dao;
import com.simplevat.dao.RoleModuleRelationDao;
import com.simplevat.entity.RoleModuleRelation;
import com.simplevat.service.RoleModuleRelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class RoleModuleRelationServiceImpl extends RoleModuleRelationService {
    @Autowired
    RoleModuleRelationDao roleModuleRelationDao;

    @Override
    public Dao<Integer, RoleModuleRelation> getDao() {
        return roleModuleRelationDao;
    }

}
