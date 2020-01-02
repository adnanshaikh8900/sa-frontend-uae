package com.simplevat.service;

import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.entity.Product;
import java.util.List;
import java.util.Map;

public abstract class ProductService extends SimpleVatService<Integer, Product> {

    public abstract List<Product> getProductList(Map<ProductFilterEnum, Object> filterMap);

    public abstract void deleteByIds(List<Integer> ids);

}
