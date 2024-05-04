export class ScheduleList {
  constructor(scheduleList) {
    this.scheduleList = scheduleList
  }

  getOngoingSchedule(currentTime) {
    const result = this.scheduleList.filter(schedule => {
      const duration = schedule.programInfo.program.duration

      const endAt = new Date(schedule.programInfo.program.startAt + duration)
      return schedule.startAt < currentTime && endAt > currentTime
    })

    return result.length === 0 ? null : result[0]
  }

  getUpcomingSchedule(currentTime) {
    let min = Infinity
    let minItem = null

    this.scheduleList.filter(schedule => {
      return schedule.startAt > currentTime
    }).map(item => {
      if (item.programInfo.program.startAt < min) {
        min = item.programInfo.program.startAt
        minItem = item
      }
    })

    return minItem
  }
}
