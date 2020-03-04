package com.simplevat.rest.bankaccountcontroller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.rest.PaginationResponseModel;

@Component
public class BankAccountRestHelper {

	public PaginationResponseModel getListModel(PaginationResponseModel pagiantionResponseModel) {

		List<BankAccountListModel> modelList = new ArrayList<BankAccountListModel>();

		if (pagiantionResponseModel != null) {

			if (pagiantionResponseModel.getData() != null) {
				List<BankAccount> bankAccounts = (List<BankAccount>) pagiantionResponseModel.getData();
				for (BankAccount acc : bankAccounts) {
					BankAccountListModel model = new BankAccountListModel();
					model.setBankAccountId(acc.getBankAccountId());
					model.setAccounName(acc.getBankAccountName());
					model.setBankAccountNo(acc.getAccountNumber());
					model.setBankAccountTypeName(
							acc.getBankAccountType() != null ? acc.getBankAccountType().getName() : "-");
					model.setCurrancyName(
							acc.getBankAccountCurrency() != null ? acc.getBankAccountCurrency().getCurrencyIsoCode()
									: "-");
					model.setName(acc.getBankName());
					model.setOpeningBalance(
							acc.getOpeningBalance() != null ? acc.getOpeningBalance().doubleValue() : 0);

					modelList.add(model);
				}
				pagiantionResponseModel.setData(modelList);
			}
		}
		return pagiantionResponseModel;
	}
}
