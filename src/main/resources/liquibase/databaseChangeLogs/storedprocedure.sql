--liquibase formatted sql
--changeset  25/04/2020 afzal:sp1 runOnChange:true endDelimiter:#
#
CREATE DEFINER=`simplevat_db_proxyuser`@`%` PROCEDURE `profitAndLossStoredProcedure`(IN `incomeCode` VARCHAR(255), IN `costOfGoodsSoldCode` VARCHAR(255), IN `adminExpenseCode` VARCHAR(255), IN `otherExpenseCode` VARCHAR(255), IN `startDate` DATE, IN `endDate` DATE)
    NO SQL
BEGIN
    SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit , CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE incomeCode and TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_CODE NOT IN ("03-01-001","03-01-003") and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
    UNION
    SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE costOfGoodsSoldCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
    UNION
    SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE adminExpenseCode and JL.CREATED_DATE BETWEEN startDate and endDate  GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
    UNION
    SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE otherExpenseCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
    UNION
    SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE incomeCode and TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_CODE IN ("03-01-001","03-01-003") and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME;
    END
#

--changeset  19/07/2020 Adil Khan:sp2 runOnChange:true endDelimiter:#
#
CREATE DEFINER=`simplevat_db_proxyuser`@`%` PROCEDURE `balanceSheetStoredProcedure`(IN `currentAssetCode` VARCHAR(255), IN `bankCode` VARCHAR(255), IN `otherCurrentAssetCode` VARCHAR(255), IN `accountReceivableCode` VARCHAR(255),IN `accountPayableCode` VARCHAR(255),IN `fixedAssetCode` VARCHAR(255),IN `currentLiabilityCode` VARCHAR(255),IN `otherLiabilityCode` VARCHAR(255), IN `equityCode` VARCHAR(255), IN `startDate` DATE, IN `endDate` DATE)
    NO SQL
BEGIN
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE currentAssetCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE bankCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE otherCurrentAssetCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE accountReceivableCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE accountPayableCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE fixedAssetCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE currentLiabilityCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE otherLiabilityCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE equityCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME;
     END
#

--changeset  19/07/2020 Zain:sp3 runOnChange:true endDelimiter:#
#
CREATE DEFINER=`simplevat_db_proxyuser`@`%` PROCEDURE `trialBalanceStoredProcedure`( IN `bankCode` VARCHAR(255), IN `otherCurrentAssetCode` VARCHAR(255), IN `accountReceivableCode` VARCHAR(255),IN `accountPayableCode` VARCHAR(255),IN `fixedAssetCode` VARCHAR(255),IN `otherLiabilityCode` VARCHAR(255), IN `equityCode` VARCHAR(255),IN `incomeCode` VARCHAR(255), IN `adminExpenseCode` VARCHAR(255), IN `otherExpenseCode` VARCHAR(255), IN `startDate` DATE, IN `endDate` DATE)
    NO SQL
BEGIN
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE bankCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE otherCurrentAssetCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE accountReceivableCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE accountPayableCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE fixedAssetCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE otherLiabilityCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE equityCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE adminExpenseCode and JL.CREATED_DATE BETWEEN startDate and endDate  GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE otherExpenseCode and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME
     UNION
     SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit, CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE LIKE incomeCode  and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME;
     END
#
--changeset  20/07/2020 muzammil sayed:sp4 runOnChange:true endDelimiter:#
#
CREATE DEFINER=`simplevat_db_proxyuser`@`%` PROCEDURE `taxesStoredProcedure`( IN `inputVatCode` VARCHAR(255), IN `outputVatCode` VARCHAR(255),IN `startDate` DATE, IN `endDate` DATE)
    NO SQL
BEGIN
   SELECT TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME,SUM(CREDIT_AMOUNT)AS credit,SUM(DEBIT_AMOUNT)AS debit,CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_CODE as code  FROM JOURNAL_LINE_ITEM JL INNER JOIN TRANSACTION_CATEGORY INNER JOIN CHART_OF_ACCOUNT WHERE JL.TRANSACTION_CATEGORY = TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_ID and TRANSACTION_CATEGORY.CHART_OF_ACCOUNT_ID = CHART_OF_ACCOUNT.CHART_OF_ACCOUNT_ID and TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_CODE IN (inputVatCode,outputVatCode) and JL.CREATED_DATE BETWEEN startDate and endDate GROUP BY TRANSACTION_CATEGORY.TRANSACTION_CATEGORY_NAME;
 END
 #



