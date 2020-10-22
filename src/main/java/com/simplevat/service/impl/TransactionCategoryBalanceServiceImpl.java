package com.simplevat.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.simplevat.service.TransactionCategoryClosingBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.TransactionCategoryBalanceDao;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.TransactionCategoryBalanceService;

@Service
public class TransactionCategoryBalanceServiceImpl extends TransactionCategoryBalanceService {

	@Autowired
	private TransactionCategoryBalanceDao transactionCategoryBalanceDao;

	@Autowired
	private TransactionCategoryClosingBalanceService transactionCategoryClosingBalanceService;

	@Override
	protected Dao<Integer, TransactionCategoryBalance> getDao() {
		return transactionCategoryBalanceDao;
	}

	@Override
	public PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> filterMap) {
		return transactionCategoryBalanceDao.getAll(filterMap);
	}

	@Override
	// TODO Remain for update completed create and delete
	// TODO Need to split this method as get amount and update TransactionCategoryBalance
	public synchronized BigDecimal updateRunningBalance(JournalLineItem lineItem) {
		List<TransactionCategoryBalance> balanceList = new ArrayList<>();
		if (lineItem != null) {
			TransactionCategory category = lineItem.getTransactionCategory();

			Map<String, Object> param = new HashMap<>();
			param.put("transactionCategory", category);

			TransactionCategoryBalance balance = getFirstElement(findByAttributes(param));

			if (balance == null) {
				balance = new TransactionCategoryBalance();
				balance.setTransactionCategory(category);
				balance.setCreatedBy(lineItem.getCreatedBy());
				balance.setOpeningBalance(lineItem.getCreditAmount()!=null?lineItem.getCreditAmount():lineItem.getDebitAmount());
				balance.setEffectiveDate(new Date());
			}

			boolean isDelated = lineItem.getDeleteFlag();
			boolean isDebit = (lineItem.getDebitAmount() != null && lineItem.getDebitAmount().intValue()!=0)
					? Boolean.TRUE
					: Boolean.FALSE;
			BigDecimal runningBalance = balance.getRunningBalance() != null ? balance.getRunningBalance()
					: BigDecimal.ZERO;
			if (!isDelated) {
				if (isDebit) {
					runningBalance = runningBalance
							.subtract(lineItem.getDebitAmount() != null ? lineItem.getDebitAmount() : BigDecimal.ZERO);
				} else {
					runningBalance = runningBalance
							.add(lineItem.getCreditAmount() != null ? lineItem.getCreditAmount() : BigDecimal.ZERO);
				}
			} else {
				if (isDebit) {
					runningBalance = runningBalance
							.add(lineItem.getDebitAmount() != null ? lineItem.getDebitAmount() : BigDecimal.ZERO);
				} else {
					runningBalance = runningBalance.subtract(
							lineItem.getCreditAmount() != null ? lineItem.getCreditAmount() : BigDecimal.ZERO);
				}
			}
			balance.setRunningBalance(runningBalance);
			balanceList.add(balance);
			transactionCategoryBalanceDao.update(balance);
			transactionCategoryClosingBalanceService.updateClosingBalance(lineItem);
			return balance.getRunningBalance();
		}

		return null;
	}

	public synchronized BigDecimal updateRunningBalanceAndOpeningBalance(JournalLineItem lineItem,Boolean updateOpeningBalance) {
		List<TransactionCategoryBalance> balanceList = new ArrayList<>();
		if (lineItem != null) {
			TransactionCategory category = lineItem.getTransactionCategory();

			Map<String, Object> param = new HashMap<>();
			param.put("transactionCategory", category);

			TransactionCategoryBalance balance = getFirstElement(findByAttributes(param));

			if (balance == null) {
				balance = new TransactionCategoryBalance();
				balance.setTransactionCategory(category);
				balance.setCreatedBy(lineItem.getCreatedBy());
				balance.setOpeningBalance(lineItem.getCreditAmount()!=null?lineItem.getCreditAmount():lineItem.getDebitAmount());
				balance.setRunningBalance(lineItem.getCreditAmount()!=null?lineItem.getCreditAmount():lineItem.getDebitAmount());
				balance.setEffectiveDate(new Date());
			}

			boolean isDelated = lineItem.getDeleteFlag();
			boolean isDebit = (lineItem.getDebitAmount() != null && lineItem.getDebitAmount().intValue()!=0)
					? Boolean.TRUE
					: Boolean.FALSE;
			BigDecimal runningBalance = balance.getRunningBalance() != null ? balance.getRunningBalance()
					: BigDecimal.ZERO;
			if (!isDelated) {
				if (isDebit) {
					runningBalance = runningBalance
							.subtract(lineItem.getDebitAmount() != null ? lineItem.getDebitAmount() : BigDecimal.ZERO);
				} else {
					runningBalance = runningBalance
							.add(lineItem.getCreditAmount() != null ? lineItem.getCreditAmount() : BigDecimal.ZERO);
				}
			} else {
				if (isDebit) {
					runningBalance = runningBalance
							.add(lineItem.getDebitAmount() != null ? lineItem.getDebitAmount() : BigDecimal.ZERO);
				} else {
					runningBalance = runningBalance.subtract(
							lineItem.getCreditAmount() != null ? lineItem.getCreditAmount() : BigDecimal.ZERO);
				}
			}
			balance.setRunningBalance(runningBalance);
			if(updateOpeningBalance&& runningBalance!=null && runningBalance.longValue()<0)
				balance.setOpeningBalance(runningBalance.negate());
			else if(updateOpeningBalance&& runningBalance!=null)
				balance.setOpeningBalance(runningBalance);
			balanceList.add(balance);
			transactionCategoryBalanceDao.update(balance);
			transactionCategoryClosingBalanceService.updateClosingBalance(lineItem);
			return balance.getRunningBalance();
		}
		return null;
	}
}
