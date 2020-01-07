package com.simplevat.enums;

import java.util.ArrayList;
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

	SAVED("Saved", 1), PENDING("Pending", 2), APPROVED("Approved", 3), PARTIALLY_PAID("Partially Paid", 4),
	PAID("Paid", 5);

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
		List<InvoiceStatusEnum> statusEnums = new ArrayList<InvoiceStatusEnum>();
		for (InvoiceStatusEnum statusEnum : values()) {
			statusEnums.add(statusEnum);
		}
		return statusEnums;
	}

	public static Map<Integer, InvoiceStatusEnum> map() {
		Map<Integer, InvoiceStatusEnum> invoiceStatusMap = new HashMap<>();
		for (InvoiceStatusEnum status : values()) {
			invoiceStatusMap.put(status.getValue(), status);
		}
		return invoiceStatusMap;
	}

	public static String getInvoiceTypeByValue(Integer value) {
		return getInvoiceStatusList().get(value).getDesc();
	}
}
