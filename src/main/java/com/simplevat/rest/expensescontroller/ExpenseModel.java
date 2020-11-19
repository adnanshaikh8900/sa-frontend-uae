/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.expensescontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import com.simplevat.constant.PayMode;

/**
 *
 * @author daynil
 */
@Data
public class ExpenseModel {

	private Integer expenseId;
	private BigDecimal expenseAmount;
	private Date expenseDate;
	private String expenseDescription;
	private String receiptNumber;
	private Integer expenseCategory;
	private Integer currencyCode;
	private BigDecimal exchangeRate;
	private Integer employeeId;
	private Integer projectId;
	private String receiptAttachmentDescription;
	private MultipartFile attachmentFile;
	private String fileName;
	private String payee;
	private Integer userId;
	private Integer createdBy;
	private LocalDateTime createdDate;
	private Integer lastUpdatedBy;
	private LocalDateTime lastUpdateDate;
	private boolean deleteFlag = false;
	private Integer versionNumber;
	private String receiptAttachmentPath;
	private Integer vatCategoryId;
	private PayMode payMode;
	private Integer bankAccountId;
}
