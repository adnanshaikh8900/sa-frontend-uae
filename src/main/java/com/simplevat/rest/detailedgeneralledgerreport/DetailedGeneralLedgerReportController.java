package com.simplevat.rest.detailedgeneralledgerreport;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.dbfilter.DateFormatFilterEnum;
import com.simplevat.entity.DateFormat;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.dateformatcontroller.DateFormatResponseModel;
import com.simplevat.security.JwtTokenUtil;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/rest/detailedGeneralLedgerReport")
public class DetailedGeneralLedgerReportController implements Serializable{

	@Autowired
	private JwtTokenUtil jwtTokenUtil;		

	@Autowired
	private DetailedGeneralLedgerRestHelper detailedGeneralLedgerRestHelper;

	@ApiOperation(value = "Get list of DateFormat")
	@GetMapping(value = "/getList")
	private ResponseEntity getDateFormat(ReportRequestModel reportRequestModel) {

		Map<DateFormatFilterEnum, Object> filterDataMap = new HashMap();

		filterDataMap.put(DateFormatFilterEnum.DELETE_FLAG, false);

		List list = detailedGeneralLedgerRestHelper
				.getDetailedGeneralLedgerReport1(reportRequestModel);

		try {
			if (list == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(list, HttpStatus.OK);
	}

}
