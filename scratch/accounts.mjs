export class Account {
    constructor(name, industry) {
        this.name = name;
        this.industry = industry;
    }

    describe(){
        return `${this.name} is in the ${this.industry} industry.`;
    }
}

