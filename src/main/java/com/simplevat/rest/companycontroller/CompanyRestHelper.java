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
                companyModel.setName(company.getCompanyName());
                companyModel.setCompanyRegistrationId(company.getCompanyIdStr());
                companyModel.setPhoneNumber(company.getPhoneNumber());
                coModelList.add(companyModel);
            }
        }
        return coModelList;
    }

    public CompanyModel getModel(Company company) {
        CompanyModel companyModel = new CompanyModel();
        companyModel.setId(company.getCompanyId());
        companyModel.setName(company.getCompanyName());
        companyModel.setCompanyRegistrationId(company.getCompanyIdStr());
        companyModel.setPhoneNumber(company.getPhoneNumber());
        if (company.getIndustryTypeCode() != null) {
            companyModel.setIndustryTypeCode(company.getCompanyTypeCode().getId());
        }
        companyModel.setAddressLine1(company.getCompanyAddressLine1());
        companyModel.setAddressLine2(company.getCompanyAddressLine2());
        companyModel.setCity(company.getCompanyCity());
        if (company.getCompanyCountryCode() != null) {
            companyModel.setCountryCode(company.getCompanyCountryCode().getCountryCode());
        }
        companyModel.setState(company.getCompanyStateRegion());
        companyModel.setPostZipCode(companyModel.getPostZipCode());
        companyModel.setContactEmailAddress(company.getEmailAddress());
        companyModel.setVatNumber(company.getVatNumber());
        companyModel.setContactPersonName(company.getContactPersionName());
        companyModel.setContactPhoneNumber(company.getContactPhoneNumber());

        return companyModel;
    }

    public Company getEntity(CompanyModel companyModel) {
        Company company = new Company();
        if (companyModel.getId() != null) {
            company = companyService.findByPK(companyModel.getId());
        }
        company.setCompanyName(companyModel.getName());
        company.setCompanyIdStr(companyModel.getCompanyRegistrationId());
        company.setPhoneNumber(companyModel.getPhoneNumber());
        if (companyModel.getIndustryTypeCode() != null) {
            company.setIndustryTypeCode(industryTypeService.findByPK(companyModel.getIndustryTypeCode()));
        }
        company.setCompanyAddressLine1(companyModel.getAddressLine1());
        company.setCompanyAddressLine2(companyModel.getAddressLine2());
        company.setCompanyCity(companyModel.getCity());
        company.setCompanyStateRegion(companyModel.getState());
        if (companyModel.getCountryCode() != null) {
            company.setCompanyCountryCode(countryService.findByPK(companyModel.getCountryCode()));
        }
        company.setCompanyPostZipCode(companyModel.getPostZipCode());
        company.setEmailAddress(companyModel.getContactEmailAddress());
        company.setVatNumber(companyModel.getVatNumber());
        company.setContactPersionName(companyModel.getContactPersonName());
        company.setContactPhoneNumber(companyModel.getContactPhoneNumber());
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
