package com.simplevat.rest.datalistcontroller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.constant.ChartOfAccountCategoryIdEnumConstant;
import com.simplevat.constant.ContactTypeEnum;
import com.simplevat.constant.InvoiceStatusEnum;
import com.simplevat.constant.PayMode;
import com.simplevat.constant.dbfilter.CurrencyFilterEnum;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.StateFilterEnum;
import com.simplevat.constant.dbfilter.VatCategoryFilterEnum;
import com.simplevat.entity.ChartOfAccountCategory;
import com.simplevat.entity.Country;
import com.simplevat.entity.IndustryType;
import com.simplevat.entity.State;
import com.simplevat.entity.bankaccount.ChartOfAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.EnumDropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.rest.SingleLevelDropDownModel;
import com.simplevat.rest.transactioncategorycontroller.TranscationCategoryHelper;
import com.simplevat.rest.vatcontroller.VatCategoryRestHelper;
import com.simplevat.service.ChartOfAccountCategoryService;
import com.simplevat.service.CountryService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.IndustryTypeService;
import com.simplevat.service.StateService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.VatCategoryService;
import com.simplevat.service.bankaccount.ChartOfAccountService;

import io.swagger.annotations.ApiOperation;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/datalist")
public class DataListController {

	private final Logger LOGGER = LoggerFactory.getLogger(DataListController.class);

	@Autowired
	private CountryService countryService;

	@Autowired
	private CurrencyService currencyService;

	@Autowired
	private ChartOfAccountService transactionTypeService;

	@Autowired
	private IndustryTypeService industryTypeService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private VatCategoryRestHelper vatCategoryRestHelper;

	@Autowired
	private TranscationCategoryHelper transcationCategoryHelper;

	@Autowired
	private StateService stateService;

	@Autowired
	private ChartOfAccountCategoryService chartOfAccountCategoryService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@GetMapping(value = "/getcountry")
	public ResponseEntity getCountry() {
		try {

			List<Country> countryList = countryService.getCountries();
			if (countryList != null && !countryList.isEmpty()) {
				return new ResponseEntity<>(countryList, HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

//	@Deprecated
	@GetMapping(value = "/getcurrenncy")
	public ResponseEntity getCurrency(PaginationModel paginationModel) {
		try {
			Map<CurrencyFilterEnum, Object> filterDataMap = new EnumMap<>(CurrencyFilterEnum.class);
			filterDataMap.put(CurrencyFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
			filterDataMap.put(CurrencyFilterEnum.DELETE_FLAG, false);

			PaginationResponseModel response = currencyService.getCurrencies(filterDataMap, paginationModel);
			if (response != null) {
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "All Transaction Types")
	@GetMapping(value = "/getTransactionTypes")
	public ResponseEntity getTransactionTypes() {
		try {
			List<ChartOfAccount> transactionTypes = transactionTypeService.findAll();
			if (transactionTypes != null && !transactionTypes.isEmpty()) {

				for (ChartOfAccount ac : transactionTypes) {
					ac.setTransactionChartOfAccountCategoryList(null);
					// TODO Make it dropdown Model
				}
				return new ResponseEntity<>(transactionTypes, HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "All Invoice Status Types")
	@GetMapping(value = "/getInvoiceStatusTypes")
	public ResponseEntity getInvoiceStatusTypes() {
		try {
			List<InvoiceStatusEnum> statusEnums = InvoiceStatusEnum.getInvoiceStatusList();
			List<DropdownModel> dropdownModels = new ArrayList<>();
			if (statusEnums != null && !statusEnums.isEmpty()) {
				for (InvoiceStatusEnum statusEnum : statusEnums) {
					dropdownModels.add(new DropdownModel(statusEnum.getValue(), statusEnum.getDesc()));
				}
				return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "All Contact Types")
	@GetMapping(value = "/getContactTypes")
	public ResponseEntity getContactTypes() {
		try {
			List<ContactTypeEnum> typeEnums = Arrays.asList(ContactTypeEnum.values());
			List<DropdownModel> dropdownModels = new ArrayList<>();
			if (typeEnums != null && !typeEnums.isEmpty()) {
				for (ContactTypeEnum typeEnum : typeEnums) {
					dropdownModels.add(new DropdownModel(typeEnum.getValue(), typeEnum.getDesc()));
				}
				return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "All Industry Types")
	@GetMapping(value = "/getIndustryTypes")
	public ResponseEntity getIndustryTypes() {
		try {
			List<DropdownModel> dropdownModels = new ArrayList<>();
			List<IndustryType> industryTypes = industryTypeService.getIndustryTypes();
			if (industryTypes != null && !industryTypes.isEmpty()) {
				for (IndustryType type : industryTypes) {
					dropdownModels.add(new DropdownModel(type.getId(), type.getIndustryTypeName()));
				}
				return new ResponseEntity<>(dropdownModels, HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/vatCategory")
	public ResponseEntity getVatCAtegory() {
		try {
			Map<VatCategoryFilterEnum, Object> filterDataMap = new HashMap();
			filterDataMap.put(VatCategoryFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
			filterDataMap.put(VatCategoryFilterEnum.DELETE_FLAG, false);

			PaginationResponseModel respone = vatCategoryService.getVatCategoryList(filterDataMap, null);
			if (respone != null) {
				return new ResponseEntity(vatCategoryRestHelper.getList(respone.getData()), HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "get Pay mode (expense)")
	@GetMapping(value = "/payMode")
	public ResponseEntity getPayMode() {
		try {
			List<PayMode> payModes = Arrays.asList(PayMode.values());
			if (payModes != null && !payModes.isEmpty()) {
				List<EnumDropdownModel> modelList = new ArrayList<>();
				for (PayMode payMode : payModes)
					modelList.add(new EnumDropdownModel(payMode.toString(), payMode.toString()));
				return new ResponseEntity<>(modelList, HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "All subChartofAccount")
	@GetMapping(value = "/getsubChartofAccount")
	public ResponseEntity getsubChartofAccount() {
		try {
			List<ChartOfAccount> transactionTypes = transactionTypeService.findAll();
			if (transactionTypes != null && !transactionTypes.isEmpty()) {
				return new ResponseEntity<>(transcationCategoryHelper.getDropDownModelList(transactionTypes),
						HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/getstate")
	public ResponseEntity getState(@RequestParam Integer countryCode) {
		try {

			Map<StateFilterEnum, Object> filterMap = new EnumMap<>(StateFilterEnum.class);
			filterMap.put(StateFilterEnum.COUNTRY, countryService.getCountry(countryCode));
			List<State> stateList = stateService.getstateList(filterMap);
			List<DropdownModel> modelList = new ArrayList<>();
			if (stateList != null && !stateList.isEmpty()) {
				for (State state : stateList)
					modelList.add(new DropdownModel(state.getId(), state.getStateName()));
				return new ResponseEntity<>(modelList, HttpStatus.OK);
			} else {
				return new ResponseEntity(modelList, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "reconsileCategories")
	@GetMapping(value = "/reconsileCategories")
	public ResponseEntity getReconsilteCategories(@RequestParam("debitCreditFlag") String debitCreditFlag) {
		try {
			List<ChartOfAccountCategory> chartOfAccountCategoryList = chartOfAccountCategoryService.findAll();
			if (chartOfAccountCategoryList != null && !chartOfAccountCategoryList.isEmpty()) {

				List<DropdownModel> modelList = new ArrayList<DropdownModel>();

				ChartOfAccountCategory parentCategory = null;
				for (ChartOfAccountCategory chartOfAccountCategory : chartOfAccountCategoryList) {

					if (debitCreditFlag.equals("C") && chartOfAccountCategory.getParentChartOfAccount() != null
							&& chartOfAccountCategory.getParentChartOfAccount().getChartOfAccountCategoryId()
									.equals(ChartOfAccountCategoryIdEnumConstant.MONEY_RECEIVED.getId())) {

						modelList.add(new DropdownModel(chartOfAccountCategory.getChartOfAccountCategoryId(),
								chartOfAccountCategory.getChartOfAccountCategoryName()));
					} else if (debitCreditFlag.equals("D") && chartOfAccountCategory.getParentChartOfAccount() != null
							&& chartOfAccountCategory.getParentChartOfAccount().getChartOfAccountCategoryId()
									.equals(ChartOfAccountCategoryIdEnumConstant.MONEY_SPENT.getId())) {
						modelList.add(new DropdownModel(chartOfAccountCategory.getChartOfAccountCategoryId(),
								chartOfAccountCategory.getChartOfAccountCategoryName()));
					} else if ((debitCreditFlag.equals("C") && chartOfAccountCategory.getChartOfAccountCategoryId()
							.equals(ChartOfAccountCategoryIdEnumConstant.MONEY_RECEIVED.getId()))
							|| debitCreditFlag.equals("D") && chartOfAccountCategory.getChartOfAccountCategoryId()
									.equals(ChartOfAccountCategoryIdEnumConstant.MONEY_SPENT.getId())) {
						parentCategory = chartOfAccountCategory;
					}
				}
//				HashMap<String, Object> response = new HashMap<>();
//				response.put(parentCategory.getChartOfAccountCategoryName(), modelList);
				return new ResponseEntity<>(Arrays.asList(
						new SingleLevelDropDownModel(parentCategory.getChartOfAccountCategoryName(), modelList)),
						HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/reconsile/getTransactionCat")
	public ResponseEntity getTransactionCategory(@RequestParam Integer chartOfAccountCategoryId) {
		try {
			ChartOfAccountCategory category = chartOfAccountCategoryService.findByPK(chartOfAccountCategoryId);
			String chartOfAccountCatCode = category.getChartOfAccountCategoryCode();

			if (category == null) {
				return new ResponseEntity(HttpStatus.BAD_REQUEST);
			}
			List<TransactionCategory> transactionCatList = transactionCategoryService
					.getTransactionCatByChartOfAccountCategoryId(category.getChartOfAccountCategoryId());
			if (transactionCatList != null && !transactionCatList.isEmpty()) {
				
				return new ResponseEntity<>(transcationCategoryHelper.getSinleLevelDropDownModelList(
						transactionCatList), HttpStatus.OK);
			} else {
				return new ResponseEntity(HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			LOGGER.error("Error", e);
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
