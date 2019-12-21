package com.simplevat.rest.productcontroller;

import com.simplevat.entity.Product;
import com.simplevat.entity.ProductWarehouse;
import com.simplevat.entity.VatCategory;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProductWarehouseService;
import com.simplevat.service.VatCategoryService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductRestHelper {

    @Autowired
    VatCategoryService vatCategoryService;

    @Autowired
    ProductService productService;

    @Autowired
    ProductWarehouseService productWarehouseService;

    public Product getEntity(ProductRequestModel productModel) {
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

    public ProductRequestModel getRequestModel(Product product) {
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

    public List<ProductListModel> getListModel(List<Product> productList) {
        List<ProductListModel> productListModels = new ArrayList();
        for (Product product : productList) {
            ProductListModel productModel = new ProductListModel();
            productModel.setId(product.getProductID());
            productModel.setName(product.getProductName());
            productModel.setVatPercentage(product.getVatCategory().getVatLabel());
            productModel.setDescription(product.getProductDescription());
            productModel.setProductCode(product.getProductCode());
            productModel.setUnitPrice(product.getUnitPrice());
            productListModels.add(productModel);
        }
        return productListModels;
    }
}
