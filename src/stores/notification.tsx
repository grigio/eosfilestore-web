import { observable, action } from 'mobx'
// import { fetchTx } from '../eosfilestore/core'

export interface INotification {
  title?: string
  message: string
}

class NotificationStore {
  @observable notifications: INotification[] = []

  @action
  push(notification: INotification) {
    this.notifications.push(notification)
  }

  @action clear() {
    this.notifications = []
  }

}
export const notificationStore = new NotificationStore()