//package com.simplevat.dao.invoice;
//
//import com.simplevat.dao.AbstractFilter;
//import com.simplevat.entity.invoice.Invoice;
//import javax.persistence.criteria.CriteriaBuilder;
//import javax.persistence.criteria.Root;
//import lombok.Getter;
//import lombok.Setter;
//
///**
// *
// * @author hiren
// * @since 20 May, 2017 7:18:46 PM
// */
//public class InvoiceFilter extends AbstractFilter<Invoice> {
//
//    @Getter
//    @Setter
//    private Integer start = 0;
//
//    @Getter
//    @Setter
//    private Integer limit = 100;
//
//    @Getter
//    @Setter
//    private Boolean deletFlag = Boolean.FALSE;
//
//    @Override
//    protected void buildPredicates(Root<Invoice> root, CriteriaBuilder cb) {
//        add(cb.equal(root.get("deleteFlag"), deletFlag));
//    }
//
//    @Override
//    protected void addOrderCriteria(Root<Invoice> root, CriteriaBuilder cb) {
//        addOrder(cb.desc(root.get("lastUpdateDate")));
//    }
//
//}
