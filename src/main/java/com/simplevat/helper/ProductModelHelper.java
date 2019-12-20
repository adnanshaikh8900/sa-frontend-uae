package com.simplevat.helper;

import com.simplevat.entity.Product;
import com.simplevat.entity.ProductWarehouse;
import com.simplevat.entity.VatCategory;
import com.simplevat.productservice.model.ProductRequestModel;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductModelHelper {

    @Autowired
    VatCategoryService vatCategoryService;

    @Autowired
    ProductService productService;

    @Autowired
    ProductWarehouseService productWarehouseService;

    public Product convertToProduct(ProductRequestModel productModel) {
        Product product = new Product();
        if (product.getUnitPrice() == null) {
            product.setUnitPrice(BigDecimal.ZERO);
        }
        product.setProductID(productModel.getProductID());
        product.setProductName(productModel.getProductName());
        if (productModel.getVatCategoryId() != null) {
            VatCategory vatCategory = vatCategoryService.findByPK(productModel.getVatCategoryId());
            product.setVatCategory(vatCategory);
        }
        product.setCreatedBy(productModel.getCreatedBy());
        product.setCreatedDate(productModel.getCreatedDate());
        product.setDeleteFlag(productModel.getDeleteFlag());
        product.setLastUpdateDate(productModel.getLastUpdateDate());
        product.setLastUpdatedBy(productModel.getLastUpdatedBy());
        product.setProductCode(productModel.getProductCode());
        product.setVersionNumber(productModel.getVersionNumber());
        product.setProductDescription(productModel.getProductDescription());
        if (productModel.getParentProductId() != null) {
            Product parentProduct = productService.findByPK(productModel.getParentProductId());
            product.setParentProduct(parentProduct);
        }

        if (productModel.getProductWarehouseId() != null) {
            ProductWarehouse productWarehouse = productWarehouseService.findByPK(productModel.getProductWarehouseId());
            product.setProductWarehouse(productWarehouse);
        }
        product.setVatIncluded(productModel.getVatIncluded());
        product.setUnitPrice(productModel.getUnitPrice());

        return product;
    }

    public ProductRequestModel convertToProductRequestModel(Product product) {
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
        if (product.getParentProduct() != null) {
            productModel.setParentProductId(product.getParentProduct().getProductID());
        }
        if (product.getProductWarehouse() != null) {
            productModel.setProductWarehouseId(product.getProductWarehouse().getWarehouseId());
        }
        productModel.setVatIncluded(product.getVatIncluded());
        productModel.setUnitPrice(product.getUnitPrice());
        return productModel;
    }
}
