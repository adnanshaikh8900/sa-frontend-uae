package com.simplevat.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ProductDao;
import com.simplevat.entity.Product;
import java.util.HashMap;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ProductDaoImpl extends AbstractDao<Integer, Product> implements ProductDao {

    @Override
    public List<Product> getProductList(Integer userId) {
        Map<String, Object> parameterDataMap = new HashMap();
        parameterDataMap.put("createdBy", userId);
        List<Product> products = this.executeNamedQuery("allProduct", parameterDataMap);
        return products;
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                Product product = findByPK(id);
                product.setDeleteFlag(Boolean.TRUE);
                update(product);
            }
        }
    }
}
