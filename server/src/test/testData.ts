// import {
//   ISnap,
//   IPrice
// } from "../types/types"

const testData = {

  swingDown: [
    120,
    140,
    140,
    130,
    120
  ] as number[],

  swingUp: [
    150,
    150,
    140,
    100,
    120,
    160
  ] as number[], // FDDUU

  oneDown: [
    200,
    100,
    50
  ] as number[],

  seeSaw: [
    100,
    105,
    99,
    120,
    121,
    122,
    80,
    85,
    70,
    100,
    95
  ] as number[],

  runDown: [
    100,
    101,
    99,
    120,
    118,
    115,
    112,
    110
  ] as number[],

  priceRun: [
    10000,
    10000,
    10000,
    10000,
    10000,  // warm up
    10010,
    10021,  // buy
    10030,
    10040,
    10050,
    10060,
    10040,
    10030,  // sell
    10025,
    10020,
    10025,
    10030,  // buy
    10040,
    10080,
    10070,
    10065,  //
    10060,
    10055,
    10080,
    10090,
    10080,
    10071,
    10060,
    10020,
    10000,
  ] as number[],
}

export { testData }
