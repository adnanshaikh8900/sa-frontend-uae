package com.simplevat.constant.dbfilter;

import lombok.Getter;

public enum JournalFilterEnum {

    USER_ID("createdBy", "= :createdBy"),
    DELETE_FLAG("deleteFlag", "= :deleteFlag"),
    JOURNAL_DATE("journalDate", "= :journalDate"),
    REFERENCE_CODE("referenceCode", " like CONCAT(:referenceCode,'%')"),
    POSTING_REFERENCE_TYPE("postingReferenceType", "= :postingReferenceType"),
    DESCRIPTION("description", " like CONCAT(:description,'%')");

    @Getter
    String dbColumnName;

    @Getter
    String condition;

    private JournalFilterEnum(String dbColumnName) {
        this.dbColumnName = dbColumnName;
    }

    private JournalFilterEnum(String dbColumnName, String condition) {
        this.dbColumnName = dbColumnName;
        this.condition = condition;
    }

}
