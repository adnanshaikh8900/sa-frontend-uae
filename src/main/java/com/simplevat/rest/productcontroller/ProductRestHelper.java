package com.simplevat.rest.productcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.simplevat.constant.ProductPriceType;
import com.simplevat.entity.Product;
import com.simplevat.entity.ProductCategory;
import com.simplevat.entity.ProductLineItem;
import com.simplevat.entity.ProductWarehouse;
import com.simplevat.entity.VatCategory;
import com.simplevat.service.ProductCategoryService;
import com.simplevat.service.ProductLineItemService;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;

@Service
public class ProductRestHelper {

	@Autowired
	VatCategoryService vatCategoryService;

	@Autowired
	ProductService productService;

	@Autowired
	ProductCategoryService productCategoryService;

	@Autowired
	ProductWarehouseService productWarehouseService;

	@Autowired
	private ProductLineItemService productLineItemService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	public Product getEntity(ProductRequestModel productModel) {
		Product product = new Product();
		if (productModel.getProductID() != null) {
			product = productService.findByPK(productModel.getProductID());
		}

		product.setProductName(productModel.getProductName());
		if (productModel.getVatCategoryId() != null) {
			VatCategory vatCategory = vatCategoryService.findByPK(productModel.getVatCategoryId());
			product.setVatCategory(vatCategory);
		}
		product.setProductCode(productModel.getProductCode());
		if (productModel.getProductWarehouseId() != null) {
			ProductWarehouse productWarehouse = productWarehouseService.findByPK(productModel.getProductWarehouseId());
			product.setProductWarehouse(productWarehouse);
		}
		if (productModel.getProductCategoryId() != null) {
			ProductCategory productCategory = productCategoryService.findByPK(productModel.getProductCategoryId());
			product.setProductCategory(productCategory);
		}
		product.setVatIncluded(productModel.getVatIncluded());
		product.setProductType(productModel.getProductType());
		product.setCreatedBy(productModel.getCreatedBy());
		product.setPriceType(productModel.getProductPriceType());

		List<ProductLineItem> lineItem = new ArrayList<>();
		Map<String, Object> param = new HashMap<>();
		if (ProductPriceType.isSalesValuePresnt(productModel.getProductPriceType())) {
			ProductLineItem item = new ProductLineItem();
			if (product.getProductID() != null) {
				param.put("product", product);
				param.put("priceType", ProductPriceType.SALES);
				List<ProductLineItem> itemList = productLineItemService.findByAttributes(param);
				item = itemList != null && !itemList.isEmpty() ? itemList.get(0) : new ProductLineItem();
			}
			item.setUnitPrice(productModel.getSalesUnitPrice());
			item.setCreatedBy(productModel.getCreatedBy());
			item.setDeleteFlag(false);
			item.setDescription(productModel.getSalesDescription());
			item.setTransactioncategory(
					transactionCategoryService.findByPK(productModel.getSalesTransactionCategoryId()));
			item.setProduct(product);
			item.setPriceType(ProductPriceType.SALES);
			lineItem.add(item);
		}
		if (ProductPriceType.isPurchaseValuePresnt(productModel.getProductPriceType())) {
			ProductLineItem item = new ProductLineItem();
			if (product.getProductID() != null) {
				param.put("product", product);
				param.put("priceType", ProductPriceType.PURCHASE);
				List<ProductLineItem> itemList = productLineItemService.findByAttributes(param);
				item = itemList != null && !itemList.isEmpty() ? itemList.get(0) : new ProductLineItem();
			}
			item.setUnitPrice(productModel.getPurchaseUnitPrice());
			item.setCreatedBy(productModel.getCreatedBy());
			item.setDeleteFlag(false);
			item.setDescription(productModel.getPurchaseDescription());
			item.setTransactioncategory(
					transactionCategoryService.findByPK(productModel.getPurchaseTransactionCategoryId()));
			item.setProduct(product);
			item.setPriceType(ProductPriceType.PURCHASE);
			lineItem.add(item);
		}

		if (!lineItem.isEmpty()) {
			product.setLineItemList(lineItem);
		}
		return product;
	}

	public ProductRequestModel getRequestModel(Product product) {
		ProductRequestModel productModel = new ProductRequestModel();

		BeanUtils.copyProperties(product, productModel);

		if (product.getVatCategory() != null) {
			productModel.setVatCategoryId(product.getVatCategory().getId());
		}
		if (product.getProductCategory() != null) {
			productModel.setProductCategoryId(product.getProductCategory().getId());
		}
		if (product.getProductWarehouse() != null) {
			productModel.setProductWarehouseId(product.getProductWarehouse().getWarehouseId());
		}
		productModel.setVatIncluded(product.getVatIncluded());
		productModel.setProductPriceType(product.getPriceType());

		if (product.getLineItemList() != null && !product.getLineItemList().isEmpty()) {
			for (ProductLineItem lineItem : product.getLineItemList()) {
				if (lineItem.getPriceType().equals(ProductPriceType.SALES)) {
					productModel.setSalesUnitPrice(lineItem.getUnitPrice());
					productModel.setSalesDescription(lineItem.getDescription());
					productModel.setSalesTransactionCategoryId(
							lineItem.getTransactioncategory().getTransactionCategoryId());
					productModel.setSalesTransactionCategoryLabel(
							lineItem.getTransactioncategory().getChartOfAccount().getChartOfAccountName());
				} else {
					productModel.setPurchaseUnitPrice(lineItem.getUnitPrice());
					productModel.setPurchaseDescription(lineItem.getDescription());
					productModel.setPurchaseTransactionCategoryId(
							lineItem.getTransactioncategory().getTransactionCategoryId());
					productModel.setPurchaseTransactionCategoryLabel(
							lineItem.getTransactioncategory().getChartOfAccount().getChartOfAccountName());
				}
			}
		}
		return productModel;
	}

	public ProductListModel getListModel(Product product) {
		ProductListModel productModel = new ProductListModel();
		productModel.setId(product.getProductID());
		productModel.setName(product.getProductName());
		if (product.getVatCategory() != null) {
			productModel.setVatCategoryId(product.getVatCategory().getId());
			productModel.setVatPercentage(product.getVatCategory().getVatLabel());
		}
		if (product.getProductCategory() != null) {
			productModel.setProductCategoryId(product.getProductCategory().getId());
		}
		if (product.getProductWarehouse() != null) {
			productModel.setProductWarehouseId(product.getProductWarehouse().getWarehouseId());
		}
		for (ProductLineItem lineItem : product.getLineItemList()) {
			if (!lineItem.getPriceType().equals(ProductPriceType.PURCHASE)) {
				productModel.setDescription(product.getDescription());
				productModel.setUnitPrice(product.getUnitPrice());
			}
		}
		productModel.setProductCode(product.getProductCode());
		productModel.setVatIncluded(product.getVatIncluded());
		return productModel;
	}

	public ProductPriceModel getPriceModel(Product product, ProductPriceType priceType) {
		ProductPriceModel productModel = new ProductPriceModel();
		productModel.setId(product.getProductID());
		productModel.setName(product.getProductName());
		if (product.getVatCategory() != null) {
			productModel.setVatCategoryId(product.getVatCategory().getId());
			productModel.setVatPercentage(product.getVatCategory().getVatLabel());
		}
		for (ProductLineItem lineItem : product.getLineItemList()) {
			if (lineItem.getPriceType().equals(priceType)) {
				productModel.setDescription(lineItem.getDescription());
				productModel.setUnitPrice(lineItem.getUnitPrice());
				if (lineItem.getPriceType().equals(ProductPriceType.PURCHASE))
					productModel.setTransactionCategoryId(lineItem.getTransactioncategory().getTransactionCategoryId());
					productModel.setTransactionCategoryLabel(lineItem.getTransactioncategory().getChartOfAccount().getChartOfAccountName());
			}

		}
		return productModel;
	}
}
