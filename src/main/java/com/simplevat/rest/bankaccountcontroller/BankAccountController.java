package com.simplevat.rest.bankaccountcontroller;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import javax.servlet.http.HttpServletRequest;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.*;
import com.simplevat.entity.Currency;
import com.simplevat.entity.bankaccount.*;
import com.simplevat.model.DashBoardBankDataModel;
import com.simplevat.rest.transactioncategorybalancecontroller.TransactionCategoryBalanceRestHelper;
import com.simplevat.rest.transactioncategorybalancecontroller.TransactioncategoryBalancePersistModel;
import com.simplevat.service.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.BankAccounrFilterEnum;
import com.simplevat.model.BankModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.bankaccount.TransactionService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/bank")
public class BankAccountController{

	private  final Logger logger = LoggerFactory.getLogger(BankAccountController.class);

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	protected JournalService journalService;

	@Autowired
	private CoacTransactionCategoryService coacTransactionCategoryService;
	@Autowired
	private TransactionCategoryClosingBalanceService transactionCategoryClosingBalanceService;


	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;

	@Autowired
	private TransactionCategoryBalanceRestHelper transactionCategoryBalanceRestHelper;

	@Autowired
	private BankAccountStatusService bankAccountStatusService;

	@Autowired
	private UserService userServiceNew;


	@Autowired
	private CurrencyService currencyService;

	@Autowired
	private BankAccountTypeService bankAccountTypeService;

	@Autowired
	private CountryService countryService;

	@Autowired
	private BankAccountRestHelper bankAccountRestHelper;

	@Autowired
	private TransactionCategoryService transactionCategoryService;
	@Autowired
	private ExpenseService expenseService;
	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	private BankAccountRestHelper bankRestHelper;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@ApiOperation(value = "Get All Bank Accounts", response = List.class)
	@GetMapping(value = "/list")
	public ResponseEntity<PaginationResponseModel> getBankAccountList(BankAccountFilterModel filterModel) {
		Map<BankAccounrFilterEnum, Object> filterDataMap = new EnumMap<>(BankAccounrFilterEnum.class);

		filterDataMap.put(BankAccounrFilterEnum.BANK_ACCOUNT_NAME, filterModel.getBankAccountName());
		filterDataMap.put(BankAccounrFilterEnum.BANK_BNAME, filterModel.getBankName());
		filterDataMap.put(BankAccounrFilterEnum.ACCOUNT_NO, filterModel.getAccountNumber());

		filterDataMap.put(BankAccounrFilterEnum.DELETE_FLAG, false);
		if (filterModel.getTransactionDate() != null) {
			LocalDateTime date = Instant.ofEpochMilli(filterModel.getTransactionDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			filterDataMap.put(BankAccounrFilterEnum.TRANSACTION_DATE, date);
		}
		if (filterModel.getBankAccountTypeId() != null) {
			filterDataMap.put(BankAccounrFilterEnum.BANK_ACCOUNT_TYPE,
					bankAccountTypeService.findByPK(filterModel.getBankAccountTypeId()));
		}
		if (filterModel.getCurrencyCode() != null) {
			filterDataMap.put(BankAccounrFilterEnum.CURRENCY_CODE,
					currencyService.findByPK(filterModel.getCurrencyCode()));
		}

		PaginationResponseModel paginatinResponseModel = bankAccountService.getBankAccounts(filterDataMap, filterModel);
		if (paginatinResponseModel != null) {
			return new ResponseEntity<>(bankAccountRestHelper.getListModel(paginatinResponseModel), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Add New Bank Account", response = BankAccount.class)
	@PostMapping("/save")
	public ResponseEntity<String> saveBankAccount(@RequestBody BankModel bankModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			bankModel.setCreatedBy(userId);
			BankAccount bankAccount = bankRestHelper.getEntity(bankModel);
			User user = userServiceNew.findByPK(userId);
			if (bankModel.getBankAccountId() == null) {
				if (user != null) {
					bankAccount.setCreatedDate(LocalDateTime.now());
					bankAccount.setCreatedBy(user.getUserId());
				}

				bankAccountService.persist(bankAccount);

				TransactionCategory category = transactionCategoryService.findByPK(bankAccount.getTransactionCategory().getTransactionCategoryId());
				TransactionCategory transactionCategory = getValidTransactionCategory(category);
				boolean isDebit=false;
				if(StringUtils.equalsAnyIgnoreCase(transactionCategory.getTransactionCategoryCode(),
						TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode())){
					isDebit=true;
				}

				List<JournalLineItem> journalLineItemList = new ArrayList<>();
				Journal journal = new Journal();
				JournalLineItem journalLineItem1 = new JournalLineItem();
				journalLineItem1.setTransactionCategory(category);
				if (isDebit) {
					journalLineItem1.setDebitAmount(bankModel.getOpeningBalance());
				} else {
					journalLineItem1.setCreditAmount(bankModel.getOpeningBalance());
				}
				journalLineItem1.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
				journalLineItem1.setReferenceId(category.getTransactionCategoryId());
				journalLineItem1.setCreatedBy(userId);
				journalLineItem1.setJournal(journal);
				journalLineItemList.add(journalLineItem1);

				JournalLineItem journalLineItem2 = new JournalLineItem();
				journalLineItem2.setTransactionCategory(transactionCategory);
				if (!isDebit) {
					journalLineItem2.setDebitAmount(bankModel.getOpeningBalance());
				} else {
					journalLineItem2.setCreditAmount(bankModel.getOpeningBalance());
				}
				journalLineItem2.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
				journalLineItem2.setReferenceId(transactionCategory.getTransactionCategoryId());
				journalLineItem2.setCreatedBy(userId);
				journalLineItem2.setJournal(journal);
				journalLineItemList.add(journalLineItem2);

				journal.setJournalLineItems(journalLineItemList);
				journal.setCreatedBy(userId);
				journal.setPostingReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
				journal.setJournalDate(LocalDateTime.now());
				journalService.persist(journal);
                coacTransactionCategoryService.addCoacTransactionCategory(bankAccount.getTransactionCategory().getChartOfAccount(),
						bankAccount.getTransactionCategory());
				return new ResponseEntity<>("Save Successfull..",HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>("Save Failure",HttpStatus.INTERNAL_SERVER_ERROR);
	}
	private TransactionCategory getValidTransactionCategory(TransactionCategory transactionCategory) {
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

	@ApiOperation(value = "Update Bank Account", response = BankAccount.class)
	@PutMapping("/{bankAccountId}")
	public ResponseEntity<String> updateBankAccount(@PathVariable("bankAccountId") Integer bankAccountId, BankModel bankModel,
													HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			bankModel.setBankAccountId(bankAccountId);
			BankAccount bankAccount = bankRestHelper.getBankAccountByBankAccountModel(bankModel);
			User user = userServiceNew.findByPK(userId);
			bankAccount.setBankAccountId(bankModel.getBankAccountId());
			bankAccount.setLastUpdateDate(LocalDateTime.now());
			bankAccount.setLastUpdatedBy(user.getUserId());
			bankAccountService.update(bankAccount);
			Journal journal = journalService.getJournalByReferenceId(bankAccount.getTransactionCategory().getTransactionCategoryId());
			if (journal != null) {
				journalService.deleteByIds(Arrays.asList(journal.getId()));
			}
			TransactionCategory category = transactionCategoryService.findByPK(bankAccount.getTransactionCategory().getTransactionCategoryId());
			TransactionCategory transactionCategory = getValidTransactionCategory(category);
			boolean isDebit=false;
			if(StringUtils.equalsAnyIgnoreCase(transactionCategory.getTransactionCategoryCode(),
					TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode())){
				isDebit=true;
			}

			List<JournalLineItem> journalLineItemList = new ArrayList<>();
			journal = new Journal();
			JournalLineItem journalLineItem1 = new JournalLineItem();
			journalLineItem1.setTransactionCategory(category);
			if (isDebit) {
				journalLineItem1.setDebitAmount(bankModel.getOpeningBalance());
			} else {
				journalLineItem1.setCreditAmount(bankModel.getOpeningBalance());
			}
			journalLineItem1.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
			journalLineItem1.setReferenceId(category.getTransactionCategoryId());
			journalLineItem1.setCreatedBy(userId);
			journalLineItem1.setJournal(journal);
			journalLineItemList.add(journalLineItem1);

			JournalLineItem journalLineItem2 = new JournalLineItem();
			journalLineItem2.setTransactionCategory(transactionCategory);
			if (!isDebit) {
				journalLineItem2.setDebitAmount(bankModel.getOpeningBalance());
			} else {
				journalLineItem2.setCreditAmount(bankModel.getOpeningBalance());
			}
			journalLineItem2.setReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
			journalLineItem2.setReferenceId(transactionCategory.getTransactionCategoryId());
			journalLineItem2.setCreatedBy(userId);
			journalLineItem2.setJournal(journal);
			journalLineItemList.add(journalLineItem2);

			journal.setJournalLineItems(journalLineItemList);
			journal.setCreatedBy(userId);
			journal.setPostingReferenceType(PostingReferenceTypeEnum.BANK_ACCOUNT);
			journal.setJournalDate(LocalDateTime.now());
			journalService.persist(journal);
			return new ResponseEntity<>("Update Successfull..",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>("Update Failure..",HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get All Bank Account Types")
	@GetMapping(value = "/getaccounttype")
	public ResponseEntity<List<BankAccountType> > getBankAccontType() {
		List<BankAccountType> bankAccountTypes = bankAccountTypeService.getBankAccountTypeList();
		if (bankAccountTypes != null && !bankAccountTypes.isEmpty()) {
			return new ResponseEntity<>(bankAccountTypes, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@ApiOperation(value = "Get All Bank Account Status")
	@GetMapping(value = "/getbankaccountstatus")
	public ResponseEntity<List<BankAccountStatus>> getBankAccountStatus() {
		List<BankAccountStatus> bankAccountStatuses = bankAccountStatusService.getBankAccountStatuses();
		if (bankAccountStatuses != null && !bankAccountStatuses.isEmpty()) {
			return new ResponseEntity<>(bankAccountStatuses, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}


	/**
	 * @Deprecated
	 */
	@GetMapping(value = "/getcountry")
	public ResponseEntity<List<Country>> getCountry() {
		try {
			List<Country> countries = countryService.getCountries();
			if (countries != null && !countries.isEmpty()) {
				return new ResponseEntity<>(countries,HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Delete the Bank Account", response = BankAccount.class)
	@DeleteMapping(value = "/{bankAccountId}")
	public ResponseEntity<BankAccount> deleteBankAccount(@PathVariable("bankAccountId") Integer bankAccountId,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

			BankAccount  bankAccount = bankAccountService.findByPK(bankAccountId);
			if (bankAccount != null) {
				Map<String,Object> filterMap = new HashMap<>();
				filterMap.put("transactionCategory",bankAccount.getTransactionCategory());

				Journal journal = journalService.getJournalByReferenceId(bankAccount.getTransactionCategory().getTransactionCategoryId());
				if (journal != null) {
					journalService.deleteByIds(Arrays.asList(journal.getId()));
				}
				//delete Transaction
				List<Transaction> transactionList = transactionService.getAllTransactionListByBankAccountId(bankAccountId);
				for(Transaction transaction:transactionList)
				{
					if(transaction.getDebitCreditFlag()=='C' && !transaction.getDeleteFlag())
					{
						bankAccount.setCurrentBalance(bankAccount.getCurrentBalance()
								.subtract(transaction.getTransactionAmount()));
					}
					else if( !transaction.getDeleteFlag())
					{
						bankAccount.setCurrentBalance(bankAccount.getCurrentBalance()
								.add(transaction.getTransactionAmount()));
					}
					transactionService.delete(transaction);


				}
//				if (bankAccount.getCurrentBalance()!=null&&bankAccount.getCurrentBalance().longValue()>0)
//				{
////					Subtract Bank balance from opening Balance Offset liabilities
//					TransactionCategory transactionCategory = transactionCategoryService
//							.findTransactionCategoryByTransactionCategoryCode(
//									TransactionCategoryCodeEnum.OPENING_BALANCE_OFFSET_LIABILITIES.getCode());
//					TransactionCategoryClosingBalance transactionCategoryClosingBalance =
//							transactionCategoryClosingBalanceService.getLastClosingBalanceByDate(transactionCategory);
//					if (transactionCategoryClosingBalance!=null){
//						transactionCategoryClosingBalance.setOpeningBalance(transactionCategoryClosingBalance.getClosingBalance()
//								.subtract(bankAccount.getCurrentBalance()));
//						transactionCategoryClosingBalance.setClosingBalance(transactionCategoryClosingBalance.getClosingBalance()
//								.subtract(bankAccount.getCurrentBalance()));
//						transactionCategoryClosingBalanceService.update(transactionCategoryClosingBalance);
//					}
//					Map<String,Object> filterMap = new HashMap<>();
//					filterMap.put("transactionCategory",transactionCategory);
//					List<TransactionCategoryBalance> transactionCategoryBalanceList =
//							transactionCategoryBalanceService.findByAttributes(filterMap);
//					for(TransactionCategoryBalance transactionCategoryBalance : transactionCategoryBalanceList)
//					{
//						transactionCategoryBalance.setOpeningBalance(transactionCategoryBalance.getOpeningBalance()
//								.subtract(bankAccount.getCurrentBalance()));
//						transactionCategoryBalance.setRunningBalance(transactionCategoryBalance.getRunningBalance()
//								.subtract(bankAccount.getCurrentBalance()));
//						transactionCategoryBalanceService.update(transactionCategoryBalance);
//					}
//				}
				//delete closing balance
				filterMap = new HashMap<>();
				filterMap.put("transactionCategory",bankAccount.getTransactionCategory());
				List<TransactionCategoryClosingBalance> transactionCategoryClosingBalanceList =
						transactionCategoryClosingBalanceService.findByAttributes(filterMap);
				for(TransactionCategoryClosingBalance transactionCategoryClosingBalance :
						transactionCategoryClosingBalanceList)
				{
					transactionCategoryClosingBalanceService.delete(transactionCategoryClosingBalance);
				}
				//delete opening balance
				List<TransactionCategoryBalance> transactionCategoryBalanceList =
						transactionCategoryBalanceService.findByAttributes(filterMap);
				for(TransactionCategoryBalance transactionCategoryBalance : transactionCategoryBalanceList)
				{
					transactionCategoryBalanceService.delete(transactionCategoryBalance);
				}
                // Delete Expenses created from Bank

				Map<String,Object> expenseFilterMap = new HashMap<>();
				expenseFilterMap.put("bankAccount",bankAccount);
				List<Expense> expenseList = expenseService.findByAttributes(expenseFilterMap);
                for(Expense expense : expenseList)
                	expenseService.delete(expense);

				bankAccount.setLastUpdateDate(LocalDateTime.now());
				bankAccount.setLastUpdatedBy(userId);
				bankAccount.setDeleteFlag(true);
				bankAccountService.delete(bankAccount);
				//delete coac category
				List<CoacTransactionCategory> coacTransactionCategoryList = coacTransactionCategoryService
						.findByAttributes(filterMap);
				for(CoacTransactionCategory coacTransactionCategory: coacTransactionCategoryList)
				{
					coacTransactionCategoryService.delete(coacTransactionCategory);
				}
				//delete transaction category
				Map<String,Object> filterTransactionCategoryMap = new HashMap<>();

				filterTransactionCategoryMap.put("transactionCategoryId",bankAccount.getTransactionCategory()
						.getTransactionCategoryId());

				List<TransactionCategory> transactionCategoryList = transactionCategoryService
						.findByAttributes(filterTransactionCategoryMap);
				for(TransactionCategory transactionCategory : transactionCategoryList)
				{
					transactionCategoryService.delete(transactionCategory);
				}

				return new ResponseEntity<>(bankAccount, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Bank Account by Bank Account ID", response = BankAccount.class)
	@GetMapping(value = "/getbyid")
	public ResponseEntity<BankModel> getById(@RequestParam("id") Integer id) {
		try {
			BankAccount bankAccount = bankAccountService.findByPK(id);
			TransactionCategoryClosingBalance closingBalance = transactionCategoryClosingBalanceService.
					getLastClosingBalanceByDate(bankAccount.getTransactionCategory());
			BankModel bankModel = bankAccountRestHelper.getModel(bankAccount);
			bankModel.setClosingBalance(closingBalance.getClosingBalance());


			if (bankAccount == null) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>( bankModel, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Delete Bank Accounts")
	@DeleteMapping(value = "/multiple")
	public ResponseEntity<String> deleteBankAccounts(@RequestBody DeleteModel ids, HttpServletRequest httpServletRequest) {
		try {
			bankAccountService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Deleted Successfull..",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>("Delete Failure..",HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/getcurrenncy")
	public ResponseEntity<List<Currency>> getCurrency() {
		try {
			List<Currency> currencies = currencyService.getCurrencies();
			if (currencies != null && !currencies.isEmpty()) {
				return new ResponseEntity<>(currencies, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/getBankChart")
	public ResponseEntity<DashBoardBankDataModel> getCurrency(@RequestParam Integer bankId, Integer monthCount) {
		try {

			if (bankId == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}

			return new ResponseEntity<>(bankAccountService.getBankBalanceList(bankAccountService.findByPK(bankId),
					transactionService.getCashInData(monthCount, bankId),
					transactionService.getCashOutData(monthCount, bankId)), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/getTotalBalance")
	public ResponseEntity<BigDecimal> getTotalBalance() {
		try {
			BigDecimal totalBalance = bankAccountService.getAllBankAccountsTotalBalance();
			return new ResponseEntity<>(totalBalance != null ? totalBalance : BigDecimal.valueOf(0), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
