package com.simplevat.rest.journalcontroller;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import lombok.Data;

@Data
public class JournalModel {

    private Integer journalId;
    private String description;
    private Date journalDate;
    private String referenceCode;
    private BigDecimal subTotalDebitAmount;
    private BigDecimal subTotalCreditAmount;
    private BigDecimal totalCreditAmount;
    private BigDecimal totalDebitAmount;
    private String createdByName;
    private Integer currencyCode;
    private List<JournalLineItemRequestModel> journalLineItems;
}
