package com.simplevat.constant;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Hiren
 */
public enum InvoiceStatusEnum {

	SAVED("Saved", 1), 
	PENDING("Draft", 2),
	POST("Sent",3), 
	APPROVED("Approved", 4), 
	PARTIALLY_PAID("Partially Paid", 5),
	PAID("Paid", 6);

	@Getter
	@Setter
	private String desc;

	@Getter
	@Setter
	private Integer value;

	InvoiceStatusEnum(final String desc, Integer value) {
		this.desc = desc;
		this.value = value;
	}

	@Override
	public String toString() {
		return this.desc;
	}

	public static List<InvoiceStatusEnum> getInvoiceStatusList() {
		return Arrays.asList(values());
	}

	public static Map<Integer, InvoiceStatusEnum> map() {
		Map<Integer, InvoiceStatusEnum> invoiceStatusMap = new HashMap<>();
		for (InvoiceStatusEnum status : values()) {
			invoiceStatusMap.put(status.getValue(), status);
		}
		return invoiceStatusMap;
	}

	public static String getInvoiceTypeByValue(Integer value) {
		return map().get(value).getDesc();
	}
}
