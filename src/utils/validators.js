function analysisValidate (rules, validator) {
  const map = new Map();
  rules.forEach(({ trigger, ...rule }) => {
    const value = map.get(trigger)
    if (map.has(trigger)) {
    map.set(trigger, [...value, rule])
    } else {
      map.set(trigger || 'default', [rule])
    }
  })
  return map
}
function isRequired (rules) {
  const isRequired = !!(rules.find(item => item['required'] != void 0) || {}).required;
  return isRequired;
}

module.exports = {
  analysisValidate,
  isRequired
}
