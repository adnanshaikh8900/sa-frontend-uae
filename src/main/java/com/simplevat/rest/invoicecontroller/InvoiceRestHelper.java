package com.simplevat.rest.invoicecontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Project;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.enums.InvoiceStatusEnum;
import com.simplevat.invoice.model.InvoiceItemModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.InvoiceLineItemService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.VatCategoryService;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceRestHelper {

	@Autowired
	VatCategoryService vatCategoryService;

	@Autowired
	ProjectService projectService;

	@Autowired
	ContactService contactService;

	@Autowired
	CurrencyService currencyService;

	@Autowired
	InvoiceLineItemService invoiceLineItemService;

	@Autowired
	private InvoiceService invoiceService;

	public Invoice getEntity(InvoiceRequestModel invoiceModel, Integer userId) {
		Invoice invoice = new Invoice();

		if (invoiceModel.getId() != null) {
			invoice = invoiceService.findByPK(invoiceModel.getId());
		}
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
		// Type supplier = 1
		// Type customer = 2
		if (invoiceModel.getType() != null && !invoiceModel.getType().isEmpty()) {
			invoice.setType(Integer.parseInt(invoiceModel.getType()));
		}
		if (invoiceModel.getProjectId() != null) {
			Project project = projectService.findByPK(invoiceModel.getProjectId());
			invoice.setProject(project);
		}
		if (invoiceModel.getContactId() != null) {
			Contact contact = contactService.findByPK(invoiceModel.getContactId());
			invoice.setContact(contact);
		}
		if (invoiceModel.getInvoiceDate() != null) {
			LocalDateTime invoiceDate = Instant.ofEpochMilli(invoiceModel.getInvoiceDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			invoice.setInvoiceDate(invoiceDate);
		}
		if (invoiceModel.getInvoiceDueDate() != null) {
			LocalDateTime invoiceDueDate = Instant.ofEpochMilli(invoiceModel.getInvoiceDueDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			invoice.setInvoiceDueDate(invoiceDueDate);
		}
		if (invoiceModel.getCurrencyCode() != null) {
			Currency currency = currencyService.findByPK(invoiceModel.getCurrencyCode());
			invoice.setCurrency(currency);
		}
		List<InvoiceLineItemModel> itemModels = new ArrayList<>();
		if (invoiceModel.getLineItemsString() != null && !invoiceModel.getLineItemsString().isEmpty()) {
			ObjectMapper mapper = new ObjectMapper();
			try {
				itemModels = mapper.readValue(invoiceModel.getLineItemsString(),
						new TypeReference<List<InvoiceLineItemModel>>() {
						});
			} catch (IOException ex) {
				Logger.getLogger(InvoiceRestHelper.class.getName()).log(Level.SEVERE, null, ex);
			}
			if (itemModels.size() > 0) {

				List<InvoiceLineItem> InvoiceLineItemList = getLineItems(itemModels, invoice, userId);
				if (invoice.getInvoiceLineItems() != null) {
					invoice.getInvoiceLineItems().clear();
					invoice.getInvoiceLineItems().addAll(InvoiceLineItemList);

				} else {

					invoice.setInvoiceLineItems(InvoiceLineItemList);
				}
			}
		}

		if (invoiceModel.getTaxIdentificationNumber() != null) {
			invoice.setTaxIdentificationNumber(invoiceModel.getTaxIdentificationNumber());
		}
		invoice.setContactPoNumber(invoiceModel.getContactPoNumber());
		invoice.setReferenceNumber(invoiceModel.getReceiptNumber());
		invoice.setReceiptAttachmentDescription(invoiceModel.getReceiptAttachmentDescription());
		invoice.setNotes(invoiceModel.getNotes());
		invoice.setDiscountType(invoiceModel.getDiscountType());
		invoice.setDiscount(invoiceModel.getDiscount());
		invoice.setStatus(InvoiceStatusEnum.PENDING); // default set, will change in transaction

		return invoice;
	}

	public List<InvoiceLineItem> getLineItems(List<InvoiceLineItemModel> itemModels, Invoice invoice, Integer userId) {
		List<InvoiceLineItem> lineItems = new ArrayList<>();
		int i = 0;
		for (InvoiceLineItemModel model : itemModels) {
			try {
				InvoiceLineItem lineItem = new InvoiceLineItem();
				lineItem.setCreatedBy(userId);
				lineItem.setCreatedDate(LocalDateTime.now());
				lineItem.setDeleteFlag(false);
				lineItem.setQuantity(model.getQuantity());
				lineItem.setDescription(model.getDescription());
				lineItem.setUnitPrice(model.getUnitPrice());
				lineItem.setSubTotal(model.getSubTotal());
				if (model.getVatCategoryId() != null) {
					lineItem.setVatCategory(vatCategoryService.findByPK(Integer.parseInt(model.getVatCategoryId())));
				}
				lineItem.setInvoice(invoice);
				lineItems.add(lineItem);
				i++;
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
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

	public List<InvoiceListModel> getListModel(List<Invoice> invoices) {
		List<InvoiceListModel> invoiceListModels = new ArrayList();
		for (Invoice invoice : invoices) {
			InvoiceListModel model = new InvoiceListModel();
			model.setId(invoice.getId());
			if (invoice.getContact() != null) {
				if (invoice.getContact().getFirstName() != null || invoice.getContact().getLastName() != null) {
					model.setName(invoice.getContact().getFirstName() + invoice.getContact().getLastName());
				}
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
				model.setStatus(invoice.getStatus().name());
			}
			invoiceListModels.add(model);
		}
		return invoiceListModels;
	}
}
