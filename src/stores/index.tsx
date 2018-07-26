import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore } from 'mobx-react-router'
import { fileStore } from './file'

export const browserHistory = createBrowserHistory();
export const routingStore = new RouterStore();
export { fileStore }