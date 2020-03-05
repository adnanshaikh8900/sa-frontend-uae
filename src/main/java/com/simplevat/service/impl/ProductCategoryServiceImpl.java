package com.simplevat.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ProductCategoryFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.ProductCategoryDao;
import com.simplevat.entity.Activity;
import com.simplevat.entity.ProductCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.ProductCategoryService;
import com.simplevat.service.SimpleVatService;

@Service("ProductCategoryService")
public class ProductCategoryServiceImpl extends ProductCategoryService {

	private static final String PRODUCT_CATEGORY = "PRODUCT_CATEGORY";

	@Autowired
	private ProductCategoryDao productCategoryDao;

	@Override
	public List<ProductCategory> findAllProductCategoryByUserId(Integer userId, boolean isDeleted) {
		Map<String, Object> parameterDataMap = new HashMap();
		parameterDataMap.put("createdBy", userId);

		List<DbFilter> filterList = new ArrayList<DbFilter>();
		filterList.add(DbFilter.builder().dbCoulmnName("createdBy").condition(" = :createdBy").value(userId).build());
		filterList.add(
				DbFilter.builder().dbCoulmnName("deleteFlag").condition(" = :deleteFlag").value(isDeleted).build());

		return getDao().executeQuery(filterList);
	}

	@Override
	protected Dao<Integer, ProductCategory> getDao() {
		return productCategoryDao;
	}

	public void persist(ProductCategory productCategory) {
		super.persist(productCategory, null, getActivity(productCategory, "CREATED"));
	}

	public ProductCategory update(ProductCategory productCategory) {
		return super.update(productCategory, null, getActivity(productCategory, "UPDATED"));
	}

	private Activity getActivity(ProductCategory productCategory, String activityCode) {
		Activity activity = new Activity();
		activity.setActivityCode(activityCode);
		activity.setModuleCode(PRODUCT_CATEGORY);
		activity.setField3("Transaction Category " + activityCode.charAt(0)
				+ activityCode.substring(1, activityCode.length()).toLowerCase());
		activity.setField1(productCategory.getProductCategoryCode());
		activity.setField2(productCategory.getProductCategoryName());
		activity.setLastUpdateDate(LocalDateTime.now());
		activity.setLoggingRequired(true);
		return activity;
	}

	@Override
	public void deleteByIds(ArrayList<Integer> ids) {
		productCategoryDao.deleteByIds(ids);
	}
	
	@Override
	public PaginationResponseModel getProductCategoryList(Map<ProductCategoryFilterEnum, Object> filterList,PaginationModel paginationModel){
		return productCategoryDao.getProductCategoryList(filterList,paginationModel);
			
	}

}
