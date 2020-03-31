package com.simplevat.dao;

import com.simplevat.constant.dbfilter.CurrencyFilterEnum;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import java.util.List;
import java.util.Map;

/**
 * Created by mohsin on 3/11/2017.
 */
public interface CurrencyDao extends Dao<Integer, Currency> {

    List<Currency> getCurrencies();

    Currency getCurrency(final int currencyCode);

    Currency getDefaultCurrency();

    CurrencyConversion getCurrencyRateFromCurrencyConversion(int currencyCode);

    String getCountryCodeAsString(String countryCode);

    List<String> getCountryCodeString();

    List<Currency> getCurrencyList(Currency currency);
    
    Boolean isCurrencyDataAvailableOnTodayDate();

    PaginationResponseModel getCurrencies(Map<CurrencyFilterEnum, Object> filterDataMap, PaginationModel paginationModel);
}
