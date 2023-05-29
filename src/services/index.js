import axios from "axios";
import PessoasServices from "./pessoas";

export const httpClient = axios.create({
  baseURL: "http://localhost:5278",
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  pessoas: PessoasServices(httpClient)
}