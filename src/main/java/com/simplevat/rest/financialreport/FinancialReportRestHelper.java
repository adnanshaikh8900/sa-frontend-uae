package com.simplevat.rest.financialreport;

import java.math.BigDecimal;
import java.util.*;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.service.JournalLineItemService;

@Component
public class FinancialReportRestHelper {

	@Autowired
	private JournalLineItemService journalLineItemService;

	/**
	 *
	 * @param reportRequestModel
	 * @return
	 */
	public ProfitAndLossResponseModel getProfitAndLossReport(FinancialReportRequestModel reportRequestModel) {

		ProfitAndLossResponseModel responseModel = new ProfitAndLossResponseModel();
		Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = journalLineItemService.getAggregateTransactionCategoryMap(reportRequestModel);

		if (aggregatedTransactionMap != null && !aggregatedTransactionMap.isEmpty()) {

			Map<String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = getChartOfAccountCodeEnumMapForProfitLoss();
			Double totalOperatingIncome = (double) 0;
			Double totalCostOfGoodsSold = (double) 0;
			Double totalOperatingExpense = (double) 0;

			Double totalNonOperatingIncome = (double) 0;
			Double totalNonOperatingExpense = (double) 0;

			for (Map.Entry<Integer,CreditDebitAggregator> entry : aggregatedTransactionMap.entrySet())
			{
				CreditDebitAggregator creditDebitAggregator = entry.getValue();
				String transactionCategoryCode = creditDebitAggregator.getTransactionCategoryCode();
                String transactionCategoryName = creditDebitAggregator.getTransactionCategoryName();
				ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = chartOfAccountCategoryCodeEnumMap.get(transactionCategoryCode);

				switch (chartOfAccountCategoryCodeEnum)
				{
					case INCOME:
						if(transactionCategoryName.equalsIgnoreCase("Sales") ||
								transactionCategoryName.equalsIgnoreCase("Other Charges"))
						{
							responseModel.getOperatingIncome().put(transactionCategoryName,
									BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
							totalOperatingIncome += creditDebitAggregator.getTotalAmount();
						}
						else
						{
							responseModel.getNonOperatingIncome().put(transactionCategoryName,
									BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
							totalNonOperatingIncome += creditDebitAggregator.getTotalAmount();
						}
						break;
					case ADMIN_EXPENSE:
						responseModel.getOperatingExpense().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						totalOperatingExpense  += creditDebitAggregator.getTotalAmount();
						break;

                        case OTHER_EXPENSE:
							responseModel.getNonOperatingExpense().put(transactionCategoryName,
									BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
 						totalNonOperatingExpense += creditDebitAggregator.getTotalAmount();
						break;
					case COST_OF_GOODS_SOLD:
						responseModel.getCostOfGoodsSold().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						totalCostOfGoodsSold += creditDebitAggregator.getTotalAmount();
						break;
					default:
						break;
				}
			}
          responseModel.setTotalOperatingIncome(BigDecimal.valueOf(totalOperatingIncome));
		  responseModel.setTotalCostOfGoodsSold(BigDecimal.valueOf(totalCostOfGoodsSold));

		  Double grossProfit = totalOperatingIncome-totalCostOfGoodsSold;
		  responseModel.setGrossProfit(BigDecimal.valueOf(grossProfit));

		  responseModel.setTotalOperatingExpense(BigDecimal.valueOf(totalOperatingExpense));

		  Double operatingProfit = grossProfit - totalOperatingExpense;
		  responseModel.setOperatingProfit(BigDecimal.valueOf(operatingProfit));

		  responseModel.setTotalNonOperatingIncome(BigDecimal.valueOf(totalNonOperatingIncome));
		  responseModel.setTotalNonOperatingExpense(BigDecimal.valueOf(totalNonOperatingExpense));
		  Double totalNonOperatingIncomeLoss = totalNonOperatingIncome - totalNonOperatingExpense;
          responseModel.setNonOperatingIncomeExpense(BigDecimal.valueOf(totalNonOperatingIncomeLoss));

          Double netProfitLoss = operatingProfit + totalNonOperatingIncomeLoss;
          responseModel.setNetProfitLoss(BigDecimal.valueOf(netProfitLoss));

		}
		return responseModel;
	}

	/**
	 *
	 * @return
	 */
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

}
