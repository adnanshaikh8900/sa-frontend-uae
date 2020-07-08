
package com.simplevat.rest.reconsilationcontroller;

import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.ChartOfAccountCategory;
import com.simplevat.entity.bankaccount.ReconcileStatus;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.rest.transactioncategorycontroller.TranscationCategoryHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.*;
import com.simplevat.service.bankaccount.ReconcileStatusService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.impl.TransactionCategoryClosingBalanceServiceImpl;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping("/rest/reconsile")
public class ReconsilationController {

	private final Logger logger = LoggerFactory.getLogger(ReconsilationController.class);

	@Autowired
	private ReconcileStatusService reconcileStatusService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private ReconsilationRestHelper reconsilationRestHelper;

	@Autowired
	private InvoiceService invoiceService;

	@Autowired
	private TranscationCategoryHelper transcationCategoryHelper;

	@Autowired
	private ChartOfAccountCategoryService chartOfAccountCategoryService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private TransactionService transactionService;

	@Autowired
	TransactionCategoryClosingBalanceServiceImpl transactionCategoryClosingBalanceService;

	@GetMapping(value = "/getByReconcilationCatCode")
	public ResponseEntity<List<ReconsilationListModel>> getByReconcilationCatCode(
			@RequestParam int reconcilationCatCode) {
		try {
			return new ResponseEntity<>(
					reconsilationRestHelper.getList(ReconsileCategoriesEnumConstant.get(reconcilationCatCode)),
					HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/getTransactionCat")
	public ResponseEntity getTransactionCategory(@RequestParam Integer chartOfAccountCategoryId) {
		try {
			ChartOfAccountCategory category = chartOfAccountCategoryService.findByPK(chartOfAccountCategoryId);
			Map<String, Object> param = null;
			List<TransactionCategory> transactionCatList = null;
			List<Object> list = new ArrayList<>();

			switch (ChartOfAccountCategoryIdEnumConstant.get(category.getChartOfAccountCategoryId())) {
				case SALES:
					param = new HashMap<>();
					param.put("deleteFlag", false);
					param.put("type", 2);
					transactionCatList = transactionCategoryService
							.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
					return new ResponseEntity<>(
							new ReconsilationCatDataModel(list,
									transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
							HttpStatus.OK);

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
											userServiceNew.getUserForDropdown()/*
										employeeService.getEmployeesForDropdown()*/)),
									transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
							HttpStatus.OK);

				case TRANSFERD_TO:
				case MONEY_SPENT_OTHERS:
				case MONEY_SPENT:
				case PURCHASE_OF_CAPITAL_ASSET:
				case TRANSFER_FROM:
				case REFUND_RECEIVED:
				case INTEREST_RECEVIED:
				case MONEY_RECEIVED_OTHERS:
				case DISPOSAL_OF_CAPITAL_ASSET:
				case MONEY_RECEIVED:

					transactionCatList = transactionCategoryService
							.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
					if (transactionCatList != null && !transactionCatList.isEmpty())
						return new ResponseEntity<>(
								new ReconsilationCatDataModel(null,
										transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
								HttpStatus.OK);
					break;
				case DEFAULT:
					transactionCatList = transactionCategoryService
							.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
					if (transactionCatList != null && !transactionCatList.isEmpty())
						return new ResponseEntity<>(
								new ReconsilationCatDataModel(null,
										transcationCategoryHelper.getSinleLevelDropDownModelList(transactionCatList)),
								HttpStatus.OK);
			}

			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}


	@ApiOperation(value = "Get ReconcileStatusList")
	@GetMapping(value = "/list")
	public ResponseEntity<PaginationResponseModel> getAllReconcileStatus(ReconcileStatusRequestModel filterModel) {


		Map<TransactionFilterEnum, Object> dataMap = new EnumMap<>(TransactionFilterEnum.class);

		if (filterModel.getBankId() != null) {
			dataMap.put(TransactionFilterEnum.BANK_ID, bankAccountService.findByPK(filterModel.getBankId()));
		}

		PaginationResponseModel response = reconcileStatusService.getAllReconcileStatusList(dataMap, filterModel);
		if (response == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		response.setData(reconsilationRestHelper.getModelList(response.getData()));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@ApiOperation(value = "Add New ReconcileStatus")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@RequestParam Integer bankAccountId, @RequestParam BigDecimal closingBalance) {
		try {
			ReconcileStatus reconcileStatus = new ReconcileStatus();
			reconcileStatus.setBankAccount(bankAccountService.getBankAccountById(bankAccountId));
			reconcileStatus.setClosingBalance(closingBalance);
			reconcileStatus.setReconciledDuration("1 Month");
			Date date = new Date();
			reconcileStatus.setReconciledDate(Instant.ofEpochMilli(date.getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime());
			reconcileStatusService.persist(reconcileStatus);
			return new ResponseEntity<>("Saved Successfully", HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "/reconcilenow")
	public ResponseEntity<ReconcilationResponseModel> reconcileNow(@ModelAttribute ReconcilationPersistModel reconcilationPersistModel,
																   HttpServletRequest request) {
		try {
			ReconcilationResponseModel responseModel = new ReconcilationResponseModel();
			LocalDateTime reconcileDate = reconsilationRestHelper.getDateFromRequest(reconcilationPersistModel);
			ReconcileStatus status = reconsilationRestHelper.getReconcileStatus(reconcilationPersistModel);
			LocalDateTime startDate = null;
			if (status == null) {
				startDate = transactionService.getTransactionStartDateToReconcile(reconcileDate, reconcilationPersistModel.getBankId());
			} else {
				startDate = status.getReconciledDate();
			}
			Integer unexplainedTransaction = 1;
			if (startDate.isEqual(reconcileDate))
				unexplainedTransaction = -1;
			else
				unexplainedTransaction = transactionService.isTransactionsReadyForReconcile(startDate, reconcileDate, reconcilationPersistModel.getBankId());
			if (unexplainedTransaction == 0) {
				//1 check if this matches with closing balance
				BigDecimal closingBalance = reconcilationPersistModel.getClosingBalance();
				;
				BigDecimal dbClosingBalance = transactionCategoryClosingBalanceService.matchClosingBalanceForReconcile(reconcileDate,
						bankAccountService.getBankAccountById(reconcilationPersistModel.getBankId()).getTransactionCategory());
				boolean isClosingBalanceMatches = dbClosingBalance.equals(closingBalance);
//				boolean isClosingBalanceMatches = transactionService.matchClosingBalanceForReconcile(reconcileDate,closingBalance,
//						reconcilationPersistModel.getBankId());
				if (isClosingBalanceMatches) {
					transactionService.updateTransactionStatusReconcile(startDate, reconcileDate, reconcilationPersistModel.getBankId());
					ReconcileStatus reconcileStatus = new ReconcileStatus();
					reconcileStatus.setReconciledDate(reconcileDate);
					reconcileStatus.setReconciledStartDate(startDate);
					reconcileStatus.setBankAccount(bankAccountService.findByPK(reconcilationPersistModel.getBankId()));
					reconcileStatus.setClosingBalance(closingBalance);
					reconcileStatusService.persist(reconcileStatus);
					responseModel.setStatus(1);
					responseModel.setMessage("Reconciled Successfully..");
					return new ResponseEntity<>(responseModel, HttpStatus.OK);
				} else {
					responseModel.setStatus(2);
					responseModel.setMessage("Failed Reconciling. Closing Balance in System " + dbClosingBalance + " does not matches with the given Closing Balance");
					return new ResponseEntity<>(responseModel, HttpStatus.OK);
				}
			} else if (unexplainedTransaction == -1) {
				responseModel.setStatus(3);
				responseModel.setMessage("The Transactions in Bank Account are already reconciled for the given date");
				return new ResponseEntity<>(responseModel, HttpStatus.OK);
			} else {    /*
			 *  Send unexplainedTransaction still pending to be explained.
			 */
				responseModel.setStatus(4);
				responseModel.setMessage("Failed Reconciling. Please update the remaining " + unexplainedTransaction + " unexplained transactions before reconciling");
				return new ResponseEntity<>(responseModel, HttpStatus.OK);
			}

		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
