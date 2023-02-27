import { ElMessage } from "element-plus"

export const createMsg = (type: string , message: string, customClass: string, duration?: number) => {
  const msgOpt: Object = {
    type,
    message,
    duration: duration || 2000,
    'custom-class': customClass
  }
  ElMessage(msgOpt)
}