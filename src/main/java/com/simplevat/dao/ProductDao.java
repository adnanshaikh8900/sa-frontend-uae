/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao;

import com.simplevat.constant.dbfilter.ProductFilterEnum;
import com.simplevat.entity.Product;
import java.util.List;
import java.util.Map;

/**
 *
 * @author daynil
 */
public interface ProductDao extends Dao<Integer, Product> {

    public List<Product> getProductList(Map<ProductFilterEnum, Object> filterMap);

    public void deleteByIds(List<Integer> ids);

}
