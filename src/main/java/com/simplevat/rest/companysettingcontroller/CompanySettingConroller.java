package com.simplevat.rest.companysettingcontroller;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.entity.CompanySetting;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.CompanySettingService;

@RestController
@RequestMapping("/rest/companySetting")
public class CompanySettingConroller {

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private CompanySettingRestHelper companySettingRestHelper;

	@Autowired
	private CompanySettingService companySettingService;

	@GetMapping(value = "/get")
	public ResponseEntity getSetting() {
		return new ResponseEntity<>(companySettingRestHelper.getModel(companySettingService.getSeting()),
				HttpStatus.OK);
	}

	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody CompanySettingRequestModel requestModel, HttpServletRequest request) {
		int userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		CompanySetting companySetting = companySettingRestHelper.getEntity(requestModel);

		if (companySetting == null) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		companySetting.setLastUpdatedBy(userId);
		companySettingService.update(companySetting);
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
