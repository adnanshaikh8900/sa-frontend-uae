package com.simplevat.dao.impl;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.dao.InvoiceLineItemDao;
import javax.persistence.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class InvoiceLineItemDaoImpl extends AbstractDao<Integer, InvoiceLineItem> implements InvoiceLineItemDao {

    @Override
    @Transactional
    public void deleteByInvoiceId(Integer invoiceId) {
        Query query = getEntityManager().createQuery("DELETE FROM InvoiceLineItem i WHERE i.invoice.id = :invoiceId ");
        query.setParameter("invoiceId", invoiceId);
        query.executeUpdate();
    }
    @Override
    public Integer getTotalInvoiceCountByProductId(Integer productId){
        Query query = getEntityManager().createQuery(
                "SELECT COUNT(i) FROM InvoiceLineItem i WHERE i.product.productID =:productId AND i.deleteFlag=false" );
        query.setParameter("productId",productId);
        List<Object> countList = query.getResultList();
        if (countList != null && !countList.isEmpty()) {
            return ((Long) countList.get(0)).intValue();
        }
        return null;
    }
}
