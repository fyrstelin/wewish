import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const stack: Array<{ path: string, key: (string | undefined) }> = [{
  key: undefined,
  path: history.location.pathname
}];

history.listen(({ action, location }) => {
  if (action === 'PUSH') {
    stack.push({
      key: location.key,
      path: location.pathname,
    });
  } else if (action === 'POP') {
    if (stack.length > 1 && stack[stack.length - 2].key === location.key) {
      stack.pop();
    } else {
      stack.push({
        key: location.key,
        path: location.pathname
      })
    }
  } else if (action === 'REPLACE') {
    stack[stack.length - 1] = {
      key: location.key,
      path: location.pathname
    };
  }
});


const historyWithUp = Object.assign(
  history,
  {
    up: (parent: string) => {
      if (stack.length === 1 || stack[stack.length - 2].path !== parent) {
        history.replace(parent);
      } else {
        history.back()
      }
    }
  }
);

export const useHistory = () => historyWithUp

export default historyWithUp
