package com.simplevat.rest.productcategorycontroller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.ProductCategoryFilterEnum;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.entity.ProductCategory;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.transactioncategorycontroller.TransactionCategoryBean;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ProductCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.service.bankaccount.TransactionTypeService;

import io.swagger.annotations.ApiOperation;

/**
 *
 * @author saurabhg 26/12/19
 */
@RestController
@RequestMapping(value = "/rest/productcategory")
public class ProductCategoryRestController {

	@Autowired
	private ProductCategoryService productCategoryService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private UserService userServiceNew;

	@Autowired
	private ProductCategoryRestHelper productCategoryRestHelper;

	@Autowired
	private TransactionTypeService transactionTypeService;

	@ApiOperation(value = "Get All Product Categories for the Loggedin User and the Master data")
	@GetMapping(value = "/getList")
	public ResponseEntity getAllProductCategory(ProductCategoryFilterModel filterModel,
			HttpServletRequest request) {

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
		User user = userServiceNew.findByPK(userId);

		Map<ProductCategoryFilterEnum, Object> filterDataMap = new HashMap();
		filterDataMap.put(ProductCategoryFilterEnum.PRODUCT_CATEGORY_CODE, filterModel.getProductCategoryCode());
		filterDataMap.put(ProductCategoryFilterEnum.PRODUCT_CATEGORY_NAME, filterModel.getProductCategoryName());
		filterDataMap.put(ProductCategoryFilterEnum.USER_ID, filterModel.getUserId());
		filterDataMap.put(ProductCategoryFilterEnum.DELETE_FLAG, false);

		List<ProductCategory> productcategories = productCategoryService.getProductCategoryList(filterDataMap);
		if (productcategories != null) {
			return new ResponseEntity(productCategoryRestHelper.getListModel(productcategories), HttpStatus.OK);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Product Category By ID")
	@GetMapping(value = "/getById")
	public ResponseEntity getProductCategoryById(@RequestParam("id") Integer id) {
		ProductCategory productCategory = productCategoryService.findByPK(id);
		return new ResponseEntity(productCategoryRestHelper.getRequestModel(productCategory), HttpStatus.OK);
	}

	@ApiOperation(value = "Delete Product Category")
	@DeleteMapping(value = "/delete")
	public ResponseEntity delete(@RequestParam("id") Integer id) {
		ProductCategory productCategories = productCategoryService.findByPK(id);
		if (productCategories == null) {
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		productCategories.setDeleteFlag(Boolean.TRUE);
		productCategoryService.update(productCategories, id);
		return new ResponseEntity(HttpStatus.OK);
	}

	@ApiOperation(value = "Delete Product Category In Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deletes(@RequestBody DeleteModel ids) {
		try {
			productCategoryService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Add New Product Category")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody ProductCategoryListModel productCategoryModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			ProductCategory selectedProductCategory = productCategoryRestHelper.getEntity(productCategoryModel);
			selectedProductCategory.setCreatedBy(user.getUserId());
			selectedProductCategory.setCreatedDate(LocalDateTime.now());
			productCategoryService.persist(selectedProductCategory);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Update Product Category")
	@PostMapping(value = "/update")
	public ResponseEntity update(@RequestBody ProductCategoryListModel productCategoryModel,
			HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userServiceNew.findByPK(userId);
			ProductCategory selectedProductCategory = productCategoryService.findByPK(productCategoryModel.getId());
			selectedProductCategory.setProductCategoryCode(productCategoryModel.getProductCategoryCode());
			selectedProductCategory.setProductCategoryName(productCategoryModel.getProductCategoryName());
			/*
			 * if (productCategoryModel.getId() != null) {
			 * selectedProductCategory.setTransactionType(
			 * transactionTypeService.findByPK(pr.getTransactionType())); }
			 */
			productCategoryModel.setLastUpdateBy(user.getUserId());
			productCategoryModel.setLastUpdateDate(LocalDateTime.now());
			productCategoryService.update(selectedProductCategory);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
