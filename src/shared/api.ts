import Axios from 'axios'

export const api = Axios.create({ baseURL: 'https://hacker-news.firebaseio.com/v0' })
