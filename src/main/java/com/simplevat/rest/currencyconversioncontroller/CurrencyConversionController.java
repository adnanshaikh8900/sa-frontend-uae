package com.simplevat.rest.currencyconversioncontroller;

import com.simplevat.entity.Company;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.CompanyService;
import com.simplevat.service.CurrencyExchangeService;
import com.simplevat.service.CurrencyService;
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

@RestController
@RequestMapping(value = "/rest/currencyConversion")
public class CurrencyConversionController{
    private final Logger logger = LoggerFactory.getLogger(CurrencyConversionController.class);

    @Autowired
  private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CurrencyExchangeService currencyExchangeService;

    @Autowired
    private CurrencyConversionHelper currencyConversionHelper;

    @Autowired
    private CurrencyService currencyService;

    @ApiOperation(value = "Save Currency Conversion", response = CurrencyConversion.class)
    @PostMapping(value = "/save")
    public ResponseEntity<String> saveConvertedCurrency(@RequestBody CurrencyConversionRequestModel currencyConversionRequestModel
            , HttpServletRequest request){
        Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

        CurrencyConversion currencyConversion = new CurrencyConversion();
        Currency currency=currencyService.findByPK(currencyConversionRequestModel.getCurrencyCode());
        currencyConversion.setCurrencyCode(currency);
        Company company=companyService.getCompany();

        currencyConversion.setCurrencyCodeConvertedTo(company.getCurrencyCode());
        currencyConversion.setExchangeRate(currencyConversionRequestModel.getExchangeRate());
        currencyConversion.setCreatedDate(LocalDateTime.now());
        currencyExchangeService.persist(currencyConversion);
        return new ResponseEntity<>("Saved Successfully..", HttpStatus.OK);
    }

    @ApiOperation(value = "update Currency Conversion", response = CurrencyConversion.class)
    @PostMapping("/update")
    public ResponseEntity<String> updateConvertedCurrency(@RequestBody CurrencyConversionRequestModel
                                                                      currencyConversionRequestModel,HttpServletRequest request){
        try {
            CurrencyConversion existingCurrency = currencyExchangeService.findByPK(currencyConversionRequestModel.getId());
            if (existingCurrency != null) {
                Currency currency = currencyService.findByPK(currencyConversionRequestModel.getCurrencyCode());
                existingCurrency.setCurrencyCode(currency);
                Company company = companyService.getCompany();
                existingCurrency.setCurrencyCodeConvertedTo(company.getCurrencyCode());
                existingCurrency.setExchangeRate(currencyConversionRequestModel.getExchangeRate());
                existingCurrency.setCreatedDate(LocalDateTime.now());
                currencyExchangeService.update(existingCurrency);
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

    @ApiOperation(value = "Get Currency List")
    @GetMapping(value = "/getCurrencyConversionList")
    public ResponseEntity getCurrencyConversionList(){
        List<CurrencyConversionResponseModel> response  = new ArrayList<>();
        List<CurrencyConversion> currencyList = currencyExchangeService.getCurrencyConversionList();
        if (currencyList != null) {
            response = currencyConversionHelper.getListOfConvertedCurrency(currencyList);
        }
        return new ResponseEntity (response, HttpStatus.OK);
    }

    @ApiOperation(value = "Get Currency List")
    @GetMapping(value = "/getCurrencyConversionById")
    public ResponseEntity getCurrencyConversionById(@RequestParam int id)  {
        CurrencyConversion currencyConversion = currencyExchangeService.findByPK(id);
       if (currencyConversion != null) {
           CurrencyConversionResponseModel currencyConversionResponseModel = new CurrencyConversionResponseModel();
           currencyConversionResponseModel.setCurrencyConversionId(currencyConversion.getCurrencyConversionId());
           currencyConversionResponseModel.setCurrencyCode(currencyConversion.getCurrencyCode().getCurrencyCode());
           currencyConversionResponseModel.setCurrencyCodeConvertedTo(currencyConversion.getCurrencyCodeConvertedTo().getCurrencyCode());
           currencyConversionResponseModel.setDescription(currencyConversion.getCurrencyCodeConvertedTo().getDescription());
           currencyConversionResponseModel.setCurrencyName(currencyConversion.getCurrencyCode().getCurrencyName());
           currencyConversionResponseModel.setExchangeRate(currencyConversion.getExchangeRate());
           return new ResponseEntity (currencyConversionResponseModel, HttpStatus.OK);
        }
        return new ResponseEntity ("No result found for id-"+id, HttpStatus.NO_CONTENT);
    }
    @ApiOperation(value = "Delete Currency by Currency Code", response = CurrencyConversion.class)
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<CurrencyConversion> deleteCurrency(@RequestParam("id") int id,
                                                   HttpServletRequest request) {
        try {
            CurrencyConversion currencyConversion = currencyExchangeService.findByPK(id);
            if (currencyConversion != null) {
                Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
                currencyConversion.setCreatedDate(LocalDateTime.now());
                currencyConversion.setDeleteFlag(true);
                currencyExchangeService.update(currencyConversion);
                return new ResponseEntity<>(currencyConversion, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            logger.error(ERROR, e);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
