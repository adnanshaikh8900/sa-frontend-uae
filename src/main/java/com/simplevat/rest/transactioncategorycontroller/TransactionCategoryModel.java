/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncategorycontroller;

import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author daynil
 */
@Getter
@Setter
public class TransactionCategoryModel {

    private Integer transactionCategoryId;
    private String transactionCategoryName;
    private String transactionCategoryDescription;
    private String transactionCategoryCode;
    private Integer transactionTypeId;
    private String transactionTypeName;
    private Integer parentTransactionCategoryId;
    private Integer vatCategoryId;
    private Character defaltFlag;
    private Integer orderSequence;
    private Integer createdBy;
    private LocalDateTime createdDate;
    private Integer lastUpdatedBy;
    private LocalDateTime lastUpdateDate;
    private Boolean deleteFlag = Boolean.FALSE;
    private Integer versionNumber;
}
