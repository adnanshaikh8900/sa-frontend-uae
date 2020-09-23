package com.simplevat.rest.transactioncategorybalancecontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.bankaccountcontroller.BankAccountRestHelper;
import com.simplevat.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.User;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping(value = "/rest/transactionCategoryBalance")
public class TransactionCategoryBalanceController {
	private final Logger logger = LoggerFactory.getLogger(TransactionCategoryBalanceController.class);

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionCategoryBalanceService transactionCategoryBalanceService;

	@Autowired
	private TransactionCategoryClosingBalanceService transactionCategoryClosingBalanceService;

	@Autowired
	private TransactionCategoryBalanceRestHelper transactionCategoryBalanceRestHelper;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private BankAccountRestHelper bankAccountRestHelper;

	@ApiOperation(value = "Save")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@RequestBody TransactioncategoryBalancePersistModel persistmodel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategoryBalance openingBalance = transactionCategoryBalanceRestHelper.getEntity(persistmodel);
			openingBalance.setCreatedBy(user.getUserId());
			transactionCategoryClosingBalanceService.addNewClosingBalance(openingBalance);
			transactionCategoryBalanceService.persist(openingBalance);
			TransactionCategory transactionCategory = getValidTransactionCategory(openingBalance.getTransactionCategory());
			Map<String,Object> filterObject = new HashMap<>();
			filterObject.put("transactionCategory",transactionCategory);
			List<TransactionCategoryClosingBalance>closingBalanceList = transactionCategoryClosingBalanceService.findByAttributes(filterObject);
			TransactionCategoryClosingBalance closingBalance = null;
			if(closingBalanceList!=null && closingBalanceList.size()>0)
			{
				closingBalance = closingBalanceList.get(0);
				BigDecimal closingBalanceValue = closingBalance.getClosingBalance();
				closingBalanceValue = closingBalanceValue.negate();
				closingBalanceValue = closingBalanceValue.add(openingBalance.getOpeningBalance());
				closingBalance.setOpeningBalance(openingBalance.getOpeningBalance().negate());
				closingBalance.setClosingBalance(closingBalanceValue.negate());
			}
			else {
				closingBalance = bankAccountRestHelper
						.getClosingBalanceEntity(openingBalance, transactionCategory);
				closingBalance.setOpeningBalance(openingBalance.getOpeningBalance().negate());
				closingBalance.setClosingBalance(openingBalance.getOpeningBalance().negate());
			}
			transactionCategoryClosingBalanceService.persist(closingBalance);
			return new ResponseEntity<>("Saved successfull",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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

	@ApiOperation(value = "/Update")
	@PostMapping(value = "update")
	public ResponseEntity<String> update(@RequestBody TransactioncategoryBalancePersistModel persistmodel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategoryBalance openingBalance = transactionCategoryBalanceRestHelper.getEntity(persistmodel);
			BigDecimal currentRunnigBalance = journalLineItemService
					.updateCurrentBalance(openingBalance.getTransactionCategory(), openingBalance.getOpeningBalance());
			openingBalance.setRunningBalance(currentRunnigBalance);
			openingBalance.setLastUpdateBy(user.getUserId());
			transactionCategoryBalanceService.persist(openingBalance);
			TransactionCategoryClosingBalance closingBalance = transactionCategoryClosingBalanceService
					.getFirstClosingBalanceByDate(openingBalance.getTransactionCategory());
			Transaction transaction = getTransactionFromClosingBalance(closingBalance,'C');
			transactionCategoryClosingBalanceService.updateClosingBalance(transaction);
			TransactionCategory transactionCategory = getValidTransactionCategory(openingBalance.getTransactionCategory());
			closingBalance = transactionCategoryClosingBalanceService.getFirstClosingBalanceByDate(transactionCategory);
			transaction = getTransactionFromClosingBalance(closingBalance,'D');
			transactionCategoryClosingBalanceService.updateClosingBalance(transaction);
			return new ResponseEntity<>("Updated successfull",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private Transaction getTransactionFromClosingBalance(TransactionCategoryClosingBalance closingBalance,Character debitCreditFlag) {
		Transaction transaction = new Transaction();
		LocalDateTime journalDate = closingBalance.getClosingBalanceDate();
		transaction.setDebitCreditFlag(debitCreditFlag);
		transaction.setCreatedBy(closingBalance.getCreatedBy());
		transaction.setTransactionDate(journalDate);
		transaction.setTransactionAmount(closingBalance.getOpeningBalance());
		return transaction;
	}

	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity<PaginationResponseModel> getAll(HttpServletRequest request) {

		Map<TransactionCategoryBalanceFilterEnum, Object> dataMap = new EnumMap<>(
				TransactionCategoryBalanceFilterEnum.class);
		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		dataMap.put(TransactionCategoryBalanceFilterEnum.USER_ID, userId);

		PaginationResponseModel response = transactionCategoryBalanceService.getAll(dataMap);
		if (response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		response.setData(
				transactionCategoryBalanceRestHelper.getList((List<TransactionCategoryBalance>) response.getData()));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
