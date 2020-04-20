package com.simplevat.rest.transactioncategorybalancecontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.exceptions.ServiceException;
import com.simplevat.service.TransactionCategoryBalanceService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.exceptions.ServiceErrorCode;
import com.simplevat.utils.DateFormatUtil;

@Component
public class TransactionCategoryBalanceRestHelper {

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;

	@Autowired
	private DateFormatUtil dateUtil;

	public TransactionCategoryBalance getEntity(TransactioncategoryBalancePersistModel persistModel) {

		if (persistModel == null) {
			throw new ServiceException("NO DATA AVAILABLE", ServiceErrorCode.BadRequest);
		}

		TransactionCategory category = transactionCategoryService.findByPK(persistModel.getTransactionCategoryId());
		if (category == null) {
			throw new ServiceException("NO DATA AVAILABLE", ServiceErrorCode.RecordDoesntExists);
		}

		TransactionCategoryBalance transactionCategoryBalance = new TransactionCategoryBalance();

		if (persistModel.getTransactionCategoryBalanceId() != null) {
			transactionCategoryBalance = transactionCategoryBalanceService
					.findByPK(persistModel.getTransactionCategoryBalanceId());
		}

		transactionCategoryBalance.setTransactionCategory(category);
		transactionCategoryBalance.setOpeningBalance(persistModel.getOpeningBalance());
		transactionCategoryBalance
				.setEffectiveDate(dateUtil.getDateStrAsDate(persistModel.getEffectiveDate(), "dd/MM/yyyy"));

		return transactionCategoryBalance;
	}
}
