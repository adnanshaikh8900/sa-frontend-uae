
export const renderOptions = (label_key, value_ley, data) => {
  let result = [{ value: null, label: 'Select..' }]
  data.map(item => {
    result.push({
      label: item[label_key],
      value: item[value_ley]
    })
  })
  return result
}