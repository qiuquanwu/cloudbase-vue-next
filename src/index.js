import cloudbase from "@cloudbase/js-sdk"
import LoginState from "./LoginState"
import DatabaseWatch from "./DatabaseWatch"
import CloudFile from "./CloudFile"
import DatabaseQuery from "./DatabaseQuery"
import { inject } from "vue"
// import UploadCloudFile from './UploadCloudFile'

const useCloud = () => {
    return inject("cloud")
}
const plugin = {
    install(app, options) {
        // Vue.component("databaseQuery", Query)
        app.component("LoginState", LoginState)
        app.component("DatabaseWatch", DatabaseWatch)
        app.component("CloudFile", CloudFile)
        app.component("DatabaseQuery", DatabaseQuery)
        // Vue.component("UploadCloudFile", UploadCloudFile)
        let cloud = cloudbase.init({
            env: options.env,
            region: options.region
        })
        app.config.globalProperties.$cloudbase = cloud
        app.provide("cloud", cloud)
    }
}

export default plugin
export { useCloud }
