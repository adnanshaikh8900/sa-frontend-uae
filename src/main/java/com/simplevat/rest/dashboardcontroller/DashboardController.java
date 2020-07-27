package com.simplevat.rest.dashboardcontroller;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.rest.financialreport.CreditDebitAggregator;
import com.simplevat.rest.financialreport.FinancialReportController;
import com.simplevat.rest.financialreport.FinancialReportRequestModel;
import com.simplevat.service.JournalLineItemService;
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
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping("/rest/dashboardReport")
public class DashboardController {
	private final Logger logger = LoggerFactory.getLogger(FinancialReportController.class);

	@Autowired
	private ChartUtil chartUtil;

	@Autowired
	private JournalLineItemService journalLineItemService;

	@Autowired
	private DateFormatUtil dateFormatUtil;


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
			Map<Integer, CreditDebitAggregator> vatReportMap = journalLineItemService.getTaxReport(startDate,endDate);
			Map<String,BigDecimal> output = new HashMap<>();
			if (vatReportMap != null && !vatReportMap.isEmpty()) {

				Map<String, ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = getChartOfAccountCodeEnumMapForVatReport();
				Double totalInputVat = (double) 0;
				Double totalOutputVat = (double) 0;

				for (Map.Entry<Integer, CreditDebitAggregator> entry : vatReportMap.entrySet()) {
					CreditDebitAggregator creditDebitAggregator = entry.getValue();
					String transactionCategoryCode = creditDebitAggregator.getTransactionCategoryCode();
					ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = chartOfAccountCategoryCodeEnumMap.get(transactionCategoryCode);

					switch (chartOfAccountCategoryCodeEnum) {
						case OTHER_CURRENT_LIABILITIES:
							output.put("OutputVat", BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
							totalOutputVat += creditDebitAggregator.getTotalAmount();
							break;

						case OTHER_CURRENT_ASSET:
							output.put("InputVat", BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
							totalInputVat += creditDebitAggregator.getTotalAmount();
							break;
						default:
							break;
					}

				}
				Double difference = totalInputVat - totalOutputVat;
				output.put("Tax payable",BigDecimal.valueOf(difference));
			}
			return new ResponseEntity<>(output, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}


	private  Map<String,ChartOfAccountCategoryCodeEnum> getChartOfAccountCodeEnumMapForProfitLoss() {
		Map<String,ChartOfAccountCategoryCodeEnum>  stringChartOfAccountCategoryCodeEnumHashMap = new HashMap<>();
		Map <String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnumMap();
		for (Map.Entry<String,ChartOfAccountCategoryCodeEnum> enumEntry : chartOfAccountCategoryCodeEnumMap.entrySet())
		{
			String chartOfAccountCode = enumEntry.getKey();
			if(chartOfAccountCode.startsWith("03")||chartOfAccountCode.startsWith("04"))
				stringChartOfAccountCategoryCodeEnumHashMap.put(chartOfAccountCode,enumEntry.getValue());
		}
		return stringChartOfAccountCategoryCodeEnumHashMap;
	}

	private  Map<String,ChartOfAccountCategoryCodeEnum> getChartOfAccountCodeEnumMapForVatReport() {
		Map<String,ChartOfAccountCategoryCodeEnum>  stringChartOfAccountCategoryCodeEnumHashMap = new HashMap<>();
		Map <String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnumMap();
		for (Map.Entry<String,ChartOfAccountCategoryCodeEnum> enumEntry : chartOfAccountCategoryCodeEnumMap.entrySet())
		{
			String chartOfAccountCode = enumEntry.getKey();
			if(chartOfAccountCode.startsWith("01")||chartOfAccountCode.startsWith("02"))
				stringChartOfAccountCategoryCodeEnumHashMap.put(chartOfAccountCode,enumEntry.getValue());
		}
		return stringChartOfAccountCategoryCodeEnumHashMap;
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
			FinancialReportRequestModel financialReportRequestModel = new FinancialReportRequestModel();
			financialReportRequestModel.setStartDate(dateFormatUtil.getDateAsString(startDate, "dd/MM/yyyy"));
			financialReportRequestModel.setEndDate(dateFormatUtil.getDateAsString(endDate, "dd/MM/yyyy"));
			Map<Integer, CreditDebitAggregator> aggregatedTransactionMap =
					journalLineItemService.getAggregateTransactionCategoryMap(financialReportRequestModel,
							"ProfitAndLoss");
			Map<String, BigDecimal> profitMap = new HashMap<>();
			if (aggregatedTransactionMap != null && !aggregatedTransactionMap.isEmpty()) {
				Map<String, ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap =  getChartOfAccountCodeEnumMapForProfitLoss();
				Double totalOperatingIncome = (double) 0;
				Double totalCostOfGoodsSold = (double) 0;
				Double totalOperatingExpense = (double) 0;
				Double totalNonOperatingIncome = (double) 0;
				Double totalNonOperatingExpense = (double) 0;
				for (Map.Entry<Integer, CreditDebitAggregator> entry : aggregatedTransactionMap.entrySet()) {
					CreditDebitAggregator creditDebitAggregator = entry.getValue();
					String transactionCategoryCode = creditDebitAggregator.getTransactionCategoryCode();
					String transactionCategoryName = creditDebitAggregator.getTransactionCategoryName();
					ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = chartOfAccountCategoryCodeEnumMap.get(transactionCategoryCode);
					switch (chartOfAccountCategoryCodeEnum) {
						case INCOME:
							if (transactionCategoryName.equalsIgnoreCase("Sales") ||
									transactionCategoryName.equalsIgnoreCase("Other Charges")) {
								totalOperatingIncome += creditDebitAggregator.getTotalAmount();
							} else {
								totalNonOperatingIncome += creditDebitAggregator.getTotalAmount();
							}
							break;
						case ADMIN_EXPENSE:
							totalOperatingExpense += creditDebitAggregator.getTotalAmount();
							break;
						case OTHER_EXPENSE:
							totalNonOperatingExpense += creditDebitAggregator.getTotalAmount();
							break;
						case COST_OF_GOODS_SOLD:
							totalCostOfGoodsSold += creditDebitAggregator.getTotalAmount();
							break;
						default:
							break;
					}
				}
				Double totalIncome = totalOperatingIncome + totalNonOperatingIncome;
				Double totalExpense = totalCostOfGoodsSold + totalOperatingExpense + totalNonOperatingExpense;
				Double netProfitLoss = totalIncome - totalExpense;
				profitMap.put("Income", BigDecimal.valueOf(totalIncome));
				profitMap.put("Expense", BigDecimal.valueOf(totalExpense));
				profitMap.put("NetProfit", BigDecimal.valueOf(netProfitLoss));

			}
			return new ResponseEntity<>(profitMap, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
