import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as FinancialReportActions from '../actions';
import { DataGrid } from '@mui/x-data-grid';
import './style.scss';
import { data } from 'screens/Language'
import LocalizedStrings from 'react-localization';
import { ReportsColumnList } from 'utils';


const mapStateToProps = (state) => {
    return {
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        financialReportActions: bindActionCreators(FinancialReportActions, dispatch,),
    };
};
let strings = new LocalizedStrings(data);
class ReportTables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: window['localStorage'].getItem('language'),
            loading: true,
            columnConfigs: [],
        };

    }

    componentDidMount = () => {
        this.getColumnConfigs();
    };

    getColumnConfigs = () => {
        const { id } = this.props;
        const postData = {
            id: id
        };
        this.props.financialReportActions.getColumnConfigs(postData).then((res) => {
            if (res.status === 200) {
                this.setState({
                    columnConfigs: res.data,
                    loading: false,
                });
            }
        }).catch((err) => {
            this.setState({ loading: false });
        });
    };

    updateColumnConfigs = (json) => {
        const { id, reportName } = this.props;
        const postData = {
            id: id,
            reportName: reportName,
            columnNames: json
        };
        this.props.financialReportActions.updateColumnConfigs(postData).then((res) => {
            if (res.status === 200) {
                this.setState({
                    columnConfigs: res.data,
                    loading: false,
                });
                this.getColumnConfigs()
            }
        }).catch((err) => {
            this.setState({ loading: false });
        });
    };

    render() {
        strings.setLanguage(this.state.language);
        const { columnConfigs } = this.state;
        const { reportDataList, reportName ,rowHeight} = this.props;

        return (
            <div id="tbl_exporttable_to_xls" className="table-wrapper">
                {reportDataList &&
                    <DataGrid
                        rows={reportDataList}
                        columns={ReportsColumnList.List[reportName]}
                        // autoHeight
                        getRowHeight={() => {
                            return rowHeight;
                        }}
                        pageSize={5}
                        rowSelection={false}
                        hideFooterPagination={true}
                        columnVisibilityModel={columnConfigs}
                        onColumnVisibilityModelChange={(newModel) => {
                            debugger
                            const str = JSON.stringify(newModel)
                            console.log(str);
                            this.updateColumnConfigs(str);
                            this.setState({ columnConfigs: newModel })
                        }}
                    />
                }

            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReportTables);
