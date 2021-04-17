import cloudbase from '@cloudbase/js-sdk'
import LoginState from './LoginState'
import DatabaseWatch from './DatabaseWatch'
import CloudFile from './CloudFile'
import DatabaseQuery from './DatabaseQuery'
// import UploadCloudFile from './UploadCloudFile'

const plugin = {
  install(app, options) {
    // Vue.component("databaseQuery", Query)
    app.component("LoginState", LoginState)
    app.component("DatabaseWatch", DatabaseWatch)
    app.component("CloudFile", CloudFile)
    app.component("DatabaseQuery", DatabaseQuery)
    // Vue.component("UploadCloudFile", UploadCloudFile)
    app.config.globalProperties.$cloudbase = cloudbase.init({
      env: options.env,
      region: options.region
    })
  }
}

export default plugin