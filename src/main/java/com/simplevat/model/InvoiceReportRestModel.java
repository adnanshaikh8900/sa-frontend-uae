package com.simplevat.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.Data;

/**
 *
 * @author Uday
 */
@Data
public class InvoiceReportRestModel implements Serializable {

    private Integer invoiceId;

    private String status;

    private String refNumber;

    private LocalDateTime invoiceDate;

    private LocalDateTime invoiceDueDate;

    private String contactName;

    private Integer noOfItem;

    private BigDecimal totalCost;
}
