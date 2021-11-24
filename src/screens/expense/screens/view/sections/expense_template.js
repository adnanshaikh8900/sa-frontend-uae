import React, { Component } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import moment from 'moment';
import '../style.scss';
import logo from 'assets/images/brand/logo.png';
import { Currency } from 'components';
import {data}  from '../../../../Language/index'
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings(data);
class ExpenseTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {language: window['localStorage'].getItem('language'),};
	}

	getRibbonColor = (expenseData) => {
		if (expenseData.expenseStatus == 'Draft') {
			return 'pending-color';
		} else if (expenseData.expenseStatus == 'Posted') {
			return 'saved-color';
		} else {
			return 'saved-color';
		}
	};

	render() {
		strings.setLanguage(this.state.language);
		const { expenseData,companyData} = this.props;
		return (
			<div>
				<Card id="singlePage" className="box">
					{/* <div
						className={`ribbon ribbon-top-left ${this.getRibbonColor(
							expenseData,
						)}`}
					>
						<span>{expenseData.expenseStatus}</span>
					</div> */}
					<CardBody style={{ marginTop: '2.5rem' }}>
						<div
							style={{
								width: '100%',
								border:'1px solid',
								padding:'7px',borderColor:'#c8ced3'
							}}
						>
							
							<div style={{ justifyContent:'center' ,
													textAlign: '-webkit-center'}}>
						
											<td
												style={{
													
													fontSize: '1.2rem',
													// fontWeight: '700',
													textTransform: 'uppercase',
													color: 'black',
													textAlign:'center'
												}}
											>
												<b>{strings.Expense}</b>
											</td>						
									</div>
									<div style={{ textAlign:'center'}}>
								
								<div className="companyDetails">
									<img
									src={
										companyData &&
										companyData.companyLogoByteArray
											? 'data:image/jpg;base64,' +
											  companyData.companyLogoByteArray
											: logo
									}
										className=""
										alt=""
										style={{ width: ' 100px' }}
									/>
								
							</div>
												</div>
									<div style={{textAlign:'center'}}><h4> {expenseData.payee} </h4></div>
									<div style={{textAlign:'center'}}><b>{strings.ExpenseDate}</b> : {moment(expenseData.expenseDate ).format('DD/MM/YYYY')}</div>
					</div>
<div style={{backgroundColor:'rgb(32 100 216)', height:'45px'}}></div>
					<div className="card text-start border"
						style={{
							width: '100%',
							display: 'flex',
							border:'1px solid',				
							borderColor:'#c8ced3'
						}}>

<Table  striped>
<tbody  >
<tr>      <td className="ml-3" style={{width:'245px'}}>	<b>{strings.Expense+" "+strings.Number}</b> :</td> 
	           <td> {expenseData.expenseNumber ?expenseData.expenseNumber :"-" }</td>
	</tr>
    <tr>      <td className="ml-3" style={{width:'245px'}}>	<b>{strings.PaidBy}</b> :</td> 
	           <td> {expenseData.payee}</td>
	</tr>

	<tr>      <td className="ml-3" style={{width:'245px'}} >	<b>{strings.ExpenseCategory}</b> :</td>
	           <td> {expenseData.transactionCategoryName}</td>
	</tr>

	<tr>      <td className="ml-3" style={{width:'245px'}}>  <b>{strings.ExpenseAmount }</b> :	</td> 
	           <td>{expenseData.expenseAmount}</td>
    </tr>

	{/* <tr>      <td className="ml-3" style={{width:'245px'}}>  <b>Expense No</b> : </td>  
			  <td>{expenseData.expenseId}</td>
	</tr> */}

	<tr>      <td className="ml-3" style={{width:'245px'}}>	<b>{strings.Vat+" "+strings.Type }</b> : </td>  
	          <td>{expenseData.vatCategoryName} </td>
	</tr>
	
	<tr>      <td className="ml-3" style={{width:'245px'}}>	<b>{strings.ReceiptNumber }</b> : </td>  
	          <td>{expenseData.receiptNumber} </td>
	</tr>
	
	
	<tr>      <td className="ml-3" style={{width:'245px'}}>	<b>{strings.Expense+" "+strings.Description }</b> : </td>  
	          <td>{expenseData.expenseDescription} </td>
	</tr>

	<tr>      <td className="ml-3" style={{width:'245px'}}>	<b>{strings.Receipt+" "+strings.Description }</b> : </td>  
	          <td>{expenseData.receiptAttachmentDescription} </td>
	</tr>
	<tr>      <td className="ml-3" style={{width:'245px'}}> <b>{strings.PostedDate }</b> : </td>
<td>
{expenseData.expenseStatus === "Posted" ?   
	moment(expenseData.lastUpdateDate).format('DD/MM/YYYY')
	:""}</td>
</tr>
</tbody>
</Table>
                                  
									{/* <div>
									<b>Last Updated By</b> : {expenseData.lastUpdatedBy}
									</div> */}
									
					</div>											
					</CardBody>
					<div style={{ textAlignLast:'center'}}>{strings.PoweredBy+" " } <b>SimpleAccounts</b></div> 
				</Card>
			</div>
		);
	}
}

export default ExpenseTemplate;
