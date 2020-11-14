package com.simplevat.rest.currencyconversioncontroller;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CurrencyConversionResponseModel {
    private Integer currencyCode;
    private Integer currencyCodeConvertedTo;
    private BigDecimal exchangeRate;
}
