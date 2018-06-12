/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.service;

import com.simplevat.entity.Company;
import java.math.BigDecimal;

/**
 *
 * @author admin
 */
public abstract class CompanyService extends SimpleVatService<Integer, Company> {
    public abstract void updateCompanyExpenseBudget(BigDecimal expenseAmount, Company company);
    public abstract void updateCompanyRevenueBudget(BigDecimal revenueAmount, Company company);
    public abstract Company getCompany();
 
}
