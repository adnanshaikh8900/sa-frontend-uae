package com.simplevat.helper;

import com.simplevat.entity.invoice.Invoice;
import com.simplevat.entity.invoice.InvoiceLineItem;
import com.simplevat.service.invoice.InvoiceService;
import com.simplevat.constant.DiscountTypeConstant;
import com.simplevat.enums.InvoiceNumberReferenceEnum;
import com.simplevat.constant.InvoicePurchaseStatusConstant;
import com.simplevat.invoice.model.InvoiceItemModel;
import com.simplevat.contact.model.InvoiceRestModel;
import com.simplevat.service.invoice.InvoiceLineItemService;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.annotation.Nonnull;
import org.apache.commons.lang3.StringUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author Uday
 *
 */
@Component
public class InvoiceModelHelper {

    @Autowired
    private InvoiceService invoiceService;

    public Invoice getInvoiceEntity(InvoiceRestModel invoiceModel) {
//        final LocalDateTime invoiceDate = LocalDateTime.ofInstant(invoiceModel.getInvoiceDate().toInstant(), ZoneId.systemDefault());
//        final LocalDateTime invoiceDueDate = LocalDateTime.ofInstant(invoiceModel.getInvoiceDueDate().toInstant(), ZoneId.systemDefault());
//        Invoice invoice;
//        if (invoiceModel.getInvoiceId() != null && invoiceModel.getInvoiceId() > 0) {
//            invoice = invoiceService.findByPK(invoiceModel.getInvoiceId());
//        } else {
//            invoice = new Invoice();
//        }
//        invoice.setContractPoNumber(invoiceModel.getContractPoNumber());
//        invoice.setCurrency(invoiceModel.getCurrencyCode());
//        invoice.setInvoiceProject(invoiceModel.getProject());
//        if (invoiceModel.getInvoiceContact() != null
//                && invoiceModel.getInvoiceContact().getContactId() != null
//                && invoiceModel.getInvoiceContact().getContactId() > 0) {
//            invoice.setInvoiceContact(invoiceModel.getInvoiceContact());
//        } else {
//            invoice.setInvoiceContact(null);
//        }
//        if (invoiceModel.getShippingContact() != null
//                && invoiceModel.getShippingContact().getContactId() != null
//                && invoiceModel.getShippingContact().getContactId() > 0) {
//            invoice.setShippingContact(invoiceModel.getShippingContact());
//        } else {
//            invoice.setShippingContact(null);
//        }
//        invoice.setInvoiceDate(invoiceDate);
//        invoice.setInvoiceDiscount(invoiceModel.getDiscount());
//        invoice.setDiscountType(invoiceModel.getDiscountType());
//        invoice.setInvoiceDueOn(invoiceModel.getInvoiceDueOn());
//        invoice.setInvoiceDueDate(invoiceDueDate);
//        invoice.setInvoiceReferenceNumber(invoiceModel.getInvoiceReferenceNumber());
//        invoice.setInvoiceNotes(invoiceModel.getInvoiceNotes());
//        final Collection<InvoiceLineItem> items = invoiceModel
//                .getInvoiceLineItems()
//                .stream()
//                .map((item) -> convertToLineItem(item, invoice))
//                .collect(Collectors.toList());
//
//        invoice.setInvoiceLineItems(items);
//        invoice.setCreatedBy(invoiceModel.getCreatedBy());
//        invoice.setLastUpdateBy(invoiceModel.getLastUpdatedBy());
//        invoice.setInvoiceAmount(invoiceModel.getInvoiceAmount());
//        invoice.setDueAmount(invoiceModel.getDueAmount());
//        invoice.setStatus(invoiceModel.getStatus());
//        invoice.setFreeze(invoiceModel.getFreeze());
//        invoice.setPaymentMode(invoiceModel.getPaymentMode());
//        return invoice;
        return null;
    }

    @Nonnull
    InvoiceLineItem convertToLineItem(@Nonnull final InvoiceItemModel model,
            @Nonnull final Invoice invoice) {
        final InvoiceLineItem item = new InvoiceLineItem();
//        if (model.getId() > 0) {
//            item.setInvoiceLineItemId(model.getId());
//        }
//        item.setCreatedDate(Calendar.getInstance().getTime());
//
//        item.setInvoiceLineItemDescription(model.getDescription());
//        item.setInvoiceLineItemQuantity(model.getQuatity());
//        item.setInvoiceLineItemUnitPrice(model.getUnitPrice());
//        item.setInvoiceLineItemVat(model.getVatId());
//        item.setCreatedBy(1);
//        item.setLastUpdateDate(Calendar.getInstance().getTime());
//        item.setVersionNumber(model.getVersionNumber());
//        if (model.getProductService() != null) {
//            item.setInvoiceLineItemProductService(model.getProductService());
//        }
//        item.setInvoice(invoice);

        return item;
    }

    @Nonnull
    InvoiceLineItem convertToLineItem(@Nonnull final InvoiceItemModel model,
            @Nonnull final Invoice invoice, @Nonnull InvoiceLineItemService invoiceLineItemService) {
        InvoiceLineItem item = null;
        if (model.getId() > 0) {
            item = invoiceLineItemService.findByPK(model.getId());
        } else {
            item = new InvoiceLineItem();
            item.setCreatedDate(Calendar.getInstance().getTime());
            item.setInvoiceLineItemDescription(model.getDescription());
            item.setInvoiceLineItemQuantity(model.getQuatity());
            item.setInvoiceLineItemUnitPrice(model.getUnitPrice());
            item.setInvoiceLineItemVat(model.getVatId());
            item.setCreatedBy(1);
            item.setLastUpdateDate(Calendar.getInstance().getTime());
            item.setVersionNumber(model.getVersionNumber());
            if (model.getProductService() != null) {
                item.setInvoiceLineItemProductService(model.getProductService());
            }
            item.setInvoice(invoice);
        }

        return item;
    }

    public InvoiceRestModel getInvoiceModel(Invoice invoice) {
        return getInvoiceModel(invoice, false);
    }

    public Invoice getInvoiceEntity(InvoiceRestModel invoiceModel, InvoiceLineItemService invoiceLineItemService) {
//        final LocalDateTime invoiceDate = LocalDateTime.ofInstant(invoiceModel.getInvoiceDate().toInstant(), ZoneId.systemDefault());
//        final LocalDateTime invoiceDueDate = LocalDateTime.ofInstant(invoiceModel.getInvoiceDueDate().toInstant(), ZoneId.systemDefault());
//        Invoice invoice;
//        if (invoiceModel.getInvoiceId() != null && invoiceModel.getInvoiceId() > 0) {
//            invoice = invoiceService.findByPK(invoiceModel.getInvoiceId());
//        } else {
//            invoice = new Invoice();
//        }
//        invoice.setContractPoNumber(invoiceModel.getContractPoNumber());
//        invoice.setCurrency(invoiceModel.getCurrencyCode());
//        invoice.setInvoiceProject(invoiceModel.getProject());
//        if (invoiceModel.getInvoiceContact() != null
//                && invoiceModel.getInvoiceContact().getContactId() != null
//                && invoiceModel.getInvoiceContact().getContactId() > 0) {
//            invoice.setInvoiceContact(invoiceModel.getInvoiceContact());
//        } else {
//            invoice.setInvoiceContact(null);
//        }
//        if (invoiceModel.getShippingContact() != null
//                && invoiceModel.getShippingContact().getContactId() != null
//                && invoiceModel.getShippingContact().getContactId() > 0) {
//            invoice.setShippingContact(invoiceModel.getShippingContact());
//        } else {
//            invoice.setShippingContact(null);
//        }
//        invoice.setInvoiceDate(invoiceDate);
//        invoice.setInvoiceDiscount(invoiceModel.getDiscount());
//        invoice.setDiscountType(invoiceModel.getDiscountType());
//        invoice.setInvoiceDueOn(invoiceModel.getInvoiceDueOn());
//        invoice.setInvoiceDueDate(invoiceDueDate);
//        invoice.setInvoiceReferenceNumber(invoiceModel.getInvoiceReferenceNumber());
//        invoice.setInvoiceNotes(invoiceModel.getInvoiceNotes());
//        final Collection<InvoiceLineItem> items = invoiceModel
//                .getInvoiceLineItems()
//                .stream()
//                .map((item) -> convertToLineItem(item, invoice, invoiceLineItemService))
//                .collect(Collectors.toList());
//
//        invoice.setInvoiceLineItems(items);
//        invoice.setCreatedBy(invoiceModel.getCreatedBy());
//        invoice.setLastUpdateBy(invoiceModel.getLastUpdatedBy());
//        invoice.setInvoiceAmount(invoiceModel.getInvoiceAmount());
//        invoice.setDueAmount(invoiceModel.getDueAmount());
//        invoice.setStatus(invoiceModel.getStatus());
//        invoice.setFreeze(invoiceModel.getFreeze());
//        invoice.setPaymentMode(invoiceModel.getPaymentMode());
//        return invoice;
        return null;
    }

    public InvoiceRestModel getInvoiceModel(Invoice invoice, boolean process) {

        InvoiceRestModel invoiceModel = new InvoiceRestModel();
        invoiceModel.setContractPoNumber(invoice.getContractPoNumber());
        invoiceModel.setCurrencyCode(invoice.getCurrency());
        invoiceModel.setInvoiceId(invoice.getInvoiceId());
        invoiceModel.setInvoiceContact(invoice.getInvoiceContact());
        invoiceModel.setShippingContact(invoice.getShippingContact());
        invoiceModel.setProject(invoice.getInvoiceProject());
        invoiceModel.setInvoiceDueDate(null != invoice.getInvoiceDueDate() ? Date.from(invoice.getInvoiceDueDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
        invoiceModel.setInvoiceDate(null != invoice.getInvoiceDate() ? Date.from(invoice.getInvoiceDate().atZone(ZoneId.systemDefault()).toInstant()) : null);
        invoiceModel.setDiscount(invoice.getInvoiceDiscount());
        invoiceModel.setDiscountType(invoice.getDiscountType());
        invoiceModel.setInvoiceDueOn(invoice.getInvoiceDueOn());
        invoiceModel.setInvoiceReferenceNumber(invoice.getInvoiceReferenceNumber());
        invoiceModel.setInvoiceNotes(invoice.getInvoiceNotes());
        invoiceModel.setFreeze(invoice.getFreeze());

        final List<InvoiceItemModel> items = invoice
                .getInvoiceLineItems()
                .stream()
                .map((lineItem) -> convertToItemModel(lineItem))
                .collect(Collectors.toList());

        invoiceModel.setInvoiceLineItems(items);
        invoiceModel.setCreatedBy(invoice.getCreatedBy());
        invoiceModel.setLastUpdatedBy(invoice.getLastUpdateBy());
        invoiceModel.setInvoiceAmount(invoice.getInvoiceAmount());
        invoiceModel.setDueAmount(invoice.getDueAmount());
        invoiceModel.setStatus(invoice.getStatus());
        if (invoice.getStatus() == InvoicePurchaseStatusConstant.PAID) {
            invoiceModel.setStatusName("PAID");
        } else if (invoice.getStatus() == InvoicePurchaseStatusConstant.PARTIALPAID) {
            invoiceModel.setStatusName("PARTIALPAID");
        } else if (invoice.getStatus() == InvoicePurchaseStatusConstant.UNPAID) {
            invoiceModel.setStatusName("UNPAID");
        }
        invoiceModel.setPaymentMode(invoice.getPaymentMode());
//        invoiceModel.setRecurringFlag(invoice.getRecurringFlag());
        if (process) {
            processAmountCalculation(invoiceModel);
        }
        return invoiceModel;
    }

    @Nonnull
    public InvoiceItemModel convertToItemModel(@Nonnull final InvoiceLineItem invoiceLineItem) {

        final InvoiceItemModel model = new InvoiceItemModel();

        model.setId(invoiceLineItem.getInvoiceLineItemId());
        model.setDescription(invoiceLineItem.getInvoiceLineItemDescription());
        model.setQuatity(invoiceLineItem.getInvoiceLineItemQuantity());
        model.setUnitPrice(invoiceLineItem.getInvoiceLineItemUnitPrice());
        if (invoiceLineItem.getInvoiceLineItemVat() != null) {
            model.setVatId(invoiceLineItem.getInvoiceLineItemVat());
        }
        model.setVersionNumber(invoiceLineItem.getVersionNumber());
        if (invoiceLineItem.getInvoiceLineItemProductService() != null) {
            model.setProductService(invoiceLineItem.getInvoiceLineItemProductService());
        }
        this.updateSubTotal(model);
        return model;
    }

    public void processAmountCalculation(InvoiceRestModel invoiceModel) {

        BigDecimal invoiceAmount = BigDecimal.ZERO;
        BigDecimal invoiceVATAmount = BigDecimal.ZERO;
        BigDecimal invoiceSubtotal = BigDecimal.ZERO;
        invoiceModel.setCalculatedDiscountAmount(BigDecimal.ZERO);
        BigDecimal discountPercentage = BigDecimal.ZERO;
        if (invoiceModel.getDiscountType() != null) {
            if (invoiceModel.getDiscountType().getDiscountTypeCode() == DiscountTypeConstant.ABSOLUTEDISCOUNT) {
                BigDecimal invoiceSubTotal = BigDecimal.ZERO;
                for (InvoiceItemModel itemModel : invoiceModel.getInvoiceLineItems()) {
                    invoiceSubTotal = invoiceSubTotal.add(itemModel.getSubTotal());
                }
                if (invoiceModel.getDiscount() != null) {
                    if (invoiceModel.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                        System.out.println("discount" + invoiceModel.getDiscount());
                        discountPercentage = invoiceSubTotal.divide(invoiceModel.getDiscount(), 5, RoundingMode.HALF_UP);
                    }
                }
            } else if (invoiceModel.getDiscountType().getDiscountTypeCode() == DiscountTypeConstant.PERCENTAGEDISCOUNT) {
                discountPercentage = invoiceModel.getDiscount();
            }
        }

        for (InvoiceItemModel itemModel : invoiceModel.getInvoiceLineItems()) {
            if (itemModel.getProductService() != null) {
                if (itemModel.getSubTotal() != null) {
                    BigDecimal vatAmount = new BigDecimal(BigInteger.ZERO);
                    BigDecimal itemAmount = new BigDecimal(BigInteger.ZERO);
                    if (invoiceModel.getDiscountType() != null) {
                        BigDecimal discountAmount = BigDecimal.ZERO;
                        if (invoiceModel.getDiscountType().getDiscountTypeCode() == DiscountTypeConstant.PERCENTAGEDISCOUNT) {
                            discountAmount = getDiscountAmount(itemModel.getSubTotal(), invoiceModel, discountPercentage);
                        } else {
                            discountPercentage = getDiscountPercentage(itemModel.getSubTotal(), invoiceModel, invoiceModel.getDiscount());
                            System.out.println("discountPercentage==" + discountPercentage);
                            discountAmount = getDiscountAmount(itemModel.getSubTotal(), invoiceModel, discountPercentage);
                            System.out.println("discountAmount=========" + discountAmount);
                            //  discountAmount = invoiceModel.getDiscount();
                        }
                        if (discountAmount != null) {
                            itemAmount = itemModel.getSubTotal().subtract(discountAmount);
                            System.out.println("discount amount==" + itemAmount);
                            invoiceModel.setCalculatedDiscountAmount(invoiceModel.getCalculatedDiscountAmount().add(discountAmount));
                        }
                    } else {
                        itemAmount = itemModel.getSubTotal();
                    }
                    if (itemModel.getVatId() != null) {
                        vatAmount = (itemAmount.multiply(itemModel.getVatId().getVat())).divide(new BigDecimal(100), 5, RoundingMode.HALF_UP);
                    }

                    invoiceSubtotal = invoiceSubtotal.add(itemAmount);
                    invoiceVATAmount = invoiceVATAmount.add(vatAmount);
                    invoiceAmount = invoiceAmount.add(itemAmount.add(vatAmount));
                }
            }
            invoiceModel.setInvoiceAmount(invoiceAmount);
            invoiceModel.setInvoiceVATAmount(invoiceVATAmount);
            invoiceModel.setInvoiceSubtotal(invoiceSubtotal);
        }
    }

    private BigDecimal getDiscountAmount(BigDecimal itemValue, InvoiceRestModel invoiceModel, BigDecimal discountAmount) {
        if (invoiceModel.getDiscountType() != null
                && itemValue != null
                && discountAmount != null) {
            discountAmount = itemValue.multiply(discountAmount.divide(new BigDecimal(100), 5, RoundingMode.HALF_UP));
        }
        return discountAmount;
    }

    private BigDecimal getDiscountPercentage(BigDecimal itemValue, InvoiceRestModel invoiceModel, BigDecimal discountAmount) {
        BigDecimal dicountPercentage = BigDecimal.ZERO;
        if (invoiceModel.getDiscountType() != null
                && itemValue != null && !itemValue.equals(BigDecimal.ZERO)
                && discountAmount != null
                && invoiceModel.getDiscountType().getDiscountTypeCode() == DiscountTypeConstant.ABSOLUTEDISCOUNT) {
            System.out.println("itemValue==" + itemValue);
            dicountPercentage = (discountAmount.multiply(new BigDecimal(100))).divide(itemValue, 5, RoundingMode.HALF_UP);
        }
        return dicountPercentage;
    }

    private void updateSubTotal(@Nonnull final InvoiceItemModel invoiceItemModel) {
        BigDecimal vatPer = new BigDecimal(BigInteger.ZERO);
        final int quantity = invoiceItemModel.getQuatity();
        final BigDecimal unitPrice = invoiceItemModel.getUnitPrice();
        if (invoiceItemModel.getVatId() != null) {
            vatPer = invoiceItemModel.getVatId().getVat();
        }
        if (null != unitPrice) {
            final BigDecimal amountWithoutTax = unitPrice.multiply(new BigDecimal(quantity));
            invoiceItemModel.setSubTotal(amountWithoutTax);

            if (vatPer != null && vatPer.compareTo(BigDecimal.ZERO) >= 1) {
                final BigDecimal amountWithTax = amountWithoutTax
                        .add(amountWithoutTax.multiply(vatPer).multiply(new BigDecimal(0.01)));
                invoiceItemModel.setSubTotal(amountWithTax);
            }
        }
    }

    public String getNextInvoiceRefNumber(String invoicingReferencePattern, InvoiceRestModel invoice) {
//        if (invoicingReferencePattern != null) {
//            if (invoicingReferencePattern.contains(InvoiceNumberReferenceEnum.DDMMYY.getValue())) {
//                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
//                LocalDateTime dateTime = LocalDateTime.now();
//                String currentDateString = dateTime.format(formatter);
//                System.out.println("=currentDateString=" + currentDateString);
//                invoicingReferencePattern = invoicingReferencePattern.replace(InvoiceNumberReferenceEnum.DDMMYY.getValue(), currentDateString);
//            }
//            if (invoicingReferencePattern.contains(InvoiceNumberReferenceEnum.CONTACT_CODE.getValue())) {
//                if (invoice.getInvoiceContact() != null) {
//                    invoicingReferencePattern = invoicingReferencePattern.replace(InvoiceNumberReferenceEnum.CONTACT_CODE.getValue(), invoice.getInvoiceContact().getContactId() + "");
//                }
//            }
//
//            Pattern p = Pattern.compile("[a-z]+|\\d+");
//            Matcher m = p.matcher(invoicingReferencePattern);
//            int invoceNumber;
//            String invoiceReplacementString = "";
//            String invoiceRefNumber = "";
//            while (m.find()) {
//                if (StringUtils.isNumeric(m.group())) {
//                    invoiceReplacementString = m.group();
//                    invoceNumber = Integer.parseInt(m.group());
//                    invoiceRefNumber = ++invoceNumber + "";
//                    while (invoiceRefNumber.length() < invoiceReplacementString.length()) {
//                        invoiceRefNumber = "0" + invoiceRefNumber;
//                    }
//                }
//            }
//            String nextInvoiceNumber = replaceLast(invoicingReferencePattern, invoiceReplacementString, invoiceRefNumber);
//            return nextInvoiceNumber;
//        }
        return null;
    }

    public String getNextInvoiceRefPattern(String invoicingReferencePattern, InvoiceRestModel invoice) {
        Pattern p = Pattern.compile("[a-z]+|\\d+");
        Matcher m = p.matcher(invoicingReferencePattern);
        int invoceNumber;
        String invoiceReplacementString = "";
        String invoiceRefNumber = "";
        while (m.find()) {
            if (StringUtils.isNumeric(m.group())) {
                invoiceReplacementString = m.group();
                invoceNumber = Integer.parseInt(m.group());
                invoiceRefNumber = ++invoceNumber + "";
                while (invoiceRefNumber.length() < invoiceReplacementString.length()) {
                    invoiceRefNumber = "0" + invoiceRefNumber;
                }
            }
        }
        String nextInvoiceNumber = replaceLast(invoicingReferencePattern, invoiceReplacementString, invoiceRefNumber);
        return nextInvoiceNumber;
    }

    public static String replaceLast(String text, String regex, String replacement) {
        return text.replaceFirst("(?s)(.*)" + regex, "$1" + replacement);
    }
}
