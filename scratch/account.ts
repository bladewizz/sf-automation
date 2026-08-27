interface Account {
    name: string;
    industry: string;
    annualRevenue: number;
}

function describe(account: Account) {
    return `${account.name} is in the ${account.industry} industry.`;
}

const acme: Account = {
    name: "Acme Corp",
    industry: "Manufacturing",
    annualRevenue: 5000000
};

console.log(describe(acme)); // Output: "Acme Corp is in the Manufacturing industry."