/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.productcontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.model.TransactionRestModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.entity.Product;
import com.simplevat.entity.VatCategory;
import com.simplevat.service.ProductService;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.VatCategoryService;
import io.swagger.annotations.ApiOperation;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
public class ProductRestController implements Serializable {

	@Autowired
	private ProductService productService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private ProductRestHelper productRestHelper;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@ApiOperation(value = "Get Product List")
	@GetMapping(value = "/getList")
	public ResponseEntity getProductList(ProductRequestFilterModel filterModel, HttpServletRequest request) {
		try {
			Map<ProductFilterEnum, Object> filterDataMap = new HashMap();
			filterDataMap.put(ProductFilterEnum.PRODUCT_NAME, filterModel.getName());
			filterDataMap.put(ProductFilterEnum.PRODUCT_CODE, filterModel.getProductCode());
			filterDataMap.put(ProductFilterEnum.DELETE_FLAG, false);
			if (filterModel.getVatPercentage() != null) {
				filterDataMap.put(ProductFilterEnum.PRODUCT_VAT_PERCENTAGE,
						vatCategoryService.findByPK(filterModel.getVatPercentage()));
			}
			filterDataMap.put(ProductFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
			PaginationResponseModel response = productService.getProductList(filterDataMap, filterModel);
			List<ProductListModel> productListModels = new ArrayList<>();
			if (response == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			} else {
				if (response.getData() != null) {
					for (Product product : (List<Product>) response.getData()) {
						ProductListModel model = productRestHelper.getListModel(product);
						productListModels.add(model);
					}
					response.setData(productListModels);
				}
			}
			return new ResponseEntity(productListModels, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Product By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteProduct(@RequestParam(value = "id") Integer id) {
		try {
			Product product = productService.findByPK(id);
			if (product != null) {
				product.setDeleteFlag(Boolean.TRUE);
				productService.update(product, product.getProductID());
			}
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Product in Bulk")
	@DeleteMapping(value = "/deletes")
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
		try {
			Product product = productService.findByPK(id);
			if (product == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<>(productRestHelper.getListModel(product), HttpStatus.OK);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Add New Product")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody ProductRequestModel productRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Product product = productRestHelper.getEntity(productRequestModel);
			product.setCreatedBy(userId);
			product.setCreatedDate(LocalDateTime.now());
			product.setDeleteFlag(Boolean.FALSE);
			productService.persist(product);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Product")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody ProductRequestModel productRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Product product = productRestHelper.getEntity(productRequestModel);
			product.setLastUpdateDate(LocalDateTime.now());
			product.setLastUpdatedBy(userId);
			productService.update(product);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
