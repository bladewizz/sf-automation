const accounts = [
  { name: "Acme Corp",     industry: "Manufacturing", employees: 500 },
  { name: "Globex",        industry: "Tech",          employees: 80 },
  { name: "Initech",       industry: "Tech",          employees: 30 },
  { name: "Umbrella",      industry: "Pharma",        employees: 1200 },
  { name: "Soylent",       industry: "Food",          employees: 45 },
  { name: "Stark Industries", industry: "Tech",       employees: 900 }
];

const techAccounts = accounts.filter((account) => account.industry === "Tech");
console.log(techAccounts);

const names = accounts.map((account) => account.name);
console.log(names);

const found = accounts.find((account) => account.employees > 1000);
console.log(found);

const chained = accounts
  .filter((account) => account.industry === "Tech")
  .map((account) => account.name);
console.log(chained);