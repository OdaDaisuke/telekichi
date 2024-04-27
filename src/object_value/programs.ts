import { MirakurunProgram } from "@/models/mirakurun";

export class MirakurunPrograms {
  constructor(public programs: Array<MirakurunProgram>) {
  }

  filterByToday(currentTime: number): MirakurunPrograms {
    const today = new Date(currentTime)
    const todayISO = today.toISOString().slice(0, 10)

    const filtered = this.programs.filter(program => {
      const programStartDate = new Date(program.startAt)
      const programISO = programStartDate.toISOString().slice(0, 10)
      return todayISO === programISO
    })
    return new MirakurunPrograms(filtered)
  }

  // その日の何秒から最初の番組が始まるか取得
  getLatestStartAtSeconds(currentTime: number): number {
    const today = new Date(currentTime)
    today.setHours(0, 0, 0, 0)
    const todayStartAtTimestamp = today.getTime()

    today.setHours(23, 59, 59, 999)
    const todayEndAtTimestamp = today.getTime()

    let min = Number.MAX_SAFE_INTEGER

    this.programs.map(program => {
      if (program.startAt < todayStartAtTimestamp || program.startAt > todayEndAtTimestamp) {
        return
      }
      if (program.startAt < min) {
        min = program.startAt
      }
    })
    if (min === Number.MAX_SAFE_INTEGER) {
      return 0
    }

    return parseInt(`${(min - todayStartAtTimestamp) / 1000}`, 10)
  }
}
