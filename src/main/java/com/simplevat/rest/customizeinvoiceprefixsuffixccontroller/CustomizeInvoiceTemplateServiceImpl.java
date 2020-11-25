package com.simplevat.rest.customizeinvoiceprefixsuffixccontroller;


import com.simplevat.dao.Dao;
import com.simplevat.entity.CustomizeInvoiceTemplate;
import com.simplevat.entity.Invoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created By Zain Khan On 20-11-2020
 */

@Service
public class CustomizeInvoiceTemplateServiceImpl extends CustomizeInvoiceTemplateService{

    @Autowired
    private CustomizeInvoiceTemplateDao customizeInvoiceTemplateDao;

    @Override
    protected Dao<Integer, CustomizeInvoiceTemplate> getDao() {

        return customizeInvoiceTemplateDao;
    }

    @Override
    public CustomizeInvoiceTemplate getCustomizeInvoiceTemplate(Integer invoiceType){
        return customizeInvoiceTemplateDao.getCustomizeInvoiceTemplate(invoiceType);
    }

    @Override
    public String getLastInvoice(Integer invoiceType){
        CustomizeInvoiceTemplate customizeInvoiceTemplateSuffix=customizeInvoiceTemplateDao.getLastInvoiceNo(invoiceType);
                Integer invoiceSuffix = customizeInvoiceTemplateSuffix.getSuffix();
                String referenceNumber = customizeInvoiceTemplateSuffix.getPrefix();
//                if(invoiceSuffix!=null && referenceNumber!=null)
                 //   referenceNumber=referenceNumber.substring(referenceNumber.indexOf("-")+1);
                    String nextInvoiceNo= referenceNumber + (invoiceSuffix +1);
//                return Integer.valueOf(referenceNumber.trim() + invoiceSuffix.toString()) + 1;
        return nextInvoiceNo ;
    }
    @Override
    public CustomizeInvoiceTemplate getInvoiceTemplate(Integer invoiceType){
        return customizeInvoiceTemplateDao.getLastInvoiceNo(invoiceType);

    }

}
