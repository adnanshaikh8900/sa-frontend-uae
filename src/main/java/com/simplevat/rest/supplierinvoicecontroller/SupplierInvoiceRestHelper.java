package com.simplevat.rest.supplierinvoicecontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Project;
import com.simplevat.entity.SupplierInvoice;
import com.simplevat.entity.SupplierInvoiceLineItem;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.VatCategoryService;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupplierInvoiceRestHelper {

    @Autowired
    VatCategoryService vatCategoryService;

    @Autowired
    ProjectService projectService;

    @Autowired
    ContactService contactService;

    @Autowired
    CurrencyService currencyService;

    public SupplierInvoice getEntity(SupplierInvoiceRequestModel invoiceModel, Integer userId) {
        SupplierInvoice invoice = new SupplierInvoice();
        if (invoiceModel.getTotalAmount() != null) {
            invoice.setTotalAmount(invoiceModel.getTotalAmount());
        }
        if (invoiceModel.getTotalVatAmount() != null) {
            invoice.setTotalVatAmount(invoiceModel.getTotalVatAmount());
        }
        if (invoiceModel.getId() != null) {
            invoice.setId(invoiceModel.getId());
        }
        invoice.setReferenceNumber(invoiceModel.getReferenceNumber());
        if (invoiceModel.getProjectId() != null) {
            Project project = projectService.findByPK(invoiceModel.getProjectId());
            invoice.setProject(project);
        }
        if (invoiceModel.getContactId() != null) {
            Contact contact = contactService.findByPK(invoiceModel.getContactId());
            invoice.setContact(contact);
        }
        if (invoiceModel.getInvoiceDate() != null) {
            LocalDateTime invoiceDate = Instant.ofEpochMilli(invoiceModel.getInvoiceDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            invoice.setInvoiceDate(invoiceDate);
        }
        if (invoiceModel.getInvoiceDueDate() != null) {
            LocalDateTime invoiceDueDate = Instant.ofEpochMilli(invoiceModel.getInvoiceDueDate().getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
            invoice.setInvoiceDueDate(invoiceDueDate);
        }
        if (invoiceModel.getCurrencyCode() != null) {
            Currency currency = currencyService.findByPK(invoiceModel.getCurrencyCode());
            invoice.setCurrency(currency);
        }
        List<SupplierInvoiceLineItemModel> itemModels = new ArrayList<>();
        if (invoiceModel.getLineItemsString() != null && !invoiceModel.getLineItemsString().isEmpty()) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                itemModels = mapper.readValue(invoiceModel.getLineItemsString(), new TypeReference<List<SupplierInvoiceLineItemModel>>(){});
            } catch (IOException ex) {
                Logger.getLogger(SupplierInvoiceRestHelper.class.getName()).log(Level.SEVERE, null, ex);
            }
            if (itemModels.size() > 0) {
                invoice.setSupplierInvoiceLineItems(getLineItems(itemModels, invoice, userId));
            }
        }
        invoice.setContactPoNumber(invoiceModel.getContactPoNumber());
        invoice.setReferenceNumber(invoiceModel.getReceiptNumber());
        invoice.setReceiptAttachmentDescription(invoiceModel.getReceiptAttachmentDescription());
        invoice.setNotes(invoiceModel.getNotes());
        invoice.setDiscountType(invoiceModel.getDiscountType());
        invoice.setDiscount(invoiceModel.getDiscount());
        return invoice;
    }

    public List<SupplierInvoiceLineItem> getLineItems(List<SupplierInvoiceLineItemModel> itemModels, SupplierInvoice invoice, Integer userId) {
        List<SupplierInvoiceLineItem> lineItems = new ArrayList<>();
        for (SupplierInvoiceLineItemModel model : itemModels) {
            SupplierInvoiceLineItem lineItem = new SupplierInvoiceLineItem();
            lineItem.setCreatedBy(userId);
            lineItem.setCreatedDate(LocalDateTime.now());
            lineItem.setDeleteFlag(false);
            lineItem.setQuantity(model.getQuantity());
            lineItem.setDescription(model.getDescription());
            lineItem.setUnitPrice(model.getUnitPrice());
            if (model.getVatCatgeoryId() != null) {
                lineItem.setVatCategory(vatCategoryService.findByPK(model.getVatCatgeoryId()));
            }
            lineItem.setSupplierInvoice(invoice);
        }
        return lineItems;
    }
//
//    public ProductRequestModel getRequestModel(Product product) {
//        ProductRequestModel productModel = new ProductRequestModel();
//        productModel.setProductID(product.getProductID());
//        productModel.setProductName(product.getProductName());
//        if (product.getVatCategory() != null) {
//            productModel.setVatCategoryId(product.getVatCategory().getId());
//        }
//        productModel.setCreatedBy(product.getCreatedBy());
//        productModel.setCreatedDate(product.getCreatedDate());
//        productModel.setDeleteFlag(product.getDeleteFlag());
//        productModel.setLastUpdateDate(product.getLastUpdateDate());
//        productModel.setLastUpdatedBy(product.getLastUpdatedBy());
//        productModel.setProductCode(product.getProductCode());
//        productModel.setVersionNumber(product.getVersionNumber());
//        productModel.setProductDescription(product.getProductDescription());
//        if (product.getParentProduct() != null) {
//            productModel.setParentProductId(product.getParentProduct().getProductID());
//        }
//        if (product.getProductWarehouse() != null) {
//            productModel.setProductWarehouseId(product.getProductWarehouse().getWarehouseId());
//        }
//        productModel.setVatIncluded(product.getVatIncluded());
//        productModel.setUnitPrice(product.getUnitPrice());
//        return productModel;
//    }
//

    public List<SupplierInvoiceListModel> getListModel(List<SupplierInvoice> invoices) {
        List<SupplierInvoiceListModel> invoiceListModels = new ArrayList();
        for (SupplierInvoice invoice : invoices) {
            SupplierInvoiceListModel model = new SupplierInvoiceListModel();
            model.setId(invoice.getId());
            if (invoice.getContact() != null) {
                model.setCustomerName(invoice.getContact().getFirstName());
            }
            model.setReferenceNumber(invoice.getReferenceNumber());
            if (invoice.getInvoiceDate() != null) {
                Date date = Date.from(invoice.getInvoiceDate().atZone(ZoneId.systemDefault()).toInstant());
                model.setInvoiceDate(date);
            }
            if (invoice.getInvoiceDueDate() != null) {
                Date date = Date.from(invoice.getInvoiceDueDate().atZone(ZoneId.systemDefault()).toInstant());
                model.setInvoiceDueDate(date);
            }
            model.setTotalAmount(invoice.getTotalAmount());
            model.setTotalVatAmount(invoice.getTotalVatAmount());
            if (invoice.getStatus() != null) {
                model.setStatus(invoice.getStatus().getDesc());
            }
            invoiceListModels.add(model);
        }
        return invoiceListModels;
    }
}
