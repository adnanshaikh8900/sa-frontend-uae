/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.purchase;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.helper.PurchaseRestControllerHelper;
import com.simplevat.contact.model.PurchaseRestModel;
import com.simplevat.contact.model.PurchaseItemRestModel;
import com.simplevat.constant.InvoicePurchaseStatusConstant;
import com.simplevat.constant.TransactionCategoryConsatant;
import com.simplevat.criteria.ProjectCriteria;
import com.simplevat.entity.Company;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.entity.Project;
import com.simplevat.entity.Purchase;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.ProductService;
import com.simplevat.service.ProjectService;
import com.simplevat.service.PurchaseService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.service.VatCategoryService;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author daynil
 */
@RestController
@RequestMapping("/rest/purchase")
public class PurchaseRestController {

    @Autowired
    private PurchaseService purchaseService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userServiceNew;

    @Autowired
    private VatCategoryService vatCategoryService;

    @Autowired
    private TransactionCategoryService transactionCategoryService;

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    PurchaseRestControllerHelper purchaseControllerRestHelper;

    @RequestMapping(method = RequestMethod.GET, value = "/populatepurchases")
    public ResponseEntity populatePurchases() {
        List<PurchaseRestModel> purchaseModels = new ArrayList<>();
        try {
            int totalPurchases = 0;
            int totalPaid = 0;
            int totalPartiallyPaid = 0;
            int totalUnPaid = 0;
            if (purchaseService.getAllPurchase() != null) {
                for (Purchase purchase : purchaseService.getAllPurchase()) {
                    if (purchase.getStatus() != null) {
                        if (null != purchase.getStatus()) {
                            switch (purchase.getStatus()) {
                                case InvoicePurchaseStatusConstant.PAID:
                                    totalPaid++;
                                    break;
                                case InvoicePurchaseStatusConstant.PARTIALPAID:
                                    totalPartiallyPaid++;
                                    break;
                                case InvoicePurchaseStatusConstant.UNPAID:
                                    totalUnPaid++;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    totalPurchases++;
                    PurchaseRestModel model = purchaseControllerRestHelper.getPurchaseModel(purchase);
                    purchaseModels.add(model);
                }
            }
            return new ResponseEntity(purchaseModels, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/vieworedit")
    public ResponseEntity viewOrEditPurchase(@RequestParam("purchaseId") Integer purchaseId) {
        try {
            PurchaseRestModel selectedPurchaseModel;
            Purchase purchase = purchaseService.findByPK(purchaseId);
            selectedPurchaseModel = purchaseControllerRestHelper.getPurchaseModel(purchase);

//            if (selectedPurchaseModel.getReceiptAttachmentBinary() != null) {
//                InputStream stream = new ByteArrayInputStream(selectedPurchaseModel.getReceiptAttachmentBinary());
//                selectedPurchaseModel.setAttachmentFileContent(new DefaultStreamedContent(stream));
//            }
            return new ResponseEntity(selectedPurchaseModel, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/delete")
    public ResponseEntity deletePurchase(@RequestParam("purchaseId") Integer purchaseId) {
        try {
//              PurchaseRestModel selectedPurchaseModel;
            Purchase purchase = purchaseService.findByPK(purchaseId);
//            selectedPurchaseModel = purchaseControllerRestHelper.getPurchaseModel(purchase);
//            Purchase purchase = purchaseControllerRestHelper.getPurchase(selectedPurchaseModel);
            purchase.setDeleteFlag(true);
            purchaseService.update(purchase);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/deletes")
    public ResponseEntity deletePurchases(@RequestBody DeleteModel purchaseIds) {
        try {
            purchaseService.deleteByIds(purchaseIds.getIds());
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(method = RequestMethod.GET, value = "/allpaidpurchase")
    public ResponseEntity<List<PurchaseRestModel>> allPaidPurchase() {
        try {
            List<PurchaseRestModel> purchaseModels = new ArrayList<>();
            for (Purchase purchase : purchaseService.getAllPurchase()) {
                if (purchase.getStatus() != null && purchase.getStatus() == InvoicePurchaseStatusConstant.PAID) {
                    purchaseModels.add(purchaseControllerRestHelper.getPurchaseModel(purchase));
                }
            }
            return new ResponseEntity(purchaseModels, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/allunpaidpurchase")
    public ResponseEntity<List<PurchaseRestModel>> allUnPaidPurchase() {
        try {
            List<PurchaseRestModel> purchaseModels = new ArrayList<>();
            for (Purchase purchase : purchaseService.getAllPurchase()) {
                if (purchase.getStatus() != null && purchase.getStatus() == InvoicePurchaseStatusConstant.UNPAID) {
                    purchaseModels.add(purchaseControllerRestHelper.getPurchaseModel(purchase));
                }
            }
            return new ResponseEntity(purchaseModels, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/allpartialpaidpurchase")
    public ResponseEntity allPartialPaidPurchase() {
        try {
            List<PurchaseRestModel> purchaseModels = new ArrayList<>();
            for (Purchase purchase : purchaseService.getAllPurchase()) {
                if (purchase.getStatus() != null && purchase.getStatus() == InvoicePurchaseStatusConstant.PARTIALPAID) {
                    purchaseModels.add(purchaseControllerRestHelper.getPurchaseModel(purchase));
                }
            }
            return new ResponseEntity(purchaseModels, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/claimants")
    public ResponseEntity getClaimants() {
        try {
            return new ResponseEntity(userServiceNew.executeNamedQuery("findAllUsers"), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/categories")
    public ResponseEntity getCategory() {
        try {
            List<TransactionCategory> transactionCategoryList = transactionCategoryService.findTransactionCategoryListByParentCategory(TransactionCategoryConsatant.TRANSACTION_CATEGORY_PURCHASE);
            return new ResponseEntity(transactionCategoryList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Deprecated
    @RequestMapping(method = RequestMethod.GET, value = "/currencys")
    public ResponseEntity getCurrency() {
        try {
            List<Currency> currencies = currencyService.getCurrencies();
            if (currencies != null && !currencies.isEmpty()) {
                return new ResponseEntity<>(currencies, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/projects")
    public ResponseEntity projects(@RequestParam("projectName") String searchQuery) {
        try {
            ProjectCriteria criteria = new ProjectCriteria();
            criteria.setActive(Boolean.TRUE);
            if (searchQuery != null && !searchQuery.isEmpty()) {
                criteria.setProjectName(searchQuery);
            }
            List<Project> projects = projectService.getProjectsByCriteria(criteria);
            return new ResponseEntity(projects, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @RequestMapping(method = RequestMethod.GET, value = "/vatcategories")
    public ResponseEntity vatCategorys(@RequestParam("vatSearchString") String searchQuery) throws Exception {
        try {
            return new ResponseEntity(vatCategoryService.getVatCategoryList(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/getexchangerate")
    public ResponseEntity exchangeRate(@RequestParam("currencyCode") Integer currencyCode, @RequestParam("userId") Integer userId) {
        try {
            String exchangeRateString = "";
            CurrencyConversion currencyConversion;
            Currency currency = currencyService.findByPK(currencyCode);
            Company company = userServiceNew.findByPK(userId).getCompany();
            currencyConversion = currencyService.getCurrencyRateFromCurrencyConversion(currencyCode);
            if (currencyConversion != null) {
                if (company.getCurrencyCode() != null) {
                    exchangeRateString = "1 " + currency.getCurrencyIsoCode() + " = " + new BigDecimal(BigInteger.ONE).divide(currencyConversion.getExchangeRate(), 9, RoundingMode.HALF_UP) + " " + company.getCurrencyCode().getCurrencyIsoCode();
                }
            }
            return new ResponseEntity(exchangeRateString, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @RequestMapping(method = RequestMethod.POST, value = "/updatevatpercentage")
    public void updateVatPercentage(PurchaseItemRestModel purchaseItemModel, PurchaseRestModel purchaseRestModel) {
        if (purchaseItemModel.getProductService() != null) {
            if (purchaseItemModel.getProductService().getVatCategory() != null) {
                VatCategory vatCategory = purchaseItemModel.getProductService().getVatCategory();
                purchaseItemModel.setVatId(vatCategory);
            } else {
                purchaseItemModel.setVatId(vatCategoryService.getDefaultVatCategory());
            }
            if (purchaseItemModel.getProductService().getVatIncluded()) {
                if (purchaseItemModel.getProductService().getVatCategory() != null) {
                    BigDecimal unit = (purchaseItemModel.getProductService().getUnitPrice().divide(purchaseItemModel.getProductService().getVatCategory().getVat().add(new BigDecimal(100)), 5, RoundingMode.HALF_UP)).multiply(new BigDecimal(100));
                    purchaseItemModel.setUnitPrice(unit);
                }
            } else {
                purchaseItemModel.setUnitPrice(purchaseItemModel.getProductService().getUnitPrice());
            }
            purchaseItemModel.setDescription(purchaseItemModel.getProductService().getProductDescription());
        }
        updateSubTotal(purchaseItemModel, purchaseRestModel);
        addInvoiceItemOnProductSelect(purchaseRestModel);
    }

    public void updateSubTotal(final PurchaseItemRestModel itemModel, PurchaseRestModel purchaseRestModel) {
        final int quantity = itemModel.getQuatity();
        final BigDecimal unitPrice = itemModel.getUnitPrice();
        if (null != unitPrice) {
            final BigDecimal amountWithoutTax = unitPrice.multiply(new BigDecimal(quantity));
            itemModel.setSubTotal(amountWithoutTax);
        }
//        calculateTotal(purchaseRestModel);
    }

//    private void calculateTotal(PurchaseRestModel purchaseRestModel) {
//        total = new BigDecimal(0);
//        vatTotal = new BigDecimal(0);
//        List<PurchaseItemRestModel> purchaseItemModels = purchaseRestModel.getPurchaseItems();
//        if (purchaseItemModels != null) {
//            for (PurchaseItemRestModel itemModel : purchaseItemModels) {
//                if (itemModel.getSubTotal() != null) {
//                    total = total.add(itemModel.getSubTotal());
//                    if (itemModel.getUnitPrice() != null) {
//                        BigDecimal totalAmount = itemModel.getUnitPrice().multiply(new BigDecimal(itemModel.getQuatity()));
//                        vatTotal = vatTotal.add((totalAmount.multiply(itemModel.getVatId().getVat())).divide(new BigDecimal(100)));
//                    }
//                }
//            }
//        }
//        purchaseRestModel.setPurchaseSubtotal(total);
//        purchaseRestModel.setPurchaseVATAmount(vatTotal);
//        totalAmount = total.add(vatTotal);
//    }
    public void addInvoiceItemOnProductSelect(PurchaseRestModel purchaseRestModel) {
        if (validateInvoiceItem(purchaseRestModel)) {
            addLineItem(purchaseRestModel);
        }
    }

    private boolean validateInvoiceItem(PurchaseRestModel purchaseRestModel) {

        boolean validated = true;
        for (int i = 0; i < purchaseRestModel.getPurchaseItems().size() - 1; i++) {
            PurchaseItemRestModel lastItem = purchaseRestModel.getPurchaseItems().get(i);
            StringBuilder validationMessage = new StringBuilder("Please enter ");
            if (lastItem.getUnitPrice() == null) {
                validationMessage.append("Unit Price ");
                validated = false;
            }
            if (validated && lastItem.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                validationMessage = new StringBuilder("Unit price should be greater than 0 ");
                validated = false;
            }
            if (lastItem.getQuatity() < 1) {
                if (!validated) {
                    validationMessage.append("and ");
                }
                validationMessage.append("Quantity should be greater than 0 ");
                validated = false;
            }
            if (!validated) {
                validationMessage.append("in expense items.");
//                FacesMessage message = new FacesMessage(validationMessage.toString());
//                message.setSeverity(FacesMessage.SEVERITY_ERROR);
//                FacesContext.getCurrentInstance().addMessage("validationId", message);
            }
        }
        return validated;
    }

    public void addLineItem(PurchaseRestModel purchaseRestModel) {
        PurchaseItemRestModel purchaseItemModel = new PurchaseItemRestModel();
        VatCategory vatCategory = vatCategoryService.getDefaultVatCategory();
        purchaseItemModel.setVatId(vatCategory);
        purchaseItemModel.setUnitPrice(BigDecimal.ZERO);
        purchaseRestModel.addPurchaseItem(purchaseItemModel);
    }

}
