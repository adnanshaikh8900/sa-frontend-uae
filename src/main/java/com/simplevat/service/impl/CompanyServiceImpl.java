/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.CompanyFilterEnum;
import com.simplevat.dao.CompanyDao;
import com.simplevat.dao.Dao;
import com.simplevat.entity.Company;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.rest.DropdownModel;
import com.simplevat.service.CompanyService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author admin
 */
@Service("companyService")
@Transactional
public class CompanyServiceImpl extends CompanyService {

    @Autowired
    private CompanyDao companyDao;

    @Override
    protected Dao<Integer, Company> getDao() {
        return this.companyDao;
    }

    @Override
    public void updateCompanyExpenseBudget(BigDecimal expenseAmount, Company company) {
        company.setCompanyExpenseBudget(company.getCompanyExpenseBudget().add(expenseAmount));
        update(company);
    }

    @Override
    public void updateCompanyRevenueBudget(BigDecimal revenueAmount, Company company) {
        company.setCompanyRevenueBudget(company.getCompanyRevenueBudget().add(revenueAmount));
        update(company);
    }

    @Override
    public Company getCompany() {
        return companyDao.getCompany();
    }

    @Override
    public List<Company> getCompanyList(Map<CompanyFilterEnum, Object> filterMap) {
        return companyDao.getCompanyList(filterMap);
    }

    @Override
    public void deleteByIds(ArrayList<Integer> ids) {
        companyDao.deleteByIds(ids);
    }

    @Override
    public List<DropdownModel> getCompaniesForDropdown() {
       return companyDao.getCompaniesForDropdown();
    }
    @Override
    public Currency getCompanyCurrency(){
        return companyDao.getCompanyCurrency();
    }
}
