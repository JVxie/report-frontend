form.on('submit(LAY-user-login-submit)', function (obj) {
    admin.req({
        url: setter.apiUrl + '/user/login'
        , method: 'POST'
        , data: JSON.stringify(obj.field)
        , contentType: "application/json"
        , dataType: 'json'
        , done: function (res) {
            layui.data(setter.tableName, {
                key: setter.request.tokenName
                , value: res.data.token
            });
            layer.msg('登录成功', {
                offset: '15px'
                , icon: 1
                , time: 1000
            }, function () {
                location.hash = search.redirect ? decodeURIComponent(search.redirect) : '/';
            });
        }
    });
});