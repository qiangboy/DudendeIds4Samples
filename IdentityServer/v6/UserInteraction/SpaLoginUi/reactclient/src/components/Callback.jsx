import React, { useEffect } from 'react';
import userManager from '../oidc-client-config/defaultUserManager'
import { useHistory } from 'react-router-dom';

const Callback = () => {
  const history = useHistory();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => {
        history.push('/');
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history]);

  return (
    <div>
      <h1>Callback Page</h1>
      <p>This is a callback page.</p>
    </div>
  );
};

export default Callback;
