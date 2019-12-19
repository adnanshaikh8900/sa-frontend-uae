package com.simplevat.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.ProductDao;
import com.simplevat.entity.Product;
import com.simplevat.service.ProductService;

@Service("ProductService")
public class ProductServiceImpl extends ProductService {

    @Autowired
    private ProductDao productDao;

    @Override
    protected Dao<Integer, Product> getDao() {
        return productDao;
    }

    @Override
    public List<Product> getProductList(Integer userId) {
        return productDao.getProductList(userId);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
       productDao.deleteByIds(ids);
    }

}
