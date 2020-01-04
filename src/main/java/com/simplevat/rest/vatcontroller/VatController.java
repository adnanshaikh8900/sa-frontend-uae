/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.vatcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.VatCategoryFilterEnum;
import com.simplevat.entity.VatCategory;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.VatCategoryService;

import io.swagger.annotations.ApiOperation;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
 * @author saurabhg 2/1/2020
 */
@RestController
@RequestMapping(value = "/rest/vat")
public class VatController implements Serializable {

    @Autowired
    private VatCategoryService vatCategoryService;

    @Autowired
    private VatCategoryRestHelper vatCategoryRestHelper;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @ApiOperation(value = "Get Vat Category List")
    @GetMapping(value = "getList")
    private ResponseEntity getVatList(VatCategoryRequestFilterModel filterModel) {

        Map<VatCategoryFilterEnum, Object> filterDataMap = new HashMap();
        filterDataMap.put(VatCategoryFilterEnum.VAT_CATEGORY_NAME, filterModel.getName());
        if (filterModel.getVatPercentage() != null && !filterModel.getVatPercentage().contentEquals("")) {
            filterDataMap.put(VatCategoryFilterEnum.VAT_RATE, new BigDecimal(filterModel.getVatPercentage()));
        }
        filterDataMap.put(VatCategoryFilterEnum.DELETE_FLAG, false);

        List<VatCategory> vatCategorys = vatCategoryService.getVatCategoryList(filterDataMap);
        if (vatCategorys != null) {
            return new ResponseEntity(vatCategoryRestHelper.getList(vatCategorys), HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

    }

    @ApiOperation(value = "delete Vat Category by Id")
    @DeleteMapping(value = "/delete")
    private ResponseEntity delete(@RequestParam(value = "id") Integer id) {
        VatCategory vatCategory = vatCategoryService.findByPK(id);
        if (vatCategory != null) {
            vatCategory.setDeleteFlag(true);
            vatCategoryService.update(vatCategory, vatCategory.getId());
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(HttpStatus.OK);

    }

    @ApiOperation(value = "Delete Vat Category in Bulk")
    @DeleteMapping(value = "/deletes")
    public ResponseEntity deletes(@RequestBody DeleteModel ids) {
        try {
            vatCategoryService.deleteByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ApiOperation(value = "Get Vat Category By ID")
    @GetMapping(value = "/getById")
    private ResponseEntity getById(@RequestParam(value = "id") Integer id) {
        VatCategory vatCategory = vatCategoryService.findByPK(id);
        if (vatCategory != null) {
            return new ResponseEntity(vatCategoryRestHelper.getModel(vatCategory), HttpStatus.OK);

        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }

    @ApiOperation(value = "Add New Vat Category")
    @PostMapping(value = "/save")
    private ResponseEntity save(@RequestBody VatCategoryRequestModel vatCatRequestModel, HttpServletRequest request) {
        try {

            VatCategory vatCategory = vatCategoryRestHelper.getEntity(vatCatRequestModel);

            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            vatCategory.setCreatedBy(userId);
            vatCategory.setCreatedDate(new Date());
            vatCategory.setCreatedDate(new Date());
            vatCategory.setDefaultFlag('N');
            vatCategory.setOrderSequence(1);
            vatCategory.setVersionNumber(1);
            vatCategoryService.persist(vatCategory);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity(HttpStatus.OK);
    }

//    Commented by mohsin as this is failing the application
    // @DeleteMapping(value = "/deletevats")
//    private ResponseEntity deleteVats() {
//        List<VatCategory> vatCategoryList = vatCategoryService.getVatCategoryList();
//        if (vatCategoryList != null) {
//            for (VatCategory vatCategory : vatCategoryList) {
//            	vatCategory.setDeleteFlag(true);
//            	vatCategoryService.update(vatCategory, vatCategory.getId());
//			}
//        } else {
//            return new ResponseEntity(HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity(HttpStatus.OK);
//
//    }
    @ApiOperation(value = "Update Vat Category")
    @PostMapping(value = "/update")
    public ResponseEntity update(@RequestBody VatCategoryRequestModel vatCatRequestModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            VatCategory vatCategory = vatCategoryRestHelper.getEntity(vatCatRequestModel);
            vatCategory.setLastUpdateDate(new Date());
            vatCategory.setLastUpdateBy(userId);
            vatCategoryService.update(vatCategory);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
