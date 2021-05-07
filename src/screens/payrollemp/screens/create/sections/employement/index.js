import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	Table,
	Button,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';

import { DateRangePicker2 } from 'components';
import moment from 'moment';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-select/dist/react-select.css'
import './style.scss';
import { PDFExport } from '@progress/kendo-react-pdf';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { Loader, Currency } from 'components';
import * as FinancialReportActions from '../../actions';
import logo from 'assets/images/brand/logo.png';
import { CommonActions } from 'services/global';
import { CenterFocusStrong } from '@material-ui/icons';

const mapStateToProps = (state) => {
	return {
	
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		financialReportActions: bindActionCreators(
			FinancialReportActions,
			dispatch,
		),
		commonActions: bindActionCreators(CommonActions, dispatch),
	};
};

class Employement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			dropdownOpen: false,
			view: false,
			initValue: {
			
			},
			csvData: [],
			activePage: 1,
			
		
		};
	
	}

	generateReport = (value) => {
		this.setState(
			{
				initValue: {
					endDate: moment(value.endDate).format('DD/MM/YYYY'),
				},
				loading: true,
				view: !this.state.view,
			},
			() => {
				this.initializeData();
			},
		);
	};

	componentDidMount = () => {
		this.initializeData();
		this.props.commonActions.getCompany() 
	};

	initializeData = () => {
		const { initValue } = this.state;
		const postData = {
			startDate: initValue.startDate,
			endDate: initValue.endDate,
		};
	
	};
	
	exportFile = (csvData, fileName, type) => {
		const fileType =
			type === 'xls'
				? 'application/vnd.ms-excel'
				: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = `.${type}`;
		const ws = XLSX.utils.json_to_sheet(csvData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: type, type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	toggle = () =>
		this.setState((prevState) => {
			return { dropdownOpen: !prevState.dropdownOpen };
		});

	viewFilter = () =>
		this.setState((prevState) => {
			return { view: !prevState.view };
		});

	exportPDFWithComponent = () => {
		this.pdfExportComponent.save();
	};

	render() {
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list,company_profile } = this.props;
		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
					<Card>
						<div>
							<CardHeader>
								
							</CardHeader>
						
							<CardBody >
                            <Button color="secondary" className="btn-square"
                                    onClick={() => { this.props.history.push('/admin/payroll/employee') }}>
                                    <i className="fa fa-ban"></i> Cancel
                                      </Button>
							</CardBody>
						</div>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Employement);
