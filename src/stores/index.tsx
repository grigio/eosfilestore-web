import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore } from 'mobx-react-router'
import { fileStore } from './file'
import { userStore } from './user'
import { notificationStore } from './notification'



export const browserHistory = createBrowserHistory();
export const routingStore = new RouterStore();
export { fileStore, userStore, notificationStore }