package com.simplevat.rest.companycontroller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.Company;
import com.simplevat.service.CompanyService;
import com.simplevat.service.CountryService;
import com.simplevat.service.IndustryTypeService;

@Component
public class CompanyRestHelper {

	@Autowired
	private CompanyService companyService;

	@Autowired
	private IndustryTypeService industryTypeService;

	@Autowired
	private CountryService countryService;

	public List<CompanyModel> getModelList(List<Company> companyList) {

		List<CompanyModel> coModelList = new ArrayList<CompanyModel>();

		if (companyList != null && companyList.size() > 0) {

			for (Company company : companyList) {
				CompanyModel companyModel = new CompanyModel();

				companyModel.setId(company.getCompanyId());
				companyModel.setCompanyName(company.getCompanyName());
				companyModel.setCompanyId(company.getCompanyIdStr());
				companyModel.setPhoneNumber(company.getPhoneNumber());
				coModelList.add(companyModel);
			}
		}

		return coModelList;
	}

	public CompanyModel getModel(Company company) {

		if (company != null) {
			CompanyModel companyModel = new CompanyModel();

			companyModel.setId(company.getCompanyId());
			companyModel.setCompanyName(company.getCompanyName());
			companyModel.setCompanyId(company.getCompanyIdStr());
			companyModel.setPhoneNumber(company.getPhoneNumber());
			if (company.getIndustryTypeCode() != null) {
				companyModel.setIndustryTypeCode(company.getCompanyTypeCode().getId());
			}
			companyModel.setCompanyAddressLine1(company.getCompanyAddressLine1());
			companyModel.setCompanyAddressLine2(company.getCompanyAddressLine2());
			companyModel.setCompanyCity(company.getCompanyCity());
			if (company.getCompanyCountryCode() != null) {
				companyModel.setCompanycountryCode(company.getCompanyCountryCode().getCountryCode());
			}
			companyModel.setCompanyState(company.getCompanyStateRegion());
			companyModel.setCompanyPostZipCode(companyModel.getCompanyPostZipCode());
			companyModel.setEmailAddress(company.getEmailAddress());
			companyModel.setVatRegistrationNumber(company.getVatRegistrationNumber());
			companyModel.setContactPersionName(company.getContactPersionName());

			return companyModel;
		}

		return null;
	}

	public Company getEntity(CompanyModel companyModel) {

		if (companyModel != null) {

			Company company = new Company();
			if (companyModel.getId() != null) {
				company = companyService.findByPK(companyModel.getId());
			}

			company.setCompanyName(companyModel.getCompanyName());
			company.setCompanyIdStr(companyModel.getCompanyId());
			company.setPhoneNumber(companyModel.getPhoneNumber());
			if (companyModel.getIndustryTypeCode() != null) {
				company.setIndustryTypeCode(industryTypeService.findByPK(companyModel.getIndustryTypeCode()));
			}
			company.setCompanyAddressLine1(companyModel.getCompanyAddressLine1());
			company.setCompanyAddressLine2(companyModel.getCompanyAddressLine2());
			company.setCompanyCity(companyModel.getCompanyCity());
			company.setCompanyStateRegion(companyModel.getCompanyState());
			if (companyModel.getCompanycountryCode() != null) {
				company.setCompanyCountryCode(countryService.findByPK(companyModel.getCompanycountryCode()));
			}
			company.setCompanyPostZipCode(companyModel.getCompanyPostZipCode());
			company.setEmailAddress(companyModel.getEmailAddress());
			company.setVatRegistrationNumber(companyModel.getVatRegistrationNumber());
			company.setContactPersionName(companyModel.getContactPersionName());
			if (companyModel.getCompanyLogo() != null) {
				try {
					company.setCompanyLogo(companyModel.getCompanyLogo().getBytes());
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			return company;
		}
		return null;
	}

}
