package com.simplevat.rest.invoicecontroller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Project;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.invoice.model.InvoiceItemModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.InvoiceLineItemService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.utils.FileHelper;

import java.io.File;
import java.io.IOException;
import java.net.URI;
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

	@Autowired
	private FileHelper fileHelper;

	public Invoice getEntity(InvoiceRequestModel invoiceModel, Integer userId) {
		Invoice invoice = new Invoice();

		if (invoiceModel.getInvoiceId() != null) {
			invoice = invoiceService.findByPK(invoiceModel.getInvoiceId());
			if (invoice.getInvoiceLineItems() != null) {
				invoiceLineItemService.deleteByInvoiceId(invoiceModel.getInvoiceId());
			}
		}
		if (invoiceModel.getTotalAmount() != null) {
			invoice.setTotalAmount(invoiceModel.getTotalAmount());
		}
		if (invoiceModel.getTotalVatAmount() != null) {
			invoice.setTotalVatAmount(invoiceModel.getTotalVatAmount());
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
				invoice.setInvoiceLineItems(InvoiceLineItemList);
			}
		}
		if (invoiceModel.getTaxIdentificationNumber() != null) {
			invoice.setTaxIdentificationNumber(invoiceModel.getTaxIdentificationNumber());
		}
		invoice.setContactPoNumber(invoiceModel.getContactPoNumber());
		invoice.setReceiptAttachmentDescription(invoiceModel.getReceiptAttachmentDescription());
		invoice.setNotes(invoiceModel.getNotes());
		invoice.setDiscountType(invoiceModel.getDiscountType());
		invoice.setDiscount(invoiceModel.getDiscount());
		invoice.setStatus(InvoiceStatusEnum.PENDING.getValue()); // default set, will change in transaction
		invoice.setDiscountPercentage(invoiceModel.getDiscountPercentage());
		invoice.setInvoiceDuePeriod(invoiceModel.getTerm());

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

	public InvoiceRequestModel getRequestModel(Invoice invoice) {
		InvoiceRequestModel requestModel = new InvoiceRequestModel();
		requestModel.setInvoiceId(invoice.getId());
		requestModel.setReferenceNumber(invoice.getReferenceNumber());
		if (invoice.getContact() != null) {
			requestModel.setContactId(invoice.getContact().getContactId());
		}
		if (invoice.getProject() != null) {
			requestModel.setProjectId(invoice.getProject().getProjectId());
		}
		if (invoice.getCurrency() != null) {
			requestModel.setCurrencyCode(invoice.getCurrency().getCurrencyCode());
		}
		if (invoice.getInvoiceDate() != null) {
			Date date = Date.from(invoice.getInvoiceDate().atZone(ZoneId.systemDefault()).toInstant());
			requestModel.setInvoiceDate(date);
		}
		if (invoice.getInvoiceDueDate() != null) {
			Date date = Date.from(invoice.getInvoiceDueDate().atZone(ZoneId.systemDefault()).toInstant());
			requestModel.setInvoiceDueDate(date);
		}
		if (invoice.getReceiptAttachmentFileName() != null) {
			requestModel.setFileName(invoice.getReceiptAttachmentFileName());
		}
		requestModel.setTotalAmount(invoice.getTotalAmount());
		requestModel.setContactPoNumber(invoice.getContactPoNumber());
		requestModel.setTotalVatAmount(invoice.getTotalVatAmount());
		requestModel.setReceiptNumber(invoice.getReceiptNumber());
		requestModel.setNotes(invoice.getNotes());
		if (invoice.getType() != null) {
			requestModel.setType(InvoiceStatusEnum.getInvoiceTypeByValue(invoice.getType()));
		}
		requestModel.setReceiptAttachmentDescription(invoice.getReceiptAttachmentDescription());
		if (invoice.getTaxIdentificationNumber() != null) {
			requestModel.setTaxIdentificationNumber(invoice.getTaxIdentificationNumber());
		}
		if (invoice.getStatus() != null) {
			requestModel.setStatus(InvoiceStatusEnum.getInvoiceTypeByValue(invoice.getStatus()));
		}
		List<InvoiceLineItemModel> lineItemModels = new ArrayList<>();
		if (invoice.getInvoiceLineItems() != null && !invoice.getInvoiceLineItems().isEmpty()) {
			for (InvoiceLineItem lineItem : invoice.getInvoiceLineItems()) {
				InvoiceLineItemModel model = getLineItemModel(lineItem);
				lineItemModels.add(model);
			}
			requestModel.setInvoiceLineItems(lineItemModels);
		}
		if (invoice.getReceiptAttachmentPath() != null) {
			requestModel.setFilePath("/file/" + fileHelper.convertFilePthToUrl(invoice.getReceiptAttachmentPath()));
		}
		if (invoice.getDiscountType() != null) {
			requestModel.setDiscountType(invoice.getDiscountType());
		}
		requestModel.setDiscount(invoice.getDiscount());
		requestModel.setDiscountPercentage(invoice.getDiscountPercentage());
		requestModel.setTerm(invoice.getInvoiceDuePeriod());

		return requestModel;
	}

	public InvoiceLineItemModel getLineItemModel(InvoiceLineItem lineItem) {
		InvoiceLineItemModel lineItemModel = new InvoiceLineItemModel();
		lineItemModel.setId(lineItem.getId());
		lineItemModel.setDescription(lineItem.getDescription());
		lineItemModel.setQuantity(lineItem.getQuantity());
		lineItemModel.setUnitPrice(lineItem.getUnitPrice());
		lineItemModel.setSubTotal(lineItem.getSubTotal());
		if (lineItem.getVatCategory() != null && lineItem.getVatCategory().getId() != null) {
			lineItemModel.setVatCategoryId(lineItem.getVatCategory().getId().toString());
		}
		return lineItemModel;
	}

	public List<InvoiceListModel> getListModel(Object invoices) {
		List<InvoiceListModel> invoiceListModels = new ArrayList();
		if (invoices != null) {
			for (Invoice invoice : (List<Invoice>) invoices) {
				InvoiceListModel model = new InvoiceListModel();
				model.setId(invoice.getId());
				if (invoice.getContact() != null) {
					if (invoice.getContact().getFirstName() != null || invoice.getContact().getLastName() != null) {
						model.setName(invoice.getContact().getFirstName() + " " + invoice.getContact().getLastName());
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
					model.setStatus(InvoiceStatusEnum.getInvoiceTypeByValue(invoice.getStatus()));
				}
				invoiceListModels.add(model);
			}
		}
		return invoiceListModels;
	}

}
