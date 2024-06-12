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
            sortedRows: [],
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

    customSort = (rows, sortModel) => {
        if (sortModel.length === 0) {
            return rows;
        }

        const sortedRows = [...rows];
        const { field, sort } = sortModel[0];

        const totalRow = sortedRows.find(row => row.isTotalRow);
        const otherRows = sortedRows.filter(row => !row.isTotalRow);

        otherRows.sort((a, b) => {
            if (a[field] < b[field]) {
                return sort === 'asc' ? -1 : 1;
            }
            if (a[field] > b[field]) {
                return sort === 'asc' ? 1 : -1;
            }
            return 0;
        });

        if (totalRow) {
            otherRows.push(totalRow);
        }
        return otherRows;
    };

    handleSortModelChange = (model) => {
        const sortedRows = this.customSort(this.props.reportDataList, model);
        this.setState({ sortedRows });
    };

    render() {
        strings.setLanguage(this.state.language);
        const { columnConfigs, sortedRows } = this.state;
        const { reportDataList, reportName, rowHeight } = this.props;

        return (
            <div id="tbl_exporttable_to_xls" className="table-wrapper">
                {reportDataList &&
                    <DataGrid
                        rows={sortedRows.length ? sortedRows : reportDataList}
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
                        getRowClassName={(params) =>
                            params.row.isTotalRow ? 'total-row' : ''
                        }
                        sortingOrder={['asc', 'desc']}
                        sortingMode="server"
                        onSortModelChange={this.handleSortModelChange}
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
