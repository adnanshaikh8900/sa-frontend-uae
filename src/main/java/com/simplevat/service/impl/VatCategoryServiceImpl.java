package com.simplevat.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.VatCategoryFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.VatCategoryDao;
import com.simplevat.entity.Activity;
import com.simplevat.entity.VatCategory;
import com.simplevat.service.VatCategoryService;
import java.time.LocalDateTime;

@Service("vatCategoryService")

public class VatCategoryServiceImpl extends VatCategoryService {

	@Autowired
	private VatCategoryDao vatCategoryDao;

	private static final String VAT_CATEGORY = "VAT_CATEGORY";

	public List<VatCategory> getVatCategoryList() {
		return vatCategoryDao.getVatCategoryList();
	}

	@Override
	public List<VatCategory> getVatCategorys(String name) {
		return vatCategoryDao.getVatCategorys(name);
	}

	@Override
	protected Dao<Integer, VatCategory> getDao() {
		return vatCategoryDao;
	}

	@Override
	public VatCategory getDefaultVatCategory() {
		return vatCategoryDao.getDefaultVatCategory();
	}

	public void persist(VatCategory vatCategory) {
		super.persist(vatCategory, null, getActivity(vatCategory, "CREATED"));
	}

	public VatCategory update(VatCategory vatCategory) {
		return super.update(vatCategory, null, getActivity(vatCategory, "UPDATED"));
	}

	private Activity getActivity(VatCategory vatCategory, String activityCode) {
		Activity activity = new Activity();
		activity.setActivityCode(activityCode);
		activity.setModuleCode(VAT_CATEGORY);
		activity.setField3("Vat Category" + activityCode.charAt(0)
				+ activityCode.substring(1, activityCode.length()).toLowerCase());
		activity.setField1(vatCategory.getVat().toString());
		activity.setField2(vatCategory.getName());
		activity.setLastUpdateDate(LocalDateTime.now());
		activity.setLoggingRequired(true);
		return activity;
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		vatCategoryDao.deleteByIds(ids);
	}

	@Override
	public List<VatCategory> getVatCategoryList(Map<VatCategoryFilterEnum, Object> filterDataMap) {
		return vatCategoryDao.getVatCategoryList(filterDataMap);
	}

}
