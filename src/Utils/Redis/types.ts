export type TSetRedisValue = {
  [key: string]: number
}

export interface IRedis {
  initRedisConnection: () => void
  setRedisValue: (key: string, value: number) => void
  multipleSetRedisValue: (records: TSetRedisValue) => void
  getRedisValue: (key: string) => Promise<number | null>
  removeRedisValue: (key: string) => Promise<void>
}