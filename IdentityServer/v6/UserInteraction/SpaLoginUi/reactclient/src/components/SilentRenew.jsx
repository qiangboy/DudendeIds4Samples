import React from 'react';
import userManager from '../oidc-client-config/defaultUserManager'

const SilentRenew = () => {
  userManager
    .signinSilentCallback()
    .then(() => {
      console.log('静默刷新成功');
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>
      <h1>SilentRenew Page</h1>
      <p>This is a SilentRenew page.</p>
    </div>
  );
};

export default SilentRenew;
