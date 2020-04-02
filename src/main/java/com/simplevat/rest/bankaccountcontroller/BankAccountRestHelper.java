package com.simplevat.rest.bankaccountcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.model.BankModel;
import com.simplevat.rest.PaginationResponseModel;

@Component
public class BankAccountRestHelper {

	public PaginationResponseModel getListModel(PaginationResponseModel pagiantionResponseModel) {

		List<BankAccountListModel> modelList = new ArrayList<>();

		if (pagiantionResponseModel != null && pagiantionResponseModel.getData() != null) {
			List<BankAccount> bankAccounts = (List<BankAccount>) pagiantionResponseModel.getData();
			for (BankAccount acc : bankAccounts) {
				BankAccountListModel model = new BankAccountListModel();
				model.setBankAccountId(acc.getBankAccountId());
				model.setAccounName(acc.getBankAccountName());
				model.setBankAccountNo(acc.getAccountNumber());
				model.setBankAccountTypeName(
						acc.getBankAccountType() != null ? acc.getBankAccountType().getName() : "-");
				model.setCurrancyName(
						acc.getBankAccountCurrency() != null ? acc.getBankAccountCurrency().getCurrencyIsoCode() : "-");
				model.setName(acc.getBankName());
				model.setOpeningBalance(acc.getOpeningBalance() != null ? acc.getOpeningBalance().doubleValue() : 0);

				modelList.add(model);
			}
			pagiantionResponseModel.setData(modelList);

		}
		return pagiantionResponseModel;
	}

	public BankModel getModel(BankAccount bank) {

		if (bank != null) {
			BankModel bankModel = new BankModel();

			bankModel.setBankAccountId(bank.getBankAccountId());
			if (bank.getBankCountry() != null) {
				bankModel.setBankCountry(bank.getBankCountry().getCountryCode());

				bankModel.setAccountNumber(bank.getAccountNumber());
				bankModel.setBankAccountName(bank.getBankAccountName());
				bankModel.setBankName(bank.getBankName());
				bankModel.setIfscCode(bank.getIfscCode());
				bankModel.setIsprimaryAccountFlag(bank.getIsprimaryAccountFlag());
				bankModel.setOpeningBalance(bank.getOpeningBalance());
				bankModel.setPersonalCorporateAccountInd(bank.getPersonalCorporateAccountInd().toString());
				bankModel.setSwiftCode(bank.getSwiftCode());

				if (bank.getBankAccountStatus() != null) {
					bankModel.setBankAccountStatus(bank.getBankAccountStatus().getBankAccountStatusCode());
				}
				if (bank.getBankAccountCurrency() != null) {
					bankModel.setBankAccountCurrency(bank.getBankAccountCurrency().getCurrencyCode().toString());
				}

				if (bank.getBankAccountType() != null) {
					bankModel.setBankAccountType(bank.getBankAccountType().getId());
				}
			}
			return bankModel;
		}
		return null;
	}
}
