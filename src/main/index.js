import { app, ipcMain , BrowserWindow ,Tray, Menu, nativeImage,globalShortcut} from 'electron'
import '../renderer/store'
import path from "path";

let WIDTH = 1440
let HEIGHT = 900

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

let iconPath = ''

if(process.env.NODE_ENV === 'development'){
  iconPath = nativeImage.createFromPath('src/renderer/store/exhale256.png')
}else {
  iconPath = nativeImage.createFromPath(path.join(path.dirname(app.getAppPath()), '/resources/exhale256.png'));
}


function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    useContentSize: true,
    frame:false,
    resizable:true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    // 限制窗口最小尺寸（int整形）, 无边框模式下，不考虑标题栏高度
    mainWindow.setMinimumSize(WIDTH / 2, HEIGHT / 2)
    mainWindow.show()
  }),

  mainWindow.setAspectRatio(1.6)


// 关闭窗口
  ipcMain.on('close', () => {
    mainWindow.hide();
  });

  let tray = new Tray(iconPath)

  tray.setToolTip('exhale')
  tray.setTitle('exhale')
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出',
      type: 'normal',
      click:() =>{
        tray.destroy()
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)

  tray.on('double-click',()=>{
    console.log(mainWindow)
    mainWindow.show()
    mainWindow.focus()
  })

}

app.on('ready', () =>{
  createWindow()
  // 隐藏菜单栏
  const { Menu } = require('electron');
  Menu.setApplicationMenu(null);
  //快捷键
  globalShortcut.register('Alt+1', () => {
    mainWindow.show();
  })
  globalShortcut.register('Alt+2', () => {
    mainWindow.hide();
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    //app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
