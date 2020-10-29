package com.simplevat.dao.impl;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.RoleModuleDao;
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
    public List<SimplevatModules> getModuleListByRoleCode(Integer roleCode){
     // return this.executeNamedQuery("moduleListByRoleCode");
      TypedQuery<SimplevatModules> query = getEntityManager().createQuery(
              "SELECT sm FROM SimplevatModules sm ,RoleModuleRelation rm WHERE sm.simplevatModuleId =" +
                      "rm.simplevatModule.simplevatModuleId AND rm.role.roleCode=:roleCode",
              SimplevatModules.class);
      query.setParameter("roleCode", roleCode);
      if (query.getResultList() != null && !query.getResultList().isEmpty()) {
        return query.getResultList();
      }
      return new ArrayList<>();
    }
}
