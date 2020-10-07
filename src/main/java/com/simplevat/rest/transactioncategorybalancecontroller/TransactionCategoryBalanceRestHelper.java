package com.simplevat.rest.transactioncategorybalancecontroller;

import java.util.ArrayList;
import java.util.List;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
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
		transactionCategoryBalance.setRunningBalance(
				transactionCategoryBalance.getRunningBalance() != null ? transactionCategoryBalance.getRunningBalance()
						: persistModel.getOpeningBalance());
		transactionCategoryBalance
				.setEffectiveDate(dateUtil.getDateStrAsDate(persistModel.getEffectiveDate(), "dd/MM/yyyy"));

		return transactionCategoryBalance;
	}

	public List<TransactionCategoryBalanceListModel> getList(List<TransactionCategoryBalance> balaneList) {

		if (balaneList != null && !balaneList.isEmpty()) {

			List<TransactionCategoryBalanceListModel> modelList = new ArrayList<>();

			for (TransactionCategoryBalance balance : balaneList) {
				if(balance.getTransactionCategory().getTransactionCategoryCode()
						.equalsIgnoreCase(TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_ASSETS.getCode())
						||balance.getTransactionCategory().getTransactionCategoryCode()
						.equalsIgnoreCase(TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode())
						||balance.getTransactionCategory().getChartOfAccount().getChartOfAccountCode()
						.equalsIgnoreCase(ChartOfAccountCategoryCodeEnum.BANK.getCode()))
					continue;
				TransactionCategoryBalanceListModel model = new TransactionCategoryBalanceListModel();
				model.setTransactionCategoryId(balance.getTransactionCategory().getTransactionCategoryId());
				model.setTransactionCategoryBalanceId(balance.getId());
				model.setEffectiveDate(dateUtil.getDateAsString(balance.getEffectiveDate(), "dd/MM/yyyy"));
				model.setOpeningBalance(balance.getOpeningBalance());
				model.setRunningBalance(balance.getRunningBalance());
				model.setTransactionCategoryName(balance.getTransactionCategory().getTransactionCategoryName());
				modelList.add(model);
			}
			return modelList;
		}
		return new ArrayList<>();
	}
}
