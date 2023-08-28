export const updateAmount = (data, vat_list,taxType) => {
    let total_net = 0;
    let total_excise = 0;
    let total = 0;
    let total_vat = 0;
    let discount = 0;

    const totalnetamount = (a) => {
        total_net = total_net + a
    }
    const totalexcise = (a) => {
        total_excise = total_excise + a
    }
    const totalvalt = (a) => {
        total_vat = total_vat + a
    }
    const totalamount = (a) => {
        total = total + a
    }
    const discountamount = (a) => {
        discount = discount + a
    }
    data.map((obj) => {
        let unitprice = parseFloat(obj.unitPrice);
        var net_value = 0;
        const index =
            obj.vatCategoryId !== ''
                ? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
                : '';

        const vat = index !== null && index > -1 && vat_list[`${index}`] ? vat_list[`${index}`]?.vat : 0;

        if (!taxType) {
            if (obj.discountType === 'PERCENTAGE')
                net_value = ((+unitprice - (+((unitprice * parseFloat(obj.discount))) / 100)) * parseInt(obj.quantity));
            else
                net_value = ((unitprice * parseInt(obj.quantity)) - parseFloat(obj.discount))

            const discount = (parseFloat(unitprice) * parseInt(obj.quantity)) - net_value;

            const excisevalue = obj.exciseTaxId === 1 ? +(net_value) / 2 : obj.exciseTaxId === 2 ? net_value : 0
            net_value = parseFloat(net_value) + parseFloat(excisevalue);
            const vat_amount = vat === 0 ? 0 : ((+net_value * vat) / 100);

            totalnetamount(net_value - excisevalue)
            totalexcise(excisevalue)
            totalvalt(vat_amount)
            totalamount(vat_amount + net_value)
            discountamount(discount)
            obj.subTotal = net_value ? parseFloat(net_value) + parseFloat(vat_amount) : 0;
            obj.vatAmount = vat_amount
            obj.exciseAmount = excisevalue
        } else {
            if (obj.discountType === 'PERCENTAGE')
                net_value = ((+unitprice - (+((unitprice * parseFloat(obj.discount))) / 100)) * parseInt(obj.quantity));
            else
                net_value = ((unitprice * parseInt(obj.quantity)) - parseFloat(obj.discount))

            const discount = (parseFloat(unitprice) * parseInt(obj.quantity)) - net_value;
            //vat amount
            const vat_amount =
                (vat === 0 ? 0 :
                    ((+net_value * (vat / (100 + vat) * 100)) / 100));

            //net value after removing vat for inclusive
            net_value = net_value - vat_amount
            const excisevalue = obj.exciseTaxId === 1 ? +(net_value) / 3 : obj.exciseTaxId === 2 ? net_value / 2 : 0

            totalnetamount(net_value - excisevalue)
            totalexcise(excisevalue)
            totalvalt(vat_amount)
            totalamount(vat_amount + net_value)
            discountamount(discount)
            obj.subTotal = net_value ? parseFloat(net_value) + parseFloat(vat_amount) : 0;
            obj.vatAmount = vat_amount
            obj.exciseAmount = excisevalue
        }
        return obj;
    });
    const list = {
        data: data,
        total_net: total_net,
        totalVatAmount: total_vat,
        totalAmount: total,
        total_excise: total_excise,
        discount: discount,
    }
    return list;
};