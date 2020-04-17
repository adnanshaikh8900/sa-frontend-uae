/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncategorycontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.DefaultTypeConstant;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.ChartOfAccountService;

/**
 *
 * @author daynil
 */
@Service
public class TranscationCategoryHelper {

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private ChartOfAccountService transactionTypeService;

	public TransactionCategory getEntity(TransactionCategoryBean transactionCategoryBean) {
		TransactionCategory transactionCategory = new TransactionCategory();
		if (transactionCategoryBean.getDefaltFlag() != null && !transactionCategoryBean.getDefaltFlag().isEmpty()) {
			transactionCategory.setDefaltFlag(transactionCategoryBean.getDefaltFlag().charAt(0));
		} else {
			transactionCategory.setDefaltFlag(DefaultTypeConstant.NO);
		}
		if (transactionCategoryBean.getParentTransactionCategory() != null) {
			transactionCategory.setParentTransactionCategory(
					transactionCategoryService.findByPK(transactionCategoryBean.getParentTransactionCategory()));
		}
		if (transactionCategoryBean.getTransactionCategoryId() != null
				&& transactionCategoryBean.getTransactionCategoryId() > 0) {
			transactionCategory.setTransactionCategoryId(transactionCategoryBean.getTransactionCategoryId());
		}
		transactionCategory
				.setTransactionCategoryDescription(transactionCategoryBean.getTransactionCategoryDescription());
		transactionCategory.setTransactionCategoryName(transactionCategoryBean.getTransactionCategoryName());
		if (transactionCategoryBean.getChartOfAccount() != null) {
			ChartOfAccount chartOfAccount = transactionTypeService
					.findByPK(transactionCategoryBean.getChartOfAccount());
			transactionCategory.setChartOfAccount(chartOfAccount);

			transactionCategory.setTransactionCategoryCode(
					transactionCategoryService.getNxtTransactionCatCodeByChartOfAccount(chartOfAccount));

		}
		if (transactionCategoryBean.getVatCategory() != null) {
			transactionCategory.setVatCategory(vatCategoryService.findByPK(transactionCategoryBean.getVatCategory()));
		}
		if (transactionCategoryBean.getVersionNumber() != null) {
			transactionCategory.setVersionNumber(transactionCategoryBean.getVersionNumber());
		} else {
			transactionCategory.setVersionNumber(0);
		}
		return transactionCategory;
	}

	public List<TransactionCategoryModel> getListModel(Object transactionCategories) {
		List<TransactionCategoryModel> transactionCategoryModelList = new ArrayList<>();

		if (transactionCategories != null) {
			for (TransactionCategory transactionCategory : (List<TransactionCategory>) transactionCategories) {
				TransactionCategoryModel transactionCategoryModel = new TransactionCategoryModel();
				BeanUtils.copyProperties(transactionCategory, transactionCategoryModel);
				if (transactionCategory.getChartOfAccount() != null) {
					transactionCategoryModel
							.setTransactionTypeId(transactionCategory.getChartOfAccount().getChartOfAccountId());
					transactionCategoryModel
							.setTransactionTypeName(transactionCategory.getChartOfAccount().getChartOfAccountName());
				}
				if (transactionCategory.getParentTransactionCategory() != null) {
					transactionCategoryModel.setParentTransactionCategoryId(
							transactionCategory.getParentTransactionCategory().getTransactionCategoryId());
				}
				if (transactionCategory.getVatCategory() != null) {
					transactionCategoryModel.setVatCategoryId(transactionCategory.getVatCategory().getId());
				}
				transactionCategoryModelList.add(transactionCategoryModel);
			}
		}
		return transactionCategoryModelList;
	}

	public TransactionCategoryModel getModel(TransactionCategory transactionCategory) {
		TransactionCategoryModel transactionCategoryModel = new TransactionCategoryModel();
		BeanUtils.copyProperties(transactionCategory, transactionCategoryModel);
		if (transactionCategory.getChartOfAccount() != null) {
			transactionCategoryModel
					.setTransactionTypeId(transactionCategory.getChartOfAccount().getChartOfAccountId());
			transactionCategoryModel
					.setTransactionTypeName(transactionCategory.getChartOfAccount().getChartOfAccountName());
		}
		if (transactionCategory.getParentTransactionCategory() != null) {
			transactionCategoryModel.setParentTransactionCategoryId(
					transactionCategory.getParentTransactionCategory().getTransactionCategoryId());
		}
		if (transactionCategory.getVatCategory() != null) {
			transactionCategoryModel.setVatCategoryId(transactionCategory.getVatCategory().getId());
		}
		return transactionCategoryModel;
	}

	public Object getDropDownModelList(List<ChartOfAccount> list) {
		if (list != null && !list.isEmpty()) {
			Map<Object, Object> chartOfAccountDropdownModelList = new HashMap<>();
			Map<Integer, List<ChartOfAccount>> idTrnxCatListMap = new HashMap<>();
			List<ChartOfAccount> categoryList = new ArrayList<>();
			for (ChartOfAccount trnxCat : list) {
				if (trnxCat.getParentChartOfAccount() != null) {
					if (idTrnxCatListMap.containsKey(trnxCat.getParentChartOfAccount().getChartOfAccountId())) {
						categoryList = idTrnxCatListMap.get(trnxCat.getParentChartOfAccount().getChartOfAccountId());
						categoryList.add(trnxCat);
					} else {
						categoryList = new ArrayList<ChartOfAccount>();
						categoryList.add(trnxCat);
						idTrnxCatListMap.put(trnxCat.getParentChartOfAccount().getChartOfAccountId(), categoryList);
					}
				}
			}

			for (Integer key : idTrnxCatListMap.keySet()) {

				String parentCategory = "";
				categoryList = idTrnxCatListMap.get(key);

				List<DropdownModel> dropDownModelList = new ArrayList<DropdownModel>();
				dropDownModelList
						.add(new DropdownModel(categoryList.get(0).getParentChartOfAccount().getChartOfAccountId(),
								categoryList.get(0).getParentChartOfAccount().getChartOfAccountName()));
				for (ChartOfAccount trnxCat : categoryList) {
					parentCategory = trnxCat.getParentChartOfAccount().getChartOfAccountName();
					dropDownModelList
							.add(new DropdownModel(trnxCat.getChartOfAccountId(), trnxCat.getChartOfAccountName()));
				}

				chartOfAccountDropdownModelList.put(parentCategory, dropDownModelList);
			}
			return chartOfAccountDropdownModelList;
		}
		return null;
	}

	public List<SingleLevelDropDownModel> getSinleLevelDropDownModelList(List<TransactionCategory> transactionCatList) {
		List<SingleLevelDropDownModel> modelList = new ArrayList<>();
		Map<Object, Object> chartOfAccountDropdownModelList = new HashMap<>();
		Map<Integer, List<TransactionCategory>> idTrnxCatListMap = new HashMap<>();
		List<TransactionCategory> transactionCategoryList = new ArrayList<>();
		for (TransactionCategory trnxCat : transactionCatList) {
			if (trnxCat.getChartOfAccount() != null) {
				if (idTrnxCatListMap.containsKey(trnxCat.getChartOfAccount().getChartOfAccountId())) {
					transactionCategoryList = idTrnxCatListMap.get(trnxCat.getChartOfAccount().getChartOfAccountId());
					transactionCategoryList.add(trnxCat);
				} else {
					transactionCategoryList = new ArrayList<>();
					transactionCategoryList.add(trnxCat);
					idTrnxCatListMap.put(trnxCat.getChartOfAccount().getChartOfAccountId(), transactionCategoryList);
				}
			}
		}

		for (Integer key : idTrnxCatListMap.keySet()) {
			String parentCategory = "";
			transactionCategoryList = idTrnxCatListMap.get(key);
			List<DropdownModel> dropDownModelList = new ArrayList<DropdownModel>();
			for (TransactionCategory trnxCat : transactionCategoryList) {
				parentCategory = trnxCat.getChartOfAccount().getChartOfAccountName();
				dropDownModelList.add(
						new DropdownModel(trnxCat.getTransactionCategoryId(), trnxCat.getTransactionCategoryName()));
			}
			chartOfAccountDropdownModelList.put(parentCategory, dropDownModelList);
			modelList.add(new SingleLevelDropDownModel(parentCategory, dropDownModelList));
		}
		return modelList;
	}
}
