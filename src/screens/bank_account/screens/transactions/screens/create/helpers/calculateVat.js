export const calculateVAT = (
  transactionAmount,
  vatId,
  exclusiveVat,
  setState
) => {
  if (transactionAmount && vatId === 1 && exclusiveVat) {
    let transactionVatAmount = 0;
    let transactionExpenseAmount = 0;
    transactionVatAmount = transactionAmount * 0.05;
    transactionExpenseAmount = transactionVatAmount + transactionAmount;
    transactionAmount = transactionExpenseAmount;
    setState({
      transactionVatAmount: transactionVatAmount,
      transactionExpenseAmount: transactionExpenseAmount,
    });
  } else if (transactionAmount && vatId === 1 && !exclusiveVat) {
    let transactionVatAmount = 0;
    let transactionExpenseAmount = 0;
    transactionVatAmount = (transactionAmount * 5) / 105;
    transactionExpenseAmount = transactionAmount - transactionVatAmount;
    setState({
      transactionVatAmount: transactionVatAmount,
      transactionExpenseAmount: transactionExpenseAmount,
    });
  }
  return transactionAmount;
};
