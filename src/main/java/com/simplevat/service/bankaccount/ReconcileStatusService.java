package com.simplevat.service.bankaccount;

import com.simplevat.constant.dbfilter.TransactionFilterEnum;
import com.simplevat.entity.bankaccount.ReconcileStatus;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.SimpleVatService;

import java.util.List;
import java.util.Map;

public abstract class ReconcileStatusService extends SimpleVatService<Integer, ReconcileStatus> {

    public abstract List<ReconcileStatus> getAllReconcileStatusListByBankAccountId(Integer bankAccountId);

    public abstract PaginationResponseModel getAllReconcileStatusList(Map<TransactionFilterEnum, Object> filterModel,
                                                                  PaginationModel paginationModel);
}
