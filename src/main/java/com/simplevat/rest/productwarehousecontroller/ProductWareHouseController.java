/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.productwarehousecontroller;

import com.simplevat.rest.productcontroller.ProductRestHelper;
import com.simplevat.entity.ProductWarehouse;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;
import java.io.Serializable;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/productwarehouse")
public class ProductWareHouseController implements Serializable {

    @Autowired
    private ProductWarehouseService productWarehouseService;

    @GetMapping(value = "/getwarehouse")
    public ResponseEntity getProductWarehouse() {
        List<ProductWarehouse> productWarehouseList = productWarehouseService.getProductWarehouseList();
        if (productWarehouseList == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productWarehouseList, HttpStatus.OK);
    }

    @PostMapping(value = "/savewarehouse")
    public ResponseEntity createNewWarehouse(@RequestBody ProductWarehouse productWarehouse) {

        if (productWarehouse != null) {
            productWarehouseService.persist(productWarehouse);
        }
        return new ResponseEntity(HttpStatus.OK);

    }

}
