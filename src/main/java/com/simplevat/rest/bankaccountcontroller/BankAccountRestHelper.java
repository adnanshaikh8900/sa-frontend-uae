package com.simplevat.rest.bankaccountcontroller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.service.*;
import com.simplevat.utils.DateFormatUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.DefaultTypeConstant;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.Currency;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.BankAccountStatus;
import com.simplevat.entity.bankaccount.BankAccountType;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.model.BankModel;
import com.simplevat.rest.PaginationResponseModel;

@Component
public class BankAccountRestHelper {

	@Autowired
	BankAccountService bankAccountService;

	@Autowired
	private DateFormatUtil dateUtil;

	@Autowired
	BankAccountStatusService bankAccountStatusService;

	@Autowired
	CurrencyService currencyService;

	@Autowired
	BankAccountTypeService bankAccountTypeService;

	@Autowired
	CountryService countryService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

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
				//model.setOpeningBalance(acc.getOpeningBalance() != null ? acc.getOpeningBalance().doubleValue() : 0);
				model.setOpeningBalance(acc.getCurrentBalance() != null ? acc.getCurrentBalance().doubleValue() : 0);
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
			if (bank.getBankCountry() != null) {
				bankModel.setBankCountry(bank.getBankCountry().getCountryCode());
			}
			return bankModel;
		}
		return null;
	}

	public BankAccount getEntity(BankModel bankModel) {
		BankAccount bankAccount = new BankAccount();

		if (bankModel.getBankAccountId() != null) {
			bankAccount = bankAccountService.findByPK(bankModel.getBankAccountId());
		}

		if (bankModel.getBankCountry() != null) {
			bankAccount.setBankCountry(countryService.getCountry(bankModel.getBankCountry()));
		}
		bankAccount.setAccountNumber(bankModel.getAccountNumber());
		bankAccount.setBankAccountName(bankModel.getBankAccountName());
		bankAccount.setBankName(bankModel.getBankName());
		bankAccount.setDeleteFlag(Boolean.FALSE);
		bankAccount.setIfscCode(bankModel.getIfscCode());
		bankAccount.setIsprimaryAccountFlag(bankModel.getIsprimaryAccountFlag());
		bankAccount.setOpeningBalance(bankModel.getOpeningBalance());
		bankAccount.setPersonalCorporateAccountInd(bankModel.getPersonalCorporateAccountInd().charAt(0));
		bankAccount.setSwiftCode(bankModel.getSwiftCode());
		bankAccount.setVersionNumber(1);

		if (bankModel.getBankAccountStatus() != null) {
			BankAccountStatus bankAccountStatus = bankAccountStatusService
					.getBankAccountStatus(bankModel.getBankAccountStatus());
			bankAccount.setBankAccountStatus(bankAccountStatus);
		}
		bankAccountCurrency(bankModel, bankAccount);

		if (bankModel.getBankAccountType() != null) {
			BankAccountType bankAccountType = bankAccountTypeService.getBankAccountType(bankModel.getBankAccountType());
			bankAccount.setBankAccountType(bankAccountType);
		}

		if (bankModel.getBankAccountId() == null || bankModel.getBankAccountId() == 0) {
			bankAccount.setCurrentBalance(bankModel.getOpeningBalance());
			BankAccountStatus bankAccountStatus = bankAccountStatusService.getBankAccountStatusByName("ACTIVE");
			bankAccount.setBankAccountStatus(bankAccountStatus);
		}
		// create transaction category with bankname-accout name

		if (bankAccount.getTransactionCategory() == null) {

			TransactionCategory bankCategory = transactionCategoryService
					.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.BANK.getCode());

			TransactionCategory category = new TransactionCategory();
			category.setChartOfAccount(bankCategory.getChartOfAccount());
			category.setEditableFlag(Boolean.TRUE);
			category.setSelectableFlag(Boolean.TRUE);
			category.setTransactionCategoryCode(transactionCategoryService
					.getNxtTransactionCatCodeByChartOfAccount(bankCategory.getChartOfAccount()));
			category.setTransactionCategoryName(bankModel.getBankName() + "-" + bankModel.getBankAccountName());
			category.setTransactionCategoryDescription(bankModel.getBankName() + "-" + bankModel.getBankAccountName());
			category.setParentTransactionCategory(bankCategory);
			category.setCreatedDate(LocalDateTime.now());
			category.setCreatedBy(bankModel.getCreatedBy());
			category.setDefaltFlag(DefaultTypeConstant.NO);
			transactionCategoryService.persist(category);
			bankAccount.setTransactionCategory(category);
		}
		return bankAccount;
	}

	public BankAccount getBankAccountByBankAccountModel(BankModel bankModel) {
		if (bankModel.getBankAccountId() != null) {
			BankAccount bankAccount = bankAccountService.getBankAccountById(bankModel.getBankAccountId());

			if (bankAccount == null) {
				bankAccount = new BankAccount();
			}

			if (bankModel.getBankCountry() != null) {
				bankAccount.setBankCountry(countryService.getCountry(bankModel.getBankCountry()));
			}
			bankAccount.setAccountNumber(bankModel.getAccountNumber());
			bankAccount.setBankAccountName(bankModel.getBankAccountName());
			bankAccount.setBankName(bankModel.getBankName());
			bankAccount.setIfscCode(bankModel.getIfscCode());
			bankAccount.setIsprimaryAccountFlag(bankModel.getIsprimaryAccountFlag());
			bankAccount.setOpeningBalance(bankModel.getOpeningBalance());
			bankAccount.setPersonalCorporateAccountInd(bankModel.getPersonalCorporateAccountInd().charAt(0));
			bankAccount.setSwiftCode(bankModel.getSwiftCode());
			bankAccount.setVersionNumber(
					bankAccount.getVersionNumber() != null ? 1 : (bankAccount.getVersionNumber() + 1));

			if (bankModel.getBankAccountStatus() != null) {
				BankAccountStatus bankAccountStatus = bankAccountStatusService
						.getBankAccountStatus(bankModel.getBankAccountStatus());
				bankAccount.setBankAccountStatus(bankAccountStatus);
			}
			bankAccountCurrency(bankModel, bankAccount);

			if (bankModel.getBankAccountType() != null) {
				BankAccountType bankAccountType = bankAccountTypeService
						.getBankAccountType(bankModel.getBankAccountType());
				bankAccount.setBankAccountType(bankAccountType);
			}

			if (bankModel.getBankAccountId() == null || bankModel.getBankAccountId() == 0) {
				bankAccount.setCurrentBalance(bankModel.getOpeningBalance());
				BankAccountStatus bankAccountStatus = bankAccountStatusService.getBankAccountStatusByName("ACTIVE");
				bankAccount.setBankAccountStatus(bankAccountStatus);
			}
			return bankAccount;
		}
		return null;
	}

	private void bankAccountCurrency(BankModel bankModel, BankAccount bankAccount) {
		if (bankModel.getBankAccountCurrency() != null) {
			Currency currency = currencyService.getCurrency(Integer.valueOf(bankModel.getBankAccountCurrency()));
			bankAccount.setBankAccountCurrency(currency);
		}
	}

	public TransactionCategoryBalance getOpeningBalanceEntity(BankAccount bankAccount) {

		TransactionCategoryBalance openingBalance = new TransactionCategoryBalance();
		openingBalance.setCreatedBy(bankAccount.getCreatedBy());
		openingBalance.setEffectiveDate(dateUtil.getDate());
		openingBalance.setRunningBalance(bankAccount.getOpeningBalance());
		openingBalance.setOpeningBalance(bankAccount.getOpeningBalance());
		openingBalance.setTransactionCategory(bankAccount.getTransactionCategory());
		openingBalance.setLastUpdateBy(bankAccount.getLastUpdatedBy());
		openingBalance.setDeleteFlag(bankAccount.getDeleteFlag());
		//openingBalance.setCreatedDate(bankAccount.getCreatedDate());
		//openingBalance.setLastUpdateDate(bankAccount.getLastUpdateDate());
		return  openingBalance;
	}

	public TransactionCategoryClosingBalance getClosingBalanceEntity(BankAccount bankAccount) {
		TransactionCategoryClosingBalance closingBalance = new TransactionCategoryClosingBalance();
		closingBalance.setClosingBalance(bankAccount.getOpeningBalance());
		closingBalance.setClosingBalanceDate(bankAccount.getCreatedDate());
		closingBalance.setCreatedBy(bankAccount.getCreatedBy());
		closingBalance.setOpeningBalance(bankAccount.getOpeningBalance());
		closingBalance.setEffectiveDate(dateUtil.getDate());
		closingBalance.setDeleteFlag(bankAccount.getDeleteFlag());
		//closingBalance.setCreatedDate(bankAccount.getCreatedDate());
		return  closingBalance;
	}
}
