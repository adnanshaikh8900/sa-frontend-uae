package com.simplevat.rest.companycontroller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.Company;
import com.simplevat.entity.User;
import com.simplevat.service.CompanyService;
import com.simplevat.service.CompanyTypeService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.IndustryTypeService;
import com.simplevat.service.UserService;

@Component
public class CompanyRestHelper {

	@Autowired
	private CompanyService companyService;

	@Autowired
	private IndustryTypeService industryTypeService;

	@Autowired
	private CountryService countryService;

	@Autowired
	private CompanyTypeService companyTypeService;

	@Autowired
	private CurrencyService currencyService;

	@Autowired
	UserService userService;

	public List<CompanyListModel> getModelList(List<Company> companyList) {
		List<CompanyListModel> coModelList = new ArrayList<>();
		if (companyList != null && companyList.size() > 0) {
			for (Company company : companyList) {

				CompanyListModel companyModel = new CompanyListModel();

				companyModel.setId(company.getCompanyId());
				companyModel.setCompanyName(company.getCompanyName());
				companyModel.setPhoneNumber(company.getPhoneNumber());

				coModelList.add(companyModel);
			}
		}
		return coModelList;
	}

	public CompanyModel getModel(Company company) {

		CompanyModel companyModel = new CompanyModel();
		
		companyModel.setCompanyName(company.getCompanyName());
		companyModel.setCompanyRegistrationNumber(company.getCompanyRegistrationNumber());
		companyModel.setVatRegistrationNumber(company.getVatNumber());

		if (company.getCompanyTypeCode() != null) {
			companyModel.setCompanyTypeCode(company.getCompanyTypeCode().getId());
		}
		if (company.getIndustryTypeCode() != null) {
			companyModel.setIndustryTypeCode(company.getCompanyTypeCode().getId());
		}
		if (company.getCurrencyCode() != null) {
			companyModel.setCurrencyCode(company.getCurrencyCode().getCurrencyCode());
		}

		companyModel.setPhoneNumber(company.getPhoneNumber());
		companyModel.setEmailAddress(company.getEmailAddress());
		companyModel.setWebsite(company.getEmailAddress());

		companyModel.setCompanyRevenueBudget(company.getCompanyRevenueBudget());
		companyModel.setCompanyExpenseBudget(company.getCompanyExpenseBudget());

		companyModel.setInvoicingAddressLine1(company.getInvoicingAddressLine1());
		companyModel.setInvoicingAddressLine2(company.getInvoicingAddressLine2());
		companyModel.setInvoicingAddressLine3(company.getInvoicingAddressLine3());
		companyModel.setInvoicingCity(company.getInvoicingCity());
		companyModel.setInvoicingStateRegion(company.getInvoicingStateRegion());
		if (company.getInvoicingCountryCode() != null) {
			companyModel.setInvoicingCountryCode(company.getInvoicingCountryCode().getCountryCode());
		}
		companyModel.setInvoicingPoBoxNumber(company.getInvoicingPoBoxNumber());
		companyModel.setInvoicingPostZipCode(company.getInvoicingPostZipCode());
		companyModel.setDateFormat(company.getDateFormat());

		companyModel.setCompanyAddressLine1(company.getCompanyAddressLine1());
		companyModel.setCompanyAddressLine2(company.getCompanyAddressLine2());
		companyModel.setCompanyAddressLine3(company.getCompanyAddressLine3());
		companyModel.setCompanyCity(company.getCompanyCity());
		companyModel.setCompanyStateRegion(company.getCompanyStateRegion());
		if (company.getCompanyCountryCode() != null) {
			companyModel.setCompanyCountryCode(company.getCompanyCountryCode().getCountryCode());
		}
		companyModel.setCompanyPoBoxNumber(company.getCompanyPoBoxNumber());
		companyModel.setCompanyPostZipCode(company.getCompanyPostZipCode());
		if (company.getCompanyLogo() != null) {
			companyModel.setCompanyLogoByteArray(company.getCompanyLogo());
		}

		return companyModel;
	}

	public Company getEntity(CompanyModel companyModel,Integer userId) {
		Company company = new Company();
		if (userId != null) {
			User user = userService.findByPK(userId);
			// XXX : assumption company allways present
			company = user.getCompany();
		}

		company.setCompanyName(companyModel.getCompanyName());
		company.setCompanyRegistrationNumber(companyModel.getCompanyRegistrationNumber());
		company.setVatNumber(companyModel.getVatRegistrationNumber());

		if (companyModel.getCompanyTypeCode() != null) {
			company.setCompanyTypeCode(companyTypeService.findByPK(companyModel.getCompanyTypeCode()));
		}
		if (companyModel.getIndustryTypeCode() != null) {
			company.setIndustryTypeCode(industryTypeService.findByPK(companyModel.getIndustryTypeCode()));
		}
		if (companyModel.getCurrencyCode() != null) {
			company.setCurrencyCode(currencyService.findByPK(companyModel.getCurrencyCode()));
		}

		company.setWebsite(companyModel.getWebsite());
		company.setEmailAddress(companyModel.getEmailAddress());
		company.setPhoneNumber(companyModel.getPhoneNumber());

		company.setCompanyExpenseBudget(companyModel.getCompanyExpenseBudget());
		company.setCompanyRevenueBudget(companyModel.getCompanyRevenueBudget());

		company.setInvoicingAddressLine1(companyModel.getInvoicingAddressLine1());
		company.setInvoicingAddressLine2(companyModel.getInvoicingAddressLine2());
		company.setInvoicingAddressLine3(companyModel.getInvoicingAddressLine3());
		company.setInvoicingCity(companyModel.getInvoicingCity());
		company.setInvoicingStateRegion(companyModel.getInvoicingStateRegion());
		if (companyModel.getInvoicingCountryCode() != null) {
			company.setInvoicingCountryCode(countryService.findByPK(companyModel.getInvoicingCountryCode()));
		}
		company.setInvoicingPoBoxNumber(companyModel.getInvoicingPoBoxNumber());
		company.setInvoicingPostZipCode(companyModel.getInvoicingPostZipCode());
		company.setDateFormat(companyModel.getDateFormat());

		company.setCompanyAddressLine1(companyModel.getCompanyAddressLine1());
		company.setCompanyAddressLine2(companyModel.getCompanyAddressLine2());
		company.setCompanyAddressLine3(companyModel.getCompanyAddressLine3());
		company.setCompanyCity(companyModel.getCompanyCity());
		company.setCompanyStateRegion(companyModel.getCompanyStateRegion());
		if (companyModel.getCompanyCountryCode() != null) {
			company.setCompanyCountryCode(countryService.findByPK(companyModel.getCompanyCountryCode()));
		}
		company.setCompanyPoBoxNumber(companyModel.getCompanyPoBoxNumber());
		company.setCompanyPostZipCode(companyModel.getCompanyPostZipCode());

		if (companyModel.getCompanyLogo() != null) {
			try {
				company.setCompanyLogo(companyModel.getCompanyLogo().getBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return company;
	}

}
