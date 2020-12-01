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
                currencyConversionResponseModel.setCurrencyConversionId(currencyConversion.getCurrencyConversionId());
                currencyConversionResponseModel.setCurrencyCode(currencyConversion.getCurrencyCode().getCurrencyCode());
                currencyConversionResponseModel.setCurrencyIsoCode(currencyConversion.getCurrencyCode().getCurrencyIsoCode());
                currencyConversionResponseModel.setCurrencySymbol(currencyConversion.getCurrencyCode().getCurrencySymbol());
                currencyConversionResponseModel.setDescription(currencyConversion.getCurrencyCodeConvertedTo().getDescription());
                currencyConversionResponseModel.setExchangeRate(currencyConversion.getExchangeRate());
                currencyConversionResponseModel.setCurrencyName(currencyConversion.getCurrencyCode().getCurrencyName());
                currencyConversionResponseModelList.add(currencyConversionResponseModel);
            }
        }
        return currencyConversionResponseModelList;
    }
}



