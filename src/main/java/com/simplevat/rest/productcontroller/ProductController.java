/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.productcontroller;

import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.entity.Product;
import com.simplevat.entity.ProductWarehouse;
import com.simplevat.entity.VatCategory;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.rest.productcontroller.ProductRequestModel;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@RequestMapping(value = "/rest/product")
public class ProductController implements Serializable {

	@Autowired
	private ProductService productService;

	@Autowired
	private ProductWarehouseService productWarehouseService;

	@Autowired
	private VatCategoryService vatCategoryService;

	private ProductModelHelper productModelHelper = new ProductModelHelper();

	@GetMapping(value = "/getproduct")
	private ResponseEntity<List<Product>> getProduct(ProductRequestFilterModel filterModel) {

		Map<ProductFilterEnum, Object> filterDataMap = new HashMap();

		filterDataMap.put(ProductFilterEnum.PRODUCT_NAME, filterModel.getName());
		filterDataMap.put(ProductFilterEnum.PRODUCT_CODE, filterModel.getProductCode());
		filterDataMap.put(ProductFilterEnum.PRODUCT_VAT_PERCENTAGE, filterModel.getVatPercentage());

		List<Product> products = productService.getProductList(filterDataMap);

		try {
			if (products == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(products, HttpStatus.OK);
	}

	@DeleteMapping(value = "/deleteproduct")
	private ResponseEntity deleteUser(@RequestParam(value = "id") Integer id) {
		Product product = productService.findByPK(id);
		if (product != null) {
			product.setDeleteFlag(Boolean.TRUE);
			productService.update(product, product.getProductID());
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@GetMapping(value = "/editproduct")
	private ResponseEntity<Product> editProduct(@RequestParam(value = "id") Integer id) {
		Product product = productService.findByPK(id);
		if (product == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(product, HttpStatus.OK);
		}

	}

	@GetMapping(value = "/getvatpercentage")
	private ResponseEntity<List<VatCategory>> vatCategorys() {
		List<VatCategory> vatCategorys = vatCategoryService.getVatCategoryList();
		;
		if (vatCategorys == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(vatCategorys, HttpStatus.OK);
	}

	@GetMapping(value = "/getwarehouse")
	private ResponseEntity<List<ProductWarehouse>> getProductWarehouse() {
		List<ProductWarehouse> productWarehouseList = productWarehouseService.getProductWarehouseList();
		if (productWarehouseList == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(productWarehouseList, HttpStatus.OK);
	}

	@PostMapping(value = "/savewarehouse")
	private ResponseEntity createNewWarehouse(@RequestBody ProductWarehouse productWarehouse) {

		if (productWarehouse != null) {
			productWarehouseService.persist(productWarehouse);
		}
		return new ResponseEntity(HttpStatus.OK);

	}

	@PostMapping(value = "/saveproduct")
	private ResponseEntity save(@RequestBody ProductRequestModel productModel, @RequestParam(value = "id") Integer id) {
		Product product = productModelHelper.convertToProduct(productModel, vatCategoryService, productWarehouseService,
				productService);
		if (product.getUnitPrice() == null) {
			product.setUnitPrice(BigDecimal.ZERO);
		}
		if (productModel.getProductID() == null) {
			product.setCreatedBy(id);
			product.setCreatedDate(LocalDateTime.now());
			product.setDeleteFlag(Boolean.FALSE);
		} else {
			product.setLastUpdateDate(LocalDateTime.now());
			product.setLastUpdatedBy(id);
		}
		if (productModel.getVatCategoryId() != null) {
			VatCategory vatCategory = vatCategoryService.findByPK(productModel.getVatCategoryId());
			product.setVatCategory(vatCategory);
		}
		if (productModel.getProductID() == null) {
			productService.persist(product);
		} else {
			productService.update(product);
		}

		return new ResponseEntity(HttpStatus.OK);
	}

}
