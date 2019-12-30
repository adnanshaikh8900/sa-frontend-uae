package com.simplevat.dao.impl;

import com.simplevat.dao.ProjectDao;
import com.simplevat.entity.Product;
import com.simplevat.entity.Project;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ProjectFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.rest.DropdownModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Utkarsh Bhavsar on 20/03/17.
 */
@Repository
public class ProjectDaoImpl extends AbstractDao<Integer, Project> implements ProjectDao {

	@Override
    public List<Project> getProjectList(Map<ProjectFilterEnum, Object> filterMap) {
        List<DbFilter> dbFilters = new ArrayList();
        filterMap.forEach((projectFilter, value) -> dbFilters.add(DbFilter.builder()
                .dbCoulmnName(projectFilter.getDbColumnName())
                .condition(projectFilter.getCondition())
                .value(value).build()));
        List<Project> projects = this.executeQuery(dbFilters);
        return projects;
    }
    
    @Override
    public List<DropdownModel> getProjectsForDropdown() {
        List<DropdownModel> empSelectItemModels = getEntityManager()
                .createNamedQuery("projectsForDropdown", DropdownModel.class)
                .getResultList();
        return empSelectItemModels;
    }
	
    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                Project project = findByPK(id);
                project.setDeleteFlag(Boolean.TRUE);
                update(project);
            }
        }
    }

}
