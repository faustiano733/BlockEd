import {apps} from "./apps.js";
import {sites} from "./sites.js"
import {students } from "./student.js";
import {school} from "./school.js"
import {device} from "./device.js"
import {user} from "./user.js"
import {account } from "./account.js"
import {location} from "./location.js";


import db from "./helpers/connection.js";
import { blocks } from "./block.js";
import { block_app } from "./blockApp.js";
import { block_site } from "./blockSite.js";



const account_test = [
    {
        email:'faustianoGeraldo@gmail.com',
        password:'12345'
    },
    {
        email:'faustianoGeraldo@gmail.com',
        password:'12345'
    }
]

const apps_teste = [
    {
        name:'whataspp',
        active:0,
        packageName:'whatsapp.com.moblie',
    },
    {
        name:'whataspp',
        active:1,
        packageName:'whatsapp.com.moblie',
    },
    {
        name:'whataspp',
        active:1,
        packageName:'whatsapp.com.moblie',
    },
]


const school_test =[
    {
        name:'Dom Dãmiao Franklin',
        blockSites:1,
        blockApps:1,
        blockInternet:1,
        blockCam:1
        
    },
    {
        name:'Colegio Goft',
        blockSites:1,
        blockApps:1,
        blockInternet:1,
        blockCam:1
        
    }
]

const location_tes = [
    {
        longitude:10.234,
        latitude:10.256
    },
    {
        longitude:10.234,
        latitude:10.256
    },
]


const sites_teste = [
    {
    domine:"www.teste.com"
    },
    {
        domine:"www.teste2.com"
    },
    {
        domine:"www.teste3.com",
    },
]

const user_test =[
    {
        name:"faustiano",
        
    },
    {
        name:"Carlos",
        
    }
]

const student_test = [
    {
        name:'Faustiano'
    },
    {
        name:'Carlos'
    }
]

const device_test = [
    {
        mac_adrress:'13hbdsbdbfsmc'
    },
    {
        mac_adrress:'13hbd1bdbfsms'
    }
]


async function insertTestData(){
    let i = 0
    const db_accounts = await Promise.all( account_test.map(async (account_db)=> await account.create(account_db) ))

    const db_users = await Promise.all(user_test.map(async (user_db)=> await user.create({...user_db, idAccount:db_accounts[0].idAccount})))

    const db_location = await Promise.all(location_tes.map(async location_db=> await location.create(location_db)))
    
    const db_schools = await Promise.all(school_test.map(async school_db=> {
        const test_school = await school.create({...school_db, idLocation:db_location[i].idLocation, idUser:db_users[i].idUser})
        i += 1
        return test_school
    }))

    const db_apps = await Promise.all(apps_teste.map(async app_db=> await apps.create({...app_db, idSchool:db_schools[0].idSchool})))

    const db_site = await Promise.all(sites_teste.map(async site_db=> await sites.create({...site_db, idSchool:db_schools[0].idSchool})))

    const db_student = await Promise.all(student_test.map(async student_db=> await students.create({...student_db, idSchool:db_schools[0].idSchool})))

    const db_device = await Promise.all(device_test.map(async device_db=> await device.create({...device_test, idStudent:db_student[0].idStudent})))

}


await db.sequelize.sync()

await insertTestData()
//db.sequelize.drop()
