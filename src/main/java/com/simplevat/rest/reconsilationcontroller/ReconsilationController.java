package com.simplevat.rest.reconsilationcontroller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.ReconsileRequestModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
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
			ReconsileCategoriesEnumConstant cat = ReconsileCategoriesEnumConstant
					.get(reconsileRequestModel.getReconcileCategoryCode());

			switch (cat) {
			case EXPENSE:
				journal = expenseReconsile(reconsileRequestModel, userId);
				break;

			case SUPPLIER_INVOICE:
				journal = invoiceReconsile(reconsileRequestModel, userId);
				break;

			default:
				break;
			}

			if (journal != null) {
				journalService.persist(journal);
				Transaction trnx = transactionService.findByPK(reconsileRequestModel.getTransactionId());
				trnx.setReconsileJournal(journal);
				transactionService.persist(trnx);
			}

			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private Journal expenseReconsile(ReconsileRequestModel reconsileRequestModel, Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList();

		Expense expence = expenseService.findByPK(reconsileRequestModel.getReconcileRrefId());

		Journal journal = new Journal();
		JournalLineItem journalLineItem1 = new JournalLineItem();
		TransactionCategory transactionCategory = transactionCategoryService
				.findTransactionCategoryByTransactionCategoryCode(
						TransactionCategoryCodeEnum.ACCOUNT_RECEIVABLE.getCode());
		journalLineItem1.setTransactionCategory(transactionCategory);
		journalLineItem1.setCreditAmount(expence.getExpenseAmount());
		journalLineItem1.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
		journalLineItem1.setReferenceId(reconsileRequestModel.getReconcileRrefId());
		journalLineItem1.setCreatedBy(userId);
		journalLineItem1.setJournal(journal);
		journalLineItemList.add(journalLineItem1);

		JournalLineItem journalLineItem2 = new JournalLineItem();
		journalLineItem2.setTransactionCategory(expence.getTransactionCategory());
		journalLineItem2.setDebitAmount(expence.getExpenseAmount());
		journalLineItem2.setReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
		journalLineItem2.setReferenceId(reconsileRequestModel.getReconcileRrefId());
		journalLineItem2.setCreatedBy(userId);
		journalLineItem2.setJournal(journal);
		journalLineItemList.add(journalLineItem2);

		journal.setJournalLineItems(journalLineItemList);
		journal.setCreatedBy(userId);
		journal.setPostingReferenceType(PostingReferenceTypeEnum.RECONSILE_TRANSACTION_INVOICE);
		journal.setJournalDate(LocalDateTime.now());
		return journal;
	}

	private Journal invoiceReconsile(ReconsileRequestModel reconsileRequestModel, Integer userId) {
		List<JournalLineItem> journalLineItemList = new ArrayList();

		Invoice invoice = invoiceService.findByPK(reconsileRequestModel.getReconcileRrefId());

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

}
