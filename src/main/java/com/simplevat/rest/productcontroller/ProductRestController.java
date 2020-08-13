package com.simplevat.rest.productcontroller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import com.simplevat.constant.ProductPriceType;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.entity.Product;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ProductService;
import com.simplevat.service.VatCategoryService;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/product")
public class ProductRestController {
	private final Logger logger = LoggerFactory.getLogger(ProductRestController.class);
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
	public ResponseEntity<PaginationResponseModel> getProductList(ProductRequestFilterModel filterModel, HttpServletRequest request) {
		try {
			Map<ProductFilterEnum, Object> filterDataMap = new EnumMap<>(ProductFilterEnum.class);
			filterDataMap.put(ProductFilterEnum.PRODUCT_NAME, filterModel.getName());
			filterDataMap.put(ProductFilterEnum.PRODUCT_CODE, filterModel.getProductCode());
			filterDataMap.put(ProductFilterEnum.DELETE_FLAG, false);
			if (filterModel.getVatPercentage() != null) {
				filterDataMap.put(ProductFilterEnum.PRODUCT_VAT_PERCENTAGE,
						vatCategoryService.findByPK(filterModel.getVatPercentage()));
			}
			if(filterModel.getOrder()!=null && filterModel.getOrder().equalsIgnoreCase("desc"))
			filterDataMap.put(ProductFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
			else
				filterDataMap.put(ProductFilterEnum.ORDER_BY, ORDERBYENUM.ASC);

			if (filterModel.getProductPriceType() != null) {
				filterDataMap.put(ProductFilterEnum.PRODUCT_PRICE_TYPE,
						Arrays.asList(filterModel.getProductPriceType(), ProductPriceType.BOTH));
			}
			PaginationResponseModel response = productService.getProductList(filterDataMap, filterModel);
			List<ProductListModel> productListModels = new ArrayList<>();
			if (response == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			} else {
				if (response.getData() != null) {
					for (Product product : (List<Product>) response.getData()) {
						ProductListModel model = productRestHelper.getListModel(product);
						productListModels.add(model);
					}
					response.setData(productListModels);
				}
			}
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Product By ID")
	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteProduct(@RequestParam(value = "id") Integer id) {
		try {
			Product product = productService.findByPK(id);
			if (product != null) {
				productService.deleteByIds(Arrays.asList(id));
			}
			return new ResponseEntity<>("deleted Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete Product in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity<String> deleteProducts(@RequestBody DeleteModel ids) {
		try {
			productService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Product By ID")
	@GetMapping(value = "/getProductById")
	public ResponseEntity<ProductRequestModel> getProductById(@RequestParam(value = "id") Integer id) {
		try {
			Product product = productService.findByPK(id);
			if (product == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			} else {
				return new ResponseEntity<>(productRestHelper.getRequestModel(product), HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Add New Product")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@RequestBody ProductRequestModel productRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			productRequestModel.setCreatedBy(userId);
			Product product = productRestHelper.getEntity(productRequestModel);
			product.setCreatedDate(LocalDateTime.now());
			product.setDeleteFlag(Boolean.FALSE);
			productService.persist(product);
			return new ResponseEntity<>("Saved Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Product")
	@PostMapping(value = "/update")
	public ResponseEntity<String> update(@RequestBody ProductRequestModel productRequestModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			productRequestModel.setCreatedBy(userId);
			Product product = productRestHelper.getEntity(productRequestModel);
			product.setLastUpdateDate(LocalDateTime.now());
			product.setLastUpdatedBy(userId);
			productService.update(product);
			return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
