const calculateBtn = document.getElementById('calculateBtn');

calculateBtn.addEventListener('click', () => {
  calculatetax();
});

function calculatetax() {
  const deductionElements = Array.from(
    document.querySelectorAll('.deductions')
  );

  //Validate Values
  const errors = deductionElements.reduce((acc, element) => {
    const maxValue = element.max;
    const minValue = element.min;
    const elementName = element.name;
    const elementValue = element.value;
    if (maxValue && maxValue < elementValue) {
      acc.push(
        `Value of Field ${elementName} is greater then the allowed value of ${maxValue}`
      );
    }
    if (minValue && elementValue < minValue) {
      acc.push(
        `Value of Field ${elementName} is less then the allowed value of ${minValue}`
      );
    }
    return acc;
  }, []);

  const annualSalary = document.getElementById('salary').value;
  if (annualSalary <= 0) {
    errors.push('Annual Salary should be greater than 0');
  }
  renderErrorMessage(errors);
  if (errors.length > 0) {
    return;
  }
  const deductionValues = deductionElements.map((element) => element.value);

  const oldTaxRegime = oldTaxCalculator({
    salary: annualSalary,
    deductionValues,
  });
  const newTaxRegime = newtaxCalculator(annualSalary);

  renderResults(oldTaxRegime, newTaxRegime);
}
//Complete this
function renderErrorMessage(errors) {
  const errorBox = document.getElementById('errors');
  errorBox.innerHTML = `<span style="color:red">${errors.join(',')}</span>`;
}

function oldTaxCalculator({ salary, deductionValues }) {
  const OLD_SLABS = [0, 5, 20, 30];
  const slabRange = [250000, 250000, 500000, Infinity];
  //sum of deduction
  const sumOfDeductions = deductionValues.reduce(
    (sum, amount) => sum + parseInt(amount),
    0
  );

  //find the taxable income=salary-sum of deduction
  let taxableIncome = salary - sumOfDeductions;
  let tax = OLD_SLABS.reduce((acc, rate, index) => {
    if (taxableIncome >= 0) {
      const slabRangeAmount = slabRange[index];
      if (index < OLD_SLABS.length - 1 && taxableIncome >= slabRangeAmount) {
        taxableIncome = taxableIncome - slabRangeAmount;

        acc = acc + slabRangeAmount * (rate / 100);
      } else {
        acc = acc + taxableIncome * (rate / 100);

        taxableIncome = 0;
      }
    }
    return acc;
  }, 0);
  const surcharge = tax * (4 / 100);
  tax += surcharge;
  return tax;
}
function newtaxCalculator(salary) {
  const NEW_SLABS = [0, 5, 10, 15, 20, 30];
  if (salary <= 700000) {
    return 0;
  } else {
    const standardDeduction = 0; //to be updated later
    salary = salary > 1550000 ? (salary -= standardDeduction) : salary;
    const slabAmount = 300000;
    let salarySlab = parseInt(salary) / slabAmount;

    let tax = NEW_SLABS.reduce((acc, rate, index) => {
      if (salarySlab >= 0) {
        if (index < NEW_SLABS.length - 1 && salarySlab >= 1) {
          salarySlab -= 1;
          acc = acc + slabAmount * (rate / 100);
        } else {
          acc = acc + salarySlab * slabAmount * (rate / 100);
          salarySlab = 0;
        }

        return acc;
      }
    }, 0);

    return tax;
  }
}
function renderResults(oldTaxRegime, newTaxRegime) {
  const resultBox = document.getElementById('results');
  resultBox.innerHTML = '<h2>Below is the Calculated Tax Comparison</h2>';
  const oldTaxBox = document.createElement('div');
  resultBox.appendChild(oldTaxBox);
  const oldTaxData = document.createElement('span');
  oldTaxBox.appendChild(oldTaxData);
  oldTaxData.innerHTML = `Old Tax Regime: ${oldTaxRegime}`;

  const newTaxBox = document.createElement('div');
  resultBox.appendChild(newTaxBox);
  const newTaxData = document.createElement('span');
  newTaxBox.appendChild(newTaxData);
  newTaxData.innerHTML = `New Tax Regime: ${newTaxRegime}`;

  if (oldTaxRegime >= newTaxRegime) {
    newTaxBox.setAttribute('style', 'color:green;font-weight:900');
    oldTaxBox.setAttribute('style', 'color:red');
  } else {
    oldTaxBox.setAttribute('style', 'color:green;font-weight:900');
    newTaxBox.setAttribute('style', 'color:red');
  }
}
