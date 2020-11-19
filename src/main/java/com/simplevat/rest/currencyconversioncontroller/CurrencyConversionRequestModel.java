package com.simplevat.rest.currencyconversioncontroller;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class CurrencyConversionRequestModel {
    private Integer id;
    private Integer currencyCode;
    private BigDecimal exchangeRate;

}
