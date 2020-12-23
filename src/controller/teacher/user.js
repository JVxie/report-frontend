/**
 @Name：用户信息管理
 */


layui.define(['table', 'form'], function(exports){
    var $ = layui.$
        ,admin = layui.admin
        ,view = layui.view
        ,table = layui.table
        ,form = layui.form
        ,setter = layui.setter
        // ,layer = layui.layer
    ;

    //用户列表
    table.render({
        elem: '#LAY-teacher-user-list'
        ,url: setter.userRole.teacher.api + '/user'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', title: 'ID', unresize: true, minWidth: 85, align: 'center'}
            ,{field: 'username', title: "用户名", minWidth: 125, align: 'center'}
            ,{field: 'nickname', title: "昵称", minWidth: 125, align: 'center'}
            ,{field: 'user_role_name', title: "角色", minWidth: 100, align: 'center'}
            ,{field: 'user_email', title: "邮箱", minWidth: 150, align: 'center'}
            ,{field: 'user_phone', title: "手机", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-teacher-user-list', unresize: true, minWidth: 225, align: 'center'}
        ]]
        ,parseData: function(res){ //res 即为原始返回的数据
            return {
                "code": res.status, //解析接口状态
                "msg": res.msg, //解析提示文本
                "count": res.data.total,
                "data": res.data.list //解析数据列表
            };
        }
        ,page: true
        ,limit: 30
        ,text:{none: '无数据'}
    });

    //监听工具条
    table.on('tool(LAY-teacher-user-list)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
            var nowId = data.id;
            // if (nowId === )
            layer.confirm('确认删除' + data.nickname + '吗？', function(index){
                admin.req({
                    url: setter.userRole.teacher.api + '/user/' + nowId
                    ,type: 'DELETE'
                    ,headers: {
                        Authorization: setter.request.tokenPrefix + layui.data(setter.tableName).token
                    }
                    ,dataType: 'json'
                    ,done: function(res) {
                        layer.msg(res.msg, {
                            offset: '15px'
                            ,icon: 1
                            ,time: 1000
                        });
                        layui.table.reload('LAY-teacher-user-list'); //重载表格
                        layer.close(index); //执行关闭
                    }
                });
            });
        } else if(obj.event === 'edit'){
            admin.popup({
                title: '编辑用户'
                ,area: ['400px', '475px']
                ,id: 'LAY-popup-user-add'
                ,success: function(layero, index){
                    view(this.id).render('teacher/user/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-user');
                        //监听提交
                        var nowId = data.id;
                        form.on('submit(LAY-teacher-user-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            //提交 Ajax 成功后，关闭当前弹层并重载表格
                            admin.req({
                                url: setter.userRole.teacher.api + '/user/' + nowId
                                ,type: 'PUT'
                                ,headers: {
                                    Authorization: setter.request.tokenPrefix + layui.data(setter.tableName).token
                                }
                                ,contentType: 'application/json'
                                ,data: JSON.stringify(field)
                                ,dataType: 'json'
                                ,done: function(res) {
                                    layer.msg(res.msg, {
                                        offset: '15px'
                                        ,icon: 1
                                        ,time: 1000
                                    });
                                    layui.table.reload('LAY-teacher-user-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            })
                        });
                    });
                }
            });
        } else if (obj.event == 'reset_password') {
            layer.confirm('确认重置' + data.nickname + '的密码吗？<br>该操作会将此用户密码重置为123456', {icon: 3, title:'提示'}, function (index) {
                var nowId = data.id;
                admin.req({
                    url: setter.userRole.teacher.api + '/user/' + nowId + '/reset_password'
                    ,type: 'POST'
                    ,headers: {
                        Authorization: setter.request.tokenPrefix + layui.data(setter.tableName).token
                    }
                    ,dataType: 'json'
                    ,done: function(res) {
                        layer.msg(res.msg, {
                            offset: '15px'
                            ,icon: 1
                            ,time: 1000
                        });
                        layer.close(index); //执行关闭
                    }
                });
            });
        }
    });


    exports('teacher/user', {})
});