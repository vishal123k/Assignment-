import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL:"http://172.20.10.2:5000/"
});

API.interceptors.request.use(
 async(config)=>{
    const token = await AsyncStorage.getItem("token");

    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
 }
);

export default API;
