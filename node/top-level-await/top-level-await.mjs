const getData = () =>
  new Promise((resolve) => setTimeout(() => resolve(42), 100));

(async () => {
  const data = await getData();
  console.log("old way, inside the IIFE:", data);
})();

const data = await getData();
console.log("new way, top level:", data);
