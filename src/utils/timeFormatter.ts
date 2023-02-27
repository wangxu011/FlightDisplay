import dayjs from "dayjs"

/**
 * 将时间戳进行格式化：YYYY-MM-DD HH:mm:ss
 * @param stamp 
 * @returns 
 */
export const formatTimeStamp = (stamp: number): string => {
  return dayjs(stamp).format('YYYY-MM-DD HH:mm:ss')
}

const weekMap = {
  0: 'week.sun',
  1: 'week.mon',
  2: 'week.tue',
  3: 'week.wed',
  4: 'week.thu',
  5: 'week.fri',
  6: 'week.sat'
}

/**
 * 根据首页时间的显示需要，对当前时间做格式化处理
 * @returns 
 */
export const formatToday = (): string[] => {
  let res: any[] = []
  const time = dayjs().format('HH:mm')
  const date = dayjs().format('MM/DD/YYYY')
  const day = new Date().getDay()
  res.push(time)
  res.push(date)
  res.push(weekMap[day])
  return res
}