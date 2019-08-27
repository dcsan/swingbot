
// only open price is required

// TODO - merge / cleanup vs. ITX
export interface IPrice {
  open: number
  last1?: number
  last2?: number
  date?: Date
  symbol?: string
  high?: number
  low?: number
  close?: number
  idx?: number
  when?: string
  time?: string
  hour?: number
  ampm?: string
  buy?: number
  sell?: number
  profit?: number
  btc_volume?: number
  usdt_volume?: number
  timestamp?: number
  avg?: number
  position?: number
  delta?: number
  tradePrice?: number
  tradeProfit?: number
}


// export interface IPrice {
//   price: number
//   time?: number
// }

export interface ITX {
  stamp?: number     // timestamp
  action?: string  // BUY/SELL
  in?: number
  out?: number
  take?: number
  points?: number
  total?: number
  msg?: string
  history?: string
  result?: string
  reason?: string
  priceHistory?: number[]
  snap?: ISnap
}

export interface ISnap {
  count?: number
  time: number,
  timeDiff: number,
  price: number,
  lastDiff?: number,
  dir?: number,
  dirArrow?: string,
  swing?: number,
  swingArrow?: string
  msg?: string
  action?: string
  reason?: string
  result?: string  // of action
  run?: string
  pat?: string // pattern = BUY/SELL
  // tx?: ITX
  prices?: number[]
  diffs?: number[]
  diffPoints?: number[]
  take?: number
  secs?: number
  delta?: number
}



export interface IBotState {
  holding: boolean,
  inPrice: number,
  outPrice: number,
  snap: ISnap,
  total: number, // cumulative
  tradeCount: number
}


export interface IBotConfig {
  logfile?: string
  calcConfig: IKalkConfig
}

export interface IKalkConfig {
  stepUp: number
  stepDown: number
}
