package com.simplevat.rest.financialreport;

import java.util.EnumMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.dbfilter.DateFormatFilterEnum;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping("/rest/financialReport")
public class FinancialReportController {

	private final Logger logger = LoggerFactory.getLogger(FinancialReportController.class);

	@Autowired
	private FinancialReportRestHelper financialReportRestHelper;

	@ApiOperation(value = "Get Profit and Loss Report")
	@GetMapping(value = "/profitandloss")
	public ResponseEntity<ProfitAndLossResponseModel> getFormat(FinancialReportRequestModel reportRequestModel) {
		Map<DateFormatFilterEnum, Object> filterDataMap = new EnumMap<>(DateFormatFilterEnum.class);
		filterDataMap.put(DateFormatFilterEnum.DELETE_FLAG, false);
		ProfitAndLossResponseModel profitAndLossResponseModel = financialReportRestHelper.getProfitAndLossReport(reportRequestModel);
		try {
			if (profitAndLossResponseModel == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(profitAndLossResponseModel, HttpStatus.OK);
	}

	@ApiOperation(value = "Get BalanceSheet Report")
	@GetMapping(value = "/balanceSheet")
	public ResponseEntity<BalanceSheetResponseModel> getFormatBalanceSheet(FinancialReportRequestModel reportRequestModel){
		Map<DateFormatFilterEnum, Object> filterDataMap = new EnumMap<>(DateFormatFilterEnum.class);
		filterDataMap.put(DateFormatFilterEnum.DELETE_FLAG, false);
		BalanceSheetResponseModel balanceSheetResponseModel=financialReportRestHelper.getBalanceSheetReport(reportRequestModel);

		try {
			if (balanceSheetResponseModel == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(balanceSheetResponseModel, HttpStatus.OK);
	}
}



