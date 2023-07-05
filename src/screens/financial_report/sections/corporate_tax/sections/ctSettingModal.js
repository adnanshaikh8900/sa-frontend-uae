import React from "react";
import { connect } from "react-redux";
import {
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    CardBody,
    ModalHeader,
} from "reactstrap";
import { Formik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import moment from "moment";
import { bindActionCreators } from "redux";
import { CommonActions } from "services/global";
import { toast } from "react-toastify";
import { data } from "../../../../Language/index";
import LocalizedStrings from "react-localization";
import "../style.scss";
import { Loader, CommonList } from "components";
import * as PayrollEmployeeActions from "../../../../payrollemp/actions";
import * as CTReportActions from "../actions";


const mapStateToProps = (state) => {
    return {
        contact_list: state.request_for_quotation.contact_list,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        commonActions: bindActionCreators(CommonActions, dispatch),
        payrollEmployeeActions: bindActionCreators(
            PayrollEmployeeActions,
            dispatch
        ),
        ctReportActions: bindActionCreators(CTReportActions, dispatch),
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
class CTSettingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: window["localStorage"].getItem("language"),
            loading: false,
            selectedRows: [],
            actionButtons: {},
            IsEligibleForCP: 'false',
            fiscalYear: '',
            dialog: null,
            view: false,
        };
        
		this.formikRef = React.createRef();
    }

	handleSubmit = (data, resetForm, setSubmitting) => {
		let formdata = new FormData()
		formdata.append("IsEligibleForCP", data.IsEligibleForCP)
		formdata.append("fiscalYear", data.fiscalYear)
		this.props.CTSettingModal
			.saveCTSettings(formdata)
			.then((res) => {
				if (res.status === 200) {
					this.props.commonActions.tostifyAlert(
						'success',
						'Corporate Tax Settings Saved Successfully',
					);
					// this.props.closeModal(false);				
				}
			})
			.catch((err) => {
				this.props.commonActions.tostifyAlert(
					'error',
					err && err.data ? err.data.message : 'Something Went Wrong',
				);
			});
	};

    displayMsg = (err) => {
		toast.error(`${err.data.message}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};

    render() {
        strings.setLanguage(this.state.language);
        const { openModal, closeModal, fiscalYearOptions} = this.props;
        const { initValue, loading } = this.state;
        fiscalYearOptions && fiscalYearOptions.length > 1 && !this.state.startDate && this.setDates(this.state.ctReprtFor ? this.state.ctReprtFor.value : fiscalYearOptions[0].value)
        fiscalYearOptions && fiscalYearOptions.length > 1 && !this.state.ctReprtFor && this.setState({ctReprtFor : fiscalYearOptions[0]})
        return (
            <div className="contact-modal-screen">
                <Modal isOpen={openModal} className="modal-success contact-modal">
                    <ModalHeader>
                        <Row>
                            <Col lg={12}>
                                <div className="h4 mb-0 d-flex align-items-center">
                                    <span className="ml-2">
                                        {strings.CorporateTaxSetting}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <Formik
                        ref={this.formikRef}
                        initialValues={initValue}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            this.handleSubmit(values, resetForm);
                        }}
                        validate={(values) => {
                            let errors = {};
                            return errors;
                        }}
                        validationSchema={Yup.object().shape({
                            fiscalYear: Yup.string().required(
                                'This field is required',
                            ),
                        })}
                    >
                    </Formik>
                    <ModalBody style={{ padding: "15px 0px 0px 0px" }}>
                        <div style={{ padding: " 0px 1px" }}>
                            <div>
                                <CardBody>
                                    {loading ? (
                                        <Row>
                                            <Col lg={12}>
                                                <Loader />
                                            </Col>
                                        </Row>
                                    ) : (
                                        <>
                                            {" "}
                                            <Formik initialValues={initValue}>
                                                {(props) => (
                                                    <Form>
                                                        <Label>
                                                            Does your company have to pay corporate taxes ?
														</Label>
                                                                <div className="wrapper">
                                                                    <Row>
                                                                        <Col>
																			<Label
																				className="form-check-label"
																				check
																				htmlFor="isEligibleForCPYes"
																			>
																				<Input
																					className="form-check-input"
																					type="radio"
																					id="isEligibleForCPYes"
																					name="isEligibleForCPYes"
																					value="True"
																					onChange={(value) => {
																						props.handleChange('isEligibleForCP')(
																							value,
																						);
																					}}
																					checked={props.values.productType === 'true'}
																				/>
																				{strings.Yes}
																			</Label>
                                                                        </Col>
                                                                        <Col>
																			<Label
																				className="form-check-label"
																				check
																				htmlFor="isEligibleForCPNo"
																			>
																				<Input
																					className="form-check-input"
																					type="radio"
																					id="isEligibleForCPNo"
																					name="isEligibleForCPNo"
																					value="False"
																					onChange={(value) => {
																						props.handleChange('isEligibleForCP')(
																							value,
																						);
																					}}
																					checked={props.values.productType ==='false'}
																				/>
																				{strings.No}
																			</Label>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                <div>
                                                                    <Col lg={4}>
                                                                        <Label>
                                                                            <span className="text-danger">* </span>
                                                                            Fiscal Year
                                                                        </Label>
                                                                        <Select
                                                                            options={fiscalYearOptions}
                                                                            id="ctReportFor"
                                                                            name="ctReoprtFor"
                                                                            value={this.state.fiscalYear}
                                                                            onChange={(option) => {
                                                                                const year = option.label.split('-')[1]
                                                                                this.setState({ reportingForYear: year, fiscalYear: option }, () => {
                                                                                    this.setDates(option.value);
                                                                                });
                                                                            }}
                                                                        />
                                                                    </Col>
																</div>
                                                    </Form>
                                                )}
                                            </Formik>{" "}
                                        </>
                                    )}
                                </CardBody>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Row className="mb-4 ">
                            <Col>
                                <Button
                                    color="primary"
                                    className="btn-square "
                                    title={this.state.monthlyDate ? "" : "Please Select Month"}
                                    onClick={this.saveCTSettings}
                                >
                                    <i class="fas fa-check-double mr-1"></i>
                                    {strings.Save}
                                </Button>
                                <Button
                                    color="secondary"
                                    className="btn-square"
                                    onClick={() => {
                                        closeModal(false);
                                    }}
                                >
                                    <i className="fa fa-ban"></i> {strings.Cancel}
                                </Button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CTSettingModal);