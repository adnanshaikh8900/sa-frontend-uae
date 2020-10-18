package com.simplevat.rest.transactioncategorybalancecontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import javax.servlet.http.HttpServletRequest;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.bankaccountcontroller.BankAccountRestHelper;
import com.simplevat.service.*;
import org.apache.commons.lang3.StringUtils;
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
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private JournalService journalService;

	@ApiOperation(value = "Save")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@RequestBody TransactioncategoryBalancePersistModel persistmodel,
									   HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategory category = transactionCategoryService.findByPK(persistmodel.getTransactionCategoryId());
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
				journalLineItem1.setDebitAmount(persistmodel.getOpeningBalance());
			} else {
				journalLineItem1.setCreditAmount(persistmodel.getOpeningBalance());
			}
			journalLineItem1.setReferenceType(PostingReferenceTypeEnum.BALANCE_ADJUSTMENT);
			journalLineItem1.setReferenceId(category.getTransactionCategoryId());
			journalLineItem1.setCreatedBy(userId);
			journalLineItem1.setJournal(journal);
			journalLineItemList.add(journalLineItem1);

			JournalLineItem journalLineItem2 = new JournalLineItem();
			journalLineItem2.setTransactionCategory(transactionCategory);
			if (!isDebit) {
				journalLineItem2.setDebitAmount(persistmodel.getOpeningBalance());
			} else {
				journalLineItem2.setCreditAmount(persistmodel.getOpeningBalance());
			}
			journalLineItem2.setReferenceType(PostingReferenceTypeEnum.BALANCE_ADJUSTMENT);
			journalLineItem2.setReferenceId(transactionCategory.getTransactionCategoryId());
			journalLineItem2.setCreatedBy(userId);
			journalLineItem2.setJournal(journal);
			journalLineItemList.add(journalLineItem2);

			journal.setJournalLineItems(journalLineItemList);
			journal.setCreatedBy(userId);
			journal.setPostingReferenceType(PostingReferenceTypeEnum.BALANCE_ADJUSTMENT);
			journal.setJournalDate(LocalDateTime.now());
			journalService.persist(journal);
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
	public ResponseEntity<String> update(@RequestBody TransactioncategoryBalancePersistModel persistModel,
										 HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			TransactionCategoryBalance transactionCategoryBalance= null;
			if (persistModel.getTransactionCategoryBalanceId() != null) {
				transactionCategoryBalance = transactionCategoryBalanceService
						.findByPK(persistModel.getTransactionCategoryBalanceId());
			}
			Journal journal = journalService.getJournalByReferenceId(transactionCategoryBalance.getTransactionCategory().getTransactionCategoryId());
			if (journal != null) {
				journalService.deleteAndUpdateByIds(Arrays.asList(journal.getId()),false);
			}
			TransactionCategory category = transactionCategoryService.findByPK(persistModel.getTransactionCategoryId());
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
				journalLineItem1.setDebitAmount(persistModel.getOpeningBalance());
			} else {
				journalLineItem1.setCreditAmount(persistModel.getOpeningBalance());
			}
			journalLineItem1.setReferenceType(PostingReferenceTypeEnum.BALANCE_ADJUSTMENT);
			journalLineItem1.setReferenceId(category.getTransactionCategoryId());
			journalLineItem1.setCreatedBy(userId);
			journalLineItem1.setJournal(journal);
			journalLineItemList.add(journalLineItem1);

			JournalLineItem journalLineItem2 = new JournalLineItem();
			journalLineItem2.setTransactionCategory(transactionCategory);
			if (!isDebit) {
				journalLineItem2.setDebitAmount(persistModel.getOpeningBalance());
			} else {
				journalLineItem2.setCreditAmount(persistModel.getOpeningBalance());
			}
			journalLineItem2.setReferenceType(PostingReferenceTypeEnum.BALANCE_ADJUSTMENT);
			journalLineItem2.setReferenceId(transactionCategory.getTransactionCategoryId());
			journalLineItem2.setCreatedBy(userId);
			journalLineItem2.setJournal(journal);
			journalLineItemList.add(journalLineItem2);

			journal.setJournalLineItems(journalLineItemList);
			journal.setCreatedBy(userId);
			journal.setPostingReferenceType(PostingReferenceTypeEnum.BALANCE_ADJUSTMENT);
			journal.setJournalDate(LocalDateTime.now());
			journalService.updateOpeningBalance(journal,true);
			return new ResponseEntity<>("Updated successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private Transaction getTransactionFromClosingBalance(TransactioncategoryBalancePersistModel persistModel,TransactionCategoryClosingBalance closingBalance,Character debitCreditFlag) {
		BigDecimal transactionAmount = BigDecimal.ZERO;
		if(persistModel.getOpeningBalance()!=null)
		{
			transactionAmount = persistModel.getOpeningBalance();
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
