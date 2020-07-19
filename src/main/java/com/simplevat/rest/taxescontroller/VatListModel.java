package com.simplevat.rest.taxescontroller;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class VatListModel {
    private Integer id;
    private LocalDateTime date;
    private String vatType;
    private String referenceType;
    private BigDecimal amount;
    private BigDecimal vatAmount;


}
