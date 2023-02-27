/**
 * 动态航班相关方法及数据
 */
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import dayjs from 'dayjs'

import { _queryFlights } from '../axios/api/flightController'
import { createMsg } from '../utils/message'

export const useFlight = () => {

  const { t } = useI18n() 

  const data: any = reactive({
    formData: {
      direction: 'D', // 'D': 出发；'A': 到达
      key: '',
      page: 0,
      size: 25,
      sort: 'schedule_datetime,asc',
      estimateTimeBefore: new Date().getTime() + 86400000,
      estimateTimeAfter: new Date().getTime(),
      onlyMasterFlight:  true
    },
    list: []
  })

  const loading = ref(false)

  // 获取带着搜索条件的航班列表（单页）
  const getList = () => {
    loading.value = true
    _queryFlights(data.formData).then(async res => {
      data.list = await Promise.all(res.value.results.map(item => {
        // 判断是否存在共享航班
        const flightNoProp: any = { shareList: null }
        let flightNos: any[] = []
        flightNos.push(item.flightIdentity)
        if(item.shareCodeFlight) {
          const shareFlights = item.shareCodeFlight.split(',')
          shareFlights.forEach(flight => {
            // 从总线获取到的共享航班的字符为：CZ2354#0，需要将 '#0' 去掉
            flightNos.push(flight.split('#')[0])
          })
        }
        flightNoProp.shareList = flightNos
        // 单独处理目的地，可能有多个
        const destProp: any = { destsList: null }
        if(item.portOfCallDTOs.length) {
          let dest: any[] = []
          item.portOfCallDTOs.forEach((e, index) => {
            if(index === 0) {
              if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
              }
            }else if(index === item.portOfCallDTOs.length - 1) {
              if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
              }
            }else {
              e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
            }
          })
          destProp.destsList = dest
        }
        // 单独处理登机口，可能有多个
        const gateProp = { gateLabel: '' }
        if(item.gates.length) {
          let gates = ''
          item.gates.forEach(e => {
            if(e.gateNumber)
              gates += e.gateNumber + '/'
          })
          gates = gates.substring(0, gates.length - 1)
          gateProp.gateLabel = gates
        }
        return {...item, ...destProp, ...gateProp, ...flightNoProp}
      }))
    }).finally(() => {
      loading.value = false
    })
  }

  // 搜索框值的变化触发，防抖延时为1000ms
  let timer: any = null
  const inputChange = (e) => {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      data.formData.page = 0
      getList()
    }, 600)
  }

  // 航班列表滚动触发下一页
  const nextPage = (type: string) => {
    loading.value = true
    data.formData.page ++
    _queryFlights(data.formData).then(async res => {
      if(res.value.results.length === 0) {
        createMsg('warning', t('tip.loadAll'), type)
      }else {
        let list = await Promise.all(res.value.results.map(item => {
          // 判断是否存在共享航班
          const flightNoProp: any = { shareList: null }
          let flightNos: any[] = []
          flightNos.push(item.flightIdentity)
          if(item.shareCodeFlight) {
            const shareFlights = item.shareCodeFlight.split(',')
            shareFlights.forEach(flight => {
              // 从总线获取到的共享航班的字符为：CZ2354#0，需要将 '#0' 去掉
              flightNos.push(flight.split('#')[0])
            })
          }
          flightNoProp.shareList = flightNos
          // 单独处理目的地，可能有多个
          const destProp: any = { destsList: null }
          if(item.portOfCallDTOs.length) {
            let dest: any[] = []
            item.portOfCallDTOs.forEach((e, index) => {
              if(index === 0) {
                if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                  e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
                }
              }else if(index === item.portOfCallDTOs.length - 1) {
                if(!(e.airportName === '杭州萧山' || e.airportName === 'Hangzhou')) {
                  e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
                }
              }else {
                e.airportName ? dest.push(e.airportName) : dest.push(e.airportIATACode)
              }
            })
            destProp.destsList = dest
          }
          // 单独处理登机口，可能有多个
          const gateProp = { gateLabel: '' }
          if(item.gates.length) {
            let gates = ''
            item.gates.forEach(e => {
              if(e.gateNumber)
                gates += e.gateNumber + '/'
            })
            gates = gates.substring(0, gates.length - 1)
            gateProp.gateLabel = gates
          }
          return {...item, ...destProp, ...gateProp, ...flightNoProp}
        }))
        data.list = data.list.concat(list)
      }
    }).finally(() => {
      loading.value = false
    })
  }

  // 出发
  const depart = () => {
    data.formData.direction = 'D'
    data.formData.page = 0
    data.formData.key = ''
    data.formData.sort = 'schedule_datetime,asc'
    data.formData.estimateTimeBefore = new Date().getTime() + 86400000,
    data.formData.estimateTimeAfter = new Date().getTime()
    getList()
  }

  // 到达
  const arrive = () => {
    data.formData.direction = 'A'
    data.formData.page = 0
    data.formData.key = ''
    data.formData.sort = 'schedule_datetime,asc'
    data.formData.estimateTimeBefore = new Date().getTime() + 18000000,
    data.formData.estimateTimeAfter = new Date().getTime() - 3600000
    getList()
  }

  // 构造 “昨天”， “今天”， “明天” 日期的选项
  const getDayOpts = () => {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const today = dayjs().format('YYYY-MM-DD')
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
    return [
      {
        label: yesterday,
        value: 0
      },
      {
        label: today,
        value: 1
      },
      {
        label: tomorrow,
        value: 2
      }
    ]
  }
  
  // 切换日期的model，0：昨天，1：今天，2：明天
  const flightDate = ref(1)

  const handleFlightDateChange = (e) => {
    console.log(e)
  }

  return { data, loading, getList, inputChange, nextPage, depart, arrive, getDayOpts, flightDate, handleFlightDateChange }
}