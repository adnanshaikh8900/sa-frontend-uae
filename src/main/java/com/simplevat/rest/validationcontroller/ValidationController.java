package com.simplevat.rest.validationcontroller;

import com.simplevat.constant.dbfilter.DateFormatFilterEnum;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Invoice;
import com.simplevat.entity.Product;
import com.simplevat.entity.VatCategory;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.service.*;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequestMapping("/rest/validation")
public class ValidationController {

    @Autowired
    private ProductService productService;

    @Autowired
    private VatCategoryService vatCategoryService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private TransactionCategoryService transactionCategoryService;

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private InvoiceService invoiceService;

    @ApiOperation(value = "Validate entries before adding to the system")
    @GetMapping(value = "/validate")
    public ResponseEntity<String> validate(@ModelAttribute ValidationModel validationModel, HttpServletRequest request) {
        if(validationModel.getModuleType()!=null)
        {
            switch(validationModel.getModuleType())
            {
                case 1: //Product validation
                    Map<String, Object> param = new HashMap<>();
                    param.put("productName", validationModel.getName());
                    param.put("deleteFlag", false);
                    List<Product> productList = productService.findByAttributes(param);
                    if(productList!= null && productList.size()>0)
                        return new ResponseEntity("Product name already exists", HttpStatus.OK);
                    else
                        return new ResponseEntity("Product name does not exists", HttpStatus.OK);
                case 2: //Vat validation
                    param = new HashMap<>();
                    param.put("name", validationModel.getName());
                    param.put("deleteFlag", false);
                    List<VatCategory> vatList = vatCategoryService.findByAttributes(param);
                    if(vatList!= null && vatList.size()>0)
                        return new ResponseEntity("Vat name already exists", HttpStatus.OK);
                    else
                        return new ResponseEntity("Vat name does not exists", HttpStatus.OK);
                case 3: //Contact Validation
                    param = new HashMap<>();
                    param.put("email", validationModel.getName());
                    param.put("deleteFlag", false);
                    List<Contact> list = contactService.findByAttributes(param);
                    if(list!= null && list.size()>0)
                        return new ResponseEntity("Contact email already exists", HttpStatus.OK);
                    else
                        return new ResponseEntity("Contact email does not exists", HttpStatus.OK);
                case 4:  //Chart of Account
                    param = new HashMap<>();
                    param.put("transactionCategoryName",validationModel.getName());
                    param.put("deleteFlag", false);
                    List<TransactionCategory> transactionCategoryList = transactionCategoryService.findByAttributes(param);
                    if(transactionCategoryList!= null && transactionCategoryList.size()>0)
                        return new ResponseEntity("Chart Of Account already exists", HttpStatus.OK);
                    else
                        return new ResponseEntity("Chart Of Account does not exists", HttpStatus.OK);
                case 5:
                    param = new HashMap<>();
                    param.put("accountNumber",validationModel.getName());
                    param.put("deleteFlag", false);
                    List<BankAccount> bankAccountList = bankAccountService.findByAttributes(param);
                    if(bankAccountList!= null && bankAccountList.size()>0)
                        return new ResponseEntity("Bank Account already exists", HttpStatus.OK);
                    else
                        return new ResponseEntity("Bank Account does not exists", HttpStatus.OK);
                case 6:
                    param = new HashMap<>();
                    param.put("referenceNumber",validationModel.getName());
                    param.put("deleteFlag", false);
                    List<Invoice> invoiceList = invoiceService.findByAttributes(param);
                    if(invoiceList!= null && invoiceList.size()>0)
                        return new ResponseEntity("Invoice Number already exists", HttpStatus.OK);
                    else
                        return new ResponseEntity("Invoice Number does not exists", HttpStatus.OK);
                default:
                    return new ResponseEntity("Bad request", HttpStatus.BAD_REQUEST);


            }
        }
        return new ResponseEntity("Bad request", HttpStatus.BAD_REQUEST);
    }
}
