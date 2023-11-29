import { UserManager, Log } from 'oidc-client';
import userManagerSettings from '../oidc-client-config/defaultUserManagerSettings'

let isDebug = process.env.REACT_APP_DEBUG === 'true';
let scope = `openid profile ms.ipcs ms.ifms ms.icms ms.idms ms.iros ${
  isDebug ? 'offline_access' : ''
}`;
let authority = isDebug ? 'http://msdev-login.ilng.cn:30080' : 'http://localhost:7008';

const userManager = new UserManager({
  ...userManagerSettings,
  authority,
  client_id: 'test',
  redirect_uri: `${window.location.origin}/callback`,
  response_type: 'code',
  scope,
  post_logout_redirect_uri: window.location.origin,
  silent_redirect_uri: `${window.location.origin}/silentrenew`,
  accessTokenExpiringNotificationTime: 10,
  automaticSilentRenew: true,
  monitorSession: !isDebug,
});

console.log('UserManager:', userManager);

Log.logger = console;
Log.level = Log.DEBUG;

userManager.events.addUserLoaded((user) => {
  console.log('新的用户已加载:', user);
});

userManager.events.addUserUnloaded(() => {
  console.log('用户会话终止.');
});

userManager.events.addAccessTokenExpiring(() => {
  console.log('访问令牌即将过期');
});

userManager.events.addAccessTokenExpired(() => {
  console.log('访问令牌已过期，开始静默刷新');

  userManager.signinSilent();
});

userManager.events.addSilentRenewError((err) => {
  console.error('静默刷新失败:', err);

  // ids登录的session已过期
  if (err.error === 'login_required') {
    alert('身份信息已过期');
    userManager.removeUser().then(() => {
      alert('移除用户信息');
      userManager.signinRedirect().catch((err) => {
        console.log(err);
      });
    });
  } else {
    userManager
      .signoutRedirect()
      .then((resp) => {
        console.log('signed out', resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

userManager.events.addUserSignedOut(() => {
  alert('用户已注销登录');
  userManager.signinRedirect().catch((err) => {
    console.log(err);
  });
});

class SecurityService {
  // 重新刷新token
  renewToken() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .signinSilent()
        .then((user) => {
          if (user == null) {
            self.signIn(null);
          } else {
            return resolve(user);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取登录用户
  getUser() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 检查用户是否已登录
  getSignedIn() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(false);
          } else {
            return resolve(true);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 重定向当前窗口到认证端点
  signIn() {
    if (window.location.href.indexOf('callback') !== -1) {
      return;
    }

    if (window.location.href.indexOf('silentrenew') !== -1) {
      return;
    }

    userManager.signinRedirect().catch((err) => {
      console.log(err);
    });
  }

  // 重定向当前窗口到认证端点到结束会话端点
  signOut() {
    userManager
      .signoutRedirect()
      .then((resp) => {
        console.log('signed out', resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 获取用户信息
  getProfile() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.profile);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取idtoken
  getIdToken() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.id_token);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取会话状态
  getSessionState() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.session_state);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取访问令牌
  getAcessToken() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.access_token);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取登录用户的作用域
  getScopes() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.scopes);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取用户角色
  getRole() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.profile.role);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // 获取用户名
  getUserName() {
    let self = this;
    return new Promise((resolve, reject) => {
      userManager
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          } else {
            return resolve(user.profile.name);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }
}

const securityService = new SecurityService();

export default securityService;
