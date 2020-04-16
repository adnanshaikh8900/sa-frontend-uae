package com.simplevat.constant;

import lombok.Getter;
import lombok.Setter;

public enum ChartOfAccountCategoryIdEnumConstant {

	MONEY_RECEIVED(1), MONEY_SPENT(9);

	@Getter
	@Setter
	private int id;

	ChartOfAccountCategoryIdEnumConstant(int id) {
		this.id = id;
	}

}
