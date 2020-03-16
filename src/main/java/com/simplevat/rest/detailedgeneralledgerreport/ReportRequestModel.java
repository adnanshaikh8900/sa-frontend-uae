package com.simplevat.rest.detailedgeneralledgerreport;

import java.io.Serializable;

import com.simplevat.rest.PaginationModel;

import lombok.Data;

@Data
public class ReportRequestModel extends PaginationModel implements Serializable {

	private String startDate;
	private String endDate;
	private Integer chartOfAccountId;
	private String reportBasic;

}
