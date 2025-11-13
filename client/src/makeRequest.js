import axios from "axios";

export const makeRequest = axios.create({
  baseURL: 'http://localhost:1337/api',
  // headers: {
  //   Authorization: "bearer " + process.env.REACT_APP_API_TOKEN,
  // },
});
