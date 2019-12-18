/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncategorycontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.helper.TranscationCategoryHelper;
import com.simplevat.contact.model.TransactionCategoryBean;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.service.TransactionCategoryServiceNew;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import com.simplevat.constant.DefualtTypeConstant;
import com.simplevat.entity.User;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.UserServiceNew;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/transactioncategory")
public class TransactionCategoryController implements Serializable {
    
    @Autowired
    private TransactionCategoryServiceNew transactionCategoryService;
    
    @Autowired
    private VatCategoryService vatCategoryService;
    
    @Autowired
    private TransactionTypeService transactionTypeService;
    
    @Autowired
    private UserServiceNew userServiceNew;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @GetMapping(value = "/gettransactioncategory")
    public ResponseEntity getAllTransactionCategory() {
        List<TransactionCategory> transactionCategories = transactionCategoryService.findAllTransactionCategory();
        if (transactionCategories != null) {
            return new ResponseEntity(transactionCategories, HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        
    }
    
    @GetMapping(value = "/edittransactioncategory")
    public ResponseEntity editTransactionCategory(@RequestParam("id") Integer id) {
        TransactionCategory transactionCategories = transactionCategoryService.findByPK(id);
        if (transactionCategories != null) {
            return new ResponseEntity(transactionCategories, HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        
    }
    
    @DeleteMapping(value = "/deletetransactioncategory")
    public ResponseEntity deleteTransactionCategory(@RequestParam("id") Integer id) {
        TransactionCategory transactionCategories = transactionCategoryService.findByPK(id);
        if (transactionCategories == null) {
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        transactionCategories.setDeleteFlag(Boolean.TRUE);
        transactionCategoryService.update(transactionCategories, id);
        return new ResponseEntity(HttpStatus.OK);
    }
    
    @DeleteMapping(value = "/deletetransactioncategorys")
    public ResponseEntity deleteTransactionCategorys(@RequestBody DeleteModel ids) {
        try {
            transactionCategoryService.deleteByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @GetMapping(value = "/getvatcategories")
    public ResponseEntity getVatCategories() {
        List<VatCategory> vatCategorys = vatCategoryService.getVatCategoryList();
        if (vatCategorys != null) {
            return new ResponseEntity(vatCategorys, HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
            
        }
    }
    
    @GetMapping(value = "/gettransactiontype")
    public ResponseEntity getAllTransactionType(String str) {
        List<TransactionType> transactionTypes;
        if (str == null) {
            return new ResponseEntity(transactionTypeService.findAll(), HttpStatus.OK);
        }
        List<TransactionType> filterList = new ArrayList<>();
        transactionTypes = transactionTypeService.findByText(str);
        for (TransactionType type : transactionTypes) {
            filterList.add(type);
        }
        return new ResponseEntity(filterList, HttpStatus.OK);
    }
    
    @PostMapping(value = "/savetransactioncategory")
    public ResponseEntity save(@RequestBody TransactionCategoryBean transactionCategoryBean, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            User user = userServiceNew.findByPK(userId);
            TransactionCategory selectedTransactionCategory = TranscationCategoryHelper.getTrascationByTrascationModel(transactionCategoryBean, transactionTypeService, transactionCategoryService, vatCategoryService);
            
            if (selectedTransactionCategory.getDefaltFlag() != null && selectedTransactionCategory.getDefaltFlag() == DefualtTypeConstant.YES) {
                System.out.println("insideif=========1=========" + selectedTransactionCategory.getDefaltFlag());
                TransactionCategory transactionCategory = transactionCategoryService.getDefaultTransactionCategoryByTransactionCategoryId(selectedTransactionCategory.getTransactionCategoryId());
                if (transactionCategory != null) {
                    System.out.println("insideif=========3=========" + transactionCategory.getDefaltFlag());
                    transactionCategory.setDefaltFlag(DefualtTypeConstant.NO);
                    transactionCategoryService.update(transactionCategory);
                }
            } else {
                selectedTransactionCategory.setDefaltFlag(DefualtTypeConstant.YES);
            }
            if (selectedTransactionCategory.getTransactionCategoryId() != null && selectedTransactionCategory.getTransactionCategoryId() > 0) {
                selectedTransactionCategory.setLastUpdateBy(user.getUserId());
                selectedTransactionCategory.setLastUpdateDate(LocalDateTime.now());
                transactionCategoryService.update(selectedTransactionCategory);
                
            } else {
                selectedTransactionCategory.setOrderSequence(1);
                selectedTransactionCategory.setCreatedBy(user.getUserId());
                selectedTransactionCategory.setCreatedDate(LocalDateTime.now());
                transactionCategoryService.persist(selectedTransactionCategory);
            }
            
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @GetMapping(value = "/getparenttransaction")
    public ResponseEntity getParentTransaction(@RequestParam("TransactionTypeCode") Integer transactionTypeCode, @RequestParam("transcationTxt") String transcationTxt) {
        
        if (transactionTypeCode != null) {
            List<TransactionCategory> transactionCategorys = transactionCategoryService.findAllTransactionCategoryByTransactionType(transactionTypeCode, transcationTxt);
            return new ResponseEntity<>(transactionCategorys, HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
}
