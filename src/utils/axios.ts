import _axios from 'axios'
import type { AxiosResponse } from 'axios'
import { APIError } from './request.js'

export const axios = _axios.create()

axios.interceptors.response.use(
  (_res: AxiosResponse) => {


    return _res
  },
  (error) => {
    return Promise.reject(
      new APIError(
        error.response?.data?.message,
        error.response?.data?.statusCode || 500,
        {
          ...error.response?.data,
          endpoint: error.config?.url
        }
      )
    )
  }
)
