import { useToaster } from '../Controls/Toaster/context';
import { copy } from './copy';
import { useTranslation } from '../Localization';


const share = (() => {
  if (navigator.share) {
    return (url: string) => navigator.share({ url });
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
