package com.simplevat.service;

import java.util.List;
import java.util.Map;

import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.rest.financialreport.CreditDebitAggregator;
import com.simplevat.rest.financialreport.FinancialReportRequestModel;

public abstract class JournalLineItemService extends SimpleVatService<Integer, JournalLineItem> {

    public abstract void deleteByJournalId(Integer journalId);

    public abstract List<JournalLineItem> getList(ReportRequestModel reportRequestModel);

    public abstract Map<Integer, CreditDebitAggregator> getAggregateTransactionCategoryMap(FinancialReportRequestModel reportRequestModel);
}
