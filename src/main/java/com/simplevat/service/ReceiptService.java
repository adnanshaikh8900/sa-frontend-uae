package com.simplevat.service;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.ReceiptFilterEnum;
import com.simplevat.entity.Receipt;

public abstract class ReceiptService extends SimpleVatService<Integer, Receipt> {

	public abstract List<Receipt> getReceiptList(Map<ReceiptFilterEnum, Object> map);

	public abstract void deleteByIds(List<Integer> ids);
}
