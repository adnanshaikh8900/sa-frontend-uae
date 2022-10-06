import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { CommonActions } from "services/global";
import moment from "moment";
import * as transactionCreateActions from "./actions";
import * as transactionActions from "../../actions";
import * as detailBankAccountActions from "../../../detail/actions";
import * as CurrencyConvertActions from "../../../../../currencyConvert/actions";
import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";
import { data } from "../../../../../Language/index";
import LocalizedStrings from "react-localization";
import { selectOptionsFactory, selectCurrencyFactory } from "utils";
import Switch from "react-switch";
import { LeavePage, Loader } from "components";

const mapStateToProps = (state) => {
  return {
    transaction_category_list: state.bank_account.transaction_category_list,
    transaction_type_list: state.bank_account.transaction_type_list,
    customer_invoice_list: state.bank_account.customer_invoice_list,
    vendor_invoice_list: state.bank_account.vendor_invoice_list,
    expense_list: state.bank_account.expense_list,
    expense_categories_list: state.expense.expense_categories_list,
    user_list: state.bank_account.user_list,
    currency_list: state.bank_account.currency_list,
    vendor_list: state.bank_account.vendor_list,
    vat_list: state.bank_account.vat_list,
    currency_convert_list: state.currencyConvert.currency_convert_list,
    UnPaidPayrolls_List: state.bank_account.UnPaidPayrolls_List,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    transactionActions: bindActionCreators(transactionActions, dispatch),
    transactionCreateActions: bindActionCreators(
      transactionCreateActions,
      dispatch
    ),
    currencyConvertActions: bindActionCreators(
      CurrencyConvertActions,
      dispatch
    ),
    commonActions: bindActionCreators(CommonActions, dispatch),
    detailBankAccountActions: bindActionCreators(
      detailBankAccountActions,
      dispatch
    ),
  };
};
const customStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#2064d8" : "#c7c7c7",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      borderColor: state.isFocused ? "#2064d8" : "#c7c7c7",
    },
  }),
};

let strings = new LocalizedStrings(data);
class CreateBankTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: window["localStorage"].getItem("language"),
      createMore: false,
      disabled: false,
      fileName: "",
      initValue: {
        transactionId: "",
        bankAccountId: "",
        transactionDate: new Date(),
        description: "",
        transactionAmount: "",
        coaCategoryId: "",
        transactionCategoryId: "",
        projectId: "",
        reference: "",
        attachementDescription: "",
        attachment: "",
        customerId: "",
        invoiceIdList: [],
        payrollListIds: "",
        vatId: "",
        expenseCategory:"",
        vendorId: "",
        employeeId: "",
        currencyCode: "",
        exchangeRate: [],
      },
      expenseType: false,
      loadingMsg: "Loading...",
      disableLeavePage: false,
      transactionCategoryList: [],
      moneyCategoryList: [],
      totalAmount: "",
      categoriesList: [
        {
          label: "Money Spent",
          options: [
            {
              value: 11,
              label: "Transfered To",
            },
            {
              value: 12,
              label: "Money Paid To User",
            },
            {
              value: 13,
              label: "Purchase Of Capital Asset",
            },
            {
              value: 14,
              label: "Money Spent Others",
            },
            {
              value: 10,
              label: "Expense",
            },
            {
              value: 100,
              label: "Supplier Invoice",
            },
          ],
        },
        {
          label: "Money Received",
          options: [
            {
              value: 2,
              label: "Sales",
            },
            {
              value: 3,
              label: "Transfered From",
            },
            {
              value: 4,
              label: "Refund Received",
            },
            {
              value: 5,
              label: "Interest Received",
            },
            // {
            //   value: 6,
            //   label: "Money Received From User",
            // },
            {
              value: 7,
              label: "Disposal Of Capital Asset",
            },
            {
              value: 8,
              label: "Money Received Others",
            },
          ],
        },
      ],
      cat_label: "",
      cat1_label: "",
      id: "",
      conversionDetails: [],
    };

    this.file_size = 1024000;
    this.supported_format = [
      "image/png",
      "image/jpeg",
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    this.regEx = /^[0-9\d]+$/;
    this.regExBoth = /[a-zA-Z0-9]+$/;
    this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
    this.formRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.transactionActions.getUnPaidPayrollsList();
    this.initializeData();
  };

  initializeData = () => {
    this.getCompanyCurrency();
    this.props.currencyConvertActions
      .getCurrencyConversionList()
      .then((response) => {
        this.setState({
          initValue: {
            ...this.state.initValue,
            ...{
              currency: response.data
                ? parseInt(response.data[0].currencyCode)
                : "",
            },
          },
        });
        this.formRef.current.setFieldValue(
          "currency",
          response.data[0].currencyCode,
          true
        );
      });
    //console.log(this.props.location.state.bankAccountId);
    if (this.props.location.state && this.props.location.state.bankAccountId) {
      this.setState(
        {
          id: this.props.location.state.bankAccountId,
        },
        () => {
          //console.log(this.state.id);
        }
      );
      this.props.detailBankAccountActions
        .getBankAccountByID(this.props.location.state.bankAccountId)
        .then((res) => {
          this.setState(
            {
              date: res.openingDate
                ? moment(res.openingDate).format("MM/DD/YYYY")
                : "",
              reconciledDate: res.lastReconcileDate
                ? moment(res.lastReconcileDate).format("MM/DD/YYYY")
                : "",
              bankCurrency: res.bankAccountCurrency ? res : "",
            },
            () => { }
          );
        })
        .catch((err) => {
          this.props.commonActions.tostifyAlert(
            "error",
            err && err.data ? err.data.message : "Something Went Wrong"
          );
        });
    }
  };

  handleFileChange = (e, props) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => { };
      reader.readAsDataURL(file);
      props.setFieldValue("attachment", file, true);
    }
  };

  handleSubmit = (data, resetForm) => {
    this.setState({ disabled: true, loading: true, disableLeavePage: true });
    let bankAccountId =
      this.props.location.state && this.props.location.state.bankAccountId
        ? this.props.location.state.bankAccountId
        : "";
    const {
      transactionDate,
      description,
      transactionAmount,
      coaCategoryId,
      transactionCategoryId,
      invoiceIdList,
      payrollListIds,
      reference,
      exchangeRate,
      customerId,
      vatId,
      vendorId,
      employeeId,
      expenseCategory,
      currencyCode,
      userId,
      expenseType,
      ExplainedInvoiceListModal,
      setexcessorshortamount

    } = data;

    if (
      (invoiceIdList && coaCategoryId.label === "Sales") ||
      (invoiceIdList && coaCategoryId.label === "Supplier Invoice")
    ) {

      var result = invoiceIdList.map((o, index) => ({
        id: o.value,
        remainingInvoiceAmount: 0,
        type: o.type,
        exchangeRate: exchangeRate[index],
      }));
    }
    if (
      payrollListIds &&
      expenseCategory.value &&
      expenseCategory.label === "Salaries and Employee Wages"
    ) {
      var result1 = payrollListIds.map((o) => ({
        payrollId: o.value,
      }));
      console.log(result1);
    }
    let formData = new FormData();
    formData.append("expenseType", this.state.expenseType);
    formData.append("bankId ", bankAccountId ? bankAccountId : "");
    formData.append("date", transactionDate ? transactionDate : "");
    formData.append("description", description ? description : "");
    formData.append("amount", transactionAmount ? transactionAmount : "");
    formData.append(
      "coaCategoryId",
      coaCategoryId
        ? coaCategoryId.value && coaCategoryId.value == 100
          ? 10
          : coaCategoryId.value
        : ""
    );
    formData.append("exchangeRate", exchangeRate.lenght > 0 ? exchangeRate[0] : 1);
    if (transactionCategoryId) {
      formData.append(
        "transactionCategoryId",
        transactionCategoryId ? transactionCategoryId.value : ""
      );
    }
   if (expenseCategory && coaCategoryId.label === "Expense") {
      formData.append(
        "expenseCategory",
        expenseCategory ? expenseCategory.value : ""
      );
   }
    if (
      (vatId && coaCategoryId.value === 10) ||
      (vatId && coaCategoryId.label === "Expense")
    ) {
      formData.append("vatId", vatId ? vatId.value : "");
    }
    if (
      (currencyCode && coaCategoryId.label === "Expense") ||
      coaCategoryId.label === "Sales" ||
      coaCategoryId.label === "Supplier Invoice"
    ) {
      formData.append(
        "currencyCode",
        currencyCode.value ? currencyCode.value : currencyCode
      );
    }
    if (
      (customerId &&
        coaCategoryId.value &&
        coaCategoryId.label === "Expenses") ||
      (customerId && coaCategoryId.value && coaCategoryId.label === "Sales")
    ) {
      formData.append("customerId", customerId ? customerId.value : "");
    }
    if (vendorId && coaCategoryId.value && coaCategoryId.label === "Expenses") {
      formData.append("vendorId", vendorId ? vendorId.value : "");
    }

    if (vendorId && coaCategoryId.label === "Supplier Invoice") {
      formData.append("vendorId", vendorId.value ? vendorId.value : vendorId);
    }
    if (vendorId && coaCategoryId.value && coaCategoryId.label === "Expenses") {
      formData.append("vatId", vatId ? vatId.value : "");
    }
    if (employeeId) {
      formData.append("employeeId", employeeId ? employeeId.value : "");
    }
    if (
      (invoiceIdList &&
        coaCategoryId.value &&
        coaCategoryId.label === "Sales") ||
      coaCategoryId.label === "Supplier Invoice"
    ) {
      formData.append(
        "explainParamListStr",
        invoiceIdList ? JSON.stringify(result) : ""
      );

      formData.append(
        "explainedInvoiceListString",
        invoiceIdList ?JSON.stringify(invoiceIdList.map((i)=>{

         return {
          invoiceId:i.value,
          invoiceAmount:i.dueAmount,
          convertedInvoiceAmount:i.convertedInvoiceAmount,
          explainedAmount:i.explainedAmount,
          exchangeRate:i.exchangeRate,
          partiallyPaid:i.pp
         } })) : []
      );
    
      formData.append(
        "exchangeGainOrLossId",this.setexcessorshortamount().data<0?103:this.setexcessorshortamount().data>0?79:0
      );
      formData.append(
        "exchangeGainOrLoss",this.setexcessorshortamount().data
      );

    }
    formData.append("reference", reference ? reference : "");
    if (this.uploadFile.files[0]) {
      formData.append("attachmentFile", this.uploadFile.files[0]);
    }
    if (
      payrollListIds &&
      expenseCategory.value &&
      expenseCategory.label === "Salaries and Employee Wages"
    ) {
      formData.append(
        "payrollListIds",
        payrollListIds ? JSON.stringify(result1) : ""
      );
    }
    this.props.transactionCreateActions
      .createTransaction(formData)
      .then((res) => {
        if (res.status === 200) {
          resetForm();
          this.props.commonActions.tostifyAlert(
            "success",
            "New Transaction Created Successfully."
          );
          if (this.state.createMore) {
            this.setState({
              createMore: false,
              disabled:false
            });
          } else {
            this.props.history.push("/admin/banking/bank-account/transaction", {
              bankAccountId,
            });
          }
        }
      })
      .catch((err) => {
        this.props.commonActions.tostifyAlert(
          "error",
          err && err.data ? err.data.message : "Something Went Wrong"
        );
      });
  };

  setValue = (value) => {
    this.setState({
      transactionCategoryList: [],
    });
    // this.setState(
    //   (prevState) => ({
    //     ...prevState,
    //     transactionCategoryList: [],
    //   }),
    //   () => {},
    // );
  };

  totalAmount(option) {
    let totalInvoiceAmount = 0;
    console.log(option);
  
    if (option && option != "") {
      option.map((row) => {
        let listData = row.amount;
        totalInvoiceAmount += listData;
      });

      const amount = option.reduce(
        (totalAmount, invoice) => totalAmount + invoice.amount,
        0
      );
      
      this.setState(
        { totalAmount: amount, totalInvoiceAmount: totalInvoiceAmount },
        () => { }
      );
      console.log(totalInvoiceAmount, " : totalInvoiceAmount");
    } else {
      this.setState(
        { totalAmount: 0, totalInvoiceAmount: totalInvoiceAmount },
        () => { }
      );
    }
  }

  getExpensesCategoriesList = () => {
    this.props.transactionActions.getExpensesCategoriesList();
    this.props.transactionActions.getCurrencyList().then((response) => {
      this.setState({
        initValue: {
          ...this.state.initValue,
          ...{
            currencyCode: response.data
              ? parseInt(response.data[0].currencyCode)
              : "",
          },
        },
      });
      this.formRef.current.setFieldValue(
        "currency",
        response.data[0].currencyCode,
        true
      );
    });
    this.props.transactionActions.getUserForDropdown();
    this.props.transactionActions.getVatList();
  };

  getVendorList = () => {
    this.props.transactionActions.getVendorList(
      this.props.location.state.bankAccountId
        ? this.props.location.state.bankAccountId
        : ""
    );
  };
  getSuggestionInvoicesFotCust = (option, amount) => {
    const data = {
      amount: amount,
      id: option,
    };
    this.props.transactionActions.getCustomerInvoiceList(data);
  };
  getSuggestionInvoicesFotVend = (option, amount, invoice_list) => {
    ;
    const data = {
      amount: amount,
      id: option,
      currency:
        this.state.invoiceCurrency && invoice_list != null
          ? this.state.invoiceCurrency
          : 0,
      bankId: this.props.location.state.bankAccountId,
    };
    this.props.transactionActions.getVendorInvoiceList(data);
    if (invoice_list === null) {
      this.formRef.current.setFieldValue("curreancyname", "", true);
      this.formRef.current.setFieldValue("exchangeRate", "", true);
      this.formRef.current.setFieldValue("currencyCode", "", true);
    }
  };

  invoiceIdList = (option) => {
  
    this.setState({
      initValue: {
        ...this.state.initValue,
        ...{
          invoiceIdList: option,
        },
      },
    });
    this.formRef.current.setFieldValue("invoiceIdList", option, true);
  };
  getInvoiceCurrency = (opt, props) => {
    const { customer_invoice_list } = this.props;

    const customerinvoice = customer_invoice_list.data.filter(
      (item) => item.value === opt.value
    );
    this.setState(
      {
        invoiceCurrency: customerinvoice?.[0].currencyCode,
      },
      () => {
        ;
        console.log(props.values.invoiceIdList);
        // this.getInvoices(
        // 	props.values.customerId,
        // 	props.values.transactionAmount,
        // )
        this.formRef.current.setFieldValue(
          "currencyCode",
          customerinvoice?.[0].currencyCode,
          true
        );

        this.setCurrency(customerinvoice?.[0].currencyCode);
        this.setExchange(this.state.bankCurrency.bankAccountCurrency);
      }
    );
  };

  getVendorInvoiceCurrency = (opt, props) => {
    const { vendor_invoice_list } = this.props;

    this.setState(
      {
        invoiceCurrency: opt?.[0].currencyCode,
      },
      () => {
        console.log(props.values.invoiceIdList);
        // this.getInvoices(
        // 	props.values.customerId,
        // 	props.values.transactionAmount,
        // )
        this.formRef.current.setFieldValue(
          "currencyCode",
          opt?.[0].currencyCode,
          true
        );

        this.setCurrency(opt?.[0].currencyCode);
        this.setExchange(this.state.bankCurrency.bankAccountCurrency);
      }
    );

    // vendor_invoice_list.data.map(item => {
    // 	if (item.value === opt.value)
    // 	{
    // 		this.setState({
    // 		invoiceCurrency : item.currencyCode
    // 	},()=>{
    // 		this.getInvoices(
    // 			props.values.customerId,
    // 			props.values.transactionAmount,
    // 		);
    // 		this.formRef.current.setFieldValue('currencyCode', this.state.invoiceCurrency, true);
    // 		this.setCurrency( this.state.invoiceCurrency );
    // 	this.setExchange( this.state.invoiceCurrency );
    // 	})}
    // })
  };
  payrollList = (option) => {
    this.setState({
      initValue: {
        ...this.state.initValue,
        ...{
          payrollListIds: option,
        },
      },
    });
    this.formRef.current.setFieldValue("payrollListIds", option, true);
  };

  getPayrollList = (UnPaidPayrolls_List, props) => {
    return (
      <Col lg={3}>
        <FormGroup className="mb-3">
          <Label htmlFor="payrollListIds">Payolls</Label>
          <Select
            style={customStyles}
            isMulti
            className="select-default-width"
            options={
              UnPaidPayrolls_List && UnPaidPayrolls_List
                ? UnPaidPayrolls_List
                : []
            }
            // options={
            //     invoice_list ? invoice_list.data : []
            // }
            id="payrollListIds"
            onChange={(option) => {
              props.handleChange("payrollListIds")(option);
              this.payrollList(option);
            }}
          />
        </FormGroup>
      </Col>
    );
  };

  getCompanyCurrency = (basecurrency) => {
    this.props.currencyConvertActions
      .getCompanyCurrency()
      .then((res) => {
        if (res.status === 200) {
          this.setState({ basecurrency: res.data });
        }
      })
      .catch((err) => {
        this.props.commonActions.tostifyAlert(
          "error",
          err && err.data ? err.data.message : "Something Went Wrong"
        );
        this.setState({ loading: false });
      });
  };

  setExchange = (value) => {
    let exchange;
    let result = this.props.currency_convert_list.filter((obj) => {
      return obj.currencyCode === value;
    });

    // this.state.invoiceCurrency
    // this.state.bankCurrency.bankAccountCurrency
    // this.state.basecurrency.currencyCode
    // if(this.state.bankCurrency.bankAccountCurrency=== this.state.invoiceCurrency )
    //  return this.formRef.current.setFieldValue('exchangeRate',1/result[0].exchangeRate, true);

    if (
      this.state.invoiceCurrency === this.state.bankCurrency.bankAccountCurrency
    ) {
      exchange = 1;
      //this.formRef.current.setFieldValue('exchangeRate', 1, true);
    } else if (
      this.state.invoiceCurrency !== this.state.bankCurrency.bankAccountCurrency
    ) {
      if (this.state.invoiceCurrency !== this.state.basecurrency.currencyCode) {
        exchange = result[0].exchangeRate;
      } else {
        exchange = 1 / result[0].exchangeRate;
      }
    }

    ;

    this.formRef.current.setFieldValue(
      "exchangeRate",
      [...this.formRef.current.state.values.exchangeRate, exchange],
      true
    );


    //   this.formRef.current.setFieldValue('exchangeRate', result[0].exchangeRate, true);
  };

  setCurrency = (value) => {
    let result = this.props.currency_convert_list.find((obj) => {
      return obj.currencyCode === value;
    });
    ;
    this.formRef.current.setFieldValue(
      "curreancyname",
      result.currencyIsoCode,
      true
    );
  };

  setcustomexchnage = (customerinvoice) => {


    let exchange;
    let result = this.props.currency_convert_list.filter((obj) => {
      return obj.currencyCode === customerinvoice;
    });
    // this.state.invoiceCurrency
    // this.state.bankCurrency.bankAccountCurrency
    // this.state.basecurrency.currencyCode
    // if(this.state.bankCurrency.bankAccountCurrency=== this.state.invoiceCurrency )
    //  return this.formRef.current.setFieldValue('exchangeRate',1/result[0].exchangeRate, true);

    if (
      customerinvoice === this.state.bankCurrency.bankAccountCurrency
    ) {
      exchange = 1;
      //this.formRef.current.setFieldValue('exchangeRate', 1, true);
    } else if (
      customerinvoice !== this.state.bankCurrency.bankAccountCurrency
    ) {
      if (customerinvoice !== this.state.basecurrency.currencyCode) {
        exchange = result[0].exchangeRate;
      } else {
        exchange = 1 / result[0].exchangeRate;
      }
    }
debugger
    return exchange
  }

  setexchnagedamount = (option, amount) => {
    if (option?.length > 0) {
      const transactionAmount = amount || this.formRef.current.state.values.transactionAmount
      const exchangerate = this.formRef.current.state.values?.exchangeRate
     debugger
      const invoicelist = [...option]
      const total = invoicelist.reduce((accu, curr, index) => curr.dueAmount * exchangerate[index])
      let remainingcredit = transactionAmount
      const finaldata = invoicelist?.map((i, ind) => {
        let localexe = 0
        debugger
        if (i.exchnageRate === undefined) localexe = this.setcustomexchnage(i.currencyCode)
        else localexe = i.exchnageRate
        let finalcredit = 0
        let localremainamount = remainingcredit
        if (remainingcredit > 0) {
          localremainamount = remainingcredit - (i.dueAmount * localexe)

          if (localremainamount >= 0) {
            finalcredit = (i.dueAmount * localexe)
          }
          if (localremainamount < 0) {
            finalcredit = (i.dueAmount * localexe) + localremainamount
          }
          remainingcredit = localremainamount
        }
        return {
          ...i,

          invoiceId: i.value,
          invoiceAmount: i.dueAmount,
          convertedInvoiceAmount: i.dueAmount * localexe,
          explainedAmount:  i.dueAmount * localexe,
          exchangeRate: localexe,
          pp: false
        }
      })
      debugger
      this.formRef.current.setFieldValue('invoiceIdList', finaldata)
      return finaldata
    }
    else {
      this.formRef.current.setFieldValue('invoiceIdList', [])
      return []
    }


  }

  onppclick = (value, indexofinvoce) => {
		
		const local2 = [...this.formRef.current.state.values.invoiceIdList]
		local2[indexofinvoce].pp = value
		let finaldata = [...(local2)]
		//how many are clicked
		const howManyAreClicked = finaldata.reduce((a, c, i) => a + (c.pp ? 1 : 0), 0)
		const transactionAmount = this.formRef.current.state.values.transactionAmount
		const total = finaldata.reduce((accu, curr, index) => accu + curr.convertedInvoiceAmount, 0)
		const shortAmount = transactionAmount - total
		let remainingcredit = transactionAmount
		let updatedfinaldata = []
		let temp=finaldata.reduce((a,c,i)=>c.convertedInvoiceAmount>=transactionAmount?a+1:a+0,0)
		let amountislessthanallinvoice= temp===finaldata.length
		let tempdata
		if(amountislessthanallinvoice) {
		if(value){
		  tempdata=finaldata.map((i)=>
		  {return {...i,pp:value,explainedAmount:transactionAmount/finaldata.length}
		 })
		}
		else {
		  const temp=finaldata.map((i)=>{
			return {...i,pp:value}
		  })
		  tempdata=this.setexchnagedamount(temp)
		  debugger
		}
		finaldata=[...tempdata]
		if(transactionAmount>0 && transactionAmount!=="")
		this.formRef.current.setFieldValue('invoiceIdList', finaldata)
	   } else {
		let currentshort=shortAmount
		finaldata.map((i, inx) => {
		  const local = { ...i }
				
		  if (i.pp) {
				let iio= local.convertedInvoiceAmount +(currentshort/howManyAreClicked)
				if(iio<0){
					local.explainedAmount= 0
					
				} else {
					local.explainedAmount=iio
				}
			}
			 else {
				local.explainedAmount=local.convertedInvoiceAmount
			}	 
		  updatedfinaldata.push(local)
		})
		this.formRef.current.setFieldValue('invoiceIdList', updatedfinaldata)
	  }
	}



  getCurrency = (opt) => {
    let supplier_currencyCode = 0;

    this.props.vendor_list.map((item) => {
      if (item.label.contactId == opt) {
        this.setState({
          supplier_currency: item.label.currency.currencyCode,
          supplier_currency_des: item.label.currency.currencyName,
        });

        supplier_currencyCode = item.label.currency.currencyCode;
      }
    });

    console.log("supplier_currencyCode", supplier_currencyCode);

    if (supplier_currencyCode != 0) {
      return supplier_currencyCode;
    } else {
      return this.state.unexplainValue && this.state.unexplainValue.currencyCode
        ? this.state.unexplainValue.currencyCode
        : 0;
    }
  };

  getTransactionCategoryList = (type) => {
    function getParentLabel(array, id, parentId) {
      return array.some(
        (o) =>
          o.label === id ||
          (o.options &&
            (parentId = getParentLabel(o.options, id, o.label)) !== null)
      )
        ? parentId
        : null;
    }
    this.setState({
      cat_label: getParentLabel(this.state.categoriesList, type.label),
    });
    this.setValue(null);
    try {
      this.props.transactionCreateActions
        .getTransactionCategoryListForExplain(
          type.value,
          this.props.location.state.bankAccountId
        )
        .then((res) => {
          debugger
          if (res.status === 200) {
            this.setState(
              {
                transactionCategoryList: res.data,
              },
              () => { }
            );
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  getMoneyPaidToUserlist = (option) => {
    try {
      this.props.transactionActions
        .getMoneyCategoryList(option.value)
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                moneyCategoryList: res.data,
              },
              () => { }
            );
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  getInvoices = (option, amount, invoice_list) => {
    const data = {
      amount: amount,
      id: option.value,
      currency:
        this.state.invoiceCurrency && invoice_list != null
          ? this.state.invoiceCurrency
          : 0,
      bankId: this.props.location.state.bankAccountId,
    };
    this.props.transactionActions.getCustomerInvoiceList(data);
    if (invoice_list === null) {
      this.formRef.current.setFieldValue("curreancyname", "", true);
      this.formRef.current.setFieldValue("exchangeRate", "", true);
      this.formRef.current.setFieldValue("currencyCode", "", true);
    }
  };

  setexcessorshortamount = () => {
    const totalexpainedamount = this.formRef.current.state.values?.invoiceIdList?.reduce(
      (accu, curr, index) =>
        accu +
        (curr.explainedAmount)
      ,
      0
    )

    const totalconvetedamount = this.formRef.current.state.values?.invoiceIdList?.reduce(
      (accu, curr, index) =>
        accu +
        (curr.convertedInvoiceAmount)
      ,
      0
    )

    const transactionAmount = this.formRef.current.state.values.transactionAmount
    const isppselected = this.formRef.current.state.values?.invoiceIdList?.reduce((a, c, i) => a + (c.pp ? 1 : 0), 0)

    let final = 0
    const totalshort = totalexpainedamount - totalconvetedamount
    if (isppselected > 0) {
      final = 0
    } else if (totalshort < 0) {
      final = totalshort
    } else if (totalshort >= 0) {
      final = transactionAmount - totalconvetedamount
    }
    return {value:` ${this.state.bankCurrency
      .bankAccountCurrencyIsoCode
    } ${final.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      } `,data:final}

  }

  render() {
    strings.setLanguage(this.state.language);
    const {
      initValue,
      id,
      transactionCategoryList,
      categoriesList,
      moneyCategoryList,
    } = this.state;
    const {
      customer_invoice_list,
      vendor_invoice_list,
      expense_categories_list,
      currency_list,
      vendor_list,
      vat_list,
      currency_convert_list,
      UnPaidPayrolls_List,
    } = this.props;

    let tmpSupplier_list = [];

    vendor_list.map((item) => {
      let obj = { label: item.label.contactName, value: item.value };
      tmpSupplier_list.push(obj);
    });

    return (
      <div className="create-bank-transaction-screen">
        <div className="animated fadeIn">
          <Row>
            <Col lg={12} className="mx-auto">
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="h4 mb-0 d-flex align-items-center">
                        <i className="icon-doc" />
                        <span className="ml-2">
                          {strings.CreateBankTransaction}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={12}>
                      <Formik
                        initialValues={initValue}
                        ref={this.formRef}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values, resetForm);
                        }}
                        validate={(values) => {
                          console.log(values);
                          let errors = {};
                          const totalexpaled=values?.invoiceIdList.reduce((a,c)=>a+c.explainedAmount,0)
                         
                          const date = moment(values.transactionDate).format(
                            "MM/DD/YYYY"
                          );
                          const date1 = new Date(date);
                          const date2 = new Date(this.state.date);
                          
                          if(values.coaCategoryId.label !== "Expense" &&
                          values.coaCategoryId.label !==
                          "Supplier Invoice" &&
                          values.coaCategoryId.label !== "Sales"){
                            if(!values.transactionCategoryId || values.transactionCategoryId===""){
                              errors.transactionCategoryId="Category is required"
                            }
                          }

                          if ((values.coaCategoryId?.value === 2 || values.coaCategoryId?.value === 100)) {
                            if (!values.vendorId?.value && values.coaCategoryId?.value === 100) {
                              errors.vendorId = "Please select the Vendor"
                            } else if (!values.customerId?.value && values.coaCategoryId?.value === 2) {
                              errors.customerId = "Please select the Customer"

                            }
                            if (values.invoiceIdList.length === 0) {

                              errors.invoiceIdList = "Please Select Invoice"
                            }else {
                              let isExplainAmountZero=false
                              values.invoiceIdList.map((i)=>{
                                  if(i.explainedAmount===0){
                                    isExplainAmountZero=true 
                                  }
                              })
                              if(isExplainAmountZero){
                                errors.invoiceIdList="Expain Amount Cannot Be Zero"  
                              }
                            }
            
                            if( values.transactionAmount>totalexpaled &&
                              this.state?.bankCurrency?.bankAccountCurrency===values?.invoiceIdList?.[0]?.currencyCode)
                           {
                            errors.transactionAmount=`Amount cannot be grater than ${totalexpaled}`
                           
                          }
                          const isppselected=values?.invoiceIdList.reduce((a,c)=>c.pp?a+1:a+0,0)
                          if( values.transactionAmount<totalexpaled &&
                            this.state?.bankCurrency?.bankAccountCurrency===values?.invoiceIdList?.[0]?.currencyCode
                            && isppselected===0
                            )
                         {
                          errors.transactionAmount=`The transaction amount is less than the invoice amount. To partially pay the invoice, please select the checkbox `
                         
                        }
                          }


                          if (
                            date1 < date2 ||
                            date1 < new Date(this.state.reconciledDate)
                          ) {
                            errors.transactionDate =
                              "Transaction Date cannot be before Bank Account Opening Date or after Current Date.";
                          }
                         
                          if (values.coaCategoryId.value !== 10 &&	(!values.transactionCategoryId && values.transactionCategoryId!=="")
                          ) {
                          	errors.transactionCategoryId ='Category is Required';
                          }
                          if (
                            (values.coaCategoryId.value === 12 ||
                              values.coaCategoryId.value === 6) &&
                            !values.employeeId
                          ) {
                            errors.employeeId = "User is Required";
                          }
                          if (
                            values.coaCategoryId.label === "Expense" &&
                            !values.currencyCode
                          ) {
                            errors.currencyCode = " Currency is Required";
                          }
                          if (
                            values.coaCategoryId.label === "Expense" &&
                            !values.expenseCategory
                          ) {
                            errors.expenseCategory = "Expense Category is Required";
                          }

                          if (
                            this.state.totalInvoiceAmount==="" &&
                            this.state.totalInvoiceAmount === 0
                          ) {
                           
                              errors.transactionAmount = `Enter Amount`;
                          }

                          // if (
                          //   this.state.totalInvoiceAmount &&
                          //   this.state.totalInvoiceAmount != 0
                          // ) {
                          //   if (
                          //     values.transactionAmount !=
                          //     this.state.totalInvoiceAmount
                          //   )
                          //     errors.transactionAmount = `Transaction Amount Must be Equal to Invoice Total(  ${this.state.totalInvoiceAmount}  )`;
                          // }
                      debugger
                          return errors;
                        }}
                        validationSchema={Yup.object().shape({
                          transactionDate: Yup.date().required(
                            "Transaction Date is Required"
                          ),
                          reference:Yup.string().max(20),
                          transactionAmount: Yup.string()
                            .required("Transaction Amount is Required")
                            .test(
                              "transactionAmount",
                              "Transaction Amount Must Be Greater Than 0",
                              (value) => value > 0
                            ),
                          coaCategoryId: Yup.string().required(
                            "Transaction Type is Required"
                          ),
                          attachment: Yup.mixed()
                            .test(
                              "fileType",
                              "*Unsupported File Format",
                              (value) => {
                                value &&
                                  this.setState({
                                    fileName: value.name,
                                  });
                                if (
                                  !value ||
                                  (value &&
                                    this.supported_format.includes(
                                      value.type
                                    )) ||
                                  !value
                                ) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }
                            )
                            .test(
                              "fileSize",
                              "*File Size is too large",
                              (value) => {
                                if (
                                  !value ||
                                  (value && value.size <= this.file_size) ||
                                  !value
                                ) {
                                  return true;
                                } else {
                                  return false;
                                }
                              }
                            ),
                        })}
                      >
                        {(props) => (
                          <Form onSubmit={props.handleSubmit}>
                            <Row>
                              <Col lg={3}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="coaCategoryId">
                                    <span className="text-danger">* </span>
                                    {strings.TransactionType}
                                  </Label>
                                  <Select
                                    options={categoriesList}
                                    value={props.values.coaCategoryId}
                                    onChange={(option) => {
                                      if (option && option.value) {
                                        props.handleChange("coaCategoryId")(
                                          option
                                        );
                                      } else {
                                        props.handleChange("coaCategoryId")("");
                                      }
                                      if (
                                        option.label !== "Expense" &&
                                        option.label !== "Supplier Invoice"
                                      ) {
                                        this.getTransactionCategoryList(option);
                                      }
                                      if (option.label === "Expense") {
                                        props.handleChange("currencyCode")(
                                          this.state.bankCurrency
                                            .bankAccountCurrency
                                        );
                                        this.getExpensesCategoriesList();
                                      }
                                      if (option.label === "Supplier Invoice") {
                                        this.getVendorList();
                                      }
                                      this.totalAmount("");
                                    }}
                                    placeholder={
                                      strings.Select + " " + strings.Type
                                    }
                                    id="coaCategoryId"
                                    name="coaCategoryId"
                                    className={
                                      props.errors.coaCategoryId &&
                                        props.touched.coaCategoryId
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.coaCategoryId &&
                                    props.touched.coaCategoryId && (
                                      <div className="invalid-feedback">
                                        {props.errors.coaCategoryId}
                                      </div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="date">
                                    <span className="text-danger">* </span>
                                    {strings.TransactionDate}
                                  </Label>
                                  <DatePicker
                                    autoComplete="off"
                                    id="transactionDate"
                                    name="transactionDate"
                                    placeholderText={strings.TransactionDate}
                                    maxDate={new Date()}
                                    showMonthDropdown
                                    showYearDropdown
                                    dateFormat="dd-MM-yyyy"
                                    dropdownMode="select"
                                    value={props.values.transactionDate}
                                    selected={props.values.transactionDate}
                                    onBlur={props.handleBlur("transactionDate")}
                                    onChange={(value) => {
                                      props.handleChange("transactionDate")(
                                        value
                                      );
                                    }}
                                    className={`form-control ${props.errors.transactionDate &&
                                        props.touched.transactionDate
                                        ? "is-invalid"
                                        : ""
                                      }`}
                                  />
                                  {props.errors.transactionDate &&
                                    props.touched.transactionDate && (
                                      <div className="invalid-feedback">
                                        {props.errors.transactionDate}
                                      </div>
                                    )}
                                </FormGroup>
                              </Col>
                              <Col lg={3}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="transactionAmount">
                                    <span className="text-danger">* </span>
                                    {strings.Amount}
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    maxLength="100"
                                    id="transactionAmount"
                                    name="transactionAmount"
                                    placeholder={strings.Amount}
                                    onChange={(option) => {
                                      if (
                                        option.target.value === "" ||
                                        this.regDecimal.test(
                                          option.target.value
                                        )
                                      ) {
                                        props.handleChange("transactionAmount")(
                                          option
                                        );
                                        this.setexchnagedamount(props.values.invoiceIdList, option.target.value)
                                      }
                                    }}
                                    value={props.values.transactionAmount}
                                    className={
                                      props.errors.transactionAmount &&
                                        props.touched.transactionAmount
                                        ? "is-invalid"
                                        : ""
                                    }
                                  />
                                  {props.errors.transactionAmount &&
                                    props.touched.transactionAmount && (
                                      <div className="invalid-feedback">
                                        {props.errors.transactionAmount}
                                      </div>
                                    )}
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                            {props.values.coaCategoryId &&
                              props.values.coaCategoryId.label ===
                              "Expense" && (
                                <Row>
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="expenseCategory">
                                        <span className="text-danger">* </span>
                                        Expense Category
                                      </Label>
                                      <Select
                                        style={customStyles}
                                        options={
                                          expense_categories_list
                                            ? selectOptionsFactory.renderOptions(
                                              "transactionCategoryName",
                                              "transactionCategoryId",
                                              expense_categories_list,
                                              "Expense Category"
                                            )
                                            : []
                                        }
                                        // value={props.values.expenseCategory}
                                        onChange={(option) => {
                                          props.handleChange("expenseCategory")(
                                            option
                                          );
                                        }}
                                        id="expenseCategory"
                                        name="expenseCategory"
                                        className={
                                          props.errors.expenseCategory &&
                                            props.touched.expenseCategory
                                            ? "is-invalid"
                                            : ""
                                        }
                                      />
                                      {props.errors.expenseCategory &&
                                        props.touched.expenseCategory && (
                                          <div className="invalid-feedback">
                                            {props.errors.expenseCategory}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                  {props.values.expenseCategory &&
                                    props.values.expenseCategory.value &&
                                    props.values.expenseCategory.value == 34 &&
                                    this.getPayrollList(
                                      UnPaidPayrolls_List,
                                      props
                                    )}
                                  {props.values.coaCategoryId &&
                                    props.values.coaCategoryId.label ===
                                    "Expense" &&
                                    props.values.expenseCategory &&
                                    props.values.expenseCategory.value !==
                                    34 && (
                                      <Col lg={3}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="vatId">VAT</Label>
                                          <Select
                                            style={customStyles}
                                            options={
                                              vat_list
                                                ? selectOptionsFactory.renderOptions(
                                                  "name",
                                                  "id",
                                                  vat_list,
                                                  "Tax"
                                                )
                                                : []
                                            }
                                            // value={
                                            // 	transactionCategoryList.dataList
                                            // 		? transactionCategoryList.dataList[0].options.find(
                                            // 				(option) =>
                                            // 					option.value ===
                                            // 					+props.values.vatId,
                                            // 		  )
                                            // 		: []
                                            // }
                                            onChange={(option) => {
                                              if (option && option.value) {
                                                props.handleChange("vatId")(
                                                  option
                                                );
                                              } else {
                                                props.handleChange("vatId")("");
                                              }
                                            }}
                                            placeholder={
                                              strings.Select +
                                              " " +
                                              strings.Type
                                            }
                                            id="vatId"
                                            name="vatId"
                                            className={
                                              props.errors.vatId &&
                                                props.touched.vatId
                                                ? "is-invalid"
                                                : ""
                                            }
                                          />
                                          {props.errors.vatId &&
                                        props.touched.vatId && (
                                          <div className="invalid-feedback">
                                            {props.errors.vatId}
                                          </div>
                                        )}
                                        </FormGroup>
                                      </Col>
                                    )}
                                  <Col className="mb-6" lg={6}>
                                    <Label htmlFor="inline-radio3">
                                      <span className="text-danger">* </span>
                                      {strings.ExpenseType}
                                    </Label>
                                    <div style={{ display: "flex" }}>
                                      {this.state.expenseType === false ? (
                                        <span
                                          style={{ color: "#0069d9" }}
                                          className="mr-4"
                                        >
                                          <b>{strings.Claimable}</b>
                                        </span>
                                      ) : (
                                        <span className="mr-4">
                                          {strings.Claimable}
                                        </span>
                                      )}

                                      <Switch
                                        checked={this.state.expenseType}
                                        onChange={(expenseType) => {
                                          props.handleChange("expenseType")(
                                            expenseType
                                          );
                                          this.setState(
                                            { expenseType },
                                            () => { }
                                          );
                                          // if (this.state.expenseType == true)
                                          // 	this.setState({ expenseType: true })
                                        }}
                                        onColor="#2064d8"
                                        onHandleColor="#2693e6"
                                        handleDiameter={25}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={48}
                                        className="react-switch"
                                      />

                                      {this.state.expenseType === true ? (
                                        <span
                                          style={{ color: "#0069d9" }}
                                          className="ml-4"
                                        >
                                          <b>{strings.NonClaimable}</b>
                                        </span>
                                      ) : (
                                        <span className="ml-4">
                                          {strings.NonClaimable}
                                        </span>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              )}

                            {props.values.coaCategoryId &&
                              props.values.coaCategoryId.label ===
                              "Supplier Invoice" && (
                                <Row>
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="vendorId">
                                        <span className="text-danger">* </span>
                                        Vendor
                                      </Label>
                                      <Select
                                       // style={customStyles}
                                        options={
                                          tmpSupplier_list
                                            ? selectOptionsFactory.renderOptions(
                                              "label",
                                              "value",
                                              tmpSupplier_list,
                                              "Supplier Name"
                                            )
                                            : []
                                        }
                                        // value={
                                        // 	props.values.vendorId
                                        // 		? transactionCategoryList.dataList[2].options.find(
                                        // 				(option) =>
                                        // 					option.value ===
                                        // 					+props.values.vendorId,
                                        // 		  )
                                        // 		: ''
                                        // }
                                        onChange={(option) => {
                                          if (option && option.value) {
                                            props.handleChange("vendorId")(
                                              option
                                            );
                                            props.handleChange("invoiceIdList")(
                                              []
                                            );
                                          } else {
                                            props.handleChange("vendorId")("");
                                          }

                                          this.getSuggestionInvoicesFotVend(
                                            option.value,
                                            props.values.transactionAmount
                                          );
                                        }}
                                        placeholder={
                                          strings.Select + " " + strings.Type
                                        }
                                        id="vendorId"
                                        name="vendorId"
                                        className={
                                          props.errors.vendorId &&
                                            props.touched.vendorId
                                            ? "is-invalid"
                                            : ""
                                        }
                                        
                                      />
                                      
                                      {props.errors.vendorId &&
                                        props.touched.vendorId && (
                                          <div className="invalid-feedback">
                                            {props.errors.vendorId}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                  {props.values.coaCategoryId &&
                                    props.values.coaCategoryId.label ===
                                    "Supplier Invoice" &&
                                    props.values.vendorId && (
                                      <Col lg={3}>
                                        <FormGroup className="mb-3">
                                          <Label htmlFor="invoiceIdList">
                                            <span className="text-danger">
                                              *{" "}
                                            </span>
                                            Invoice
                                          </Label>
                                          <Select
                                            style={customStyles}
                                            isMulti
                                            options={
                                              vendor_invoice_list
                                                ? vendor_invoice_list.data
                                                : []
                                            }
                                            onChange={(option) => {
                                              ;
                                              if (option === null) {
                                                this.getSuggestionInvoicesFotVend(
                                                  props.values.vendorId.value,
                                                  props.values
                                                    .transactionAmount,
                                                  option
                                                );
                                              }
                                              this.setexchnagedamount(option)
                                              
                                              this.totalAmount(option);
                                              if (option) {
                                                this.getVendorInvoiceCurrency(
                                                  option,
                                                  props
                                                );
                                              }
                                            }}
                                            value={props.values.invoiceIdList}
                                            placeholder={
                                              strings.Select +
                                              " " +
                                              strings.Type
                                            }
                                            id="invoiceIdList"
                                            name="invoiceIdList"
                                            className={
                                              props.errors.invoiceIdList &&
                                                props.touched.invoiceIdList
                                                ? "is-invalid"
                                                : ""
                                            }
                                          />
                                          {props.errors.invoiceIdList &&
                                            props.touched.invoiceIdList && (
                                              <div className="invalid-feedback">
                                                {props.errors.invoiceIdList}
                                              </div>
                                            )}
                                          {this.state.initValue.invoiceIdList &&
                                            this.state.initValue.invoiceIdList.reduce(
                                              (totalAmount, invoice) =>
                                                totalAmount + invoice.amount,
                                              0
                                            ) > this.state.initValue.amount && (
                                              <div
                                                className={
                                                  this.state.initValue.invoiceIdList.reduce(
                                                    (totalAmount, invoice) =>
                                                      totalAmount +
                                                      invoice.amount,
                                                    0
                                                  ) >
                                                    this.state.initValue.amount
                                                    ? "is-invalid"
                                                    : ""
                                                }
                                              >
                                                <div className="invalid-feedback">
                                                  Total Invoice Amount Is More
                                                  Than The Transaction Amount
                                                </div>
                                              </div>
                                            )}
                                        </FormGroup>
                                      </Col>
                                    )}
                                </Row>
                              )}
                            {transactionCategoryList.categoriesList &&
                              props.values.coaCategoryId.label !== "Expense" &&
                              props.values.coaCategoryId.label !==
                              "Supplier Invoice" &&
                              props.values.coaCategoryId.label !== "Sales" && (
                                <Row>
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="transactionCategoryId">
                                        <span className="text-danger">* </span>
                                        Category
                                      </Label>
                                      <Select
                                        style={customStyles}
                                        // className="select-default-width"
                                        options={
                                          transactionCategoryList
                                            ? transactionCategoryList.categoriesList
                                            : []
                                        }
                                        value={
                                          transactionCategoryList
                                            ? props.values.transactionCategoryId
                                            : ""
                                        }
                                        id="transactionCategoryId"
                                        onChange={(option) => {
                                          if (option && option.value) {
                                            props.handleChange(
                                              "transactionCategoryId"
                                            )(option);
                                          } else {
                                            props.handleChange(
                                              "transactionCategoryId"
                                            )("");
                                          }
                                          if (
                                            option.label !==
                                            "Salaries and Employee Wages" &&
                                            option.label !== "Owners Drawing" &&
                                            option.label !== "Dividend" &&
                                            option.label !==
                                            "Owners Current Account" &&
                                            option.label !== "Share Premium" &&
                                            option.label !==
                                            "Employee Advance" &&
                                            option.label !==
                                            "Employee Reimbursements" &&
                                            option.label !==
                                            "Director Loan Account" &&
                                            option.label !== "Owners Equity"
                                          ) {
                                          }
                                          if (
                                            option.label ===
                                            "Salaries and Employee Wages"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label === "Owners Drawing"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (option.label === "Dividend") {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label ===
                                            "Owners Current Account"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label === "Share Premium"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label === "Employee Advance"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label ===
                                            "Employee Reimbursements"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label ===
                                            "Director Loan Account"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                          if (
                                            option.label === "Owners Equity"
                                          ) {
                                            this.getMoneyPaidToUserlist(option);
                                          }
                                        }}
                                        className={`${props.errors.transactionCategoryId &&
                                          props.touched.transactionCategoryId
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                      />
                                      {props.errors.transactionCategoryId &&
                                        props.touched.transactionCategoryId && (
                                          <div className="invalid-feedback">
                                            {props.errors.transactionCategoryId}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              )}
                            {transactionCategoryList.dataList && (
                              <Row>
                                {props.values.coaCategoryId.value === 6 && (
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="employeeId">
                                        <span className="text-danger">* </span>
                                        User
                                      </Label>
                                      <Select
                                        style={customStyles}
                                        //className="select-default-width"
                                        options={
                                          moneyCategoryList
                                            ? moneyCategoryList
                                            : []
                                        }
                                        id="employeeId"
                                        value={props.values.employeeId}
                                        onChange={(option) => {
                                          props.handleChange("employeeId")(
                                            option
                                          );
                                        }}
                                        className={`${props.errors.employeeId &&
                                          props.touched.employeeId
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                      />
                                      {props.errors.employeeId &&
                                        props.touched.employeeId && (
                                          <div className="invalid-feedback">
                                            {props.errors.employeeId}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                )}
                                {props.values.coaCategoryId.value === 12 && (
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="employeeId">
                                        <span className="text-danger">* </span>
                                        User
                                      </Label>
                                      <Select
                                        style={customStyles}
                                        //className="select-default-width"
                                        // options={
                                        // 	transactionCategoryList.dataList[0]
                                        // 		? transactionCategoryList
                                        // 				.dataList[0].options
                                        // 		: []
                                        // }
                                        options={
                                          moneyCategoryList
                                            ? moneyCategoryList
                                            : []
                                        }
                                        id="employeeId"
                                        value={props.values.employeeId}
                                        onChange={(option) => {
                                          props.handleChange("employeeId")(
                                            option
                                          );
                                        }}
                                        className={`${props.errors.employeeId &&
                                          props.touched.employeeId
                                          ? "is-invalid"
                                          : ""
                                        }`}
                                      />
                                      {props.errors.employeeId &&
                                        props.touched.employeeId && (
                                          <div className="invalid-feedback">
                                            {props.errors.employeeId}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                )}

                                {props.values.coaCategoryId.label ===
                                  "Sales" && (
                                    <Col lg={3}>
                                      <FormGroup className="mb-3">
                                        <Label htmlFor="customerId">
                                          {" "}
                                          <span className="text-danger">* </span>
                                          Customer
                                        </Label>
                                        <Select
                                          style={customStyles}
                                          className="select-default-width"
                                          options={
                                            transactionCategoryList &&
                                              transactionCategoryList.dataList[1]
                                              ? transactionCategoryList
                                                .dataList[0].options
                                              : []
                                          }
                                          id="customerId"
                                          value={props.values.customerId}
                                          onChange={(option) => {
                                            // if (option && option.value) {
                                            // 	this.formRef.current.setFieldValue('currencyCode', this.getCurrency(option.value), true);

                                            // 	this.setExchange( this.getCurrency(option.value) );
                                            props.handleChange("customerId")(
                                              option
                                            );
                                            // 		option.value,
                                            // 	);
                                            // } else {
                                            // 	props.handleChange('customerId')(
                                            // 		'',
                                            // 	);
                                            // }
                                            props.handleChange("invoiceIdList")(
                                              []
                                            );
                                            this.getInvoices(
                                              option,
                                              props.values.transactionAmount
                                            );
                                          }}
                                        />
                                      </FormGroup>
                                    </Col>
                                  )}
                                {props.values.coaCategoryId.value === 2 && (
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="invoiceIdList">
                                        <span className="text-danger">* </span>
                                        Invoice
                                      </Label>
                                      <Select
                                        style={customStyles}
                                        isMulti
                                        className="select-default-width"
                                        options={
                                          customer_invoice_list &&
                                            customer_invoice_list.data
                                            ? customer_invoice_list.data
                                            : []
                                        }
                                        value={props.values.invoiceIdList}
                                        // options={
                                        // 	invoice_list ? invoice_list.data : []
                                        // }
                                        id="invoiceIdList"
                                        onChange={(option) => {
                                          if (option === null) {
                                            this.getInvoices(
                                              props.values.customerId,
                                              props.values.transactionAmount,
                                              option
                                            );
                                          }

                                          this.setexchnagedamount(option)
                                          this.totalAmount(option);

                                          if (option != null) {
                                            this.getInvoiceCurrency(
                                              option[0],
                                              props
                                            );
                                          }
                                        }}
                                      />
                                      {props.errors.invoiceIdList &&
                                        props.touched.invoiceIdList && (
                                          <div className="invalid-feedback">
                                            {props.errors.invoiceIdList}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                )}
                              </Row>
                            )}
                            {/* {
																	props.values.coaCategoryId &&
																		props.values.coaCategoryId.label ===
																		'Sales' && 
																
																	(
																		this.state.invoiceCurrency !== this.state.bankCurrency ?
																		<Row >
																			<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="currencyCode">
																						{strings.Currency}
																						</Label>
																					<Select
																						style={customStyles}
																						id="currencyCode"
																						name="currencyCode"
																						options={
																							currency_convert_list
																								? selectCurrencyFactory.renderOptions(
																									'currencyName',
																									'currencyCode',
																									currency_convert_list,
																									'Currency',
																								)
																								: []
																						}
																						isDisabled={true}
																						value={
																							currency_convert_list &&
																							selectCurrencyFactory
																								.renderOptions(
																									'currencyName',
																									'currencyCode',
																									currency_convert_list,
																									'Currency',
																								)
																								.find(
																									(option) =>
																										option.value ===
																										+this.state.invoiceCurrency,
																								)
																						}
																						onChange={(option) => {
																							debugger
																							if (option && option.value) {
																								props.handleChange(
																									'currencyCode',
																								)(option.value);
																							} else {
																								props.handleChange(
																									'currencyCode',
																								)('');
																							}
																							this.setExchange(option.value);
																							this.setCurrency(option.value)
																						}}
																						className={
																							props.errors.currencyCode &&
																								props.touched.currencyCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.currencyCode &&
																						props.touched.currencyCode && (
																							<div className="invalid-feedback">
																								{props.errors.currencyCode}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																		</Row>
																	:'')} */}
                          
                            {props.values.coaCategoryId &&
                              (props.values.coaCategoryId.label === "Sales" ||
                                props.values.coaCategoryId.label ===
                                "Supplier Invoice") && (
                                <>
                                  {props.values?.invoiceIdList.length > 0 &&
                                    <Row className="border-bottom mb-3"
                                    style={{display:'flex',justifyContent:'space-between'}}
                                    >
                                      <Col lg={1}>
                                        <span className="font-weight-bold"> Invoice</span>
                                      </Col>
                                      <Col lg={2}>
                                        <span className="font-weight-bold"> Invoice Date</span>
                                      </Col>
                                      <Col lg={2}>
                                        <span className="font-weight-bold">Invoice Amount</span>
                                      </Col>
                                      { this.state.bankCurrency.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                      <Col lg={2}>
                                        <FormGroup className="mb-3">
                                          <div>
                                            <span className="font-weight-bold">Currency Rate</span>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                      }
                                       { this.state.bankCurrency.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                      <Col lg={2}>
                                        <FormGroup className="mb-3">
                                          <div>
                                            <span className="font-weight-bold">Amount</span>
                                          </div>
                                        </FormGroup>
                                      </Col>
  }
                                      <Col lg={1} >
                                        <FormGroup className="font-weight-bold " style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >

                                          <div>
                                            Partially Paid
                                          </div>
                                        </FormGroup>
                                      </Col>

                                      <Col lg={2}>
                                        <FormGroup className="font-weight-bold">
                                          <div>
                                            <span>Explained Amount</span>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  }
                                  {props.values?.invoiceIdList?.map(
                                    (i, invindex) => {
                                      return (
                                        <Row
                                        style={{display:'flex',justifyContent:'space-between'}}
                                        >
                                           <Col lg={1}>
                                            <span>{i.invoiceNumber}</span>
                                          </Col>
                                          <Col lg={2}>
                                            <Input
                                              disabled
                                              id="1"
                                              name="1"
                                              value={moment(i.invoiceDate).format('DD-MM-YYYY')}
                                            />
                                          </Col>
                                          <Col lg={2}>
                                            <Input
                                            style={{textAlign:'right'}}
                                              disabled
                                              id="1"
                                              name="1"
                                              value={` ${props.values.curreancyname} ${i.dueAmount}`}
                                            />
                                          </Col>

                                          { this.state.bankCurrency.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                          <Col lg={2}>
                                          
                                                    <FormGroup className="mb-3">
                                              <div>
                                                <Input
                                                 
                                                  className="form-control"
                                                  id="exchangeamount"
                                                  name="exchangeamount"
                                                  type="number"
                                                  style={{textAlign:'right'}}
                                                  value={
                                                    i.exchangeRate}
                                                  onChange={(value) => {
                                                    let local2 = [...props.values?.invoiceIdList]
                                                    local2[invindex].exchnageRate = value.target.value

                                                    this.setexchnagedamount(local2)
                                                  }}
                                                />
                                              </div>
                                            </FormGroup>
                                          </Col>}

                                          { this.state.bankCurrency.bankAccountCurrencyIsoCode!==props.values.curreancyname &&
                                          <Col lg={2}>
                                            <FormGroup className="mb-3">
                                              <div>
                                                <Input
                                                  className="form-control"
                                                  id="exchangeRate"
                                                  style={{textAlign:'right'}}
                                                  name="exchangeRate"
                                                  disabled
                                                  value={`${this.state.bankCurrency.bankAccountCurrencyIsoCode} ${i.convertedInvoiceAmount?.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `
                                                  }
                                                  onChange={(value) => {

                                                  }}
                                                />
                                              </div>
                                            </FormGroup>
                                          </Col>}
                                          <Col lg={1} >
                                            <FormGroup className="mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                              <div>
                                                <Input
                                                
                                                  disabled={props.values?.transactionAmount -
                                                    props.values?.invoiceIdList?.reduce(
                                                      (accu, curr, index) =>
                                                        accu +
                                                        curr.amount * curr.exchangeRate
                                                      ,
                                                      0
                                                    ) >= 0}
                                                  type="checkbox"

                                                  checked={i.pp !== undefined ? i.pp : false}

                                                  onChange={(e) => {

                                                    this.onppclick(e.target.checked, invindex)
                                                  }}
                                                />
                                              </div>
                                            </FormGroup>
                                          </Col>

                                          <Col lg={2}>
                                            <FormGroup className="mb-3">
                                              <div>
                                                <Input
                                                  className="form-control"
                                                  id="exchangeRate"
                                                  name="exchangeRate"
                                                  disabled
                                                  style={{textAlign:'right'}}
                                                  value={`${this.state.bankCurrency.bankAccountCurrencyIsoCode} ${i.explainedAmount?.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `

                                                  }
                                                  onChange={(value) => {

                                                  }}
                                                />
                                                {i.explainedAmount===0 && <div
                                                style={{color:'red',fontSize:'9px'}}
                                                >Expain Amount Cannot be Zero</div>}
                                              </div>
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                  )}




                                  {props.values?.invoiceIdList?.length > 0 && (
                                    <>
                                      <Row
                                        style={{
                                          display: "flex",
                                          flexDirection:'row-reverse',
                                          justifyContent: "flex-start",
                                       
                                         
                                        }}
                                      >
                                        
                                        
                                        <Col lg={2} 
                                        style={{float:'right'}}
                                        >
                                          <Input
                                            disabled
                                            style={{textAlign:'right'}}
                                            id="total"
                                            name="total"
                                            value={`${this.state.bankCurrency
                                              .bankAccountCurrencyIsoCode
                                            } ${(props.values?.invoiceIdList?.reduce(
                                              (accu, curr, index) =>
                                                accu +
                                                curr.explainedAmount
                                              ,
                                              0
                                            )).toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                              }  `
                                            }
                                          />
                                        </Col>
                                        <Col lg={3}>
                                          <Input
                                          style={{textAlign:'right'}}
                                            disabled
                                            id="total"
                                            name="total"
                                            value={"Total Explained Amount ="}
                                          />
                                        </Col>
                                      </Row>
                                    { (this.setexcessorshortamount().data!== 0
                                    && 
                                    this.state.bankCurrency.bankAccountCurrencyIsoCode!==props.values.curreancyname 
                                    ) && <Row
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                         
                                          marginTop:10
                                        }}
                                      >
                                        
                                         { <Col lg={5}>
                                        <Select
                                     options={[{label:'Currency Gain ',value:79},
                                        {label:'Currency Loss',value:103}    
                                      ]}
                                      isDisabled={true}
                                      value={this.setexcessorshortamount().data<0
                                      ?{label:'Currency Loss',value:103}:{label:'Currency Gain ',value:103}
                                      }
                                        />
                                        </Col>}

                                        <Col lg={3}>
                                          <Input
                                          style={{textAlign:'right'}}
                                            disabled
                                            id="total"
                                            name="total"
                                            value={"Total Excess/Short Amount = "}
                                          />
                                        </Col>
                                        
                                        <Col lg={2}>
                                          <Input
                                          style={{textAlign:'right'}}
                                            disabled
                                            id="total"
                                            name="total"
                                            value={this.setexcessorshortamount().value}
                                          />
                                        </Col>
                                      </Row>}
                                    </>
                                  )}
                                </>
                              )}

                            {props.values.coaCategoryId &&
                              props.values.coaCategoryId.label ===
                              "Supplier Invoice" &&
                              (this.state.invoiceCurrency !=
                                this.state.bankCurrency.bankAccountCurrency ? (
                                <Row>
                                  <Col lg={3}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="currencyCode">
                                        {strings.Currency}
                                      </Label>
                                      <Select
                                        style={customStyles}
                                        id="currencyCode"
                                        name="currencyCode"
                                        options={
                                          currency_convert_list
                                            ? selectCurrencyFactory.renderOptions(
                                              "currencyName",
                                              "currencyCode",
                                              currency_convert_list,
                                              "Currency"
                                            )
                                            : []
                                        }
                                        value={
                                          currency_convert_list &&
                                          selectCurrencyFactory
                                            .renderOptions(
                                              "currencyName",
                                              "currencyCode",
                                              currency_convert_list,
                                              "Currency"
                                            )
                                            .find(
                                              (option) =>
                                                option.value ===
                                                +this.state.invoiceCurrency
                                            )
                                        }
                                        isDisabled={true}
                                        onChange={(option) => {
                                          props.handleChange("currencyCode")(
                                            option
                                          );
                                          this.setExchange(option.value);
                                          this.setCurrency(option.value);
                                        }}
                                      />
                                      {props.errors.currencyCode &&
                                        props.touched.currencyCode && (
                                          <div className="invalid-feedback">
                                            {props.errors.currencyCode}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              ) : (
                                ""
                              ))}
                            {/* {props.values.coaCategoryId &&
																	props.values.coaCategoryId.label ===
																	'Supplier Invoice' && 
																
																(
																		<Row  style={{display: props.values.exchangeRate === 1 ? 'none' : ''}}>
																			<Col lg={2}>
																				<Input
																					disabled
																					id="1"
																					name="1"
																					value={
																						1}

																				/>
																			</Col>
																			<Col lg={2}>
																				<FormGroup className="mb-3">
																				
																					<div>
																						<Input
																							disabled
																							className="form-control"
																							id="curreancyname"
																							name="curreancyname"
																							value={this.state.supplier_currency_des}
																							onChange={(value) => {
																								props.handleChange('curreancyname')(
																									value,
																								);
																							}}
																						/>
																					</div>
																				</FormGroup>
																			</Col>
																			<FormGroup className="mt-2"><label><b>=</b></label>	</FormGroup>
																			<Col lg={2}>
																				<FormGroup className="mb-3">
																				
																					<div>
																						<Input
																							className="form-control"
																							id="exchangeRate"
																							name="exchangeRate"

																							value={props.values.exchangeRate}
																							onChange={(value) => {
																								props.handleChange('exchangeRate')(
																									value,
																								);
																							}}
																						/>
																					</div>
																				</FormGroup>
																			</Col>

																			<Col lg={2}>
																				<Input
																					disabled
																					id="currencyName"
																					name="currencyName"
																					value={
																						this.state.basecurrency}

																				/>
																			</Col>
																		</Row>
																	)}  */}
                            {/* {props.values.coaCategoryId &&
															(props.values.coaCategoryId.label ==='Expense'||
															props.values.coaCategoryId.label ==='Sales'  ||
															props.values.coaCategoryId.label ==='Supplier Invoice')&& (
																	<Row>
																		<Col lg={3}>
																				<FormGroup className="mb-3">
																					<Label htmlFor="currencyCode"><span className="text-danger">* </span>
																						Currency
																					</Label>
																					<Select	
																					style={customStyles}
																						id="currencyCode"
																						name="currencyCode"
																						options={
																							currency_convert_list
																								? selectCurrencyFactory.renderOptions(
																										'currencyName',
																										'currencyCode',
																										currency_convert_list,
																										'Currency',
																								  )
																								: []
																						}
																						isDisabled={true}
																						value={
																							currency_convert_list &&
																							   selectCurrencyFactory
																							   .renderOptions(
																									   'currencyName',
																										'currencyCode',
																									   currency_convert_list,
																										'Currency',
																								   )
																									.find(
																									   (option) =>
																											option.value ===
																										+props.values.currencyCode,
																								)
																							}
																						onChange={(option) => {
																							props.handleChange('currencyCode')(option);
																							this.setExchange(option.value);
																							this.setCurrency(option.value)
																						   }}
																						className={
																							props.errors.currencyCode &&
																							props.touched.currencyCode
																								? 'is-invalid'
																								: ''
																						}
																					/>
																					{props.errors.currencyCode &&
																						props.touched.currencyCode && (
																							<div className="invalid-feedback">
																								{props.errors.currencyCode}
																							</div>
																						)}
																				</FormGroup>
																			</Col>
																	</Row>
																	)} */}

                            {/* {props.values.coaCategoryId &&
															props.values.coaCategoryId.label ===
																'Expense' && (
																	<Row  style={{display: props.values.exchangeRate === 1 ? 'none' : ''}} >
																	<Col lg={1}>
																<Input
																		disabled
																				id="1"
																				name="1"
																				value=	{
																					1 }
																				
																			/>
																</Col>
																<Col lg={1}>
																<FormGroup className="mb-3">
																
																	<div>
																		<Input
																		disabled	
																			className="form-control"
																			id="curreancyname"
																			name="curreancyname"
																			
																			value={props.values.curreancyname}
																			onChange={(value) => {
																				props.handleChange('curreancyname')(
																					value,
																				);
																			}}
																		/>
																	</div>
																</FormGroup>
															</Col>
															<FormGroup className="mt-2"><label><b>=</b></label>	</FormGroup>
															<Col lg={1}>
																<FormGroup className="mb-3">
																
																	<div>
																		<Input
																			className="form-control"
																			id="exchangeRate"
																			name="exchangeRate"
																			
																			value={props.values.exchangeRate}
																			onChange={(value) => {
																				props.handleChange('exchangeRate')(
																					value,
																				);
																			}}
																		/>
																	</div>
																</FormGroup>
															</Col>
														
															<Col lg={1}>
															<Input
																		disabled
																				id="currencyName"
																				name="currencyName"
																				value=	{
																					this.state.basecurrency.currencyName }
																				
																			/>
														</Col>
														</Row>
																)} */}

                            <Row>
                              <Col lg={8}>
                                <FormGroup className="mb-3">
                                  <Label htmlFor="description">
                                    {strings.Description}
                                  </Label>
                                  <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    rows="6"
                                    placeholder={strings.Description}
                                    onChange={(option) => {
                                      if (!option.target.value.includes("="))
                                        props.handleChange("description")(
                                          option
                                        );
                                    }}
                                    value={props.values.description}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={8}>
                                <Row>
                                  <Col lg={6}>
                                    <FormGroup className="mb-3">
                                      <Label htmlFor="reference">
                                        {strings.ReferenceNumber}
                                      </Label>
                                      <Input
                                        type="text"
                                        maxLength="20"
                                        id="reference"
                                        name="reference"
                                        placeholder={strings.ReceiptNumber}
                                        onChange={(option) => {
                                          if (
                                            option.target.value === "" ||
                                            this.regExBoth.test(
                                              option.target.value
                                            )
                                          ) {
                                            props.handleChange("reference")(
                                              option
                                            );
                                          }
                                        }}
                                        value={props.values.reference}
                                      />
                                       {props.errors.reference &&
                                        props.touched.reference && (
                                          <div className="invalid-file" style={{color:"red"}}>
                                            {props.errors.reference}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={12}>
                                    <FormGroup className="mb-3 hideAttachment">
                                      <Field
                                        name="attachment"
                                        render={({ field, form }) => (
                                          <div>
                                            <Label>{strings.Attachment}</Label>{" "}
                                            <br />
                                            <Button
                                              color="primary"
                                              onClick={() => {
                                                document
                                                  .getElementById("fileInput")
                                                  .click();
                                              }}
                                              className="btn-square mr-3"
                                            >
                                              <i className="fa fa-upload"></i>{" "}
                                              {strings.upload}
                                            </Button>
                                            <input
                                              id="fileInput"
                                              ref={(ref) => {
                                                this.uploadFile = ref;
                                              }}
                                              type="file"
                                              style={{ display: "none" }}
                                              onChange={(e) => {
                                                this.handleFileChange(e, props);
                                              }}
                                            />
                                            {this.state.fileName && (
                                              <div>
                                                <i
                                                  className="fa fa-close"
                                                  onClick={() =>
                                                    this.setState({
                                                      fileName: "",
                                                    })
                                                  }
                                                ></i>{" "}
                                                {this.state.fileName}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      />
                                      {props.errors.attachment &&
                                        props.touched.attachment && (
                                          <div className="invalid-file">
                                            {props.errors.attachment}
                                          </div>
                                        )}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} className="mt-5">
                                <FormGroup className="text-right">
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn-square mr-3"
                                    disabled={this.state.disabled}
                                    onClick={() => {
                                      //	added validation popup	msg
                                      console.log(props.errors,"EERRROR");
                                      props.handleBlur();
                                      if (
                                        props.errors &&
                                        Object.keys(props.errors).length != 0
                                      )
                                        this.props.commonActions.fillManDatoryDetails();
                                      this.setState(
                                        { createMore: false },
                                        () => {
                                          props.handleSubmit();
                                        }
                                      );
                                    }}
                                  >
                                    <i className="fa fa-dot-circle-o"></i>{" "}
                                    {this.state.disabled
                                      ? "Creating..."
                                      : strings.Create}
                                  </Button>
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="btn-square mr-3"
                                    disabled={this.state.disabled}
                                    onClick={() => {
                                      //	added validation popup	msg
                                      props.handleBlur();
                                      if (
                                        props.errors &&
                                        Object.keys(props.errors).length != 0
                                      )
                                        this.props.commonActions.fillManDatoryDetails();
                                      this.setState(
                                        { createMore: true },
                                        () => {
                                          props.handleSubmit();
                                        }
                                      );
                                    }}
                                  >
                                    <i className="fa fa-repeat"></i>{" "}
                                    {this.state.disabled
                                      ? "Creating..."
                                      : strings.CreateandMore}
                                  </Button>
                                  <Button
                                    color="secondary"
                                    className="btn-square"
                                    onClick={() => {
                                      this.props.history.push(
                                        "/admin/banking/bank-account/transaction",
                                        { bankAccountId: id }
                                      );
                                    }}
                                  >
                                    <i className="fa fa-ban"></i>{" "}
                                    {strings.Cancel}
                                  </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      </Formik>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        {this.state.disableLeavePage ? "" : <LeavePage />}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBankTransaction);
