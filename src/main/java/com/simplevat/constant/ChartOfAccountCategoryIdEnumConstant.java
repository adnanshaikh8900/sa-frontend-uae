package com.simplevat.constant;

import lombok.Getter;
import lombok.Setter;

public enum ChartOfAccountCategoryIdEnumConstant {

	MONEY_RECEIVED(1), SALES(2), MONEY_SPENT(9), TRANSFERED_TO(11), TRANSFERED_FROM(3), EXPENSE(4),MONEY_PAID_TO_USER(12), DEFAULT(0);

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

}
