// @ts-nocheck
import QWebChannel from './qtWebChannel.js'

export default class Channel {

  public static isQtClient: boolean = navigator.userAgent.includes('QtWebEngine')

  public QTObject: any = null

  public constructor() {
    if(typeof (qt) !== 'undefined') {
      console.log('Current browser is in QT WebEngine !')
      const qwChannel = new QWebChannel(window.qt.webChannelTransport, (channel: any) => {
        this.QTObject = channel.objects.IFDObject
        console.log(`QT Object ===>>> `, this.QTObject)
      })
    }else {
      // 不是QT客户端的WebEngine
      this.QTObject = null
      console.log('Current browser is not QT WebEngine !')
    }
  }
}