import { WebStorageStateStore } from 'oidc-client';

const defaultUserManagerSettings = {
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  response_mode: 'query',
};

export default defaultUserManagerSettings;
