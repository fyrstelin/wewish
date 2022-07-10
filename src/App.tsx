import { FC, useEffect } from 'react';
import * as Home from './Home';
import { Splash } from './Splash';
import * as Firebase from './Firebase';
import * as Wishlist from './Wishlist';
import * as UserSettings from './UserSettings';
import { WishlistSettings } from './WishlistSettings';
import { Policy } from './Legal/Policy';
import { Toaster, useToaster } from './Controls/Toaster';
import { FirebaseLocalization } from './Localization/FirebaseLocalization';
import { Invite } from './Invite';
import { useTranslation } from './Localization';
import { filter } from 'rxjs/operators';
import { Skills } from './Skills';
import { Terms } from './Legal/Terms';
import { About } from './Legal/About';
import { HashController } from './Utils/Hash';
import { SyncFcmTokenProcess } from './SyncFcmTokenProcess';
import { downloadSharp } from 'ionicons/icons';
import { Popups } from './Controls/Popups';
import { UserProvider } from './User/UserProvider';
import { Observable } from 'rxjs';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { Route, useRouteMatch } from 'react-router';

const ServiceWorkerMessages: FC<{
  updates: Observable<string>
}> = ({
  updates
}) => {
    const toaster = useToaster()
    const translation = useTranslation()

    useEffect(() => {
      const s = updates.pipe(
        filter(x => x === 'NEW_CONTENT')
      ).subscribe(() => toaster.next({
        message: translation['service-worker']['new-content'],
        action: {
          icon: downloadSharp,
          onClick: () => window.location.reload()
        }
      }))

      return () => s.unsubscribe()
    }, [toaster, translation, updates])

    return null
  }

const Wrappers = {
  Wishlist: () => {
    const { params: { id } } = useRouteMatch<{ id: string }>()
    return <Wishlist.Root
      id={id}
    />
  },
  WishlistSettings: () => {
    const { params: { id } } = useRouteMatch<{ id: string }>()
    return <WishlistSettings id={id!} />
  },
  Invite: () => {
    const { params: { code } } = useRouteMatch<{ code: string }>()
    return <Invite code={code!} />
  }
}

export const App: FC<{
  updates: Observable<string>
}> = ({ updates }) => (
  <Firebase.Initializer delay={500}>{isInitialized => {
    if (!isInitialized) {
      return <Splash />;
    }
    return (
      <FirebaseLocalization>
        <Popups>
          <Toaster>
            <Skills>
              <ServiceWorkerMessages updates={updates} />
              <SyncFcmTokenProcess />
              <IonReactRouter>
                <HashController>
                  <UserProvider>
                    <IonRouterOutlet>
                      <Route exact path='/' component={Home.Root} />
                      <Route exact path='/wishlists/:id/settings' component={Wrappers.WishlistSettings} />
                      <Route exact path='/wishlists/:id' component={Wrappers.Wishlist} />
                      <Route exact path='/user-settings' component={UserSettings.Root} />
                      <Route exact path='/policy' component={Policy} />
                      <Route exact path='/terms' component={Terms} />
                      <Route exact path='/about' component={About} />
                      <Route exact path='/invites/:code' component={Wrappers.Invite} />
                    </IonRouterOutlet>
                  </UserProvider>
                </HashController>
              </IonReactRouter>
            </Skills>
          </Toaster>
        </Popups>
      </FirebaseLocalization>
    );
  }}
  </Firebase.Initializer>
)
