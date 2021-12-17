import Datastore from 'nedb'
import path from 'path'
import {app, nativeImage, remote} from 'electron'
let dbPath = path.join(remote.app.getPath('userData'), '/exhaleDB.db');
if(process.env.NODE_ENV !== 'development'){
    dbPath = path.join(path.dirname(remote.app.getAppPath()), '/exhaleDB.db')
}
export default new Datastore({
    autoload: true,
    filename: dbPath
})