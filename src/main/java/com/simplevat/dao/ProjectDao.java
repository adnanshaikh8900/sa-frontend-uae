package com.simplevat.dao;

import com.simplevat.constant.dbfilter.ProjectFilterEnum;
import com.simplevat.entity.Project;
import java.util.List;
import java.util.Map;

/**
 * Created by Utkarsh Bhavsar on 20/03/17.
 */
public interface ProjectDao extends Dao<Integer, Project> {

    public void deleteByIds(List<Integer> ids);

	public List<Project> getProjectList(Map<ProjectFilterEnum, Object> filterMap);

}
