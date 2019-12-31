package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ReceiptFilterEnum;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ReceiptDao;
import com.simplevat.entity.Receipt;

@Repository
@Transactional
public class ReceiptDaoImpl extends AbstractDao<Integer, Receipt> implements ReceiptDao {

	@Override
	public List<Receipt> getProductList(Map<ReceiptFilterEnum, Object> filterMap) {
		List<DbFilter> dbFilters = new ArrayList();
		filterMap.forEach(
				(productFilter, value) -> dbFilters.add(DbFilter.builder().dbCoulmnName(productFilter.getDbColumnName())
						.condition(productFilter.getCondition()).value(value).build()));
		List<Receipt> receipts = this.executeQuery(dbFilters);
		return receipts;
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		if (ids != null && !ids.isEmpty()) {
			for (Integer id : ids) {
				Receipt receipt = findByPK(id);
				receipt.setDeleteFlag(Boolean.TRUE);
				update(receipt);
			}
		}
	}

}
