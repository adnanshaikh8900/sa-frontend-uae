package com.simplevat.rest.journalcontroller;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class JournalRequestModel implements Serializable{
	private Integer id;
	private Date journalDate;
	private String referenceCode;
	private String description;
	private Integer currencyCode;
	private BigDecimal subTotalDebitAmount;
	private BigDecimal totalDebitAmount;
	private BigDecimal totalCreditAmount;
	private BigDecimal subTotalCreditAmount;
	private List<JournalLineItemRequestModel> journalLineItems;
	private Integer createdBy;
	private LocalDateTime createdDate;
	private Integer lastUpdatedBy;
	private LocalDateTime lastUpdateDate;
	private Boolean deleteFlag = Boolean.FALSE;

}
