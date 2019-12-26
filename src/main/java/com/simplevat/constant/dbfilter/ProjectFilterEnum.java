package com.simplevat.constant.dbfilter;

import lombok.Getter;

/**
 * 
 * @author  saurabh 26/12/19
 *
 */

public enum ProjectFilterEnum {

    PROJECT_ID("projectId", " = :projectId"),
    PROJECT_NAME("projectNamee", " like '%:projectName%'"),
    DELETE_FLAG("deleteFlag", " = :deleteFlag"),   
    USER_ID("createdBy", "= :createdBy");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

    private ProjectFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }

    private ProjectFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }

}
