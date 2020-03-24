/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao.impl;

import com.simplevat.constant.DatatableSortingFilterConstant;
import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.PaymentFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.PaymentDao;
import com.simplevat.entity.Payment;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Ashish
 */
@Repository(value = "paymentDao")
public class PaymentDaoImpl extends AbstractDao<Integer, Payment> implements PaymentDao {

	@Autowired
	private DatatableSortingFilterConstant dataTableUtil;

	@Override
	public PaginationResponseModel getPayments(Map<PaymentFilterEnum, Object> filterMap,
			PaginationModel paginationModel) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		paginationModel.setSortingCol(dataTableUtil.getColName(paginationModel.getSortingCol(), dataTableUtil.PAYMENT));
		return new PaginationResponseModel(this.getResultCount(dbFilters),
				this.executeQuery(dbFilters, paginationModel));
	}

	@Override
	@Transactional
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Payment payment = findByPK(id);
				payment.setDeleteFlag(Boolean.TRUE);
				update(payment);
			}
		}
	}

	@Override
	public BigDecimal getAmountByInvoiceId(Integer invoiceId) {
		TypedQuery<Payment> query = getEntityManager().createNamedQuery("getAmountByInvoiceId", Payment.class);
		query.setParameter("id", invoiceId);
		List<Payment> paymentList = query.getResultList();
		BigDecimal totalAmount = new BigDecimal(0);

		for (Payment p : paymentList) {
			totalAmount = totalAmount.add(p.getInvoiceAmount());
		}
		return totalAmount;
	}

}
