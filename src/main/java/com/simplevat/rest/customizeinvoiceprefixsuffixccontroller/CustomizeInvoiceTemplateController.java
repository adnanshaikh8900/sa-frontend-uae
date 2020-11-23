package com.simplevat.rest.customizeinvoiceprefixsuffixccontroller;


import com.simplevat.entity.Company;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.entity.CustomizeInvoiceTemplate;
import com.simplevat.rest.invoicecontroller.InvoiceRestController;
import com.simplevat.rest.invoicecontroller.InvoiceRestHelper;
import com.simplevat.service.InvoiceService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.simplevat.constant.ErrorConstant.ERROR;

/**
 * Created By Zain Khan On 20-11-2020
 */

@RestController
@RequestMapping(value = "/rest/customizeinvoiceprefixsuffix")
public class CustomizeInvoiceTemplateController {
    private final Logger logger = LoggerFactory.getLogger(CustomizeInvoiceTemplateController.class);
    @Autowired
    private InvoiceRestHelper invoiceRestHelper;

    @Autowired
    private CustomizeInvoiceTemplateService customizeInvoiceTemplateService;

    @ApiOperation(value = "Get Invoice Prefix List")
    @GetMapping(value = "/getListForInvoicePrefixAndSuffix")
    public ResponseEntity getListForInvoicePrefix(){
//        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest();
        List<CustomizeInvoiceTemplateResponseModel> response  = new ArrayList<>();
        List<CustomizeInvoiceTemplate> customizeInvoiceTemplateList=customizeInvoiceTemplateService.getCustomizeInvoiceTemplate();
        if (customizeInvoiceTemplateList != null) {
            response = invoiceRestHelper.getListOfCustomizeInvoicePrefix(customizeInvoiceTemplateList);
        }
        return new ResponseEntity (response, HttpStatus.OK);

    }

    @ApiOperation(value = "update Invoice Prefix Suffix", response = CurrencyConversion.class)
    @PostMapping("/update")
    public ResponseEntity<String> updateConvertedCurrency(@RequestBody CustomizeInvoiceTemplateRequestModel
                                                                  customizeInvoiceTemplateRequestModel,
                                                          HttpServletRequest request){
        try {
            CustomizeInvoiceTemplate customizeInvoiceTemplate = customizeInvoiceTemplateService.findByPK(customizeInvoiceTemplateRequestModel.getId());
            if (customizeInvoiceTemplate != null) {
                customizeInvoiceTemplate.setPrefix(customizeInvoiceTemplateRequestModel.getPrefix());
                customizeInvoiceTemplate.setSuffix(customizeInvoiceTemplateRequestModel.getSuffix());
                customizeInvoiceTemplate.setType(customizeInvoiceTemplateRequestModel.getType());
                customizeInvoiceTemplate.setId(customizeInvoiceTemplateRequestModel.getId());
                customizeInvoiceTemplateService.update(customizeInvoiceTemplate);
                return new ResponseEntity<>("Updated Successfully..", HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            logger.error(ERROR, e);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ApiOperation(value = "Next invoice No")
    @GetMapping(value = "/getNextInvoiceNo")
    public ResponseEntity<String> getNextInvoiceNo(@RequestParam(value = "invoiceType") Integer invoiceType) {
        try {
            String nxtInvoiceNo = customizeInvoiceTemplateService.getLastInvoice(invoiceType);
            if (nxtInvoiceNo == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(nxtInvoiceNo, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ERROR, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
