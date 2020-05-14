package com.simplevat.rest.detailedgeneralledgerreport;

import java.util.EnumMap;
import java.util.List;
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

@RestController
@RequestMapping("/rest/detailedGeneralLedgerReport")
public class DetailedGeneralLedgerReportController {

	private final Logger logger = LoggerFactory.getLogger(DetailedGeneralLedgerReportController.class);

	@Autowired
	private DetailedGeneralLedgerRestHelper detailedGeneralLedgerRestHelper;

	@ApiOperation(value = "Get list of DateFormat")
	@GetMapping(value = "/getList")
	public ResponseEntity getDateFormat(ReportRequestModel reportRequestModel) {
		Map<DateFormatFilterEnum, Object> filterDataMap = new EnumMap<>(DateFormatFilterEnum.class);
		filterDataMap.put(DateFormatFilterEnum.DELETE_FLAG, false);
		List list = detailedGeneralLedgerRestHelper.getDetailedGeneralLedgerReport(reportRequestModel);
		try {
			if (list == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error("Error", e);
		}
		return new ResponseEntity(list, HttpStatus.OK);
	}

}
