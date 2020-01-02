//package com.simplevat.dao.impl;
//
//import java.util.List;
//
//
//
//import org.springframework.stereotype.Repository;
//
//import com.simplevat.dao.DiscountTypeDao;
//import com.simplevat.entity.invoice.DiscountType;
//import com.simplevat.dao.AbstractDao;
//
///**
// *
// * @author hiren
// */
//@Repository
//public class DiscountTypeDaoImpl extends AbstractDao<Integer, DiscountType> implements DiscountTypeDao {
//
//
//    @Override
// 
//    public List<DiscountType> getDiscountTypes() {
//        final List<DiscountType> discountTypes = this.executeNamedQuery("DiscountType.discountTypes");
//        return discountTypes;
//    }
//
//}
