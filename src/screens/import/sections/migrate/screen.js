import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
	UncontrolledTooltip,
} from 'reactstrap';
import Select from 'react-select';

import { Formik } from 'formik';
import * as Yup from 'yup';

import './style.scss';
import { data } from '../../../Language/index'
import LocalizedStrings from 'react-localization';

import * as ProductActions from '../../actions';
import * as SupplierInvoiceActions from '../../../supplier_invoice/actions';
import { CommonActions } from 'services/global';

import { WareHouseModal } from '../../sections';
import { selectOptionsFactory } from 'utils';

const mapStateToProps = (state) => {
	return {
		vat_list: state.product.vat_list,
		product_warehouse_list: state.product.product_warehouse_list,
		product_category_list: state.product.product_category_list,
		supplier_list: state.supplier_invoice.supplier_list,
		inventory_account_list: state.product.inventory_account_list,

	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		productActions: bindActionCreators(ProductActions, dispatch),
		commonActions: bindActionCreators(CommonActions, dispatch),
		supplierInvoiceActions: bindActionCreators(
			SupplierInvoiceActions,
			dispatch,
		),
	};
};
const customStyles = {
	control: (base, state) => ({
		...base,
		borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		boxShadow: state.isFocused ? null : null,
		'&:hover': {
			borderColor: state.isFocused ? '#2064d8' : '#c7c7c7',
		},
	}),
};

let strings = new LocalizedStrings(data);
class MigarteHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			loading: true,
			createMore: false,
			exist: false,
			ProductExist: false,
			disabled: false,
			productActive: true,
			isActive: true,
			selectedStatus: true,
		};
		this.formRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[ +a-zA-Z0-9-./\\|]+$/;
		this.regExAlpha = /^[0-9!@#$&()-\\`.+,/\"]+$/;
		this.regDecimal = /^[0-9][0-9]*[.]?[0-9]{0,2}$$/;
		this.regDecimal5 = /^\d{1,5}$/;
	}

	componentDidMount = () => {

	};
	initializeData = () => {

	};

	render() {
		strings.setLanguage(this.state.language);
		const { vat_list, product_category_list, supplier_list, inventory_account_list } = this.props;
		const { initValue, purchaseCategory, salesCategory, inventoryAccount } = this.state;

		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>	Migarte </CardHeader>
						<CardBody>..content..

							<Row>
								<Col lg={12} className="mt-5">
									<div className="table-wrapper">
										<FormGroup className="text-center">
											<Button color="secondary" className="btn-square pull-left"
												onClick={() => { this.toggle(0, '1') }}>
												<i className="far fa-arrow-alt-circle-left"></i> RollBack Migration
											</Button>

											<Button name="button" color="primary" className="btn-square pull-right mr-3"
												onClick={() => {
													this.props.history.push('/admin/settings/migrateHistory');
												}}>
												Finish Migration	<i class="far fa-arrow-alt-circle-right mr-1"></i>
											</Button>
										</FormGroup>
									</div>
								</Col>
							</Row>


						</CardBody>
					</Card>

				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MigarteHistory);
