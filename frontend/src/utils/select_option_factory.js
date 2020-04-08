
export const renderOptions = (label_key, value_ley, data,placeholder,showSelect) => {
  let result = showSelect ? [] : [{ value: "", label: `Select ${placeholder}` }]
  data.map((item) => {
    result.push({
      label: item[label_key],
      value: item[value_ley]
    })
    return item
  })
  return result
}