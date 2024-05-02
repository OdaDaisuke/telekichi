import { MirakurunChannelList, MirakurunChannel } from '@/models/mirakurun'

export const getNextChannel = (channelId: string, list: MirakurunChannelList): MirakurunChannel => {
  console.log(channelId, list)
  const base = parseInt(channelId)
  let nextId = Infinity
  let nextChannel = list[0]

  let min = Infinity
  let minChannel = list[0]

  list.map(item => {
    const itemId = parseInt(item.channel, 10)
    if (itemId > base && itemId < nextId) {
      nextId = itemId
      nextChannel = item
    }
    if (itemId < min) {
      min = itemId
      minChannel = item
    }
  })

  if (base === nextId) {
    return minChannel
  }
  return nextChannel
}
