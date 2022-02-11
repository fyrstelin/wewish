import { useToaster } from '../Controls/Toaster/context';
import { copy } from './copy';
import { useTranslation } from '../Localization';


type share = (url: string) => Promise<void>;
const share: share | null = (() => {
  const nav = (navigator as any);
  if (nav.share) {
    return (url: string) => nav.share({ url });
  }
  return null;
})();

export const useShare: (toast?: string) => (url: string) => Promise<void> = share
  ? () => share
  : toast => {
    const { utils } = useTranslation()
    const toaster = useToaster()

    const message = toast ?? utils.share['link-copied']

    return async url => {
      await copy(`${window.location.host}${url}`);
      toaster.next({
        message
      });
    }
  }
