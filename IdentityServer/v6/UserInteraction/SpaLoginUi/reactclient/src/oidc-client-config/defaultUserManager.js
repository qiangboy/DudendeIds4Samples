import { UserManager } from 'oidc-client';
import settings from './defaultUserManagerSettings';

const defaultUseManager = new UserManager({
  ...settings
});

export default defaultUseManager;
