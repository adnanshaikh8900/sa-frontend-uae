/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.reports;

import java.util.Date;
import lombok.Data;

/**
 *
 * @author admin
 */
@Data
public class FinancialPeriodRest {

    private Integer id;
    private String name;
    private Date startDate;
    private Date lastDate;
}
