import './index.css';
import './theme.css';
import './printable.css';
import '@ionic/core/css/ionic.bundle.css';

import * as ReactDOM from 'react-dom';
import { Root } from './Root';

import { setupIonicReact } from '@ionic/react'

import registerServiceWorker from './registerServiceWorker';

const userAgent = navigator.userAgent.toLowerCase()

setupIonicReact({})

if (userAgent.includes('fb_iab')) {
  if (userAgent.includes('android')) {
    const intent = `intent://wewish.app${window.location.pathname}#Intent;action=android.intent.action.VIEW;scheme=https;end;`
    window.location.href = intent
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
registerServiceWorker();
