//package com.simplevat.service.impl;
//
//import com.simplevat.dao.DiscountTypeDao;
//import com.simplevat.entity.invoice.DiscountType;
//import com.simplevat.service.DiscountTypeService;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
///**
// *
// * @author hiren
// */
//@Service
//@Transactional
//public class DiscountTypeServiceImpl extends DiscountTypeService {
//
//    @Autowired
//    private DiscountTypeDao discountTypeDao;
//
//  
//    @Override
//    public List<DiscountType> getDiscountTypes() {
//        return getDao().getDiscountTypes();
//    }
//
//	@Override
//	public DiscountTypeDao getDao() {
//		return this.discountTypeDao;
//	}
//
//}
