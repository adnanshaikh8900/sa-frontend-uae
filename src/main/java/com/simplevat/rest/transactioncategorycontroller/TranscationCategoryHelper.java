/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncategorycontroller;

import com.simplevat.constant.DefualtTypeConstant;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.TransactionTypeService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

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
    private TransactionTypeService transactionTypeService;

//    public TransactionCategoryModel getCategory(TransactionCategory category) {
//        TransactionCategoryModel model = new TransactionCategoryModel();
//        model.setCreatedBy(category.getCreatedBy());
//        model.setCreatedDate(category.getCreatedDate());
//        model.setDefaltFlag(category.getDefaltFlag());
//        model.setDeleteFlag(category.getDeleteFlag());
//        model.setLastUpdateDate(category.getLastUpdateDate());
//        model.setOrderSequence(category.getOrderSequence());
//        model.setParentTransactionCategory(category.getParentTransactionCategory());
//        model.setTransactionCategoryId(category.getTransactionCategoryId());
//        model.setTransactionCategoryCode(category.getTransactionCategoryCode());
//        model.setTransactionCategoryDescription(category.getTransactionCategoryDescription());
//        model.setTransactionCategoryName(category.getTransactionCategoryName());
//        model.setTransactionType(category.getTransactionType());
//        model.setVatCategory(category.getVatCategory());
//        model.setVersionNumber(category.getVersionNumber());
//        return model;
//    }
//    public TransactionCategory getTrascationModel(TransactionCategoryModel categoryModel) {
//        TransactionCategory transactionCategory = new TransactionCategory();
//        transactionCategory.setCreatedBy(categoryModel.getCreatedBy());
//        transactionCategory.setCreatedDate(categoryModel.getCreatedDate());
//        transactionCategory.setDefaltFlag(categoryModel.getDefaltFlag());
//        transactionCategory.setDeleteFlag(categoryModel.getDeleteFlag());
//        transactionCategory.setLastUpdateDate(categoryModel.getLastUpdateDate());
//        transactionCategory.setOrderSequence(categoryModel.getOrderSequence());
//        transactionCategory.setParentTransactionCategory(categoryModel.getParentTransactionCategory());
//        transactionCategory.setTransactionCategoryId(categoryModel.getTransactionCategoryId());
//        transactionCategory.setTransactionCategoryCode(categoryModel.getTransactionCategoryCode());
//        transactionCategory.setTransactionCategoryDescription(categoryModel.getTransactionCategoryDescription());
//        transactionCategory.setTransactionCategoryName(categoryModel.getTransactionCategoryName());
//        transactionCategory.setTransactionType(categoryModel.getTransactionType());
//        transactionCategory.setVatCategory(categoryModel.getVatCategory());
//        transactionCategory.setVersionNumber(categoryModel.getVersionNumber());
//        return transactionCategory;
//    }
    public TransactionCategory getEntity(TransactionCategoryBean transactionCategoryBean) {
        TransactionCategory transactionCategory = new TransactionCategory();
        if (transactionCategoryBean.getDefaltFlag() != null && !transactionCategoryBean.getDefaltFlag().isEmpty()) {
            transactionCategory.setDefaltFlag(transactionCategoryBean.getDefaltFlag().charAt(0));
        } else {
            transactionCategory.setDefaltFlag(DefualtTypeConstant.NO);
        }
        if (transactionCategoryBean.getParentTransactionCategory() != null) {
            transactionCategory.setParentTransactionCategory(
                    transactionCategoryService.findByPK(transactionCategoryBean.getParentTransactionCategory()));
        }
        if (transactionCategoryBean.getTransactionCategoryId() != null
                && transactionCategoryBean.getTransactionCategoryId() > 0) {
            transactionCategory.setTransactionCategoryId(transactionCategoryBean.getTransactionCategoryId());
        }
        transactionCategory.setTransactionCategoryCode(transactionCategoryBean.getTransactionCategoryCode());
        transactionCategory
                .setTransactionCategoryDescription(transactionCategoryBean.getTransactionCategoryDescription());
        transactionCategory.setTransactionCategoryName(transactionCategoryBean.getTransactionCategoryName());
        if (transactionCategoryBean.getTransactionType() != null) {
            transactionCategory
                    .setTransactionType(transactionTypeService.findByPK(transactionCategoryBean.getTransactionType()));
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

    public List<TransactionCategoryModel> getListModel(List<TransactionCategory> transactionCategories) {
        List<TransactionCategoryModel> transactionCategoryModelList = new ArrayList<TransactionCategoryModel>();

        if (transactionCategories != null && transactionCategories.size() > 0) {
            for (TransactionCategory transactionCategory : transactionCategories) {
                TransactionCategoryModel transactionCategoryModel = new TransactionCategoryModel();
                BeanUtils.copyProperties(transactionCategory, transactionCategoryModel);
                if (transactionCategory.getTransactionType() != null) {
                    transactionCategoryModel.setTransactionTypeId(transactionCategory.getTransactionType().getTransactionTypeCode());
                    transactionCategoryModel.setTransactionTypeName(transactionCategory.getTransactionType().getTransactionTypeName());
                }
                if (transactionCategory.getParentTransactionCategory() != null) {
                    transactionCategoryModel.setParentTransactionCategoryId(transactionCategory.getParentTransactionCategory().getTransactionCategoryId());
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
        if (transactionCategory.getTransactionType() != null) {
            transactionCategoryModel.setTransactionTypeId(transactionCategory.getTransactionType().getTransactionTypeCode());
            transactionCategoryModel.setTransactionTypeName(transactionCategory.getTransactionType().getTransactionTypeName());
        }
        if (transactionCategory.getParentTransactionCategory() != null) {
            transactionCategoryModel.setParentTransactionCategoryId(transactionCategory.getParentTransactionCategory().getTransactionCategoryId());
        }
        if (transactionCategory.getVatCategory() != null) {
            transactionCategoryModel.setVatCategoryId(transactionCategory.getVatCategory().getId());
        }
        return transactionCategoryModel;
    }

}
