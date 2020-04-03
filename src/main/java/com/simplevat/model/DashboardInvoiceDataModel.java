package com.simplevat.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardInvoiceDataModel {

	private List<String> labels;
	private data paid;
	private data due;
	private data overdue;

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public
	static class data {
		private String label;
		private List<Object> data;
	}
}
