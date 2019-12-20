package com.simplevat.service;

import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.entity.Project;
import java.math.BigDecimal;

import java.util.List;

public abstract class ProjectService extends SimpleVatService<Integer, Project> {

    public abstract List<Project> getProjectsByCriteria(ProjectCriteria projectCriteria) throws Exception;

//    public abstract void updateProjectExpenseBudget(BigDecimal expenseAmount, Project project);

    public abstract void updateProjectRevenueBudget(BigDecimal revenueAmount, Project project);

    public abstract void deleteByIds(List<Integer> ids);
}
