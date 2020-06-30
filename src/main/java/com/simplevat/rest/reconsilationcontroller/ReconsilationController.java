
package com.simplevat.rest.reconsilationcontroller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.simplevat.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.entity.ChartOfAccountCategory;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.InviceSingleLevelDropdownModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.rest.transactioncategorycontroller.TranscationCategoryHelper;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.bankaccount.TransactionService;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping("/rest/reconsile")
public class ReconsilationController {

	private final Logger logger = LoggerFactory.getLogger(ReconsilationController.class);

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
			Map<String, Object> param = new HashMap<>();
			List<TransactionCategory> transactionCatList = new ArrayList<>();
			List<Object> list = new ArrayList<>();

			switch (ChartOfAccountCategoryIdEnumConstant.get(category.getChartOfAccountCategoryId())) {
			case SALES:
				param = new HashMap<>();
				param.put("deleteFlag", false);
				param.put("type", 2);
				/*List<Invoice> invList = invoiceService.findByAttributes(param);
				List<InviceSingleLevelDropdownModel> invModelList = new ArrayList<>();

				for (Invoice invice : invList) {
					invModelList.add(new InviceSingleLevelDropdownModel(invice.getId(), invice.getReferenceNumber()
							+ " (" + invice.getTotalAmount() + " " + invice.getCurrency().getCurrencyName()+")",
							invice.getTotalAmount()));
				}

				list.add(new SingleLevelDropDownModel("Customer", contactService.getContactForDropdown(2)));
				param = new HashMap<>();
				param.put("label", "Sales Invoice");
				param.put("options", invModelList);
				list.add(param);*/
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

}
