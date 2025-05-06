import { signup } from "../../services/authServices.js";

const newAccount = signup({email:'malibuForever2@gmail.com',password:'1234567'},{name:'malibu'},{name:'Colegio Goft', blockSites: false, blockCam: true, blockApps: false, blockInternet: false},{longitude:'10.1003',latitude:'10.3080', radius: 200})