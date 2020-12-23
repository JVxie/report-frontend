layui.define(['form'], function (exports) {
    var $ = layui.$
        , layer = layui.layer
        , laytpl = layui.laytpl
        , setter = layui.setter
        , view = layui.view
        , admin = layui.admin
        , form = layui.form
    ;

    var $body = $('body');

    form.render();

    //自定义验证
    form.verify({
        username: [
            /^[\u4E00-\u9FA5A-Za-z0-9_]{5,18}$/
            , '用户名只能包含中文、英文、数字和下划线，长度在5~18之间'
        ]

        , nickname: [
            /\S{3,20}/
            , '昵称不能包含空白字符，且长度在3~20之间'
        ]

        , user_email: [
            /(^$)|(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/
            , '请填写正确的邮箱'
        ]

        , user_phone: [
            /(^$)|(^1[3-9]\d{9}$)/
            , '请填写正确的手机号码'
        ]

        , password: [
            /[\w]{6,18}$/
            , '密码只能包含数字、字母和下划线，长度在6~18之间'
        ]

        //确认密码
        , confirm_password: function (value) {
            if (value !== $('#LAY_password').val()) {
                return '两次密码输入不一致';
            }
        }
    });

    //设置我的资料
    form.on('submit(Lay-set-user-info)', function (obj) {
        // layer.msg(JSON.stringify(obj.field));
        layer.confirm('确认修改信息吗？', {icon: 3}, function (index) {
            admin.req({
                url: setter.apiUrl + '/user/info'
                , type: 'PUT'
                , contentType: 'application/json'
                , data: JSON.stringify(obj.field)
                , dataType: 'json'
                , done: function (res) {
                    layer.msg(res.msg, {
                        offset: '15px'
                        ,icon: 1
                        ,time: 1000
                    }, function () {
                        layer.close(index);
                        location.reload();
                    });
                }
            });
        });
        //提交修改


        return true;
    });

    //设置密码
    form.on('submit(Lay-set-user-password)', function (obj) {
        // layer.msg(JSON.stringify(obj.field));
        layer.confirm('确认修改密码吗？', {icon: 3}, function (index) {
            //提交修改
            admin.req({
                url: setter.apiUrl + '/user/password'
                , type: 'POST'
                , contentType: 'application/json'
                , data: JSON.stringify(obj.field)
                , dataType: 'json'
                , done: function (res) {
                    layer.msg(res.msg, {
                        offset: '15px'
                        ,icon: 1
                        ,time: 1000
                    }, function () {
                        layer.close(index);
                        admin.req({
                            url: setter.apiUrl + '/user/logout'
                            ,type: 'post'
                            ,data: {}
                            ,done: function(res){
                                //清空本地记录的 token，并跳转到登入页
                                admin.exit();
                            }
                        });
                    });
                }
            });
        });

        return true;
    });

    //对外暴露的接口
    exports('set', {});
});