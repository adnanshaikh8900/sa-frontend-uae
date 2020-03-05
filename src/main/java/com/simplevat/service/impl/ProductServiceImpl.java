package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.ProductFilterEnum;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.ProductDao;
import com.simplevat.entity.Product;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.ProductService;
import java.util.Map;

@Service("ProductService")
public class ProductServiceImpl extends ProductService {

    @Autowired
    private ProductDao productDao;

    @Override
    protected Dao<Integer, Product> getDao() {
        return productDao;
    }

    @Override
    public PaginationResponseModel getProductList(Map<ProductFilterEnum, Object> filterMap,PaginationModel paginationModel) {
        return productDao.getProductList(filterMap,paginationModel);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
       productDao.deleteByIds(ids);
    }

}
