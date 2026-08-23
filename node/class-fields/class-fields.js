// What are class fields and #private?
// One DevTools snippet, built up block by block.
// Each experiment is wrapped in its own { } so the whole thing runs as one script: the block scope keeps the repeated const acc / class Account from colliding.
// Paste a block, Cmd+Enter to run the whole snippet, read the newest lines at the bottom.

// ① public fields: declare state at the top
{
  // before ES2022: state was assigned inside a constructor
  class CounterOld {
    constructor() {
      this.count = 0;
      this.step = 1;
    }
    tick() {
      this.count += this.step;
      return this.count;
    }
  }

  // now: declare the fields right at the top, no constructor needed
  class Counter {
    count = 0;
    step = 1;
    tick() {
      this.count += this.step;
      return this.count;
    }
  }

  const c = new Counter();
  console.log(c.tick());
  console.log(c.tick());
  console.log(c.count);
}

// ② the old privacy: an underscore was only a hint
{
  // the old convention: a leading underscore meant "please don't touch"
  class AccountOld {
    constructor(balance) {
      this._balance = balance;   // "private" by convention only
    }
    deposit(amount) {
      this._balance += amount;
      return this._balance;
    }
  }

  const acc = new AccountOld(100);
  console.log(acc.deposit(50));
  console.log(acc._balance);
  acc._balance = 999999;
  console.log(acc._balance);
}

// ③ real privacy: #private is enforced
{
  class Account {
    #balance;                          // a real private field, declared at the top
    constructor(balance) {
      this.#balance = balance;
    }
    deposit(amount) {
      this.#balance += amount;
      return this.#log("deposit");     // a public method can call a private one
    }
    #log(action) {                     // a private method: callable only from inside
      return `${action}: balance is ${this.#balance}`;
    }
  }

  const acc = new Account(100);
  console.log(acc.deposit(50));
  console.log(Object.keys(acc));
  console.log(acc.balance);
  // note: acc.#balance out here would be a SyntaxError, so the whole file would refuse to run
  // (DevTools will happily read it though, at the prompt AND in a snippet: DevTools is a debugger, and debuggers may peek at privates. see real-code.md for the real thing)
}

// ④ the brand check: #balance in obj
{
  class Account {
    #balance = 0;
    static isAccount(obj) {
      return #balance in obj;
    }
  }

  // the forgery attempt: a whole class with its OWN #balance, same spelling
  class Impostor {
    #balance = 0;
  }

  const real = new Account();
  const fake = { balance: 0 };         // looks similar, but was not built by us
  const forged = new Impostor();       // even carries a #balance of its own

  console.log(Account.isAccount(real));
  console.log(Account.isAccount(fake));
  console.log(Account.isAccount(forged));
}
