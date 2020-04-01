package com.simplevat.dao.impl;

import org.springframework.stereotype.Repository;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.CurrencyExchangeDao;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

@Repository
public class CurrencyExchangeDaoImpl extends AbstractDao<Integer, CurrencyConversion> implements CurrencyExchangeDao {

    private static String ACCESSKEY = "c6267cc9e9bd2735a5a2637aa778d61a";

    @Override
    public void saveExchangeCurrencies(Currency baseCurrency, List<Currency> convertCurrenies) {
        try {
            System.out.println("baseCurrency====" + baseCurrency.getCurrencyIsoCode());
            System.out.println("convertCurrenies====" + convertCurrenies);
            List<String> listOfCounteries = new ArrayList<>();
            for (Currency currency : convertCurrenies) {
                listOfCounteries.add(currency.getCurrencyIsoCode());
            }

            String currencyIsoName = StringUtils.join(listOfCounteries, ',');
            System.out.println("currencyIsoName=" + currencyIsoName);
            String url = "http://data.fixer.io/api/latest?access_key=" + URLEncoder.encode(ACCESSKEY, "UTF-8") + "&base=" + URLEncoder.encode(baseCurrency.getCurrencyIsoCode(), "UTF-8") + "&symbols=" + URLEncoder.encode(currencyIsoName, "UTF8");
            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
            HttpGet httpGet = new HttpGet(url);
            CloseableHttpResponse response = httpClient.execute(httpGet);
            String responseString = EntityUtils.toString(response.getEntity(), "UTF-8");

            JSONObject obj = new JSONObject(responseString);
            JSONObject rates = obj.getJSONObject("rates");
            for (Currency currency : convertCurrenies) {
                try {
                    double value = rates.getDouble(currency.getCurrencyIsoCode());
                    System.out.println("responseString1==" + currency);
                    System.out.println("responseString2==" + value);
                    System.out.println("responseString==" + responseString);
                    CurrencyConversion currencyConversion = new CurrencyConversion();
                    currencyConversion.setCurrencyCode(baseCurrency.getCurrencyCode());
                    currencyConversion.setCurrencyCodeConvertedTo(currency.getCurrencyCode());
                    currencyConversion.setCreatedDate(LocalDateTime.now());
                    currencyConversion.setExchangeRate( BigDecimal.valueOf(value));
                    persist(currencyConversion);
                } catch (Exception e) {
                    CurrencyConversion currencyConversion = new CurrencyConversion();
                    currencyConversion.setCurrencyCode(baseCurrency.getCurrencyCode());
                    currencyConversion.setCurrencyCodeConvertedTo(currency.getCurrencyCode());
                    currencyConversion.setCreatedDate(LocalDateTime.now());
                    currencyConversion.setExchangeRate(BigDecimal.ZERO);
                    persist(currencyConversion);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

//            StorageValue storageValue = new ObjectMapper().readValue(responseString, new TypeReference<StorageValue>() {
//            });
    }
}
