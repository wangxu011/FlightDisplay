import axios from '../index'

import baseObjectResponse from '../vo/baseObjectResponse'

export const _queryFastSC = ():Promise<baseObjectResponse<any>> => {
  return axios.get('/app/checkEfficiency/query')
}