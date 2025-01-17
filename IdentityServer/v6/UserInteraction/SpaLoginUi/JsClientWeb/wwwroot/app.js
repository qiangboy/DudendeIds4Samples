function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api-product").addEventListener("click", apiProduct, false);
document.getElementById("api-order").addEventListener("click", apiOrder, false);
document.getElementById("logout").addEventListener("click", logout, false);

var config = {
    authority: "http://124.221.169.49:5000",
    //authority: "http://localhost:5000",
    client_id: "test",
    //redirect_uri: "http://localhost:5003/callback.html",
    redirect_uri: "http://124.221.169.49:5003/callback.html",
    response_type: "code",
    scope: "openid profile ms.product", // offline_access",
    //post_logout_redirect_uri: "http://localhost:5003/index.html",
    post_logout_redirect_uri: "http://124.221.169.49:5003/index.html",
    // 访问令牌提前通知时间，以触发AccessTokenExpiring事件和静默刷新token
    // 如果访问令牌的有效期是20秒，则每20-10=10秒触发一次AccessTokenExpiring事件和静默刷新token
    accessTokenExpiringNotificationTime: 5,
    //// 是否静默刷新访问令牌，如果含有offline_access的scope，则通过刷新令牌去重新获取访问令牌，
    //// 否则通过/authrize/token端点获取访问令牌（这样会导致ids的会话永不过期），解决方案是静默刷新token的间隔时间必须大于ids会话时间
    //// 如果是含有offline_access的scope，则把ids会话时间设置为和AbsoluteRefreshTokenLifetime一致
    automaticSilentRenew: true,
    //// 静默刷新令牌地址
    //silent_redirect_uri: "http://localhost:5003/silentrenew.html",
    silent_redirect_uri: "http://124.221.169.49:5003/silentrenew.html",
    //// 注销时撤销访问令牌
    //revokeAccessTokenOnSignout: true,
    monitorSession: true,
    userStore: new Oidc.WebStorageStateStore()
};
var mgr = new Oidc.UserManager(config);
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

//mgr.events.addUserLoaded(function (user) {
//    console.log("User loaded");
//});
//mgr.events.addUserUnloaded(function () {
//    console.log("User logged out locally");
//});
mgr.events.addAccessTokenExpiring(function () {
    console.log("Access token expiring..." + new Date());
});
mgr.events.addAccessTokenExpired(function () {
    console.log('访问令牌已过期，开始静默刷新');

    mgr.signinSilent();
});

mgr.events.addSilentRenewError(function (err) {
    console.error('静默刷新失败:', err);

    // ids登录的session已过期
    if (err.error === 'login_required') {
        alert('身份信息已过期');
        mgr.removeUser().then(() => {
            alert('移除用户信息');
            mgr.signinRedirect().catch((err) => {
                console.log(err);
            });
        });
    } else {
        mgr
            .signoutRedirect()
            .then((resp) => {
                console.log('signed out', resp);
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

mgr.events.addUserLoaded((user) => {
    console.log('新的用户已加载:', user);
});

mgr.events.addUserSignedOut(() => {
    alert('用户已注销登录');
    mgr.signinRedirect().catch((err) => {
        console.log(err);
    });
});

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
        console.log(user);
    }
    else {
        log("User not logged in");
        login();
    }
});

function login() {
    mgr.signinRedirect();
}

function apiProduct() {
    // 调用方法时，如果token已经过期，也会触发AccessTokenExpired事件
    mgr.getUser().then(function (user) {
        var url = "http://124.221.169.49:5100/api/product";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, xhr.responseText);
        }

        xhr.withCredentials = true; // 启用跨域请求携带Cookie
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();
    });
}

function apiOrder() {
    mgr.getUser().then(function (user) {
        var url = "http://124.221.169.49:5100/api/order";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, xhr.responseText);
        }

        xhr.withCredentials = true; // 启用跨域请求携带Cookie
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}