import { observable, action } from 'mobx'

interface IAccount {
  name: string
}

class UserStore {
  @observable account: IAccount | null = null

  @action setAccount(account: any) {
    this.account = account
  }

}
export const userStore = new UserStore()