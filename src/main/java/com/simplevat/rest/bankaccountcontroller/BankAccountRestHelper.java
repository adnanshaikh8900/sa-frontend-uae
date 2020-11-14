package com.simplevat.rest.bankaccountcontroller;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.*;
import com.simplevat.entity.Currency;
import com.simplevat.entity.bankaccount.*;
import com.simplevat.service.*;
import com.simplevat.service.bankaccount.ReconcileStatusService;
import com.simplevat.utils.DateFormatUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.DefaultTypeConstant;
import com.simplevat.constant.TransactionCategoryCodeEnum;
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
	ReconcileStatusService reconcileStatusService;

	@Autowired
	BankAccountTypeService bankAccountTypeService;

	@Autowired
	CountryService countryService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;


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
				List<ReconcileStatus> reconcileStatusList = reconcileStatusService.getAllReconcileStatusListByBankAccountId(acc.getBankAccountId());
				if(reconcileStatusList != null && !reconcileStatusList.isEmpty())
				{
					ReconcileStatus reconcileStatus = reconcileStatusList.get(0);
					model.setReconcileDate(dateUtil.getLocalDateTimeAsString(reconcileStatus.getReconciledDate(), "dd-MM-yyyy"));
					model.setClosingBalance(reconcileStatus.getClosingBalance());
				}
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
			bankModel.setCurrentBalance(bank.getCurrentBalance());
			if (bank.getOpeningDate() != null) {
				LocalDateTime openingDate = bank.getOpeningDate();
				openingDate = LocalDateTime.ofInstant(openingDate.toInstant(ZoneOffset.UTC),ZoneId.of(System.getProperty("simplevat.user.timezone","Asia/Dubai")));
				bankModel.setOpeningDate(openingDate);
			}
			if (bank.getBankAccountStatus() != null) {
				bankModel.setBankAccountStatus(bank.getBankAccountStatus().getBankAccountStatusCode());
			}
			if (bank.getBankAccountCurrency() != null) {
				bankModel.setBankAccountCurrency(bank.getBankAccountCurrency().getCurrencyCode());
			}

			if (bank.getBankAccountType() != null) {
				bankModel.setBankAccountType(bank.getBankAccountType().getId());
			}
			if (bank.getBankCountry() != null) {
				bankModel.setBankCountry(bank.getBankCountry().getCountryCode());
			}
			List<ReconcileStatus> reconcileStatusList = reconcileStatusService.getAllReconcileStatusListByBankAccountId(bankModel.getBankAccountId());
			if(reconcileStatusList != null && !reconcileStatusList.isEmpty()) {
				ReconcileStatus reconcileStatus = reconcileStatusList.get(0);
				if (reconcileStatus.getReconciledDate()!=null){
					//	Date date = Date.from(reconcileStatus.getReconciledDate().atZone(ZoneId.systemDefault()).toInstant());
					bankModel.setLastReconcileDate(reconcileStatus.getReconciledDate());
				}

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
		if (bankModel.getOpeningDate()!= null) {
//			//LocalDateTime openingDate = Instant.ofEpochMilli(bankModel.getOpeningDate().getTime())
//					.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
//					.toLocalDateTime();
			bankAccount.setOpeningDate(bankModel.getOpeningDate());
		}
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
			category.setEditableFlag(Boolean.FALSE);
			category.setSelectableFlag(Boolean.FALSE);
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
//	private void openingDate(BankModel bankModel, BankAccount bankAccount) {
//		if (bankModel.getOpeningDate()!= null) {
//			LocalDateTime openingDate = Instant.ofEpochMilli(bankModel.getOpeningDate().getTime())
//					.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
//					.toLocalDateTime();
//			bankAccount.setOpeningDate(openingDate);
//		}
//	}

	public BankAccount getBankAccountByBankAccountModel(BankModel bankModel) {
		if (bankModel.getBankAccountId() != null) {
			BankAccount bankAccount = bankAccountService.getBankAccountById(bankModel.getBankAccountId());
        	if (bankModel.getBankCountry() != null) {
				bankAccount.setBankCountry(countryService.getCountry(bankModel.getBankCountry()));
			}
			bankAccount.setAccountNumber(bankModel.getAccountNumber());
			bankAccount.setBankAccountName(bankModel.getBankAccountName());
			bankAccount.setBankName(bankModel.getBankName());
			bankAccount.setIfscCode(bankModel.getIfscCode());
			bankAccount.setIsprimaryAccountFlag(bankModel.getIsprimaryAccountFlag());
			BigDecimal actualOpeningBalance = bankModel.getOpeningBalance().subtract(bankAccount.getOpeningBalance());
			bankModel.setActualOpeningBalance(actualOpeningBalance);
			bankAccount.setOpeningBalance(bankAccount.getOpeningBalance().add(actualOpeningBalance));
			bankAccount.setCurrentBalance(bankAccount.getCurrentBalance().add(actualOpeningBalance));
			bankAccount.setPersonalCorporateAccountInd(bankModel.getPersonalCorporateAccountInd().charAt(0));
			bankAccount.setSwiftCode(bankModel.getSwiftCode());
			bankAccount.setVersionNumber(
					bankAccount.getVersionNumber() != null ? 1 : (bankAccount.getVersionNumber() + 1));
			if (bankModel.getOpeningDate()!= null) {
				bankAccount.setOpeningDate(bankModel.getOpeningDate());
			}
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

	public TransactionCategoryBalance getOpeningBalanceEntity(BankAccount bankAccount,TransactionCategory transactionCategory) {
		Map<String,Object> filterMap = new HashMap<String,Object>();
		filterMap.put("transactionCategory",transactionCategory);
		List<TransactionCategoryBalance> transactionCategoryBalanceList = transactionCategoryBalanceService.findByAttributes(filterMap);
		TransactionCategoryBalance openingBalance =null;
		if(transactionCategoryBalanceList!=null && transactionCategoryBalanceList.size()>0)
		{
			return transactionCategoryBalanceList.get(0);
			//////openingBalance.setOpeningBalance(bankAccount.getOpeningBalance());
			//////openingBalance.setRunningBalance(bankAccount.getCurrentBalance());
		}
		else {
			openingBalance = new TransactionCategoryBalance();
			openingBalance.setCreatedBy(bankAccount.getCreatedBy());
			openingBalance.setEffectiveDate(dateUtil.getDate());
			openingBalance.setRunningBalance(bankAccount.getOpeningBalance());
			openingBalance.setOpeningBalance(bankAccount.getOpeningBalance());
			openingBalance.setTransactionCategory(transactionCategory);
			openingBalance.setLastUpdateBy(bankAccount.getLastUpdatedBy());
			openingBalance.setDeleteFlag(bankAccount.getDeleteFlag());
		}
		return  openingBalance;
	}
	public Transaction getBankBalanceFromClosingBalance(BankModel bankModel, TransactionCategoryClosingBalance closingBalance
	,Character debitCreditFlag) {
		BigDecimal transactionAmount = BigDecimal.ZERO;
		if (bankModel.getOpeningBalance() != null) {
			transactionAmount = bankModel.getOpeningBalance();
			BigDecimal closingBalanceAmount = closingBalance.getOpeningBalance();
			transactionAmount = transactionAmount.subtract(closingBalanceAmount);
		}
		Transaction transaction = new Transaction();
		LocalDateTime journalDate = closingBalance.getClosingBalanceDate();
		transaction.setDebitCreditFlag(debitCreditFlag);
		transaction.setCreatedBy(closingBalance.getCreatedBy());
		transaction.setTransactionDate(journalDate);
		transaction.setTransactionAmount(transactionAmount);
		transaction.setExplainedTransactionCategory(closingBalance.getTransactionCategory());
		return transaction;
	}
	public TransactionCategory getValidTransactionCategory(TransactionCategory transactionCategory) {
		String transactionCategoryCode = transactionCategory.getChartOfAccount().getChartOfAccountCode();
		ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnum(transactionCategoryCode);
		if (chartOfAccountCategoryCodeEnum == null)
			return null;
		switch (chartOfAccountCategoryCodeEnum) {
			case ACCOUNTS_RECEIVABLE:
			case BANK:
			case CASH:
			case CURRENT_ASSET:
			case FIXED_ASSET:
			case OTHER_CURRENT_ASSET:
			case STOCK:
				return transactionCategoryService
						.findTransactionCategoryByTransactionCategoryCode(
								TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode());
			case OTHER_LIABILITY:
			case OTHER_CURRENT_LIABILITIES:
			case EQUITY:
				return transactionCategoryService
						.findTransactionCategoryByTransactionCategoryCode(
								TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_ASSETS.getCode());
		}
		return transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode());
	}
	public TransactionCategoryClosingBalance getClosingBalanceEntity(BankAccount bankAccount, TransactionCategory transactionCategory) {
		TransactionCategoryClosingBalance closingBalance = new TransactionCategoryClosingBalance();
		closingBalance.setClosingBalance(bankAccount.getOpeningBalance());
		closingBalance.setClosingBalanceDate(bankAccount.getOpeningDate());
		closingBalance.setCreatedBy(bankAccount.getCreatedBy());
		closingBalance.setOpeningBalance(bankAccount.getOpeningBalance());
		closingBalance.setEffectiveDate(dateUtil.getDate());
		closingBalance.setDeleteFlag(bankAccount.getDeleteFlag());
		closingBalance.setTransactionCategory(transactionCategory);

		return  closingBalance;
	}

	public TransactionCategoryClosingBalance getClosingBalanceEntity(TransactionCategoryBalance transactionCategoryBalance, TransactionCategory transactionCategory) {
		TransactionCategoryClosingBalance closingBalance = new TransactionCategoryClosingBalance();
		closingBalance.setClosingBalance(transactionCategoryBalance.getOpeningBalance());
		LocalDateTime openingDate = Instant.ofEpochMilli(new Date().getTime())
				.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
				.toLocalDateTime();
		closingBalance.setClosingBalanceDate(openingDate);
		closingBalance.setCreatedBy(transactionCategoryBalance.getCreatedBy());
		closingBalance.setOpeningBalance(transactionCategoryBalance.getOpeningBalance());
		closingBalance.setEffectiveDate(dateUtil.getDate());
		closingBalance.setDeleteFlag(Boolean.FALSE);
		closingBalance.setTransactionCategory(transactionCategory);

		return  closingBalance;
	}

	public Journal getJournalEntries(BankAccount bankAccount)
	{
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();

		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);

		journalLineItem1.setCreditAmount(bankAccount.getOpeningBalance());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
		journalLineItem1.setReferenceId(bankAccount.getBankAccountId());
		journalLineItem1.setCreatedBy(bankAccount.getCreatedBy());
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		TransactionCategory bankTransactionCategory = transactionCategoryService
				.findByPK(bankAccount.getTransactionCategory().getTransactionCategoryId());
		journalLineItem2.setTransactionCategory(bankTransactionCategory);
		journalLineItem2.setDebitAmount(bankAccount.getOpeningBalance());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
		journalLineItem2.setReferenceId(bankAccount.getBankAccountId());
		journalLineItem2.setCreatedBy(bankAccount.getCreatedBy());
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);
		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(bankAccount.getCreatedBy());
		journal.setPostingReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}
}
