/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

/**
 *
 * @author sonu
 */
@Data
public class TransactionPresistModel implements Serializable {

    private Date transactionDate;
    private String transactionDescription;
    private BigDecimal transactionAmount;
    @NotNull
    private Integer transactionTypeCode;
    private Integer transactionCategoryId;
    @NotNull
    private Integer bankAccountId;
    private Integer projectId;
    private String receiptNumber;
    private String attachementDescription;
    private MultipartFile attachment;

}
