// SA Checker - routes.js
// Self Assessment eligibility checker for 2023-2024 tax year

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ---------------------------------------------------------------
// EMPLOYMENT
// After employment question - if employed, ask about >£100k income
// If not employed, skip to self-employed question
// ---------------------------------------------------------------
router.post('/employment-answer', function (req, res) {
  var employment = req.session.data['employment']

  if (employment === 'yes') {
    res.redirect('/high-income')
  } else {
    res.redirect('/self-employed')
  }
})

// ---------------------------------------------------------------
// HIGH INCOME (>£100k)
// If yes - they definitely need SA, go to result
// If no - continue checking other criteria
// ---------------------------------------------------------------
router.post('/high-income-answer', function (req, res) {
  var highIncome = req.session.data['high-income']

  if (highIncome === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/self-employed')
  }
})

// ---------------------------------------------------------------
// SELF-EMPLOYED
// If yes - ask about income threshold (£1,000 trading allowance)
// If no - skip to partnership question
// ---------------------------------------------------------------
router.post('/self-employed-answer', function (req, res) {
  var selfEmployed = req.session.data['self-employed']

  if (selfEmployed === 'yes') {
    res.redirect('/self-employed-income')
  } else {
    res.redirect('/partnership')
  }
})

// ---------------------------------------------------------------
// SELF-EMPLOYED INCOME THRESHOLD
// If > £1,000 - they need SA, go to result
// If <= £1,000 - continue to partnership
// ---------------------------------------------------------------
router.post('/self-employed-income-answer', function (req, res) {
  var selfEmployedIncome = req.session.data['self-employed-income']

  if (selfEmployedIncome === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/partnership')
  }
})

// ---------------------------------------------------------------
// PARTNERSHIP
// If yes - they definitely need SA, go to result
// If no - continue to untaxed income
// ---------------------------------------------------------------
router.post('/partnership-answer', function (req, res) {
  var partnership = req.session.data['partnership']

  if (partnership === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/untaxed-income')
  }
})

// ---------------------------------------------------------------
// UNTAXED INCOME (rental, savings, dividends, tips)
// If any selected other than 'none' - they need SA
// If 'none' - continue to capital gains
// ---------------------------------------------------------------
router.post('/untaxed-income-answer', function (req, res) {
  var untaxedIncome = req.session.data['untaxed-income']

  // untaxedIncome is an array from checkboxes
  // Could be a string if only one option selected, or array if multiple
  var incomeArray = Array.isArray(untaxedIncome) ? untaxedIncome : [untaxedIncome]

  // Filter out undefined/null
  incomeArray = incomeArray.filter(Boolean)

  if (incomeArray.length === 0 || (incomeArray.length === 1 && incomeArray[0] === 'none')) {
    res.redirect('/capital-gains')
  } else if (incomeArray.includes('none')) {
    // Should not happen with exclusive behaviour but guard anyway
    res.redirect('/capital-gains')
  } else {
    res.redirect('/result-need')
  }
})

// ---------------------------------------------------------------
// CAPITAL GAINS
// If yes - they need SA, go to result
// If no - continue to foreign income
// ---------------------------------------------------------------
router.post('/capital-gains-answer', function (req, res) {
  var capitalGains = req.session.data['capital-gains']

  if (capitalGains === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/foreign-income')
  }
})

// ---------------------------------------------------------------
// FOREIGN INCOME
// If yes - they need SA, go to result
// If no - continue to child benefit
// ---------------------------------------------------------------
router.post('/foreign-income-answer', function (req, res) {
  var foreignIncome = req.session.data['foreign-income']

  if (foreignIncome === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/child-benefit')
  }
})

// ---------------------------------------------------------------
// CHILD BENEFIT
// If yes - ask follow up about income threshold
// If no - continue to pension question
// ---------------------------------------------------------------
router.post('/child-benefit-answer', function (req, res) {
  var childBenefit = req.session.data['child-benefit']

  if (childBenefit === 'yes') {
    res.redirect('/child-benefit-income')
  } else {
    res.redirect('/pension')
  }
})

// ---------------------------------------------------------------
// CHILD BENEFIT HIGH INCOME CHARGE (>£50,000)
// If yes - they need SA (High Income Child Benefit charge)
// If no - continue to pension
// ---------------------------------------------------------------
router.post('/child-benefit-income-answer', function (req, res) {
  var childBenefitIncome = req.session.data['child-benefit-income']

  if (childBenefitIncome === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/pension')
  }
})

// ---------------------------------------------------------------
// PENSION
// If yes - ask if pension exceeded Personal Allowance (£12,570)
// If no - all checks done, they do not need SA
// ---------------------------------------------------------------
router.post('/pension-answer', function (req, res) {
  var pension = req.session.data['pension']

  if (pension === 'yes') {
    res.redirect('/pension-over-allowance')
  } else {
    res.redirect('/result-no-need')
  }
})

// ---------------------------------------------------------------
// PENSION OVER PERSONAL ALLOWANCE
// If yes - they may need SA (PAYE may not have collected all tax)
// If no - they do not need SA
// ---------------------------------------------------------------
router.post('/pension-over-allowance-answer', function (req, res) {
  var pensionOverAllowance = req.session.data['pension-over-allowance']

  if (pensionOverAllowance === 'yes') {
    res.redirect('/result-need')
  } else {
    res.redirect('/result-no-need')
  }
})

module.exports = router
