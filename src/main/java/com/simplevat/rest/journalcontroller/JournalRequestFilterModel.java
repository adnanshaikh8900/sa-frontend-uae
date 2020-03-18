package com.simplevat.rest.journalcontroller;

import com.simplevat.rest.PaginationModel;
import lombok.Data;

@Data
public class JournalRequestFilterModel extends PaginationModel {
	// TODO : added required param

	private String journalDate;
	// private String referenceCode;
	private String journalReferenceNo;
	private String description;
}
