package com.simplevat.dao.impl;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.RoleModuleDao;
import com.simplevat.entity.RoleModuleRelation;
import com.simplevat.entity.SimplevatModules;
import com.simplevat.entity.bankaccount.TransactionCategory;
import org.springframework.stereotype.Repository;

import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RoleModuleDaoImpl extends AbstractDao<Integer, SimplevatModules> implements RoleModuleDao {
  @Override
  public List<SimplevatModules> getListOfSimplevatModules() {

        return this.executeNamedQuery("listOfSimplevatModules");
    }

    @Override
    public List<RoleModuleRelation> getModuleListByRoleCode(Integer roleCode){
     // return this.executeNamedQuery("moduleListByRoleCode");
      TypedQuery<RoleModuleRelation> query = getEntityManager().createQuery(
              "SELECT rm FROM RoleModuleRelation rm ,SimplevatModules sm,Role r WHERE sm.simplevatModuleId =" +
                      "rm.simplevatModule.simplevatModuleId AND r.roleCode=rm.role.roleCode AND rm.role.roleCode=:roleCode",
              RoleModuleRelation.class);
      query.setParameter("roleCode", roleCode);
      if (query.getResultList() != null && !query.getResultList().isEmpty()) {
        return query.getResultList();
      }
      return new ArrayList<>();
    }
}
