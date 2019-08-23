const GDAX = require("gdax");
const publicClient = new GDAX.PublicClient();

let count = 0

const checkIt = async () => {
  let res = await publicClient.getProducts()
  let btc = res.filter(elem => elem.id === "BTC-USD")
  count++
  console.log('count:', count, btc, '\n\n')
}


// const main = () => {
//   setInterval(checkIt, 2000)
// }

// main()
