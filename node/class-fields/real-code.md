# Can real code read #balance?

DevTools said yes. But DevTools is a debugger, and debuggers are allowed to peek at private fields. Real code is not a debugger.

Select the code block and press **F8** to run it. It FAILS on purpose: node refuses the file at parse time, so nothing in it ever runs.

① The same account, and the same sneaky line at the bottom.

```js
class Account {
  #balance;
  constructor(balance) {
    this.#balance = balance;
  }
  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }
}

const acc = new Account(100);
console.log(acc.deposit(50));

console.log(acc.#balance);
```
