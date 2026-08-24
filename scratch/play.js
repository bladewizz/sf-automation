const name = 'John Doe';
const industry = 'Software Development';
const employeeCount = 100;
const annualRevenue = 5000000;
const parentAccount = null;

let companyProfile = {
  name: name,
  industry: industry,};
  
console.log(companyProfile);
console.log(`${name} works in the ${industry} industry and has ${employeeCount} employees with an annual revenue of $${annualRevenue}.`);

function describeSize(count){
return count > 50 ? 'large' : 'small';
}

const describeSize2 = function(count){
  return count >= 100 ? 'large' : 'small';
}

console.log(describeSize(employeeCount));
console.log(describeSize2(employeeCount));