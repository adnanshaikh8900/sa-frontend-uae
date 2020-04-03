package com.simplevat.rest.companysettingcontroller;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.CompanySetting;
import com.simplevat.service.CompanySettingService;

@Component
public class CompanySettingRestHelper {

	@Autowired
	private CompanySettingService companySeetingService;

	public CompanySettingModel getModel(CompanySetting companyStting) {

		if (companyStting != null) {
			CompanySettingModel companySettingModel = new CompanySettingModel();
			BeanUtils.copyProperties(companyStting, companySettingModel);
			return companySettingModel;
		}
		return null;
	}

	public CompanySetting getEntity(CompanySettingRequestModel companySettingReqModel) {

		if (companySettingReqModel != null) {

			CompanySetting companySetting = new CompanySetting();

			if (companySettingReqModel.getId() != null) {
				companySetting = companySeetingService.findByPK(companySettingReqModel.getId());
			}
			BeanUtils.copyProperties(companySettingReqModel, companySetting);

			return companySetting;
		}
		return null;
	}

}
