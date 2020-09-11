/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.*;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.*;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.helper.TransactionHelper;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.PostingRequestModel;
import com.simplevat.rest.ReconsileRequestLineItemModel;
import com.simplevat.rest.receiptcontroller.ReceiptRestHelper;
import com.simplevat.rest.reconsilationcontroller.ReconsilationRestHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.*;
import com.simplevat.service.bankaccount.ChartOfAccountService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.service.impl.TransactionCategoryClosingBalanceServiceImpl;
import com.simplevat.utils.ChartUtil;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.FileHelper;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author sonu
 */
@RestController
@RequestMapping(value = "/rest/transaction")
public class TransactionRestController {
	private final Logger logger = LoggerFactory.getLogger(TransactionRestController.class);
	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	TransactionCategoryClosingBalanceServiceImpl transactionCategoryClosingBalanceService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired

	private ChartOfAccountService chartOfAccountService;

	@Autowired
	private TransactionHelper transactionHelper;

	@Autowired
	private ChartUtil chartUtil;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private ReconsilationRestHelper reconsilationRestHelper;

	@Autowired
	private JournalService journalService;

	@Autowired
	private BankAccountService bankService;

	@Autowired
	private ChartOfAccountCategoryService chartOfAccountCategoryService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private TransactionStatusService transactionStatusService;

	@Autowired
	private DateFormatUtil dateFormatUtil;

	@Autowired
	private FileHelper fileHelper;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ReceiptService receiptService;

	@Autowired
	private CustomerInvoiceReceiptService customerInvoiceReceiptService;

	@Autowired
	private ReceiptRestHelper receiptRestHelper;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private TransactionExpensesService transactionExpensesService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private SupplierInvoicePaymentService supplierInvoicePaymentService;

	@Autowired
	private UserService userService;

	@Autowired
	private CurrencyService currencyService;


	@ApiOperation(value = "Get Transaction List")
	@GetMapping(value = "/list")
	public ResponseEntity<PaginationResponseModel> getAllTransaction(TransactionRequestFilterModel filterModel) {

		Map<TransactionFilterEnum, Object> dataMap = new EnumMap<>(TransactionFilterEnum.class);

		if (filterModel.getBankId() != null) {
			dataMap.put(TransactionFilterEnum.BANK_ID, bankAccountService.findByPK(filterModel.getBankId()));
		}
		if(filterModel.getTransactionType()!=null)
		{String transactionType = filterModel.getTransactionType();
			if(transactionType.equalsIgnoreCase("POTENTIAL_DUPLICATE"))
			{
				dataMap.put(TransactionFilterEnum.CREATION_MODE, TransactionCreationMode.POTENTIAL_DUPLICATE);
			}
			else if(transactionType.equalsIgnoreCase("NOT_EXPLAIN"))
			{
				dataMap.put(TransactionFilterEnum.TRANSACTION_EXPLINATION_STATUS, TransactionExplinationStatusEnum.NOT_EXPLAIN);
			}
			else
			{
				dataMap.put(TransactionFilterEnum.TRANSACTION_EXPLINATION_STATUS_IN,TransactionExplinationStatusEnum.NOT_EXPLAIN);
				dataMap.put(TransactionFilterEnum.TRANSACTION_EXPLINATION_STATUS_IN,TransactionExplinationStatusEnum.FULL);
				dataMap.put(TransactionFilterEnum.TRANSACTION_EXPLINATION_STATUS_IN,TransactionExplinationStatusEnum.RECONCILED);
				dataMap.put(TransactionFilterEnum.TRANSACTION_EXPLINATION_STATUS_IN,TransactionExplinationStatusEnum.PARIAL);
			}
		}
		if (filterModel.getTransactionDate() != null) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
			LocalDateTime dateTime = null;
			try {
				dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getTransactionDate()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
			} catch (ParseException e) {
				logger.error(ERROR, e);
			}
			dataMap.put(TransactionFilterEnum.TRANSACTION_DATE, dateTime);
		}
		if (filterModel.getTransactionStatusCode() != null) {
			dataMap.put(TransactionFilterEnum.TRANSACTION_STATUS,
					transactionStatusService.findByPK(filterModel.getTransactionStatusCode()));
		}
		if (filterModel.getChartOfAccountId() != null) {
			dataMap.put(TransactionFilterEnum.CHART_OF_ACCOUNT,
					chartOfAccountService.findByPK(filterModel.getChartOfAccountId()));
		}
		dataMap.put(TransactionFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
		dataMap.put(TransactionFilterEnum.DELETE_FLAG, false);
		PaginationResponseModel response = transactionService.getAllTransactionList(dataMap, filterModel);
		if (response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		response.setData(transactionHelper.getModelList(response.getData()));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@ApiOperation(value = "Add New Transaction", response = Transaction.class)
	@PostMapping(value = "/save")
	public ResponseEntity<String> saveTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
												  HttpServletRequest request) {

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
//dada ki ID
		int chartOfAccountCategory = transactionPresistModel.getCoaCategoryId();

		Transaction trnx = updateTransactionWithCommonFields(transactionPresistModel,userId,TransactionCreationMode.MANUAL, null);
		trnx.setCreatedBy(userId);
		switch(ChartOfAccountCategoryIdEnumConstant.get(chartOfAccountCategory))
		{
//---------------------------------------Expense Chart of Account Category----------------------------------
			case EXPENSE:
				if(transactionPresistModel.getExpenseCategory()!=null && transactionPresistModel.getExpenseCategory() !=0)
				{
					explainExpenses(transactionPresistModel, userId, trnx);
				}
				else
				{  // Supplier Invoices
					updateTransactionForSupplierInvoices(trnx,transactionPresistModel);
					// JOURNAL LINE ITEM FOR normal transaction
					Journal journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,false);
					journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
							transactionPresistModel.getDATE_FORMAT()));
					journalService.persist(journal);
					List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
					reconsileSupplierInvoices(userId, trnx, itemModels);
				}
				break;
			case MONEY_PAID_TO_USER:
				updateTransactionMoneyPaidToUser(trnx,transactionPresistModel);
				Journal journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx,false);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			case TRANSFERD_TO:
				updateTransactionForMoneySpent(trnx,transactionPresistModel);
				TransactionCategory explainedTransactionCategory = trnx.getExplainedTransactionCategory();
				boolean isdebitFromBank = false;
				if(explainedTransactionCategory!=null && explainedTransactionCategory.getChartOfAccount()
						.getChartOfAccountCode().equalsIgnoreCase(ChartOfAccountCategoryCodeEnum.BANK.getCode()))
				{
					TransactionCategory transactionCategory = transactionCategoryService
							.findTransactionCategoryByTransactionCategoryCode(
									TransactionCategoryCodeEnum.AMOUNT_IN_TRANSIT.getCode());
					trnx.setExplainedTransactionCategory(transactionCategory);
					trnx.setExplainedTransactionDescription("Transferred to "+explainedTransactionCategory.getTransactionCategoryName()
							+" : TransactionId="+explainedTransactionCategory.getTransactionCategoryId());
					isdebitFromBank = true;
				}
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, isdebitFromBank);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			case MONEY_SPENT:
			case MONEY_SPENT_OTHERS:
			case PURCHASE_OF_CAPITAL_ASSET:
				updateTransactionForMoneySpent(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, false);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
//-----------------------------------------------------Sales Chart of Account Category-----------------------------------------
			case SALES:
				// Customer Invoices
				updateTransactionForCustomerInvoices(trnx,transactionPresistModel);
				// JOURNAL LINE ITEM FOR normal transaction
				journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,true);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
				reconsileCustomerInvoices(userId, trnx, itemModels);
				break;
			case TRANSFER_FROM:
				updateTransactionForMoneyReceived(trnx,transactionPresistModel);
				explainedTransactionCategory = trnx.getExplainedTransactionCategory();
				isdebitFromBank = true;
				if(explainedTransactionCategory!=null && explainedTransactionCategory.getChartOfAccount()
						.getChartOfAccountCode().equalsIgnoreCase(ChartOfAccountCategoryCodeEnum.BANK.getCode()))
				{
					TransactionCategory transactionCategory = transactionCategoryService
							.findTransactionCategoryByTransactionCategoryCode(
									TransactionCategoryCodeEnum.AMOUNT_IN_TRANSIT.getCode());
					trnx.setExplainedTransactionCategory(transactionCategory);
					trnx.setExplainedTransactionDescription("Transferred from "+explainedTransactionCategory.getTransactionCategoryName()
							+" : TransactionId="+explainedTransactionCategory.getTransactionCategoryId());
					isdebitFromBank = false;
				}
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, isdebitFromBank);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);

				break;
			case REFUND_RECEIVED:
			case INTEREST_RECEVIED:
			case DISPOSAL_OF_CAPITAL_ASSET:
			case MONEY_RECEIVED_FROM_USER:
			case MONEY_RECEIVED_OTHERS:
				updateTransactionForMoneyReceived(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, true);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			default:
				return new ResponseEntity<>("Chart of Category Id not sent correctly", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(transactionPresistModel.getIsValidForClosingBalance())
		{
			//	transactionCategoryClosingBalanceService.updateClosingBalance(trnx);
		}
		updateBankCurrentBalance(trnx);
		return new ResponseEntity<>("Saved successfull", HttpStatus.OK);

	}

	private void updateBankCurrentBalance(Transaction trnx) {
		BankAccount bankAccount = trnx.getBankAccount();
		BigDecimal currentBalance = trnx.getBankAccount().getCurrentBalance();
		if (trnx.getDebitCreditFlag() == 'D')
		{
			currentBalance = currentBalance.subtract(trnx.getTransactionAmount());
		}
		else
		{
			currentBalance =	currentBalance.add(trnx.getTransactionAmount());
		}
		bankAccount.setCurrentBalance(currentBalance);
		bankAccountService.update(bankAccount);
	}

	@ApiOperation(value = "update Transaction", response = Transaction.class)
	@PostMapping(value = "/update")
	public ResponseEntity<String> updateTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
													HttpServletRequest request) {

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		Transaction trnx = isValidTransactionToExplain(transactionPresistModel);
		if(trnx!=null)
			unExplain(transactionPresistModel,trnx);
		trnx = updateTransactionWithCommonFields(transactionPresistModel,userId,TransactionCreationMode.IMPORT,trnx);
		int chartOfAccountCategory = transactionPresistModel.getCoaCategoryId();

		switch(ChartOfAccountCategoryIdEnumConstant.get(chartOfAccountCategory))
		{
//---------------------------------------Expense Chart of Account Category----------------------------------
			case EXPENSE:
				if(transactionPresistModel.getExpenseCategory()!=null && transactionPresistModel.getExpenseCategory() !=0)
				{
					explainExpenses(transactionPresistModel, userId, trnx);
				}
				else
				{  // Supplier Invoices
					updateTransactionForSupplierInvoices(trnx,transactionPresistModel);
					// JOURNAL LINE ITEM FOR normal transaction
					Journal journal = null;
//					reconsilationRestHelper.invoiceReconsile(userId,trnx,false);
//					journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
//							transactionPresistModel.getDATE_FORMAT()));
//					journalService.persist(journal);
					List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
					reconsileSupplierInvoices(userId, trnx, itemModels);
				}
				break;
			case MONEY_PAID_TO_USER:
				updateTransactionMoneyPaidToUser(trnx,transactionPresistModel);
				Journal journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, false);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			case TRANSFERD_TO:
				updateTransactionForMoneySpent(trnx,transactionPresistModel);
				TransactionCategory explainedTransactionCategory = trnx.getExplainedTransactionCategory();
				boolean isdebitFromBank = false;
				if(explainedTransactionCategory!=null && explainedTransactionCategory.getChartOfAccount()
						.getChartOfAccountCode().equalsIgnoreCase(ChartOfAccountCategoryCodeEnum.BANK.getCode()))
				{
					TransactionCategory transactionCategory = transactionCategoryService
							.findTransactionCategoryByTransactionCategoryCode(
									TransactionCategoryCodeEnum.AMOUNT_IN_TRANSIT.getCode());
					trnx.setExplainedTransactionCategory(transactionCategory);
					trnx.setExplainedTransactionDescription("Transferred to "+explainedTransactionCategory.getTransactionCategoryName()
							+" : TransactionId="+explainedTransactionCategory.getTransactionCategoryId());
					isdebitFromBank = true;
				}
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, isdebitFromBank);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			case MONEY_SPENT:
			case MONEY_SPENT_OTHERS:
			case PURCHASE_OF_CAPITAL_ASSET:
				updateTransactionForMoneySpent(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, false);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
//-----------------------------------------------------Sales Chart of Account Category-----------------------------------------
			case SALES:
				// Customer Invoices
				updateTransactionForCustomerInvoices(trnx,transactionPresistModel);
				// JOURNAL LINE ITEM FOR normal transaction
//				journal = reconsilationRestHelper.invoiceReconsile(userId,trnx,true);
//				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
//						transactionPresistModel.getDATE_FORMAT()));
//				journalService.persist(journal);
				List<ReconsileRequestLineItemModel> itemModels = getReconsileRequestLineItemModels(transactionPresistModel);
				reconsileCustomerInvoices(userId, trnx, itemModels);
				break;
			case TRANSFER_FROM:
				updateTransactionForMoneyReceived(trnx,transactionPresistModel);
				explainedTransactionCategory = trnx.getExplainedTransactionCategory();
				isdebitFromBank = true;
				if(explainedTransactionCategory!=null && explainedTransactionCategory.getChartOfAccount()
						.getChartOfAccountCode().equalsIgnoreCase(ChartOfAccountCategoryCodeEnum.BANK.getCode()))
				{
					TransactionCategory transactionCategory = transactionCategoryService
							.findTransactionCategoryByTransactionCategoryCode(
									TransactionCategoryCodeEnum.AMOUNT_IN_TRANSIT.getCode());
					trnx.setExplainedTransactionCategory(transactionCategory);
					trnx.setExplainedTransactionDescription("Transferred from "+explainedTransactionCategory.getTransactionCategoryName()
							+" : TransactionId="+explainedTransactionCategory.getTransactionCategoryId());
					isdebitFromBank =false;
				}
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, isdebitFromBank);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);

				break;
			case REFUND_RECEIVED:
			case INTEREST_RECEVIED:
			case DISPOSAL_OF_CAPITAL_ASSET:
			case MONEY_RECEIVED_FROM_USER:
			case MONEY_RECEIVED_OTHERS:
				updateTransactionForMoneyReceived(trnx,transactionPresistModel);
				journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel.getTransactionCategoryId(),
						transactionPresistModel.getAmount(), userId, trnx, true);
				journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
						transactionPresistModel.getDATE_FORMAT()));
				journalService.persist(journal);
				break;
			default:
				return new ResponseEntity<>("Chart of Category Id not sent correctly", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if(transactionPresistModel.getIsValidForClosingBalance()!=null && transactionPresistModel.getIsValidForClosingBalance())
		{
			//	transactionCategoryClosingBalanceService.updateClosingBalance(trnx);
		}
		if (transactionPresistModel.getIsValidForCurrentBalance()!=null && transactionPresistModel.getIsValidForCurrentBalance()){

			BigDecimal oldTransactionAmount = transactionPresistModel.getOldTransactionAmount();
			BigDecimal newTransactionAmount =transactionPresistModel.getAmount();
			BigDecimal currentBalance = trnx.getBankAccount().getCurrentBalance();

			BigDecimal updateTransactionAmount= BigDecimal.ZERO;
			updateTransactionAmount=newTransactionAmount.subtract(oldTransactionAmount);
			if(trnx.getDebitCreditFlag() == 'C'){

				currentBalance= currentBalance.subtract(oldTransactionAmount);
				currentBalance= currentBalance.add(newTransactionAmount);
			}
			else{
				currentBalance= currentBalance.add(oldTransactionAmount);
				currentBalance= currentBalance.subtract(newTransactionAmount);
			}

			BankAccount bankAccount =trnx.getBankAccount();
			bankAccount.setCurrentBalance(currentBalance);
			bankAccountService.update(bankAccount);
			trnx.setTransactionAmount(updateTransactionAmount);
		}
		return new ResponseEntity<>("Saved successfull", HttpStatus.OK);
	}
	protected Transaction isValidTransactionToExplain(TransactionPresistModel transactionPresistModel)
	{
		if(transactionPresistModel.getTransactionId()==null)
			return null;
		Transaction transaction =  transactionService.findByPK(transactionPresistModel.getTransactionId());
		if(transaction.getTransactionExplinationStatusEnum()== TransactionExplinationStatusEnum.FULL)
			return transaction;
		else
			return	null;
	}
	@ApiOperation(value = "Un explain Transaction", response = Transaction.class)
	@PostMapping(value = "/unexplain")
	public ResponseEntity<String> unExplainTransaction(@ModelAttribute TransactionPresistModel transactionPresistModel,
													   HttpServletRequest request) {

		Transaction trnx = isValidTransactionToExplain(transactionPresistModel);
		if(trnx==null)
			return new ResponseEntity<String>("Transaction is already unexplained", HttpStatus.OK);

		String response = unExplain(transactionPresistModel, trnx);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	private String unExplain(@ModelAttribute TransactionPresistModel transactionPresistModel, Transaction trnx) {
		int chartOfAccountCategory = transactionPresistModel.getCoaCategoryId();

		switch(ChartOfAccountCategoryIdEnumConstant.get(chartOfAccountCategory))
		{
//---------------------------------------Expense Chart of Account Category----------------------------------
			case EXPENSE:
				if(transactionPresistModel.getExpenseCategory()!=null && transactionPresistModel.getExpenseCategory() !=0)
				{
					unExplainExpenses(transactionPresistModel,trnx);
				}
				else
				{
					// Get invoice
					Map<String, Object> param = new HashMap<>();
					param.put("transaction", trnx);
					List<TransactionStatus> transactionStatusList = transactionStatusService.findByAttributes(param);
					if(transactionStatusList!=null)	{

					for(TransactionStatus transactionStatus : transactionStatusList ) {
						param.clear();
						Invoice invoice = transactionStatus.getInvoice();
						param.put("supplierInvoice", invoice);
						List<SupplierInvoicePayment> supplierInvoicePaymentList = supplierInvoicePaymentService.findByAttributes(param);
						if (supplierInvoicePaymentList != null ) {
							param.clear();
							param.put("invoice", invoice);
							List<Payment> paymentList = paymentService.findByAttributes(param);
							if (paymentList != null && paymentList.size() > 0) {
								paymentList.stream().forEach(p -> {
									// Delete journal lineitem
									Journal journal = journalService.getJournalByReferenceId(p.getPaymentId());
									List<Integer> list = new ArrayList<>();
									list.add(journal.getId());
									journalService.deleteByIds(list);
									//Delete payment
									paymentService.delete(p);
								});
							}
							supplierInvoicePaymentList.stream().forEach(sp -> {
								// Delete SupplierInvoicePayment
								supplierInvoicePaymentService.delete(sp);
							});
						}
						//Change invoice status from paid to unpaid
						invoice.setStatus(InvoiceStatusEnum.POST.getValue());
						invoiceService.update(invoice);
						transactionStatusService.delete(transactionStatus);
					 }
					}
					clearAndUpdateTransaction(trnx);
				}
				break;
			case MONEY_PAID_TO_USER:
			case TRANSFERD_TO:
			case MONEY_SPENT:
			case MONEY_SPENT_OTHERS:
			case PURCHASE_OF_CAPITAL_ASSET:
			case TRANSFER_FROM:
			case REFUND_RECEIVED:
			case INTEREST_RECEVIED:
			case DISPOSAL_OF_CAPITAL_ASSET:
			case MONEY_RECEIVED_FROM_USER:
			case MONEY_RECEIVED_OTHERS:
				Journal journal = journalService.getJournalByReferenceId(trnx.getTransactionId());
				List<Integer> list = new ArrayList<>();
				list.add(journal.getId());
				journalService.deleteByIds(list);
				clearAndUpdateTransaction(trnx);
				break;
	//-----------------------------------------------------Sales Chart of Account Category-----------------------------------------
			case SALES:
				// Customer Invoices
				// Get invoice
				Map<String, Object> param = new HashMap<>();
				param.put("transaction", trnx);
				List<TransactionStatus> transactionStatusList = transactionStatusService.findByAttributes(param);
				if(transactionStatusList!=null)	{

					for(TransactionStatus transactionStatus : transactionStatusList ) {
						param.clear();
						Invoice invoice = transactionStatus.getInvoice();
						param.put("supplierInvoice", invoice);
						List<CustomerInvoiceReceipt> customerInvoiceReceiptList = customerInvoiceReceiptService.findByAttributes(param);
						if (customerInvoiceReceiptList != null ) {
							param.clear();
							param.put("invoice", invoice);
							List<Receipt> receiptList = receiptService.findByAttributes(param);
							if (receiptList != null && receiptList.size() > 0) {
								receiptList.stream().forEach(r -> {
									// Delete journal lineitem
									Journal receiptJournal = journalService.getJournalByReferenceId(r.getId());
									List<Integer> receiptIdList = new ArrayList<>();
									receiptIdList.add(receiptJournal.getId());
									journalService.deleteByIds(receiptIdList);
									//Delete payment
									receiptService.delete(r);
								});
							}
							customerInvoiceReceiptList.stream().forEach(cp -> {
								// Delete SupplierInvoicePayment
								customerInvoiceReceiptService.delete(cp);
							});
						}
						//Change invoice status from paid to unpaid
						invoice.setStatus(InvoiceStatusEnum.POST.getValue());
						invoiceService.update(invoice);
						transactionStatusService.delete(transactionStatus);
					}
				}
				clearAndUpdateTransaction(trnx);
				break;
			default:
				return "Chart of Category Id not sent correctly";
		}
		return "Transaction Un Explained Successfully";
	}

	/**
	 *
	 * @param userId
	 * @param trnx
	 * @param itemModels
	 */
	private void reconsileCustomerInvoices(Integer userId, Transaction trnx, List<ReconsileRequestLineItemModel> itemModels) {
		BigDecimal totalAmt = BigDecimal.ZERO;
		for (ReconsileRequestLineItemModel explainParam : itemModels) {
			// Update invoice Payment status
			Invoice invoiceEntity = invoiceService.findByPK(explainParam.getId());
			Contact contact =  invoiceEntity.getContact();
			totalAmt = totalAmt.add(invoiceEntity.getTotalAmount());
			if (invoiceEntity.getStatus() < InvoiceStatusEnum.PAID.getValue()) {
				invoiceEntity.setStatus(
						explainParam.getRemainingInvoiceAmount().compareTo(BigDecimal.ZERO) == 0
								? InvoiceStatusEnum.PAID.getValue()
								: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
				invoiceEntity.setDueAmount(BigDecimal.ZERO);
				invoiceService.update(invoiceEntity);
				// CREATE MAPPNG BETWEEN RECEIPT AND INVOICE
				CustomerInvoiceReceipt customerInvoiceReceipt = new CustomerInvoiceReceipt();
				customerInvoiceReceipt.setCustomerInvoice(invoiceEntity);
				customerInvoiceReceipt.setPaidAmount(invoiceEntity.getTotalAmount());
				customerInvoiceReceipt.setDeleteFlag(Boolean.FALSE);
				customerInvoiceReceipt.setDueAmount(BigDecimal.ZERO);

				// CREATE RECEIPT
				Receipt receipt = transactionHelper.getReceiptEntity(contact, totalAmt,
						trnx.getBankAccount().getTransactionCategory());
				receipt.setCreatedBy(userId);
				receiptService.persist(receipt);

				// POST JOURNAL FOR RECCEPT
				Journal journalForReceipt = receiptRestHelper.receiptPosting(
						new PostingRequestModel(receipt.getId(), receipt.getAmount()), userId,
						receipt.getDepositeToTransactionCategory());
				journalService.persist(journalForReceipt);

				// SAVE DATE OF RECEIPT AND INVOICE MAPPING IN MIDDLE TABLE
				customerInvoiceReceipt.setReceipt(receipt);
				customerInvoiceReceipt.setCreatedBy(userId);
				customerInvoiceReceiptService.persist(customerInvoiceReceipt);
			}
			// CREATE MAPPING BETWEEN TRANSACTION AND JOURNAL
			createTransactionStatus(userId, trnx, explainParam, invoiceEntity);
		}
	}

	/**
	 *
	 * @param userId
	 * @param trnx
	 * @param itemModels
	 */
	private void reconsileSupplierInvoices(Integer userId, Transaction trnx, List<ReconsileRequestLineItemModel> itemModels) {
		BigDecimal totalAmt = BigDecimal.ZERO;
		for (ReconsileRequestLineItemModel explainParam : itemModels) {
			// Update invoice Payment status
			Invoice invoiceEntity = invoiceService.findByPK(explainParam.getId());
			Contact contact =  invoiceEntity.getContact();
			totalAmt = totalAmt.add(invoiceEntity.getTotalAmount());
			if (invoiceEntity.getStatus() < InvoiceStatusEnum.PAID.getValue()) {
				invoiceEntity.setStatus(
						explainParam.getRemainingInvoiceAmount().compareTo(BigDecimal.ZERO) == 0
								? InvoiceStatusEnum.PAID.getValue()
								: InvoiceStatusEnum.PARTIALLY_PAID.getValue());
				invoiceEntity.setDueAmount(BigDecimal.ZERO);
				invoiceService.update(invoiceEntity);

				// CREATE MAPPNG BETWEEN PAYMENT AND INVOICE
				SupplierInvoicePayment supplierInvoicePayment = new SupplierInvoicePayment();
				supplierInvoicePayment.setSupplierInvoice(invoiceEntity);
				supplierInvoicePayment.setPaidAmount(invoiceEntity.getTotalAmount());
				supplierInvoicePayment.setDeleteFlag(Boolean.FALSE);
				supplierInvoicePayment.setDueAmount(BigDecimal.ZERO);
				// CREATE PAYMENT
				Payment payment = transactionHelper.getPaymentEntity(contact, totalAmt,
						trnx.getBankAccount().getTransactionCategory(), invoiceEntity);
				payment.setCreatedBy(userId);
				paymentService.persist(payment);

				// POST JOURNAL FOR PAYMENT
				Journal journalForReceipt = receiptRestHelper.paymentPosting(
						new PostingRequestModel(payment.getPaymentId(), payment.getInvoiceAmount()),
						userId, payment.getDepositeToTransactionCategory());
				journalService.persist(journalForReceipt);

				// SAVE DATE OF RECEIPT AND INVOICE MAPPING IN MIDDLE TABLE
				supplierInvoicePayment.setPayment(payment);
				supplierInvoicePayment.setCreatedBy(userId);
				supplierInvoicePaymentService.persist(supplierInvoicePayment);
			}
			// CREATE MAPPING BETWEEN TRANSACTION AND JOURNAL
			createTransactionStatus(userId, trnx, explainParam, invoiceEntity);
		}
	}

	private void createTransactionStatus(Integer userId, Transaction trnx, ReconsileRequestLineItemModel explainParam, Invoice invoiceEntity) {
		TransactionStatus status = new TransactionStatus();
		status.setCreatedBy(userId);
		status.setExplinationStatus(TransactionExplinationStatusEnum.FULL);
		status.setTransaction(trnx);
		status.setRemainingToExplain(explainParam.getRemainingInvoiceAmount());
		status.setInvoice(invoiceEntity);
		transactionStatusService.persist(status);
	}

	/**
	 * This method with retrieve the invoice list from the TransactionPresistModel to List of ReconsileRequestLineItemModel
	 * @param transactionPresistModel
	 * @return list<ReconsileRequestLineItemModel>
	 */
	private List<ReconsileRequestLineItemModel> getReconsileRequestLineItemModels(@ModelAttribute TransactionPresistModel transactionPresistModel) {
		List<ReconsileRequestLineItemModel> itemModels = new ArrayList<>();
		if (transactionPresistModel.getExplainParamListStr() != null
				&& !transactionPresistModel.getExplainParamListStr().isEmpty()) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				itemModels = mapper.readValue(transactionPresistModel.getExplainParamListStr(),
						new TypeReference<List<ReconsileRequestLineItemModel>>() {
						});
			} catch (IOException ex) {
				logger.error(ERROR, ex);
			}
		}
		return itemModels;
	}

	/**
	 *
	 * @param transactionPresistModel
	 * @param userId
	 * @param trnx
	 */
	private void explainExpenses(@ModelAttribute TransactionPresistModel transactionPresistModel, Integer userId, Transaction trnx) {
		//create new expenses
		Expense expense =  createNewExpense(transactionPresistModel,userId);
		// create Journal entry for Expense
		//Chart of account in expense and user
		Journal journal = null;//getJournalEntryForExpense(transactionPresistModel,expense,userId);
		//journalService.persist(journal);
		int transactionCategoryId = 0;
		if(transactionPresistModel.getTransactionCategoryId()==null) {
			transactionCategoryId = transactionPresistModel.getExpenseCategory();//TransactionCategoryConsatant.TRANSACTION_EMPLOYEE_REIMBURSEMENTS;
			TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionCategoryId);
			trnx.setExplainedTransactionCategory(transactionCategory);
		}
		else
		{
			transactionCategoryId = transactionPresistModel.getTransactionCategoryId();
		}
		// explain transaction
		updateTransactionMoneyPaidToUser(trnx,transactionPresistModel);
		// create Journal entry for Transaction explanation
		//Employee reimbursement and bank
		journal = reconsilationRestHelper.getByTransactionType(transactionPresistModel,transactionCategoryId
				, userId, trnx,expense);

		journal.setJournalDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
				transactionPresistModel.getDATE_FORMAT()));
		journalService.persist(journal);
		TransactionExpenses status = new TransactionExpenses();
		status.setCreatedBy(userId);
		status.setExplinationStatus(TransactionExplinationStatusEnum.FULL);
		status.setRemainingToExplain(BigDecimal.ZERO);
		status.setTransaction(trnx);
		status.setExpense(expense);
		transactionExpensesService.persist(status);
	}
	/**
	 *
	 * @param transactionPresistModel
	 * @param transaction
	 */
	private void unExplainExpenses(@ModelAttribute TransactionPresistModel transactionPresistModel, Transaction transaction) {
		//delete existing expense
		List<Integer> expenseIdList = deleteExpense(transaction);
		if(expenseIdList.size()!=0)
		{
			Journal journal = journalService.getJournalByReferenceId(expenseIdList.get(0));
			List<Integer> list = new ArrayList<>();
			list.add(journal.getId());
			journalService.deleteByIds(list);
			clearAndUpdateTransaction(transaction);
			Map<String, Object> param = new HashMap<>();
			param.put("transaction", transaction);
			List<TransactionExpenses> transactionExpensesList = transactionExpensesService.findByAttributes(param);
			for (TransactionExpenses transactionExpenses : transactionExpensesList)
				transactionExpensesService.delete(transactionExpenses);
		}
	}

	private List<Integer> deleteExpense(Transaction transaction) {
		List<Integer> expenseIdList = new ArrayList<>();
		List<TransactionExpenses> transactionExpensesList = transactionExpensesService
				.findAllForTransactionExpenses(transaction.getTransactionId());
		for(TransactionExpenses transactionExpenses : transactionExpensesList)
		{
			Expense expense = transactionExpenses.getExpense();
			expenseIdList.add(expense.getExpenseId());
			expenseService.delete(expense);
			transactionExpensesService.delete(transactionExpenses);
		}
		return expenseIdList;
	}

	private Expense createNewExpense(TransactionPresistModel model, Integer userId) {
		Expense expense = new Expense();
		expense.setStatus(ExpenseStatusEnum.POST.getValue());
		Expense.ExpenseBuilder expenseBuilder = expense.toBuilder();
		expenseBuilder.expenseAmount(model.getAmount());
		if(model.getUserId()!=null) {
			expenseBuilder.userId(userService.findByPK(model.getUserId()));
		}
		else
		{
			expenseBuilder.payee("Company Expense");
		}
		if (model.getDate() != null) {
			expenseBuilder.expenseDate(dateFormatUtil.getDateStrAsLocalDateTime(model.getDate(),
					model.getDATE_FORMAT()));
		}
		expenseBuilder.expenseDescription(model.getDescription());
		if (model.getCurrencyCode() != null) {
			expenseBuilder.currency(currencyService.findByPK(model.getCurrencyCode()));
		}
		if (model.getExpenseCategory() != null) {
			expenseBuilder.transactionCategory(transactionCategoryService.findByPK(model.getExpenseCategory()));
		}
		if (model.getVatId() != null) {
			expenseBuilder.vatCategory(vatCategoryService.findByPK(model.getVatId()));
		}
		if (model.getBankId() != null) {
			expenseBuilder.bankAccount(bankAccountService.findByPK(model.getBankId()));
		}
		expenseBuilder.createdBy(userId).createdDate(LocalDateTime.now());
		if (model.getAttachmentFile() != null && !model.getAttachmentFile().isEmpty()) {
			String fileName = null;
			try {
				fileName = fileHelper.saveFile(model.getAttachmentFile(), FileTypeEnum.EXPENSE);
			} catch (IOException e) {
				logger.error("Error saving file attachment ");
			}
			expenseBuilder.receiptAttachmentFileName(model.getAttachmentFile().getOriginalFilename())
					.receiptAttachmentPath(fileName);

		}
		expense =expenseBuilder.build();
		expenseService.persist(expense);
		return expense;
	}

	private void updateTransactionForMoneySpent(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('D');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment(transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}
	private void updateTransactionForMoneyReceived(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		updateTransactionDetails(trnx, transactionPresistModel);
		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment(transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}

	private void updateTransactionDetails(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('C');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
	}

	private void updateTransactionForSupplierInvoices(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		trnx.setDebitCreditFlag('D');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getVatId() != null) {
			trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
		}
		if (transactionPresistModel.getVendorId() != null) {
			trnx.setExplinationVendor((contactService.findByPK(transactionPresistModel.getVendorId())));
		}

		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment( transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}
	private void updateTransactionForCustomerInvoices(Transaction trnx, TransactionPresistModel transactionPresistModel) {
		updateTransactionDetails(trnx, transactionPresistModel);
		if (transactionPresistModel.getVatId() != null) {
			trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
		}
		if (transactionPresistModel.getCustomerId() != null) {
			trnx.setExplinationVendor((contactService.findByPK(transactionPresistModel.getCustomerId())));
		}

		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment( transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}
	private Transaction updateTransactionWithCommonFields(TransactionPresistModel transactionPresistModel, int userId, TransactionCreationMode mode, Transaction trnx) {

		if(transactionPresistModel.getTransactionId()!=null || trnx != null) {

			trnx = transactionService.findByPK(transactionPresistModel.getTransactionId());
		}else{
				trnx = new Transaction();
				transactionPresistModel.setIsValidForClosingBalance(true);
			}

			BigDecimal oldTransactionAmount = trnx.getTransactionAmount();
			BigDecimal newTransactionAmount = transactionPresistModel.getAmount();
			if(trnx.getTransactionExplinationStatusEnum()!=TransactionExplinationStatusEnum.FULL)
			{
				transactionPresistModel.setIsValidForClosingBalance(true);

			}

			else if(trnx.getTransactionExplinationStatusEnum() == TransactionExplinationStatusEnum.FULL
					&& oldTransactionAmount.compareTo(newTransactionAmount) != 0) {
				transactionPresistModel.setIsValidForCurrentBalance(true);
				transactionPresistModel.setOldTransactionAmount(oldTransactionAmount);
			}

		trnx.setLastUpdateBy(userId);
		//GrandFather daddu dadaji
		trnx.setCoaCategory(chartOfAccountCategoryService.findByPK(transactionPresistModel.getCoaCategoryId()));
		trnx.setTransactionAmount(transactionPresistModel.getAmount());
		trnx.setCreationMode(mode);
		trnx.setTransactionExplinationStatusEnum(TransactionExplinationStatusEnum.FULL);
		trnx.setTransactionDate(dateFormatUtil.getDateStrAsLocalDateTime(transactionPresistModel.getDate(),
				transactionPresistModel.getDATE_FORMAT()));
		if(transactionPresistModel.getVatId() != null) {
			trnx.setVatCategory(vatCategoryService.findByPK(transactionPresistModel.getVatId()));
		}

		if(transactionPresistModel.getTransactionCategoryId()!=null) {
			//Pota Grandchild
			TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionPresistModel.getTransactionCategoryId());
			trnx.setExplainedTransactionCategory(transactionCategory);
		}
		return trnx;
	}
	/*
	 * This method will update the transaction for Money paid to user.
	 * Fields to update
	 * 1. Desc
	 * 2.
	 */
	private void updateTransactionMoneyPaidToUser(Transaction trnx, TransactionPresistModel transactionPresistModel)
	{
		trnx.setDebitCreditFlag('D');
		if (transactionPresistModel.getDescription() != null) {
			trnx.setExplainedTransactionDescription(transactionPresistModel.getDescription());
		}
		if (transactionPresistModel.getEmployeeId() != null) {
			trnx.setExplainationUser(userService.findByPK(transactionPresistModel.getEmployeeId()));
		}
		if (transactionPresistModel.getUserId() != null) {
			trnx.setExplainationUser(userService.findByPK(transactionPresistModel.getUserId()));
		}
		if (transactionPresistModel.getBankId() != null) {
			trnx.setBankAccount(bankService.findByPK(transactionPresistModel.getBankId()));
		}
		if (transactionPresistModel.getReference() != null
				&& !transactionPresistModel.getReference().isEmpty()) {
			trnx.setReferenceStr(transactionPresistModel.getReference());
		}
		if (transactionPresistModel.getAttachmentFile() != null
				&& !transactionPresistModel.getAttachmentFile().isEmpty()) {
			String filePath = saveFileAttachment(transactionPresistModel.getAttachmentFile(),FileTypeEnum.TRANSATION);
			trnx.setExplainedTransactionAttachmentFileName(
					transactionPresistModel.getAttachmentFile().getOriginalFilename());
			trnx.setExplainedTransactionAttachmentPath(filePath);
		}
		transactionService.persist(trnx);
	}

	/*
	 * This method will update the transaction for Money paid to user.
	 * Fields to update
	 * 1. Desc
	 * 2.
	 */
	private void clearAndUpdateTransaction(Transaction trnx)
	{
		trnx.setChartOfAccount(null);
		trnx.setExplainedTransactionDescription(null);
		trnx.setExplainationUser(null);
		trnx.setExplinationBankAccount(null);
		trnx.setExplainedTransactionCategory(null);
		trnx.setExplainedTransactionAttachmentFileName(null);
		trnx.setExplainedTransactionAttachmentPath(null);
		trnx.setExplainedTransactionAttachementDescription(null);
		trnx.setExplinationVendor(null);
		trnx.setExplinationCustomer(null);
		trnx.setExplinationEmployee(null);
		trnx.setCoaCategory(null);
		trnx.setTransactionExplinationStatusEnum(TransactionExplinationStatusEnum.NOT_EXPLAIN);
		transactionService.persist(trnx);
	}

	private String saveFileAttachment( MultipartFile attachmentFile, FileTypeEnum fileTypeEnum) {
		try{
			return fileHelper.saveFile(attachmentFile,
					fileTypeEnum);
		}catch (IOException e){
			logger.error("Error saving file attachment");
		}
		return null;
	}

	@ApiOperation(value = "Delete Transaction By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteTransaction(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx != null) {
			trnx.setDeleteFlag(Boolean.TRUE);
			transactionService.deleteTransaction(trnx);
		}
		return new ResponseEntity<>("Deleted successful", HttpStatus.OK);

	}

	@ApiOperation(value = "Delete Transaction in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity<String> deleteTransactions(@RequestBody DeleteModel ids) {
		try {
			transactionService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Deleted successfull", HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Update Transaction Status")
	@PostMapping(value = "/changestatus")
	public ResponseEntity<String> updateTransactions(@RequestBody DeleteModel ids) {
		try {
			transactionService.updateStatusByIds(ids.getIds(),TransactionCreationMode.POTENTIAL_DUPLICATE);
			return new ResponseEntity<>("Transaction status mode updated successfully", HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Transaction By ID")
	@GetMapping(value = "/getById")
	public ResponseEntity<TransactionPresistModel> getInvoiceById(@RequestParam(value = "id") Integer id) {
		Transaction trnx = transactionService.findByPK(id);
		if (trnx == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(transactionHelper.getModel(trnx), HttpStatus.OK);
		}
	}

	@GetMapping(value = "/getCashFlow")
	public ResponseEntity<Object> getCashFlow(@RequestParam int monthNo) {
		try {
			Object obj = chartUtil.getCashFlow(transactionService.getCashInData(monthNo, null),
					transactionService.getCashOutData(monthNo, null));
			return new ResponseEntity<>(obj, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	@ApiOperation(value = "Get Explained Transaction Count")
	@GetMapping(value = "/getExplainedTransactionCount")
	public ResponseEntity<Integer> getExplainedTransactionCount(@RequestParam int bankAccountId){
		Integer response = transactionService.getTotalExplainedTransactionCountByBankAccountId(bankAccountId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}


}
