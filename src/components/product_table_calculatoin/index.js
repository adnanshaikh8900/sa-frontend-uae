export const updateAmount = (data, vat_list, taxType) => {
    let total_net = 0;
    let total_excise = 0;
    let total = 0;
    let total_vat = 0;
    let net_value = 0;
    let discount_total = 0;

    data.map((obj) => {
        if (obj.productId) {
            let unitprice = obj.unitPrice;
            const index =
                obj.vatCategoryId !== ''
                    ? vat_list.findIndex((item) => item.id === +obj.vatCategoryId)
                    : '';
            const vat = index !== '' && vat_list[`${index}`] && index >= 0 ? vat_list[`${index}`].vat : 0;

            //Exclusive case

            if (taxType === false) {
                if (obj.discountType === 'PERCENTAGE') {
                    net_value =
                        ((+unitprice -
                            (+((unitprice * obj.discount)) / 100)) * obj.quantity);
                    var discount = (unitprice * obj.quantity) - net_value
                    if (obj.exciseTaxId != 0) {
                        if (obj.exciseTaxId === 1) {
                            const value = +(net_value) / 2;
                            net_value = parseFloat(net_value) + parseFloat(value);
                            obj.exciseAmount = parseFloat(value);
                        } else if (obj.exciseTaxId === 2) {
                            const value = net_value;
                            net_value = parseFloat(net_value) + parseFloat(value);
                            obj.exciseAmount = parseFloat(value);
                        }
                    }
                    else {
                        obj.exciseAmount = 0
                    }
                    var vat_amount =
                        vat === 0 ? 0 :
                            ((+net_value * vat) / 100);
                } else {
                    net_value =
                        ((unitprice * obj.quantity) - obj.discount)
                    var discount = (unitprice * obj.quantity) - net_value
                    if (obj.exciseTaxId != 0) {
                        if (obj.exciseTaxId === 1) {
                            const value = +(net_value) / 2;
                            net_value = parseFloat(net_value) + parseFloat(value);
                            obj.exciseAmount = parseFloat(value);
                        } else if (obj.exciseTaxId === 2) {
                            const value = net_value;
                            net_value = parseFloat(net_value) + parseFloat(value);
                            obj.exciseAmount = parseFloat(value);
                        }
                    }
                    else {
                        obj.exciseAmount = 0
                    }
                    var vat_amount =
                        vat === 0 ? 0 :
                            ((+net_value * vat) / 100);
                }

            }
            //Inclusive case
            else {
                if (obj.discountType === 'PERCENTAGE') {

                    //net value after removing discount
                    net_value =
                        ((+unitprice -
                            (+((unitprice * obj.discount)) / 100)) * obj.quantity);

                    //discount amount
                    var discount = (unitprice * obj.quantity) - net_value

                    //vat amount
                    var vat_amount =
                        (vat === 0 ? 0 :
                            ((+net_value * (vat / (100 + vat) * 100)) / 100));

                    //net value after removing vat for inclusive
                    net_value = net_value - vat_amount

                    //excise calculation
                    if (obj.exciseTaxId != 0) {
                        if (obj.exciseTaxId === 1) {
                            const value = net_value / 3
                            net_value = net_value
                            obj.exciseAmount = parseFloat(value);
                        }
                        else if (obj.exciseTaxId === 2) {
                            const value = net_value / 2
                            obj.exciseAmount = parseFloat(value);
                            net_value = net_value
                        }

                    }
                    else {
                        obj.exciseAmount = 0
                    }
                }

                else // fixed discount
                {
                    //net value after removing discount
                    net_value =
                        ((unitprice * obj.quantity) - obj.discount)

                    //discount amount
                    var discount = (unitprice * obj.quantity) - net_value

                    //vat amount
                    var vat_amount =
                        (vat === 0 ? 0 :
                            ((+net_value * (vat / (100 + vat) * 100)) / 100));

                    //net value after removing vat for inclusive
                    net_value = net_value - vat_amount

                    //excise calculation
                    if (obj.exciseTaxId != 0) {
                        if (obj.exciseTaxId === 1) {
                            const value = net_value / 3
                            net_value = net_value
                            obj.exciseAmount = parseFloat(value);
                        }
                        else if (obj.exciseTaxId === 2) {
                            const value = net_value / 2
                            obj.exciseAmount = parseFloat(value);
                            net_value = net_value
                        }
                    }
                    else {
                        obj.exciseAmount = 0
                    }
                }
            }
            obj.unitPrice = unitprice
            obj.vatAmount = vat_amount
            obj.subTotal =
                net_value ? parseFloat(net_value) + parseFloat(vat_amount) : 0;
            discount_total = +discount_total + discount
            total_net = +(total_net + parseFloat(net_value));
            total_vat = +(total_vat + vat_amount);
            total_excise = +(total_excise + obj.exciseAmount)
            total = total_vat + total_net;
        }
        return obj;
    });

    const list = {
        data: data,
        total_net: total_net ? parseFloat(parseFloat(total_net).toFixed(2)) - parseFloat(parseFloat(total_excise).toFixed(2)) : 0,
        totalVatAmount: total_vat ? parseFloat(parseFloat(total_vat).toFixed(2)) : 0,
        totalAmount: total ? parseFloat(parseFloat(total).toFixed(2)) : 0,
        total_excise: total_excise ? parseFloat(parseFloat(total_excise).toFixed(2)) : 0,
        discount: discount_total ? parseFloat(parseFloat(discount_total).toFixed(2)) : 0,
    }
    return list;
};