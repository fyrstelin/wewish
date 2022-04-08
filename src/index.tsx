import './index.css';
import './theme.css';
import './printable.css';
import '@ionic/core/css/ionic.bundle.css';
import 'pwacompat'
import * as ReactDOM from 'react-dom';
import { Root } from './Root';

import { setupIonicReact } from '@ionic/react'

import { register } from './serviceWorkerRegistration';
import { connectable, Observable, shareReplay } from 'rxjs';

const userAgent = navigator.userAgent.toLowerCase()

setupIonicReact({})

if (userAgent.includes('fb_iab')) {
  if (userAgent.includes('android')) {
    const intent = `intent://wewish.app${window.location.pathname}#Intent;action=android.intent.action.VIEW;scheme=https;end;`
    window.location.href = intent
  }
}

const updates = connectable(new Observable<string>(s => {
  register({
    onSuccess: () => s.next('SW_INSTALLED'),
    onUpdate: () => s.next('NEW_CONTENT')
  });
}).pipe(
  shareReplay({
    refCount: true,
    windowTime: 100
  })
))

ReactDOM.render(
  <Root updates={updates} />,
  document.getElementById('root')
)

updates.connect()
