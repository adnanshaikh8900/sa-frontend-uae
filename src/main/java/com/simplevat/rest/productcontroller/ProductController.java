/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.productcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.helper.ProductModelHelper;
import com.simplevat.entity.Product;
import com.simplevat.service.ProductService;
import com.simplevat.productservice.model.ProductRequestModel;
import com.simplevat.security.JwtTokenUtil;
import io.swagger.annotations.ApiOperation;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/product")
public class ProductController implements Serializable {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductModelHelper productModelHelper;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @ApiOperation(value = "Get Product List")
    @GetMapping(value = "/getProductList")
    public ResponseEntity getProduct(HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        List<Product> products = productService.getProductList(userId);
        try {
            if (products == null) {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(products, HttpStatus.OK);
    }
    
    
//    @RequestMapping(method = RequestMethod.GET, value = "/products")
//    public ResponseEntity products(@RequestParam("productName") String searchQuery) throws Exception {
//        try {
//            List<Product> productList = productService.getProductList();
//            if (productList != null) {
//                List<Product> parentProductList = new ArrayList<>();
//                for (Product product : productList) {
//                    if (product.getParentProduct() != null) {
//                        parentProductList.add(product.getParentProduct());
//                    }
//                }
//                productList.removeAll(parentProductList);
//            }
//            return new ResponseEntity(productList, HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

    @ApiOperation(value = "Delete Product By ID")
    @DeleteMapping(value = "/deleteProduct")
    public ResponseEntity deleteProduct(@RequestParam(value = "id") Integer id) {
        Product product = productService.findByPK(id);
        if (product != null) {
            product.setDeleteFlag(Boolean.TRUE);
            productService.update(product, product.getProductID());
        }
        return new ResponseEntity(HttpStatus.OK);

    }

    @ApiOperation(value = "Delete Product in Bulk")
    @DeleteMapping(value = "/deleteProducts")
    public ResponseEntity deleteProducts(@RequestBody DeleteModel ids) {
        try {
            productService.deleteByIds(ids.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @ApiOperation(value = "Get Product By ID")
    @GetMapping(value = "/getProductById")
    public ResponseEntity getProductById(@RequestParam(value = "id") Integer id) {
        Product product = productService.findByPK(id);
        if (product == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(product, HttpStatus.OK);
        }

    }

    @ApiOperation(value = "Add New Product")
    @PostMapping(value = "/save")
    public ResponseEntity save(@RequestBody ProductRequestModel productRequestModel, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        Product product = productModelHelper.convertToProduct(productRequestModel);
        product.setCreatedBy(userId);
        product.setCreatedDate(LocalDateTime.now());
        product.setDeleteFlag(Boolean.FALSE);
        productService.persist(product);
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "Update Product")
    @PostMapping(value = "/update")
    public ResponseEntity update(@RequestBody ProductRequestModel productRequestModel, HttpServletRequest request) {
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
        Product product = productModelHelper.convertToProduct(productRequestModel);
        product.setLastUpdateDate(LocalDateTime.now());
        product.setLastUpdatedBy(userId);
        productService.update(product);

        return new ResponseEntity(HttpStatus.OK);
    }

}
