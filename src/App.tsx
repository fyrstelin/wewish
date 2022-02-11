import React, { FC, useEffect } from 'react';
import * as Home from './Home';
import { Splash } from './Splash';
import * as Firebase from './Firebase';
import { Route, Router, Switch } from 'react-router-dom';
import * as Wishlist from './Wishlist';
import { useHistory } from './Utils/History';
import * as UserSettings from './UserSettings';
import { WishlistSettings } from './WishlistSettings';
import { Policy } from './Legal/Policy';
import { Toaster, useToaster } from './Controls/Toaster';
import { FirebaseLocalization } from './Localization/FirebaseLocalization';
import { Invite } from './Invite';
import { events } from './registerServiceWorker'
import { useTranslation } from './Localization';
import { filter } from 'rxjs/operators';
import { Skills } from './Skills';
import { Terms } from './Legal/Terms';
import { About } from './Legal/About';
import { Hash } from './Utils/Hash';
import { SyncFcmTokenProcess } from './SyncFcmTokenProcess';
import { download } from 'ionicons/icons';
import { Popups } from './Controls/Popups';
import { UserProvider } from './User/UserProvider';

const ServiceWorkerMessages: FC<{
  children?: unknown
}> = () => {
  const toaster = useToaster()
  const translation = useTranslation()

  useEffect(() => {
    const s = events.pipe(
      filter(x => x === 'NEW_CONTENT')
    ).subscribe(() => toaster.next({
      message: translation['service-worker']['new-content'],
      action: {
        icon: download,
        onClick: () => window.location.reload()
      }
    }))

    return () => s.unsubscribe()
  }, [ toaster, translation])

  return null
}

export const App = () => {
  const history = useHistory()

  return (
    <Firebase.Initializer delay={400}>{isInitialized => {
      if (!isInitialized) {
        return <Splash />
      }
      return (
        <FirebaseLocalization>
          <Popups>
            <Toaster>
              <Skills>
                <Hash>
                    <ServiceWorkerMessages />
                    <SyncFcmTokenProcess />
                    <Router history={history}>
                      <UserProvider>
                        <Switch>
                          <Route exact path='/'
                            render={_ => <Home.Root />} />
                          <Route exact path='/wishlists/:id/settings'
                            render={x => <WishlistSettings id={x.match.params.id} />} />
                          <Route exact path='/wishlists/:id/:wishId?'
                            render={x => <Wishlist.Root
                              id={x.match.params.id}
                              wishId={x.match.params.wishId}
                            />} />
                          <Route exact path='/user-settings'
                            render={_ => <UserSettings.Root />} />
                          <Route exact path='/policy'
                            render={_ => <Policy />} />
                          <Route exact path='/terms'
                            render={_ => <Terms />} />
                          <Route exact path='/about'
                            render={_ => <About />} />
                          <Route exact path='/invites/:code'
                            render={x => <Invite code={x.match.params.code} />} />
                          <Route
                            render={x => 'Not found'} />
                        </Switch>
                      </UserProvider>
                    </Router>
                </Hash>
              </Skills>
            </Toaster>
          </Popups>
        </FirebaseLocalization>
      );
    }}
    </Firebase.Initializer>
  );
}
