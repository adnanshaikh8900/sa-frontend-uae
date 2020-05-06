package com.simplevat.constant;

import lombok.Getter;
import lombok.Setter;

public enum ChartOfAccountCategoryIdEnumConstant {

	MONEY_RECEIVED(1), SALES(2), MONEY_SPENT(9), EXPENSE(10), MONEY_PAID_TO_USER(12), MONEY_RECEIVED_FROM_USER(6),
	DEFAULT(0);

	@Getter
	@Setter
	public Integer id;

	ChartOfAccountCategoryIdEnumConstant(int id) {
		this.id = id;
	}

	public static ChartOfAccountCategoryIdEnumConstant get(Integer id) {
		for (ChartOfAccountCategoryIdEnumConstant constant : ChartOfAccountCategoryIdEnumConstant.values()) {
			if (constant.id.equals(id))
				return constant;
		}
		return ChartOfAccountCategoryIdEnumConstant.DEFAULT;
	}

	public static boolean isDebitedFromBank(Integer id) {

		if (id.equals(MONEY_SPENT.id))
			return true;

		return false;
	}
}
