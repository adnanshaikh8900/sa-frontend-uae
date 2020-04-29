package com.simplevat.rest.reconsilationcontroller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.ChartOfAccountConstant;
import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.ChartOfAccountCategory;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.InviceSingleLevelDropdownModel;
import com.simplevat.rest.ReconsileLineItemModel;
import com.simplevat.rest.ReconsileRequestModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.rest.transactioncategorycontroller.TranscationCategoryHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.ChartOfAccountCategoryService;
import com.simplevat.service.ContactService;
import com.simplevat.service.EmployeeService;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.TransactionService;

@RestController
@RequestMapping("/rest/reconsile")
public class ReconsilationController {

	private final Logger LOGGER = LoggerFactory.getLogger(ReconsilationController.class);

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	TransactionCategoryService transactionCategoryService;

	@Autowired
	private JournalService journalService;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	private ReconsilationRestHelper reconsilationRestHelper;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private TranscationCategoryHelper transcationCategoryHelper;

	@Autowired
	private BankAccountService bankService;

	@Autowired
	private ChartOfAccountCategoryService chartOfAccountCategoryService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private ContactService contactService;

	@GetMapping(value = "/getByReconcilationCatCode")
	public ResponseEntity getByReconcilationCatCode(@RequestParam int reconcilationCatCode) {
		try {
			return new ResponseEntity<>(
					reconsilationRestHelper.getList(ReconsileCategoriesEnumConstant.get(reconcilationCatCode)),
					HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@PostMapping(value = "/reconcile")
	public ResponseEntity reconcile(@RequestBody ReconsileRequestModel reconsileRequestModel,
			HttpServletRequest request) {
		try {

			Journal journal = null;

			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			List<Journal> journalList = new ArrayList<Journal>();

			if (reconsileRequestModel != null && reconsileRequestModel.getExplainData() != null
					&& !reconsileRequestModel.getExplainData().isEmpty()) {

				for (ReconsileLineItemModel reconsileLineItemModel : reconsileRequestModel.getExplainData()) {
					ReconsileCategoriesEnumConstant cat = ReconsileCategoriesEnumConstant
							.get(reconsileLineItemModel.getCategoryType());

					switch (cat) {
					case EXPENSE:
						journal = expenseReconsile(reconsileLineItemModel, userId);
						break;

					case SUPPLIER_INVOICE:
						journal = invoiceReconsile(reconsileLineItemModel, userId);
						break;

					default:
						break;
					}
					if (journal != null) {
						journalList.add(journal);
					}
				}

				Transaction trnx = transactionService.findByPK(reconsileRequestModel.getTransactionId());

				if (reconsileRequestModel.getTransactionCategory() != null
						&& reconsileRequestModel.getRemainingBalance() != null) {
					journal = getByTransactionType(reconsileRequestModel.getTransactionCategory(),
							reconsileRequestModel.getRemainingBalance(), userId, trnx);
					if (journal != null) {
						journalList.add(journal);
					}
				}

				if (!journalList.isEmpty()) {

					for (Journal journal1 : journalList) {
						journalService.persist(journal1);
					}
					trnx.setReconsileJournalList(journalList);
					transactionService.persist(trnx);
				}
			}
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private Journal expenseReconsile(ReconsileLineItemModel reconsileLineItemModel, Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList();

		Expense expence = expenseService.findByPK(reconsileLineItemModel.getReconcileRrefId());

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		journalLineItem1.setCreditAmount(expence.getExpenseAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
		journalLineItem1.setReferenceId(reconsileLineItemModel.getReconcileRrefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(expence.getTransactionCategory());
		journalLineItem2.setDebitAmount(expence.getExpenseAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
		journalLineItem2.setReferenceId(reconsileLineItemModel.getReconcileRrefId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	private Journal invoiceReconsile(ReconsileLineItemModel reconsileLineItemModel, Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList<>();

		Invoice invoice = invoiceService.findByPK(reconsileLineItemModel.getReconcileRrefId());

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_PAYABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		journalLineItem1.setCreditAmount(invoice.getTotalAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.INVOICE);
		journalLineItem1.setReferenceId(invoice.getId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		TransactionCategory saleTransactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(TransactionCategoryCodeEnum.SALE.getCode());
		journalLineItem2.setTransactionCategory(saleTransactionCategory);
		journalLineItem2.setDebitAmount(invoice.getTotalAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_EXPENSE);
		journalLineItem2.setReferenceId(invoice.getId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);
		journal.setJournalLineItems(journalLineItemList);

		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_EXPENSE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	private Journal getByTransactionType(Integer transactionCategoryCode, BigDecimal amount, int userId,
			Transaction transaction) {
		List<JournalLineItem> journalLineItemList = new ArrayList();

		TransactionCategory transactionCategory = transactionCategoryService.findByPK(transactionCategoryCode);

		ChartOfAccount transactionType = transactionCategory.getChartOfAccount();

		boolean isdebitFromBank = transactionType.getChartOfAccountId().equals(ChartOfAccountConstant.MONEY_IN)
				|| (transactionType.getParentChartOfAccount() != null
						&& transactionType.getParentChartOfAccount().getChartOfAccountId() != null
						&& transactionType.getParentChartOfAccount().getChartOfAccountId()
								.equals(ChartOfAccountConstant.MONEY_IN)) ? Boolean.TRUE : Boolean.FALSE;

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		journalLineItem1.setTransactionCategory(transaction.getExplainedTransactionCategory());
		if (!isdebitFromBank) {
			journalLineItem1.setDebitAmount(amount);
		} else {
			journalLineItem1.setCreditAmount(amount);
		}
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_REMAIN);
		journalLineItem1.setReferenceId(transaction.getTransactionId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(transaction.getBankAccount().getTransactionCategory());
		if (isdebitFromBank) {
			journalLineItem2.setDebitAmount(transaction.getTransactionAmount());
		} else {
			journalLineItem2.setCreditAmount(transaction.getTransactionAmount());
		}
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_REMAIN);
		journalLineItem2.setReferenceId(transaction.getTransactionId());
		journalLineItem2.setCreatedBy(transaction.getCreatedBy());
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(transaction.getCreatedBy());
		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_REMAIN);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	@GetMapping(value = "/getTransactionCat")
	public ResponseEntity getTransactionCategory(@RequestParam Integer chartOfAccountCategoryId) {
		try {
			ChartOfAccountCategory category = chartOfAccountCategoryService.findByPK(chartOfAccountCategoryId);
			Map<String, Object> param = new HashMap<>();
			List<DropdownModel> dropDownModelList = new ArrayList<DropdownModel>();
			List<TransactionCategory> transactionCatList = new ArrayList<>();
			List<Object> list = new ArrayList<>();

			switch (ChartOfAccountCategoryIdEnumConstant.get(category.getChartOfAccountCategoryId())) {
			case SALES:
				param = new HashMap<>();
				param.put("deleteFlag", false);
				List<Invoice> invList = invoiceService.findByAttributes(param);
				List<InviceSingleLevelDropdownModel> invModelList = new ArrayList<>();

				for (Invoice invice : invList) {
					invModelList
							.add(new InviceSingleLevelDropdownModel(
									invice.getId(), "Ref No. " + invice.getReferenceNumber() + " "
											+ invice.getTotalAmount() + " " + invice.getCurrency().getCurrencyName(),
									invice.getTotalAmount()));
				}

				list.add(new SingleLevelDropDownModel("Customer", contactService.getContactForDropdown(2)));
				param = new HashMap<>();
				param.put("label", "Sales Invoice");
				param.put("options", invModelList);
				list.add(param);
				return new ResponseEntity<>(new ReconsilationCatDataModel(list, null), HttpStatus.OK);

			case EXPENSE:
				transactionCatList = transactionCategoryService
						.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
				list.add(new SingleLevelDropDownModel("Vat Included", vatCategoryService.getVatCategoryForDropDown()));
				list.add(new SingleLevelDropDownModel("Customer", contactService.getContactForDropdown(2)));
				list.add(new SingleLevelDropDownModel("Vendor", contactService.getContactForDropdown(1)));
				return new ResponseEntity<>(
						new ReconsilationCatDataModel(list,
								transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
						HttpStatus.OK);

			case MONEY_PAID_TO_USER:
			case MONEY_RECEIVED_FROM_USER:
				transactionCatList = transactionCategoryService
						.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
				return new ResponseEntity<>(
						new ReconsilationCatDataModel(
								Arrays.asList(new SingleLevelDropDownModel("User",
										employeeService.getEmployeesForDropdown())),
								transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
						HttpStatus.OK);

			case DEFAULT:
				transactionCatList = transactionCategoryService
						.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
				if (transactionCatList != null && !transactionCatList.isEmpty())
					return new ResponseEntity<>(
							new ReconsilationCatDataModel(null,
									transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
							HttpStatus.OK);
			}

			return new ResponseEntity(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
