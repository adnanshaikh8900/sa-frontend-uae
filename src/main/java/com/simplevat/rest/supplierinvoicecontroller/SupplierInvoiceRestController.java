/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.supplierinvoicecontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.SupplierInvoiceFilterEnum;
import com.simplevat.entity.SupplierInvoice;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.SupplierInvoiceService;
import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @Autowired
    private SupplierInvoiceRestHelper supplierInvoiceRestHelper;

    @Autowired
    private SupplierInvoiceService supplierInvoiceService;

    @ApiOperation(value = "Get Suppler Invoice List")
    @GetMapping(value = "/getList")
    public ResponseEntity getSupplierInvoiceList(SupplierInvoiceRequestFilterModel filterModel,
            HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        Map<SupplierInvoiceFilterEnum, Object> filterDataMap = new HashMap();
//        filterDataMap.put(SupplierInvoiceFilterEnum.CUSTOMER_NAME, filterModel.getCustomerName());
        filterDataMap.put(SupplierInvoiceFilterEnum.INVOICE_NUMBER, filterModel.getReferenceNumber());
        filterDataMap.put(SupplierInvoiceFilterEnum.INVOICE_DATE, filterModel.getInvoiceDate());
        filterDataMap.put(SupplierInvoiceFilterEnum.INVOICE_DUE_DATE, filterModel.getInvoiceDueDate());
        filterDataMap.put(SupplierInvoiceFilterEnum.STATUS, filterModel.getStatus());
        filterDataMap.put(SupplierInvoiceFilterEnum.USER_ID, userId);
        List<SupplierInvoice> invoices = supplierInvoiceService.getSupplierInvoiceList(filterDataMap);
        if (invoices == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(supplierInvoiceRestHelper.getListModel(invoices), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete Invoice By ID")
    @DeleteMapping(value = "/delete")
    public ResponseEntity deleteProduct(@RequestParam(value = "id") Integer id) {
        SupplierInvoice invoice = supplierInvoiceService.findByPK(id);
        if (invoice != null) {
            invoice.setDeleteFlag(Boolean.TRUE);
            supplierInvoiceService.update(invoice, invoice.getId());
        }
        return new ResponseEntity(HttpStatus.OK);

    }

    @ApiOperation(value = "Delete Invoices in Bulk")
    @DeleteMapping(value = "/deletes")
    public ResponseEntity deleteProducts(@RequestBody DeleteModel ids) {
        try {
            supplierInvoiceService.deleteByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @ApiOperation(value = "Get Invoice By ID")
    @GetMapping(value = "/getInvoiceById")
    public ResponseEntity getInvoiceById(@RequestParam(value = "id") Integer id) {
        SupplierInvoice invoice = supplierInvoiceService.findByPK(id);
        if (invoice == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(invoice, HttpStatus.OK);
        }
    }

    @ApiOperation(value = "Add New Supplier Invoice")
    @PostMapping(value = "/save")
    public ResponseEntity save(
            @ModelAttribute SupplierInvoiceRequestModel requestModel,
            HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        SupplierInvoice invoice = supplierInvoiceRestHelper.getEntity(requestModel,userId);
        invoice.setCreatedBy(userId);
        invoice.setCreatedDate(LocalDateTime.now());
        invoice.setDeleteFlag(Boolean.FALSE);
        supplierInvoiceService.persist(invoice);
        return new ResponseEntity(HttpStatus.OK);
    }
}
