package com.simplevat.dao;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ReceiptFilterEnum;
import com.simplevat.entity.Receipt;

public interface ReceiptDao extends Dao<Integer, Receipt> {

	public List<Receipt> getProductList(Map<ReceiptFilterEnum, Object> filterMap);

	public void deleteByIds(List<Integer> ids);

}
