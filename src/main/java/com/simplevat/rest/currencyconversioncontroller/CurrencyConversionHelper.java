package com.simplevat.rest.currencyconversioncontroller;

import com.simplevat.entity.CurrencyConversion;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CurrencyConversionHelper {

    public List<CurrencyConversionResponseModel> getListOfConvertedCurrency(List<CurrencyConversion> currencyConversionList) {
        List<CurrencyConversionResponseModel> currencyConversionResponseModelList = new ArrayList<>();
        if (currencyConversionList!=null) {
            for (CurrencyConversion currencyConversion : currencyConversionList) {
                CurrencyConversionResponseModel currencyConversionResponseModel = new CurrencyConversionResponseModel();
                currencyConversionResponseModel.setCurrencyCode(currencyConversion.getCurrencyCode());
                currencyConversionResponseModel.setCurrencyCodeConvertedTo(currencyConversion.getCurrencyCodeConvertedTo());
                currencyConversionResponseModel.setExchangeRate(currencyConversion.getExchangeRate());
                currencyConversionResponseModelList.add(currencyConversionResponseModel);
            }
        }
        return currencyConversionResponseModelList;
    }
}



