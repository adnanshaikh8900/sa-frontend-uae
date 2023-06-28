const reportPeriod = [
    { label: "Montly", value: 0 },
    { label: "Yearly", value: 1 },
    { label: "Quarterly", value: 2 },
];
const termList = [
    { label: "Net 7 Days", value: "NET_7" },
    { label: "Net 10 Days", value: "NET_10" },
    { label: "Net 30 Days", value: "NET_30" },
    { label: 'Net 45 Days', value: 'NET_45' },
    { label: 'Net 60 Days', value: 'NET_60' },
    { label: "Due on Receipt", value: "DUE_ON_RECEIPT" },
];

export const CommonList = {
    termList: termList,
    reportPeriod: reportPeriod,
}