import React from 'react';
import {
	Button,
	Row,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	CardHeader,
	ModalBody,
	ModalFooter,
	ButtonGroup,
} from 'reactstrap';

import DatePicker from 'react-datepicker'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { selectCurrencyFactory, selectOptionsFactory } from 'utils'
import { SalaryComponentScreen } from '../../salary_component/sections';

import Select from 'react-select'
import { toast } from 'react-toastify';

import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { data } from '../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
class SalaryComponentFixed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			showDetails: false,
			loading: false,
			initValue: {
				employeeId: '',
				salaryStructure: 1,
				type: '',
				flatAmount: '',
				email: '',
				dob: new Date(),
				description: '',
				formula: '',
				// data: [
				// 	{
				// 		salaryStructure: 1,
				// 		type: '',
				// 		flatAmount: '',
				// 	},
				// ],
			},
			selectDisable: true,
			addNewDisabled: false,
			state_list: [],
			selectedData: {},
		};
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z][a-zA-Z ]*$/;
		this.regExAddress = /^[a-zA-Z0-9\s,'-]+$/;
		this.regDec1 = /^\d{1,2}\.\d{1,2}$|^\d{1,2}$/;
		this.type = [
			{ label: 'Flat Amount', value: 1 },
			{ label: '% of CTC', value: 2 }
		];
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.selectedData !== nextProps.selectedData) {

			return {
				selectedData: nextProps.selectedData,
			};
		}
	}
	getData = (data) => {
		let temp = {};
		for (let item in data) {
			if (typeof data[`${item}`] !== 'object') {
				temp[`${item}`] = data[`${item}`];
			} else {
				temp[`${item}`] = data[`${item}`].value;
			}
		}
		return temp;
	};


	handleSubmit = (data, resetForm) => {
		this.setState({ disabled: true });
		const {
			id,
			salaryStructure,
			description,
			formula,
			flatAmount
		} = data;


		const formData = new FormData();
		formData.append('id', id != null ? id.value : '');
		formData.append('employeeId', this.state.selectedData.id)


		formData.append(
			'salaryStructure', 1
		)
		formData.append(
			'description',
			description != null ? description : '',
		)
		formData.append(
			'formula',
			formula != null ? formula : '',
		)
		formData.append(
			'flatAmount',
			flatAmount != null ? flatAmount : '',
		)
		// formData.append('salaryComponentString', JSON.stringify(
		// 	this.state.data
		// ));

		this.props
			.CreateComponent(formData)
			.then((res) => {
				if (res.status === 200) {
					resetForm();
					this.props.closeSalaryComponentFixed(true);
				}
			})
			.catch((err) => {
				this.displayMsg(err);
				this.formikRef.current.setSubmitting(false);
			});
	}



	displayMsg = (err) => {
		toast.error(`${err.data}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};
	_showDetails = (bool) => {
		this.setState({
			showDetails: bool,
		});
		if (bool === true) {
			this.setState({
				addNewDisabled: true,
				selectDisable: false
			});
		}
		else {
			this.setState({
				addNewDisabled: false,
				selectDisable: true
			});
		}
	}


	render() {
		strings.setLanguage(this.state.language);
		const {
			openSalaryComponentFixed,
			closeSalaryComponentFixed,
			salary_structure_dropdown,
			salary_component_dropdown,
		} = this.props;
		const { initValue } = this.state;
		return (
			<div className="contact-modal-screen">
				<Modal
					isOpen={openSalaryComponentFixed}
					className="modal-success contact-modal"
				>
					<SalaryComponentScreen
						getCurrentProductData={(Data) => {
							this.props.getCurrentProduct(Data);
						}}
						closeModal={(e) => {
							closeSalaryComponentFixed(false);
						}}
						isCreated={true}
						ComponentType={'Earning'}
						salaryStructureModalCard={true}
					/>
				</Modal>
			</div>
		);
	}
}

export default SalaryComponentFixed;
