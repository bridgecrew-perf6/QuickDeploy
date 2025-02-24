'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const fs = require('fs')
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 770,
    useContentSize: true,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})


ipcMain.handle('file-save', async (event, data) => {


  // ファイルの内容を返却
  try {
    fs.writeFileSync('./aws/sample.json', data);

    return({
      status: true,
      path: 'sample.yaml'
    });
  }
  catch(error) {
    return({status:false, message:error.message});
  }
});



ipcMain.handle('aws-cli-command', async (event, data) => {
  return await exec(data)
});


ipcMain.handle('server-deploy', async (event, path, ip ,command) => {
  try {
    const scpCommnad = "scp -r -o StrictHostKeyChecking=no  -i aws/my-key-pair.pem " + path + " ec2-user@" + ip +  ":~"
    const sshCommnad = "ssh -i aws/my-key-pair.pem ec2-user@" + ip + " " + command

    console.log("scp command: " + scpCommnad)
    console.log("scp command: " + sshCommnad)



    const hoge = await exec(scpCommnad)


    console.log("scp command結果:" + hoge.stdout)
    return await exec(sshCommnad)
  }catch (e) {

    console.error(e)

  }

});


ipcMain.handle('aws-cli-webhooks', async (event, appId, branchName) => {

  try {
    const createWebHooksCommand = "aws amplify create-webhook --app-id " + appId + " --branch-name " + branchName
    const webhooks = await exec(createWebHooksCommand)
    const webHook = await JSON.parse(webhooks.stdout).webhook
    await requestWebhooks(webHook.webhookUrl)

    // const deleteWebHooksCommand = "aws amplify delete-webhook --webhook-id " + webHook.webhookId
    // await exec(deleteWebHooksCommand)


    return true
  }catch (error){
    console.log(error)
    return false
  }



})


function requestWebhooks(url){
  const requestCreateHooksCommand = "curl -X POST -d {} \""+ url + "\" -H \"Content-Type:application/json\""
  exec(requestCreateHooksCommand)
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
