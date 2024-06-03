export const getTransactionCategoryList = (list) => {
    let categoryList = [];
    if (list) {
        list.map(obj => {
            categoryList = [...categoryList, ...obj.options];
        })
    }
    return categoryList;
}

