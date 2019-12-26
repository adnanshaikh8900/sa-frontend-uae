package com.simplevat.rest.projectcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.simplevat.entity.Project;

@Service
public class ProjectRestHelper {

	public List<ProjectListModel> getListModel(List<Project> projectList) {
        List<ProjectListModel> projectListModels = new ArrayList();
        for (Project project : projectList) {
            ProjectListModel projectModel = new ProjectListModel();
            BeanUtils.copyProperties(project, projectModel);
            projectListModels.add(projectModel);
        }
        return projectListModels;
    }
}
