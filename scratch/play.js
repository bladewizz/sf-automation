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

console.log(typeof employeeCount); // Output: number
console.log(typeof parentAccount); // Output: object (null is considered an object in JavaScript)
