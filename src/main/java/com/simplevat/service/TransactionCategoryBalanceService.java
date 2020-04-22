package com.simplevat.service;

import java.util.Collection;
import java.util.Map;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.rest.PaginationResponseModel;

public abstract class TransactionCategoryBalanceService extends SimpleVatService<Integer, TransactionCategoryBalance> {

	public abstract PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> dataMap);

	public abstract void updateRunningBalance(Collection<JournalLineItem> lineItems);

}
