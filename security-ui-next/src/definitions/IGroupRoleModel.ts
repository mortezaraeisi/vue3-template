export interface IGroupRoleModel {
  NidGroup: string
  type: 'group' | 'role',
  NidParent: string,
  name: string,
  title: string,
  label: string,
  enabled: boolean,
  attribute: string,
  NidUserCreator: string,
  description: string,
  createdAt: string,
  minPasswdLength: number,
  passwdStretchDays: number,
  boundaryLimitation: boolean
  allowUsePrevPasswd: boolean
  passwdComplexityLevel: number
  concurrentLoginCount: number
  mustLoginByCamera: boolean
  twoFactorAuthentication: boolean
  notifyLoginBySMS: boolean
  notifyLoginByEmail: boolean
  ignoreHardwareToken: boolean
  loginTryCount: number
  loginBannedTimeoutSeconds: number
  sessionTimeout: number
  allowedIp?: string
  allowViewUsersList: boolean
  allowViewAuthHistory: boolean
}
