package com.simplevat.rest.taxescontroller;

import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.ContactService;
import com.simplevat.service.JournalLineItemService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.EnumMap;
import java.util.Map;

import static com.simplevat.constant.ErrorConstant.ERROR;

@RestController
@RequestMapping(value = "/rest/taxes")
public class TaxesRestController {
    private final Logger logger = LoggerFactory.getLogger(TaxesRestController.class);


    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ContactService contactService;

    @Autowired
    private JournalLineItemService journalLineItemService;

    @Autowired
    private TaxesRestHelper taxesRestHelper;


    @ApiOperation(value = "Get Vat Transation list")
    @GetMapping(value = "/getVatTransationList")
    public ResponseEntity<PaginationResponseModel> getVatTransactionList (TaxesFilterModel filterModel, HttpServletRequest request) {
        try {
            Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
            Map<TaxesFilterEnum, Object> filterDataMap = new EnumMap<>(TaxesFilterEnum.class);

            filterDataMap.put(TaxesFilterEnum.SOURCE, filterModel.getReferenceType());
            if (filterModel.getAmount() != null) {
                filterDataMap.put(TaxesFilterEnum.VAT_AMOUNT, filterModel.getAmount());
            }
            if (filterModel.getTransactionDate() != null && !filterModel.getTransactionDate().isEmpty()) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
                LocalDateTime dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getTransactionDate()).getTime())
                        .atZone(ZoneId.systemDefault()).toLocalDateTime();
                filterDataMap.put(TaxesFilterEnum.TRANSACTION_DATE, dateTime);
            }
            filterDataMap.put(TaxesFilterEnum.STATUS, filterModel.getStatus());
            filterDataMap.put(TaxesFilterEnum.USER_ID, userId);
            filterDataMap.put(TaxesFilterEnum.DELETE_FLAG, false);

            filterDataMap.put(TaxesFilterEnum.TYPE,  " ( 88,94 ) " );

            PaginationResponseModel responseModel = journalLineItemService.getVatTransactionList(filterDataMap,filterModel);
            if (responseModel == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            responseModel.setData(taxesRestHelper.getListModel(responseModel.getData()));
            return new ResponseEntity<>(responseModel, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(ERROR, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }



    }
}
