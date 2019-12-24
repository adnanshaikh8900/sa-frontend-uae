package com.simplevat.dao.impl;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.ProductFilterEnum;
import java.util.List;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ProductDao;
import com.simplevat.entity.Product;
import java.util.ArrayList;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ProductDaoImpl extends AbstractDao<Integer, Product> implements ProductDao {

    @Override
    public List<Product> getProductList(Map<ProductFilterEnum, Object> filterMap) {
        List<DbFilter> dbFilters = new ArrayList();
        filterMap.forEach((productFilter, value) -> dbFilters.add(DbFilter.builder()
                .dbCoulmnName(productFilter.getDbColumnName())
                .condition(productFilter.getCondition())
                .value(value).build()));
        List<Product> products = this.executeQuery(dbFilters);
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
