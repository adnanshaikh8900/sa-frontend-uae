package com.simplevat.rest.bankaccountcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.simplevat.entity.bankaccount.BankAccount;

@Component
public class BankAccountRestHelper {

	public List<BankAccountListModel> getListModel(List<BankAccount> bankAccounts) {

		List<BankAccountListModel> modelList = new ArrayList<BankAccountListModel>();

		if (bankAccounts != null && bankAccounts.size() > 0) {
			for (BankAccount acc : bankAccounts) {

				BankAccountListModel model = new BankAccountListModel();

				model.setBankAccountId(acc.getBankAccountId());
				model.setAccounName(acc.getBankAccountName());
				model.setBankAccountNo(acc.getAccountNumber());
				model.setBankAccountTypeName(
						acc.getBankAccountType() != null ? acc.getBankAccountType().getName() : "-");
				model.setCurrancyName(
						acc.getBankAccountCurrency() != null ? acc.getBankAccountCurrency().getCurrencyIsoCode()  : "-");
				model.setName(acc.getBankName());
				model.setOpeningBalance(acc.getOpeningBalance() != null ? acc.getOpeningBalance().doubleValue() : 0);

				modelList.add(model);
			}
		}

		return modelList;
	}
}
