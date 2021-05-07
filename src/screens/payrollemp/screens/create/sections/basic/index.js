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

class Basic extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            basicComponnents: true,
			loading: true,
			dropdownOpen: false,
			view: false,
			initValue: {
				startDate: moment().startOf('month').format('DD/MM/YYYY'),
				endDate: moment().endOf('month').format('DD/MM/YYYY'),
				reportBasis: 'ACCRUAL',
				chartOfAccountId: '',
			},
			csvData: [],
			activePage: 0,
			sizePerPage: 10,
			totalCount: 0,
			sort: {
				column: null,
				direction: 'desc',
			},
			data: {
				totalCurrentAssets: 24136.36,
				totalFixedAssets: 0,
				totalAssets: 24136.36,
				totalOtherCurrentAssets: 386.36,
				totalBank: 3750,
				totalOtherLiability: 0,
				totalAccountReceivable: 20000,
				totalAccountPayable: 22250,
				totalOtherCurrentLiability: 7750,
				totalLiability: 30000,
				totalEquities: 0,
				totalLiabilityEquities: 30000,
				stocks: 0,
				currentAssets: {},
				otherCurrentAssets: {
					'Input VAT': 386.36,
				},
				bank: {
					'Axis Bank-Afzal Khan': 3750,
				},
				fixedAssets: {},
				otherLiability: {},
				otherCurrentLiability: {
					'Employee Reimbursements': 7750,
				},
				equities: {},
			},
		};
		this.columnHeader = [
			{ label: 'Account', value: 'Account', sort: true },
			{ label: 'Account Code', value: 'Account Code', sort: false },
			{ label: 'Total', value: 'Total', sort: false },
		];
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
  
   renderBasicComponnents = (data) =>{
        return this.props.basicProps(data)
    }



	render() {
		const { loading, initValue, dropdownOpen, csvData, view } = this.state;
		const { profile, universal_currency_list,company_profile } = this.props;

        console.log(this.props.basicProps.data)
		return (
			<div className="transactions-report-screen">
				<div className="animated fadeIn">
					<Card>
						<div>
							<CardHeader>
							
							</CardHeader>
						
							<CardBody id="section-to-print">
                            <Button
                onClick={() => {
                //   this.setState({ activeKey: "1" });
                     this.renderBasicComponnents()
            }}
              >
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

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
