console.log("first");

setTimeout(() => {
  console.log("second - two seconds later");
}, 2000);

console.log("third");

const order = new Promise((resolve) => {
  setTimeout(() => {
    resolve("burger is ready");
  }, 2000);
});

order.then((result) => console.log(result));

async function getOrder() {
    const result = order;
    console.log(result);
}

getOrder();