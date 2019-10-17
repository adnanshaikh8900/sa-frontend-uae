package com.simplevat.rest.productcontroller;

import com.simplevat.entity.Product;
import com.simplevat.productservice.model.ProductModel;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;

public class ProductModelHelper {

    public Product convertToProduct(ProductModel productModel, VatCategoryService vatCategoryService, ProductWarehouseService productWarehouseService, ProductService productService) {
        Product product = new Product();
        product.setProductID(productModel.getProductID());
        product.setProductName(productModel.getProductName());
        if (vatCategoryService != null) {
            product.setVatCategory(vatCategoryService.findByPK(productModel.getVatCategory()));
        }
        product.setCreatedBy(productModel.getCreatedBy());
        product.setCreatedDate(productModel.getCreatedDate());
        product.setDeleteFlag(productModel.getDeleteFlag());
        product.setLastUpdateDate(productModel.getLastUpdateDate());
        product.setLastUpdatedBy(productModel.getLastUpdatedBy());
        product.setProductCode(productModel.getProductCode());
        product.setVersionNumber(productModel.getVersionNumber());
        product.setProductDescription(productModel.getProductDescription());
        if (productService != null) {
            product.setParentProduct(productService.findByPK(productModel.getParentProduct()));
        }
        if (productWarehouseService != null) {
            product.setProductWarehouse(productWarehouseService.findByPK(productModel.getProductWarehouse()));
        }
        product.setVatIncluded(productModel.getVatIncluded());
        product.setUnitPrice(productModel.getUnitPrice());

        return product;
    }

    public ProductModel convertToProductModel(Product product) {
        ProductModel productModel = new ProductModel();
        productModel.setProductID(product.getProductID());
        productModel.setProductName(product.getProductName());
        if (product.getVatCategory() != null) {
            productModel.setVatCategory(product.getVatCategory().getId());
        }
        productModel.setCreatedBy(product.getCreatedBy());
        productModel.setCreatedDate(product.getCreatedDate());
        productModel.setDeleteFlag(product.getDeleteFlag());
        productModel.setLastUpdateDate(product.getLastUpdateDate());
        productModel.setLastUpdatedBy(product.getLastUpdatedBy());
        productModel.setProductCode(product.getProductCode());
        productModel.setVersionNumber(product.getVersionNumber());
        productModel.setProductDescription(product.getProductDescription());
        if (product.getParentProduct() != null) {
            productModel.setParentProduct(product.getParentProduct().getProductID());
        }
        if (product.getProductWarehouse() != null) {
            productModel.setProductWarehouse(product.getProductWarehouse().getWarehouseId());
        }
        productModel.setVatIncluded(product.getVatIncluded());
        productModel.setUnitPrice(product.getUnitPrice());
        return productModel;
    }
}
