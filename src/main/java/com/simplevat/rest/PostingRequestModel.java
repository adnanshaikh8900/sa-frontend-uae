/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

/**
 *
 * @author uday
 */
@Data
public class PostingRequestModel implements Serializable {

    private Integer postingRefId;
    private String postingRefType;
    private Integer postingChartOfAccountId;
    private BigDecimal amount;
}
