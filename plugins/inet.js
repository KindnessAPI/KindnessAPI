import axios from 'axios'

let baseURL = ''
if (process.env.NODE_ENV !== 'production') {
  baseURL = `http://localhost:3000/`
} else {
  baseURL = `https://www.kindnessapi.com/`
}

let iaxios = axios.create({
  baseURL
})

export const getDataWithProxy = ({ url }) => {
  return iaxios.post(`/api/v1/proxy-url`, {
    url
  })
}