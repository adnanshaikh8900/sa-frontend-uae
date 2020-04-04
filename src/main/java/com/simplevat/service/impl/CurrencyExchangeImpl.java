package com.simplevat.service.impl;

import com.simplevat.dao.CurrencyExchangeDao;
import com.simplevat.entity.Currency;
import com.simplevat.entity.CurrencyConversion;
import com.simplevat.service.CurrencyExchangeService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service("currencyExchangeImpl")
public class CurrencyExchangeImpl extends CurrencyExchangeService {
	private final Logger LOGGER = LoggerFactory.getLogger(CurrencyExchangeImpl.class);
    private static String ACCESSKEY = "c6267cc9e9bd2735a5a2637aa778d61a";
    @Autowired
    CurrencyExchangeDao currencyExchangeDao;

    HashMap<String, Integer> currencyIdMap = new HashMap<>();

    @Override
    public void saveExchangeCurrencies(Currency baseCurrency, List<Currency> convertCurrenies) {

        for (Currency currency : convertCurrenies) {
            currencyIdMap.put(currency.getCurrencyIsoCode(), currency.getCurrencyCode());
        }

//            System.out.println("baseCurrency====" + baseCurrency.getCurrencyIsoCode());
//            System.out.println("convertCurrenies====" + convertCurrenies);
//            List<String> listOfCounteries = new ArrayList<>();
//            for (Currency currency : convertCurrenies) {
//                listOfCounteries.add(currency.getCurrencyIsoCode());
//            }
//
//            String currencyIsoName = StringUtils.join(listOfCounteries, ',');
//            System.out.println("currencyIsoName=" + currencyIsoName);
//            String url = "http://data.fixer.io/api/latest?access_key=" + URLEncoder.encode(ACCESSKEY, "UTF-8") + "&base=" + URLEncoder.encode(baseCurrency.getCurrencyIsoCode(), "UTF-8") + "&symbols=" + URLEncoder.encode(currencyIsoName, "UTF8");
//            CloseableHttpClient httpClient = HttpClientBuilder.create().build();
//            HttpGet httpGet = new HttpGet(url);
//            CloseableHttpResponse response = httpClient.execute(httpGet);
//            String responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
//            JSONObject obj = new JSONObject(responseString);
//            JSONObject rates = obj.getJSONObject("rates");
        CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        try {
            String url = "https://us-central1-simplevat-web-app.cloudfunctions.net/getExchangeRate";
          
            HttpPost httpPost = new HttpPost(url);
            httpPost.addHeader("Accept", "application/json");
            httpPost.addHeader("Content-Type", "application/x-www-form-urlencoded");
            List<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair("currencyCode", baseCurrency.getCurrencyIsoCode()));
            httpPost.setEntity(new UrlEncodedFormEntity(params));
            CloseableHttpResponse response = httpClient.execute(httpPost);
            String responseString = EntityUtils.toString(response.getEntity(), "UTF-8");
            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.HOUR_OF_DAY, 0);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            cal.set(Calendar.MILLISECOND, 0);
            Date dateWithoutTime = cal.getTime();

            JSONArray jsonRules = new JSONArray(responseString);
            // iterate over the rules 
            for (int i = 0; i < jsonRules.length(); i++) {
                JSONObject obj = jsonRules.getJSONObject(i);
                System.out.println("====obj====" + obj);
                String currencyCode = obj.getString("currencyCode");
                System.out.println("===id is===: " + currencyCode);
                CurrencyConversion currencyConversion = new CurrencyConversion();
                currencyConversion.setCurrencyCode(baseCurrency.getCurrencyCode());
                currencyConversion.setCurrencyCodeConvertedTo(currencyIdMap.get(currencyCode));
                currencyConversion.setCreatedDate(LocalDateTime.ofInstant(dateWithoutTime.toInstant(), ZoneId.systemDefault()));
                currencyConversion.setExchangeRate(new BigDecimal(obj.getString("exchangeRate")));
                persist(currencyConversion);
            }

//                for (Currency currency : convertCurrenies) {
//                    try {
//                        //double value = rates.getDouble(currency.getCurrencyIsoCode());
//                        CurrencyConversion currencyConversion = new CurrencyConversion();
//                        currencyConversion.setCurrencyCode(baseCurrency.getCurrencyCode());
//                        currencyConversion.setCurrencyCodeConvertedTo(currency.getCurrencyCode());
//                        currencyConversion.setCreatedDate(LocalDateTime.ofInstant(dateWithoutTime.toInstant(), ZoneId.systemDefault()));
//                        //currencyConversion.setExchangeRate(new BigDecimal(value));
//                        persist(currencyConversion);
//                    } catch (Exception e) {
//                        CurrencyConversion currencyConversion = new CurrencyConversion();
//                        currencyConversion.setCurrencyCode(baseCurrency.getCurrencyCode());
//                        currencyConversion.setCurrencyCodeConvertedTo(currency.getCurrencyCode());
//                        currencyConversion.setCreatedDate(LocalDateTime.ofInstant(dateWithoutTime.toInstant(), ZoneId.systemDefault()));
//                        //currencyConversion.setExchangeRate(new BigDecimal(1).negate());
//                        persist(currencyConversion);
//                    }
//                }
        } catch (Exception e) {
        	LOGGER.error("Error", e);
        }
    }

    @Override
    protected CurrencyExchangeDao getDao() {
        return currencyExchangeDao;
    }

}
