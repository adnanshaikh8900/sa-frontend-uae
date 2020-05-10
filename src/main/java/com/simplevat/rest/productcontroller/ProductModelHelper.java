package com.simplevat.rest.productcontroller;

import com.simplevat.entity.Product;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;

public class ProductModelHelper {

	public Product convertToProduct(ProductRequestModel productModel, VatCategoryService vatCategoryService,
									ProductWarehouseService productWarehouseService, ProductService productService) {
		Product product = new Product();
		product.setProductID(productModel.getProductID());
		product.setProductName(productModel.getProductName());
		if (vatCategoryService != null) {
			product.setVatCategory(vatCategoryService.findByPK(productModel.getVatCategoryId()));
		}
		product.setCreatedBy(productModel.getCreatedBy());
		product.setCreatedDate(productModel.getCreatedDate());
		product.setDeleteFlag(productModel.getDeleteFlag());
		product.setLastUpdateDate(productModel.getLastUpdateDate());
		product.setLastUpdatedBy(productModel.getLastUpdatedBy());
		product.setProductCode(productModel.getProductCode());
		product.setVersionNumber(productModel.getVersionNumber());
		product.setProductDescription(productModel.getProductDescription());

		if (productWarehouseService != null) {
			product.setProductWarehouse(productWarehouseService.findByPK(productModel.getProductWarehouse()));
		}
		product.setVatIncluded(productModel.getVatIncluded());
		product.setUnitPrice(productModel.getUnitPrice());

		return product;
	}

	public ProductRequestModel convertToProductModel(Product product) {
		ProductRequestModel productModel = new ProductRequestModel();
		productModel.setProductID(product.getProductID());
		productModel.setProductName(product.getProductName());
		if (product.getVatCategory() != null) {
			productModel.setVatCategoryId(product.getVatCategory().getId());
		}
		productModel.setCreatedBy(product.getCreatedBy());
		productModel.setCreatedDate(product.getCreatedDate());
		productModel.setDeleteFlag(product.getDeleteFlag());
		productModel.setLastUpdateDate(product.getLastUpdateDate());
		productModel.setLastUpdatedBy(product.getLastUpdatedBy());
		productModel.setProductCode(product.getProductCode());
		productModel.setVersionNumber(product.getVersionNumber());
		productModel.setProductDescription(product.getProductDescription());

		if (product.getProductWarehouse() != null) {
			productModel.setProductWarehouse(product.getProductWarehouse().getWarehouseId());
		}
		productModel.setVatIncluded(product.getVatIncluded());
		productModel.setUnitPrice(product.getUnitPrice());
		return productModel;
	}
}
