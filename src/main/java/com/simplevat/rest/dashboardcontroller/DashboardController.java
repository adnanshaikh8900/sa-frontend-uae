package com.simplevat.rest.dashboardcontroller;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.constant.TransactionCategoryCodeEnum;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.rest.financialreport.FinancialReportController;
import com.simplevat.rest.financialreport.FinancialReportRestHelper;
import com.simplevat.service.TransactionCategoryClosingBalanceService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.utils.ChartUtil;
import com.simplevat.utils.DateFormatUtil;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.math.BigDecimal;
import java.util.*;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping("/rest/dashboardReport")
public class DashboardController {
	private final Logger logger = LoggerFactory.getLogger(FinancialReportController.class);

	@Autowired
	private ChartUtil chartUtil;

	@Autowired
	private DateFormatUtil dateFormatUtil;

	@Autowired
	private FinancialReportRestHelper financialReportRestHelper;

	@Autowired
	TransactionCategoryClosingBalanceService transactionCategoryClosingBalanceService;

	@Autowired
	TransactionCategoryService transactionCategoryService;


	@GetMapping(value = "/getVatReport")
	public ResponseEntity<Object> getVatReport(@RequestParam Integer monthNo) {

		try {
			Date startDate = null;
			Date endDate =  chartUtil.getEndDate().getTime();
			if (monthNo != null){
				startDate = chartUtil.getStartDate(Calendar.MONTH, -monthNo).getTime();
			}
			else
			{
				startDate = chartUtil.getStartDate(Calendar.YEAR, -1).getTime();
			}
			ReportRequestModel requestModel = new ReportRequestModel();
			requestModel.setStartDate(dateFormatUtil.getDateAsString(startDate, "dd/MM/yyyy"));
			requestModel.setEndDate(dateFormatUtil.getDateAsString(endDate, "dd/MM/yyyy"));
			String chartOfAccountCodes = financialReportRestHelper.getChartOfAccountCategoryCodes("VatReport");
			requestModel.setChartOfAccountCodes(chartOfAccountCodes);
			List<TransactionCategoryClosingBalance> closingBalanceList = transactionCategoryClosingBalanceService.getListByChartOfAccountIds(requestModel);
			Map<String,BigDecimal> output = new HashMap<>();
			if (closingBalanceList != null && !closingBalanceList.isEmpty()) {
				Map<Integer,TransactionCategoryClosingBalance> transactionCategoryClosingBalanceMap = financialReportRestHelper.processTransactionCategoryClosingBalance(closingBalanceList);
				BigDecimal totalInputVat = BigDecimal.ZERO;
				BigDecimal totalOutputVat = BigDecimal.ZERO;

				for (Map.Entry<Integer,TransactionCategoryClosingBalance> entry : transactionCategoryClosingBalanceMap.entrySet())
				{
					TransactionCategoryClosingBalance transactionCategoryClosingBalance = entry.getValue();
					String transactionCategoryCode = transactionCategoryClosingBalance.getTransactionCategory().getChartOfAccount().getChartOfAccountCode();
					BigDecimal closingBalance = transactionCategoryClosingBalance.getClosingBalance();
					if(closingBalance.longValue()<0)
					{	closingBalance = closingBalance.negate();
					}
					ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnum(transactionCategoryCode);
					if (chartOfAccountCategoryCodeEnum == null)
						continue;
					switch (chartOfAccountCategoryCodeEnum)
					{
						case OTHER_CURRENT_LIABILITIES:
							TransactionCategory transactionCategory = transactionCategoryClosingBalance.getTransactionCategory();
							if (transactionCategory.getTransactionCategoryCode().equalsIgnoreCase
									(TransactionCategoryCodeEnum.OUTPUT_VAT.getCode())) {
								output.put("OutputVat", closingBalance);
								totalOutputVat = totalOutputVat.add(closingBalance);
							}
								break;

						case OTHER_CURRENT_ASSET:
							transactionCategory = transactionCategoryClosingBalance.getTransactionCategory();
							if (transactionCategory.getTransactionCategoryCode().equalsIgnoreCase
									(TransactionCategoryCodeEnum.INPUT_VAT.getCode())) {
								output.put("InputVat", closingBalance);
								totalInputVat = totalInputVat.add(closingBalance);
							}
							break;
						default:
							break;
					}
				}
				BigDecimal difference = totalInputVat.subtract(totalOutputVat);
				output.put("Tax payable",difference);
			}
			return new ResponseEntity<>(output, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Profit and Loss Report")
	@GetMapping(value = "/profitandloss")
	public ResponseEntity<Object> getDashboardProfitAndLoss(@RequestParam Integer monthNo) {
		try {
			Date startDate = null;
			Date endDate = chartUtil.getEndDate().getTime();
			if (monthNo != null) {
				startDate = chartUtil.getStartDate(Calendar.MONTH, -monthNo).getTime();
			} else {
				startDate = chartUtil.getStartDate(Calendar.YEAR, -1).getTime();
			}
			ReportRequestModel requestModel = new ReportRequestModel();
			requestModel.setStartDate(dateFormatUtil.getDateAsString(startDate, "dd/MM/yyyy"));
			requestModel.setEndDate(dateFormatUtil.getDateAsString(endDate, "dd/MM/yyyy"));
			String chartOfAccountCodes = financialReportRestHelper.getChartOfAccountCategoryCodes("ProfitLoss");
			requestModel.setChartOfAccountCodes(chartOfAccountCodes);
			List<TransactionCategoryClosingBalance> closingBalanceList = transactionCategoryClosingBalanceService.getListByChartOfAccountIds(requestModel);
			Map<String, BigDecimal> profitMap = new HashMap<>();
			if (closingBalanceList != null && !closingBalanceList.isEmpty()) {
				Map<Integer, TransactionCategoryClosingBalance> transactionCategoryClosingBalanceMap = financialReportRestHelper.processTransactionCategoryClosingBalance(closingBalanceList);
				BigDecimal totalOperatingIncome = BigDecimal.ZERO;
				BigDecimal totalCostOfGoodsSold = BigDecimal.ZERO;
				BigDecimal totalOperatingExpense = BigDecimal.ZERO;

				BigDecimal totalNonOperatingIncome = BigDecimal.ZERO;
				BigDecimal totalNonOperatingExpense = BigDecimal.ZERO;

				for (Map.Entry<Integer, TransactionCategoryClosingBalance> entry : transactionCategoryClosingBalanceMap.entrySet()) {
					TransactionCategoryClosingBalance transactionCategoryClosingBalance = entry.getValue();
					String transactionCategoryCode = transactionCategoryClosingBalance.getTransactionCategory().getChartOfAccount().getChartOfAccountCode();
					String transactionCategoryName = transactionCategoryClosingBalance.getTransactionCategory().getTransactionCategoryName();
					BigDecimal closingBalance = transactionCategoryClosingBalance.getClosingBalance();
					ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnum(transactionCategoryCode);
					if (chartOfAccountCategoryCodeEnum == null)
						continue;
					if (closingBalance.longValue() < 0) {
						closingBalance = closingBalance.negate();
					}
					switch (chartOfAccountCategoryCodeEnum) {
						case INCOME:
							if (transactionCategoryName.equalsIgnoreCase("Sales") ||
									transactionCategoryName.equalsIgnoreCase("Other Charges")) {
								totalOperatingIncome = totalOperatingIncome.add(closingBalance);
							} else {
								totalNonOperatingIncome = totalNonOperatingIncome.add(closingBalance);
							}
							break;
						case ADMIN_EXPENSE:
							totalOperatingExpense = totalOperatingExpense.add(closingBalance);
							break;
						case OTHER_EXPENSE:
							totalNonOperatingExpense = totalNonOperatingExpense.add(closingBalance);
							break;
						case COST_OF_GOODS_SOLD:
							totalCostOfGoodsSold = totalCostOfGoodsSold.add(closingBalance);
							break;
						default:
							break;
					}
				}
				BigDecimal totalIncome = totalOperatingIncome.add(totalNonOperatingIncome);
				BigDecimal totalExpense = totalCostOfGoodsSold.add(totalOperatingExpense).add(totalNonOperatingExpense);
				BigDecimal netProfitLoss = totalIncome.subtract(totalExpense);
				profitMap.put("Income", totalIncome);
				profitMap.put("Expense", totalExpense);
				profitMap.put("NetProfit", netProfitLoss);
			}
			return new ResponseEntity<>(profitMap, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
