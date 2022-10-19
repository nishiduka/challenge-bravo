export type TRequestCoinBody = {
  code: string
  codein: string
  name: string
  high: string
  low: string
  varBid: string
  pctChange: string
  bid: string
  ask: string
  timestamp: string
  create_date: string
}

export type TRequestCoin = {
  [key: string]: TRequestCoinBody
}

export type TRetriveValueCoin = {
  fromQuotation: number
  toQuotation: number
}

export type TCurrencies = {
  [key: string]: number
}
