package com.simplevat.rest.journalcontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

import lombok.Data;

@Data
public class JournalRequestModel {
	private Integer id;
	private Date journalDate;
	private String journlReferenceCode;
	private String journalDescription;
	private Integer currencyCode;
	private BigDecimal subTotalDebitAmount;
	private BigDecimal totalDebitAmount;
	private BigDecimal TotalCreditAmount;
	private BigDecimal subTotalCreditAmount;
	private String journalLineItem;
	private Integer createdBy;
	private LocalDateTime createdDate;
	private Integer lastUpdatedBy;
	private LocalDateTime lastUpdateDate;
	private Boolean deleteFlag = Boolean.FALSE;

}
