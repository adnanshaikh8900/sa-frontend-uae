package com.simplevat.rest.financialreport;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.*;

import com.simplevat.constant.ChartOfAccountCategoryCodeEnum;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.model.TrialBalanceResponseModel;
import com.simplevat.rest.detailedgeneralledgerreport.ReportRequestModel;
import com.simplevat.service.TransactionCategoryClosingBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.service.JournalLineItemService;

@Component
public class FinancialReportRestHelper {

	@Autowired
	private JournalLineItemService journalLineItemService;
	@Autowired
	TransactionCategoryClosingBalanceService transactionCategoryClosingBalanceService;

	/**
	 *
	 * @param reportRequestModel
	 * @return
	 */
	public BalanceSheetResponseModel getBalanceSheetReport(FinancialReportRequestModel reportRequestModel){

		BalanceSheetResponseModel balanceSheetResponseModel= new BalanceSheetResponseModel();
		Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = journalLineItemService.getAggregateTransactionCategoryMap(reportRequestModel,"BalanceSheet");

		if (aggregatedTransactionMap != null && !aggregatedTransactionMap.isEmpty()) {

			Map<String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = getChartOfAccountCodeEnumMapForBalanceSheet();
			Double totalCurrentAssets = (double) 0;
			Double totalAccumulatedDepriciation = (double) 0;
			Double totalOtherCurrentAssets = (double) 0;
			Double totalFixedAssets = (double) 0;
			Double totalAccountReceivable =(double)0;
			Double totalAccountPayable =(double)0;
			Double totalOtherCurrentLiability = (double) 0;
			Double totalLiability = (double) 0;
			Double totalOtherLiability = (double) 0;
			Double totalEquities = (double) 0;

			Double totalBank = (double) 0;

			for (Map.Entry<Integer,CreditDebitAggregator> entry : aggregatedTransactionMap.entrySet()) {
				CreditDebitAggregator creditDebitAggregator = entry.getValue();
				String transactionCategoryCode = creditDebitAggregator.getTransactionCategoryCode();
				String transactionCategoryName = creditDebitAggregator.getTransactionCategoryName();
				ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = chartOfAccountCategoryCodeEnumMap.get(transactionCategoryCode);

				switch (chartOfAccountCategoryCodeEnum) {
					case BANK:
						balanceSheetResponseModel.getBank().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
						totalBank += creditDebitAggregator.getActualAmount();
						break;

					case CURRENT_ASSET:
						balanceSheetResponseModel.getCurrentAssets().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
						totalCurrentAssets += creditDebitAggregator.getActualAmount();
						break;

					case ACCOUNTS_RECEIVABLE:
						totalAccountReceivable += creditDebitAggregator.getActualAmount();
						break;

					case FIXED_ASSET:
						balanceSheetResponseModel.getFixedAssets().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						if(transactionCategoryName.contains("Depreciation")){
							totalAccumulatedDepriciation+=creditDebitAggregator.getTotalAmount();
						}
						totalFixedAssets += creditDebitAggregator.getTotalAmount();
						break;

					case OTHER_CURRENT_ASSET:
						balanceSheetResponseModel.getOtherCurrentAssets().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						totalOtherCurrentAssets += creditDebitAggregator.getTotalAmount();
						break;

					case OTHER_LIABILITY:
						balanceSheetResponseModel.getOtherLiability().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						totalOtherLiability += creditDebitAggregator.getTotalAmount();
						break;

					case ACCOUNTS_PAYABLE:
						totalAccountPayable += creditDebitAggregator.getActualAmount();
						break;

					case OTHER_CURRENT_LIABILITIES:
						balanceSheetResponseModel.getOtherCurrentLiability().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						totalOtherCurrentLiability += creditDebitAggregator.getTotalAmount();
						break;

					case EQUITY:
						balanceSheetResponseModel.getEquities().put(transactionCategoryName,
								BigDecimal.valueOf(creditDebitAggregator.getTotalAmount()));
						totalEquities += creditDebitAggregator.getTotalAmount();
						break;

					default:
						break;
				}
			}
			balanceSheetResponseModel.setTotalBank(BigDecimal.valueOf(totalBank));
			totalCurrentAssets+=totalBank+totalAccountReceivable+totalOtherCurrentAssets;
			balanceSheetResponseModel.setTotalCurrentAssets(BigDecimal.valueOf(totalCurrentAssets));
			balanceSheetResponseModel.setTotalAccountReceivable(BigDecimal.valueOf(totalAccountReceivable));
			balanceSheetResponseModel.setTotalOtherCurrentAssets(BigDecimal.valueOf(totalOtherCurrentAssets));
			totalFixedAssets=totalFixedAssets-totalAccumulatedDepriciation;
			balanceSheetResponseModel.setTotalFixedAssets(BigDecimal.valueOf(totalFixedAssets));
			double totalAssets = totalCurrentAssets+totalFixedAssets;
			balanceSheetResponseModel.setTotalAssets(BigDecimal.valueOf(totalAssets));

			balanceSheetResponseModel.setTotalOtherLiability(BigDecimal.valueOf(totalOtherLiability));
			balanceSheetResponseModel.setTotalOtherCurrentLiability(BigDecimal.valueOf(totalOtherCurrentLiability));
			double totalLiabilities = totalOtherLiability+totalOtherCurrentLiability+totalAccountPayable;
			balanceSheetResponseModel.setTotalLiability(BigDecimal.valueOf(totalLiabilities));
			balanceSheetResponseModel.setTotalAccountPayable(BigDecimal.valueOf(totalAccountPayable));
			balanceSheetResponseModel.setTotalEquities(BigDecimal.valueOf(totalEquities));
			double totalLiabilityEquities =totalLiabilities+totalEquities;
			balanceSheetResponseModel.setTotalLiabilityEquities(BigDecimal.valueOf(totalLiabilityEquities));

		}


		return balanceSheetResponseModel;
	}
	public ProfitAndLossResponseModel getProfitAndLossReport(FinancialReportRequestModel reportRequestModel) {

		ProfitAndLossResponseModel responseModel = new ProfitAndLossResponseModel();
		Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = journalLineItemService.getAggregateTransactionCategoryMap(reportRequestModel, "ProfitAndLoss");

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

	private  Map<String,ChartOfAccountCategoryCodeEnum> getChartOfAccountCodeEnumMapForBalanceSheet() {
		Map<String,ChartOfAccountCategoryCodeEnum>  stringChartOfAccountCategoryCodeEnumHashMap = new HashMap<>();
		Map <String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnumMap();
		for (Map.Entry<String,ChartOfAccountCategoryCodeEnum> enumEntry : chartOfAccountCategoryCodeEnumMap.entrySet())
		{
			String chartOfAccountCode = enumEntry.getKey();
			if(chartOfAccountCode.startsWith("01")||chartOfAccountCode.startsWith("02")||chartOfAccountCode.startsWith("05"))
				stringChartOfAccountCategoryCodeEnumHashMap.put(chartOfAccountCode,enumEntry.getValue());
		}
		return stringChartOfAccountCategoryCodeEnumHashMap;
	}

	public TrialBalanceResponseModel getTrialBalanceReport(FinancialReportRequestModel reportRequestModel) {
		TrialBalanceResponseModel trialBalanceResponseModel = new TrialBalanceResponseModel();
		ReportRequestModel requestModel = new ReportRequestModel();
		requestModel.setStartDate(reportRequestModel.getStartDate());
		requestModel.setEndDate(reportRequestModel.getEndDate());
		List<TransactionCategoryClosingBalance> closingBalanceList = transactionCategoryClosingBalanceService.getList(requestModel);

		if (closingBalanceList != null && !closingBalanceList.isEmpty()) {
			Map<Integer,TransactionCategoryClosingBalance> transactionCategoryClosingBalanceMap = processTransactionCategoryClosingBalance(closingBalanceList);
			Map<String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = getChartOfAccountCodeEnumMapForTrialBalance();
			BigDecimal totalDebitAmount = BigDecimal.ZERO;
			BigDecimal totalCreditAmount = BigDecimal.ZERO;

			for (Map.Entry<Integer,TransactionCategoryClosingBalance> entry : transactionCategoryClosingBalanceMap.entrySet())
			{
				TransactionCategoryClosingBalance transactionCategoryClosingBalance = entry.getValue();
				String transactionCategoryCode = transactionCategoryClosingBalance.getTransactionCategory().getChartOfAccount().getChartOfAccountCode();
				String transactionCategoryName = transactionCategoryClosingBalance.getTransactionCategory().getTransactionCategoryName();
				BigDecimal closingBalance = transactionCategoryClosingBalance.getClosingBalance();
				Boolean isDebitFlag = false;
				if(closingBalance.longValue()<0)
				{	closingBalance = closingBalance.negate();
					isDebitFlag = true;

				}
				ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = chartOfAccountCategoryCodeEnumMap.
						get(transactionCategoryCode);
				switch (chartOfAccountCategoryCodeEnum)
				{
					case ACCOUNTS_RECEIVABLE:
						trialBalanceResponseModel.getAccountReceivable().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
							{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;

					case BANK:
						trialBalanceResponseModel.getBank().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;
					case OTHER_CURRENT_ASSET:
						//if (transactionCategoryName.equalsIgnoreCase("Input Vat"))
					//	{
							trialBalanceResponseModel.getAssets().put(transactionCategoryName,
									closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
					//	}
						break;
					case FIXED_ASSET:
						trialBalanceResponseModel.getFixedAsset().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;

					case ACCOUNTS_PAYABLE:
						trialBalanceResponseModel.getAccountpayable().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;
					case OTHER_LIABILITY:
					case OTHER_CURRENT_LIABILITIES:
						trialBalanceResponseModel.getLiabilities().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}

						break;
					case EQUITY:
						trialBalanceResponseModel.getEquities().put(transactionCategoryName,closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;
					case INCOME:

						trialBalanceResponseModel.getIncome().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;
					case ADMIN_EXPENSE:
					case OTHER_EXPENSE:
					case COST_OF_GOODS_SOLD:
						trialBalanceResponseModel.getExpense().put(transactionCategoryName,
								closingBalance);
						if(isDebitFlag) {
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Debit");
							totalDebitAmount = totalDebitAmount.add(closingBalance);
						}else
						{
							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName, "Credit");
							totalCreditAmount = totalCreditAmount.add(closingBalance);
						}
						break;
					default:
						break;
				}
			}
			trialBalanceResponseModel.setTotalCreditAmount(totalCreditAmount);
			trialBalanceResponseModel.setTotalDebitAmount(totalDebitAmount);
		}
		return trialBalanceResponseModel;
	}
//    public TrialBalanceResponseModel getTrialBalanceReport(FinancialReportRequestModel reportRequestModel) {
//        TrialBalanceResponseModel trialBalanceResponseModel = new TrialBalanceResponseModel();
//        Map<Integer, CreditDebitAggregator> aggregatedTransactionMap = journalLineItemService.getAggregateTransactionCategoryMap(reportRequestModel,"TrialBalance");
//		ReportRequestModel requestModel = new ReportRequestModel();
//		requestModel.setStartDate(reportRequestModel.getStartDate());
//		requestModel.setEndDate(reportRequestModel.getEndDate());
//        List<TransactionCategoryClosingBalance> closingBalanceList = transactionCategoryClosingBalanceService.getList(requestModel);
//
//		if (aggregatedTransactionMap != null && !aggregatedTransactionMap.isEmpty()) {
//            Map<String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = getChartOfAccountCodeEnumMapForTrialBalance();
//            Double totalDebitAmount = (double) 0;
//			Double totalCreditAmount = (double) 0;
//
//            for (Map.Entry<Integer,CreditDebitAggregator> entry : aggregatedTransactionMap.entrySet())
//            {
//                CreditDebitAggregator creditDebitAggregator = entry.getValue();
//                String transactionCategoryCode = creditDebitAggregator.getTransactionCategoryCode();
//                String transactionCategoryName = creditDebitAggregator.getTransactionCategoryName();
//                ChartOfAccountCategoryCodeEnum chartOfAccountCategoryCodeEnum = chartOfAccountCategoryCodeEnumMap.get(transactionCategoryCode);
//                switch (chartOfAccountCategoryCodeEnum)
//                {
//                    case ACCOUNTS_RECEIVABLE:
//                        trialBalanceResponseModel.getAccountReceivable().put(transactionCategoryName,
//                                BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Debit");
//						totalDebitAmount += creditDebitAggregator.getActualAmount();
//                        break;
//
//                    case BANK:
//                        trialBalanceResponseModel.getBank().put(transactionCategoryName,
//                                BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Debit");
//						totalDebitAmount +=creditDebitAggregator.getActualAmount();
//                        break;
//                    case OTHER_CURRENT_ASSET:
//                        if (transactionCategoryName.equalsIgnoreCase("Input Vat"))
//                        {
//                            trialBalanceResponseModel.getAssets().put(transactionCategoryName,
//                                    BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Debit");
//							totalDebitAmount +=creditDebitAggregator.getActualAmount();
//                        }
//                        break;
//                    case FIXED_ASSET:
//                        trialBalanceResponseModel.getFixedAsset().put(transactionCategoryName,
//                                BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						if(transactionCategoryName.contains("Depreciation")){
//							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Credit");
//							totalCreditAmount +=creditDebitAggregator.getActualAmount();
//						}
//						else {
//							totalDebitAmount +=creditDebitAggregator.getActualAmount();
//							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Debit");
//						}
//                        break;
//
//                    case ACCOUNTS_PAYABLE:
//                        trialBalanceResponseModel.getAccountpayable().put(transactionCategoryName,
//                                BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Credit");
//						totalCreditAmount += creditDebitAggregator.getActualAmount();
//                        break;
//                    case OTHER_LIABILITY:
//
//                    	trialBalanceResponseModel.getLiabilities().put(transactionCategoryName,
//								BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Credit");
//                    	totalCreditAmount += creditDebitAggregator.getActualAmount();
//
//                        break;
//                    case EQUITY:
//                        if(transactionCategoryName.equalsIgnoreCase("Drawing")||
//                                transactionCategoryName.equalsIgnoreCase("Owner's Capital"))
//
//                        {
//                            trialBalanceResponseModel.getEquities().put(transactionCategoryName,
//                                    BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Debit");
//                            totalDebitAmount +=creditDebitAggregator.getActualAmount();
//                        }
//                        else if( transactionCategoryName.equalsIgnoreCase("Owner's Equity")||
//								transactionCategoryName.equalsIgnoreCase("Retained Earnings")){
//							trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Credit");
//							totalCreditAmount +=creditDebitAggregator.getActualAmount();
//                        }
//                        break;
//                    case INCOME:
//
//                            trialBalanceResponseModel.getIncome().put(transactionCategoryName,
//                                    BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Credit");
//							totalCreditAmount +=creditDebitAggregator.getActualAmount();
//
//                        break;
//                    case ADMIN_EXPENSE:
//                    case OTHER_EXPENSE:
//                        trialBalanceResponseModel.getExpense().put(transactionCategoryName,
//                                BigDecimal.valueOf(creditDebitAggregator.getActualAmount()));
//						trialBalanceResponseModel.getTransactionCategoryMapper().put(transactionCategoryName,"Debit");
//						totalDebitAmount  +=creditDebitAggregator.getActualAmount();
//                        break;
//                    default:
//                        break;
//                }
//            }
//            trialBalanceResponseModel.setTotalCreditAmount(BigDecimal.valueOf(totalCreditAmount));
//            trialBalanceResponseModel.setTotalDebitAmount(BigDecimal.valueOf(totalDebitAmount));
//
//        }
//        return trialBalanceResponseModel;
//    }

	private Map<Integer, TransactionCategoryClosingBalance> processTransactionCategoryClosingBalance(List<TransactionCategoryClosingBalance> closingBalanceList) {
		Map<Integer, TransactionCategoryClosingBalance> transactionCategoryClosingBalanceMap = new HashMap<>();
		for(TransactionCategoryClosingBalance transactionCategoryClosingBalance :closingBalanceList)
		{
			TransactionCategoryClosingBalance tempTransactionCategoryClosingBalance = transactionCategoryClosingBalanceMap.get(transactionCategoryClosingBalance.getTransactionCategory().getTransactionCategoryId());

			if(tempTransactionCategoryClosingBalance==null)
			{
				tempTransactionCategoryClosingBalance = new TransactionCategoryClosingBalance();
				tempTransactionCategoryClosingBalance.setOpeningBalance(transactionCategoryClosingBalance.getOpeningBalance());
				tempTransactionCategoryClosingBalance.setClosingBalance(transactionCategoryClosingBalance.getClosingBalance());
				tempTransactionCategoryClosingBalance.setClosingBalanceDate(transactionCategoryClosingBalance.getClosingBalanceDate());
				tempTransactionCategoryClosingBalance.setTransactionCategory(transactionCategoryClosingBalance.getTransactionCategory());
				transactionCategoryClosingBalanceMap.put(transactionCategoryClosingBalance.getTransactionCategory().getTransactionCategoryId(),tempTransactionCategoryClosingBalance);
			}
			else
				tempTransactionCategoryClosingBalance.setOpeningBalance(transactionCategoryClosingBalance.getOpeningBalance());
			tempTransactionCategoryClosingBalance.setCreatedDate(Date.from(transactionCategoryClosingBalance.getClosingBalanceDate().atZone(ZoneId.systemDefault()).toInstant()));
		}
		return transactionCategoryClosingBalanceMap;
	}
	/**
	 *
	 * @return
	 */
	private  Map<String,ChartOfAccountCategoryCodeEnum> getChartOfAccountCodeEnumMapForTrialBalance() {
		Map<String,ChartOfAccountCategoryCodeEnum>  stringChartOfAccountCategoryCodeEnumHashMap = new HashMap<>();
		Map <String,ChartOfAccountCategoryCodeEnum> chartOfAccountCategoryCodeEnumMap = ChartOfAccountCategoryCodeEnum.getChartOfAccountCategoryCodeEnumMap();
		for (Map.Entry<String,ChartOfAccountCategoryCodeEnum> enumEntry : chartOfAccountCategoryCodeEnumMap.entrySet())
		{
			String chartOfAccountCode = enumEntry.getKey();
			if(chartOfAccountCode.startsWith("01") || chartOfAccountCode.startsWith("02") ||
					chartOfAccountCode.startsWith("03") || chartOfAccountCode.startsWith("04") ||
					chartOfAccountCode.startsWith("05"))
				stringChartOfAccountCategoryCodeEnumHashMap.put(chartOfAccountCode,enumEntry.getValue());
		}
		return stringChartOfAccountCategoryCodeEnumHashMap;
	}
}
