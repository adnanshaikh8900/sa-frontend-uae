package com.simplevat.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.constant.dbfilter.ProjectFilterEnum;
import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.criteria.ProjectFilter;
import com.simplevat.dao.Dao;
import com.simplevat.dao.ProjectDao;
import com.simplevat.entity.Product;
import com.simplevat.entity.Project;
import com.simplevat.service.ProjectService;
import java.math.BigDecimal;

/**
 * Created by Utkarsh Bhavsar on 21/03/17.
 */
@Service("projectService")
public class ProjectServiceImpl extends ProjectService {

    @Autowired
    private ProjectDao projectDao;

    @Override
    @Transactional(readOnly = true)
    public List<Project> getProjectsByCriteria(ProjectCriteria projectCriteria) throws Exception {
        ProjectFilter filter = new ProjectFilter(projectCriteria);
        return getDao().filter(filter);
    }

    @Override
    public Dao<Integer, Project> getDao() {
        return projectDao;
    }

//    @Override
//    public void updateProjectExpenseBudget(BigDecimal expenseAmount, Project project) {
//        if (project.getProjectExpenseBudget() != null) {
//            project.setProjectExpenseBudget(project.getProjectExpenseBudget().add(expenseAmount));
//        } else {
//            project.setProjectExpenseBudget(expenseAmount);
//        }
//        update(project);
//    }

    @Override
    public void updateProjectRevenueBudget(BigDecimal revenueAmount, Project project) {
        if (project.getProjectRevenueBudget() != null) {
            project.setProjectRevenueBudget(project.getProjectRevenueBudget().add(revenueAmount));
        } else {
            project.setProjectRevenueBudget(revenueAmount);
        }
        update(project);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        projectDao.deleteByIds(ids);
    }

	@Override
	public List<Project> getProjectList(Map<ProjectFilterEnum, Object> filterMap) {
		return projectDao.getProjectList(filterMap);
	}
}
