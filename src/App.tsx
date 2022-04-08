import { FC, useEffect } from 'react';
import * as Home from './Home';
import { Splash } from './Splash';
import * as Firebase from './Firebase';
import { Route, unstable_HistoryRouter as Router, Routes, useParams } from 'react-router-dom';
import * as Wishlist from './Wishlist';
import history from './Utils/History';
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
  }, [toaster, translation])

  return null
}

const Wrappers = {
  Wishlist: () => {
    const { id, wishId } = useParams<'id' | 'wishId'>()
    return <Wishlist.Root
      id={id!}
      wishId={wishId}
    />
  },
  WishlistSettings: () => {
    const { id } = useParams<'id'>()
    return <WishlistSettings id={id!} />
  },
  Invite: () => {
    const { code } = useParams<'code'>()
    return <Invite code={code!}/>
  }
}

export const App = () => {
  return (
    <Firebase.Initializer delay={500}>{isInitialized => {
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
                      <Routes>
                        <Route path='/' element={<Home.Root />} />
                        <Route path='/wishlists/:id/settings' element={<Wrappers.WishlistSettings />} />
                        <Route path='/wishlists/:id' element={<Wrappers.Wishlist />}/>
                        <Route path='/wishlists/:id/:wishId' element={<Wrappers.Wishlist />}/>
                        <Route path='/user-settings' element={<UserSettings.Root />} />
                        <Route path='/policy' element={<Policy />} />
                        <Route path='/terms' element={<Terms />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/invites/:code' element={<Wrappers.Invite />} />
                        <Route path='*' element='Not found' />
                      </Routes>
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
