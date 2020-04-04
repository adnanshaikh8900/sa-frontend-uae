package com.simplevat.rest.invoicecontroller;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.internet.MimeMultipart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.constant.ConfigurationConstants;
import com.simplevat.constant.EmailConstant;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.entity.Configuration;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.entity.Mail;
import com.simplevat.entity.Project;
import com.simplevat.entity.User;
import com.simplevat.service.ConfigurationService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.InvoiceLineItemService;
import com.simplevat.service.InvoiceService;
import com.simplevat.service.PaymentService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.UserService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.utils.FileHelper;
import com.simplevat.utils.MailUtility;

@Service
public class InvoiceRestHelper {
	private final Logger LOGGER = LoggerFactory.getLogger(InvoiceRestHelper.class);
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

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private MailUtility mailUtility;

	@Autowired
	private ConfigurationService configurationService;

	@Autowired
	private UserService userService;

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
					.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
					.toLocalDateTime();
			invoice.setInvoiceDate(invoiceDate);
		}
		if (invoiceModel.getInvoiceDueDate() != null) {
			LocalDateTime invoiceDueDate = Instant.ofEpochMilli(invoiceModel.getInvoiceDueDate().getTime())
					.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
					.toLocalDateTime();
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
				LOGGER.error("Error", ex);
			}
			if (!itemModels.isEmpty()) {
				List<InvoiceLineItem> invoiceLineItemList = getLineItems(itemModels, invoice, userId);
				invoice.setInvoiceLineItems(invoiceLineItemList);
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
			} catch (Exception e) {
				LOGGER.error("Error", e);
				return new ArrayList<>();
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
		requestModel
				.setDueAmount(invoice.getTotalAmount().subtract(paymentService.getAmountByInvoiceId(invoice.getId())));
		if (invoice.getContact() != null) {
			Contact contact = invoice.getContact();

			requestModel.setOrganisationName(contact.getOrganization());
			requestModel.setName(getFullName(contact));
			requestModel.setAddress(getAddress(contact));
			requestModel.setEmail(contact.getBillingEmail());
			requestModel.setTaxRegistrationNo(contact.getVatRegistrationNumber());
		}
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
			lineItemModel.setVatPercentage(lineItem.getVatCategory().getVat().intValue());
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

	private String getFullName(Contact contact) {
		StringBuilder sb = new StringBuilder();
		if (contact.getFirstName() != null && !contact.getFirstName().isEmpty()) {
			sb.append(contact.getFirstName()).append(" ");
		}
		if (contact.getMiddleName() != null && !contact.getMiddleName().isEmpty()) {
			sb.append(contact.getMiddleName()).append(" ");
		}
		if (contact.getLastName() != null && !contact.getLastName().isEmpty()) {
			sb.append(contact.getLastName());
		}
		return sb.toString();
	}

	private String getAddress(Contact contact) {
		StringBuilder sb = new StringBuilder();
		if (contact.getAddressLine1() != null && !contact.getAddressLine1().isEmpty()) {
			sb.append(contact.getAddressLine1()).append(" ");
		}
		if (contact.getAddressLine2() != null && !contact.getAddressLine2().isEmpty()) {
			sb.append(contact.getAddressLine1()).append(" ");
		}
		if (contact.getAddressLine3() != null && !contact.getAddressLine3().isEmpty()) {
			sb.append(contact.getAddressLine1());
		}
		if (sb.length() > 0) {
			sb.append("\n");
		}
		if (contact.getCountry() != null && contact.getCountry().getCountryName() != null) {
			sb.append(contact.getCountry().getCountryName()).append(", ");
		}
		if (contact.getState() != null) {
			sb.append(contact.getState().getStateName()).append(", ");
		}
		if (contact.getCity() != null && !contact.getCity().isEmpty()) {
			sb.append(contact.getCity()).append(", ");
		}
		if (contact.getPoBoxNumber() != null && !contact.getPoBoxNumber().isEmpty()) {
			sb.append(contact.getPoBoxNumber()).append(".");
		}

		return sb.toString();
	}

	public void send(Invoice invoice, Integer userId) {
		String subject = "";
		String body = "";
		Contact contact = invoice.getContact();
		Configuration invoiceEmailSub = configurationService
				.getConfigurationByName(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_SUBJECT);

		Map<String, String> map = getInvoceData(invoice, userId);

		if (invoiceEmailSub != null && invoiceEmailSub.getValue() != null) {
			subject = mailUtility.create(map, invoiceEmailSub.getValue());
		}

		Configuration invoiceEmailBody = configurationService
				.getConfigurationByName(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_BODY);

		if (invoiceEmailBody != null && invoiceEmailBody.getValue() != null) {
			body = mailUtility.create(map, invoiceEmailBody.getValue());
		}

		if (invoice.getContact() != null && contact.getBillingEmail() != null && !contact.getBillingEmail().isEmpty()) {
			mailUtility.triggerEmailOnBackground(subject, body, null, EmailConstant.ADMIN_SUPPORT_EMAIL,
					EmailConstant.ADMIN_EMAIL_SENDER_NAME, new String[] { invoice.getContact().getBillingEmail() },
					true);
		} else {
			LOGGER.info("BILLING ADDRES NOT PRESENT");
		}
	}

	public Map<String, String> getInvoceData(Invoice invoice, Integer userId) {
		Map<String, String> map = mailUtility.getInvoiceEmailParamMap();
		Map<String, String> invoiceDataMap = new HashMap<>();
		User user = userService.findByPK(userId);

		for (String key : map.keySet()) {
			String value = map.get(key);
			switch (key) {
			case MailUtility.Invoice_Reference_Number:
				if (invoice.getReferenceNumber() != null && !invoice.getReferenceNumber().isEmpty()) {
					invoiceDataMap.put(value, invoice.getReferenceNumber());
				}
				break;

			case MailUtility.Invoice_Date:
				if (invoice.getInvoiceDate() != null) {
					invoiceDataMap.put(value, invoice.getInvoiceDate().toString());
				}
				break;

			case MailUtility.Invoice_Due_Date:
				if (invoice.getInvoiceDueDate() != null) {
					invoiceDataMap.put(value, invoice.getInvoiceDueDate().toString());
				}
				break;

			case MailUtility.Invoic_Discount:
				if (invoice.getDiscount() != null) {
					invoiceDataMap.put(value, invoice.getDiscount().toString());
				}
				break;

			case MailUtility.Contract_Po_Number:
				if (invoice.getContactPoNumber() != null && !invoice.getContactPoNumber().isEmpty()) {
					invoiceDataMap.put(value, invoice.getContactPoNumber());
				}
				break;

			case MailUtility.Contact_Name:
				if (invoice.getContact() != null && !invoice.getContact().getFirstName().isEmpty()) {
					StringBuilder sb = new StringBuilder();
					Contact c = invoice.getContact();
					if (c.getFirstName() != null && !c.getFirstName().isEmpty()) {
						sb.append(c.getFirstName()).append(" ");
					}
					if (c.getMiddleName() != null && !c.getMiddleName().isEmpty()) {
						sb.append(c.getMiddleName()).append(" ");
					}
					if (c.getLastName() != null && !c.getLastName().isEmpty()) {
						sb.append(c.getLastName());
					}
					invoiceDataMap.put(value, sb.toString());
				}

				break;

			case MailUtility.Project_Name:
				if (invoice.getProject() != null && !invoice.getProject().getProjectName().isEmpty()) {
					invoiceDataMap.put(value, invoice.getProject().getProjectName());
				}
				break;

			case MailUtility.Invoice_Amount:
				if (invoice.getTotalAmount() != null) {
					invoiceDataMap.put(value, invoice.getTotalAmount().toString());
				}
				break;

//			case MailUtility.Due_Amount:
//				if (invoice.getd!= null) {
//					invoiceDataMap.put(value, invoice.getTotalAmount().toString());
//				}
//				break;

			case MailUtility.Sender_Name:

				invoiceDataMap.put(value, user.getUserEmail());
				break;

			case MailUtility.Company_Name:
				if (user.getCompany() != null)
					invoiceDataMap.put(value, user.getCompany().getCompanyName());
				break;
			}
		}
		return invoiceDataMap;
	}
}
