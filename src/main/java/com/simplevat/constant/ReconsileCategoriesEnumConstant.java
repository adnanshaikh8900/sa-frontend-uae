package com.simplevat.constant;

import lombok.Getter;

public enum ReconsileCategoriesEnumConstant {
	EXPENSE(21), Supplier_Invoice(22), Money_Paid_to_user(23), Money_Transfer_to_another_account(24),
	Cash_Withdrawal(25), Sales(11), Money_paid_by_user(12), Transfer_from_another_account(13);

	@Getter
	private int code;

	ReconsileCategoriesEnumConstant(int code) {
		this.code = code;
	}

	public static ReconsileCategoriesEnumConstant get(int code) {

		for (ReconsileCategoriesEnumConstant cat : ReconsileCategoriesEnumConstant.values()) {
			if (cat.getCode() == code)
				return cat;
		}
		return null;
	}
}
