/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.supplierinvoicecontroller;

import com.simplevat.constant.dbfilter.SupplierInvoiceFilterEnum;
import com.simplevat.entity.SupplierInvoice;
import com.simplevat.security.JwtTokenUtil;
import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ashish
 */
@RestController
@RequestMapping(value = "/rest/supplierinvoice")
public class SupplierInvoiceRestController implements Serializable {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

//    @Autowired
//    private JwtTokenUtil jwtTokenUtil;

    @ApiOperation(value = "Get Suppler Invoice List")
    @PostMapping(value = "/getList")
    public ResponseEntity getSupplierInvoiceList(
//            @RequestBody SupplierInvoiceRequestFilterModel filterModel, 
            HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
//        Map<SupplierInvoiceFilterEnum, Object> filterDataMap = new HashMap();
//        filterDataMap.put(SupplierInvoiceFilterEnum.CUSTOMER_NAME, filterModel.getCustomerName());
//        filterDataMap.put(SupplierInvoiceFilterEnum.INVOICE_NUMBER, filterModel.getReferenceNumber());
//        filterDataMap.put(SupplierInvoiceFilterEnum.INVOICE_DATE, filterModel.getInvoiceDate());
//        filterDataMap.put(SupplierInvoiceFilterEnum.INVOICE_DUE_DATE, filterModel.getInvoiceDueDate());
//        filterDataMap.put(SupplierInvoiceFilterEnum.STATUS, filterModel.getStatus());
//        filterDataMap.put(SupplierInvoiceFilterEnum.USER_ID, userId);
//        List<SupplierInvoice> invoices = productService.getProductList(filterDataMap);
//        if (products == null) {
//            return new ResponseEntity(HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity(productRestHelper.getListModel(products), HttpStatus.OK);
        return new ResponseEntity(HttpStatus.OK);
    }

}
