package com.simplevat.rest.companycontroller;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.simplevat.constant.ErrorConstant;
import com.simplevat.entity.Currency;
import com.simplevat.rest.DropdownModel;
import com.simplevat.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.constant.dbfilter.CompanyFilterEnum;
import com.simplevat.entity.Company;
import com.simplevat.entity.User;
import com.simplevat.security.JwtTokenUtil;

import io.swagger.annotations.ApiOperation;

import static com.simplevat.constant.ErrorConstant.ERROR;

@Component
@RequestMapping("/rest/company")
public class CompanyController {

	private final Logger logger = LoggerFactory.getLogger(CompanyController.class);

	@Autowired
	private CompanyService companyService;

	@Autowired
	private CurrencyService currencyService;

	@Autowired
	private CompanyTypeService companyTypeService;

	@Autowired
	private IndustryTypeService industryTypeService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private CompanyRestHelper companyRestHelper;

	@Autowired
	private RoleService roleService;

	@Autowired
	private UserService userService;

	/**
	 * @Deprecated
	 **/
	@ApiOperation(value = "Get Company List")
	@GetMapping(value = "/getList")
	public ResponseEntity<List<CompanyListModel>> getCompanyList(HttpServletRequest request) {
		try {
			Map<CompanyFilterEnum, Object> filterMap = new EnumMap<>(CompanyFilterEnum.class);
			filterMap.put(CompanyFilterEnum.DELETE_FLAG, false);
			List<Company> companyList = companyService.getCompanyList(filterMap);
			if (companyList == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(companyRestHelper.getModelList(companyList), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/getCompaniesForDropdown")
	public ResponseEntity<List<DropdownModel>> getCompaniesForDropdown() {
		return new ResponseEntity<>(companyService.getCompaniesForDropdown(), HttpStatus.OK);
	}
/**
 * @Deprecated
 **/
	@ApiOperation(value = "delete By Id")
	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteCompany(@RequestParam(value = "id") Integer id) {
		try {
			Company company = companyService.findByPK(id);
			if (company != null) {
				company.setDeleteFlag(Boolean.TRUE);
				companyService.update(company);
			}
			return new ResponseEntity<>("Deleted Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
/**
* @Deprecated
* */
	@ApiOperation(value = "Delete Companies in Bulk")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity<String> deleteCompanies(@RequestBody DeleteModel ids) {
		try {
			companyService.deleteByIds(ids.getIds());
			return new ResponseEntity<>("Companies Deleted successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
		}
		return new ResponseEntity<>("Cannot Delete The companies",HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ApiOperation(value = "Get Company Deatials for login user")
	@GetMapping(value = "/getCompanyDetails")
	public ResponseEntity<CompanyModel> getCompanyById(HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

			User user = userService.findByPK(userId);
			if (user == null) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<>(companyRestHelper.getModel(user.getCompany()), HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@ApiOperation(value = "Get Company Count ")
	@GetMapping(value = "/getCompanyCount")
	public ResponseEntity<Integer> getCompanyCount(HttpServletRequest request) {
		try {
			Company company = companyService.getCompany();
			if (company == null) {
				return new ResponseEntity<>(0, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(1, HttpStatus.OK);
			}
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Add New Company")
	@PostMapping(value = "/save")
	public ResponseEntity<String> save(@ModelAttribute CompanyModel companyModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Company company = companyRestHelper.getEntity(companyModel, userId);
			company.setCreatedBy(userId);
			company.setCreatedDate(LocalDateTime.now());
			company.setDeleteFlag(Boolean.FALSE);
			companyService.persist(company);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Register New Company")
	@PostMapping(value = "/register")
	public ResponseEntity<String> save(@ModelAttribute RegistrationModel registrationModel, HttpServletRequest request) {
		try {
			String password = registrationModel.getPassword();
			if (password != null && !password.trim().isEmpty()) {
				BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
				String encodedPassword = passwordEncoder.encode(password);
				registrationModel.setPassword(encodedPassword);
			}
			User user = new User();
			user.setFirstName(registrationModel.getFirstName());
			user.setLastName(registrationModel.getLastName());
			user.setUserEmail(registrationModel.getEmail());
			user.setPassword(registrationModel.getPassword());
			user.setRole(roleService.findByPK(1));
			user.setCreatedBy(1);
			user.setIsActive(true);
			userService.persist(user);
			Company company = new Company();
			company.setCompanyName(registrationModel.getCompanyName());
			if (registrationModel.getCompanyTypeCode() != null) {
				company.setCompanyTypeCode(companyTypeService.findByPK(registrationModel.getCompanyTypeCode()));
			}
			if (registrationModel.getIndustryTypeCode() != null) {
				company.setIndustryTypeCode(industryTypeService.findByPK(registrationModel.getIndustryTypeCode()));
			}
			if (registrationModel.getCurrencyCode() != null) {
				company.setCurrencyCode(currencyService.findByPK(registrationModel.getCurrencyCode()));
			}
			company.setCreatedBy(user.getUserId());
			company.setCreatedDate(LocalDateTime.now());
			company.setDeleteFlag(Boolean.FALSE);
			companyService.persist(company);
			user.setCompany(company);
			userService.update(user);

			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Update Company")
	@PostMapping(value = "/update")
	public ResponseEntity<String> update(@ModelAttribute CompanyModel companyModel, HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			Company company = companyRestHelper.getEntity(companyModel, userId);
			company.setLastUpdateDate(LocalDateTime.now());
			company.setLastUpdatedBy(userId);
			companyService.update(company);
			currencyService.updateCurrencyProfile(company.getCurrencyCode().getCurrencyCode());
			return new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
		} catch (Exception e) {
			logger.error(ERROR, e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Get Currency List", response = List.class)
	@GetMapping(value = "/getCurrency")
	public ResponseEntity<List<Currency>> getCurrencies() {
		try {
			List<Currency> currencies = currencyService.getCurrenciesProfile();
			if (currencies != null && !currencies.isEmpty()) {
				return new ResponseEntity<>(currencies, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
		} catch (Exception e) {
			logger.error(ErrorConstant.ERROR, e);
		}
		return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
