/**
 @Name：学生信息管理
 */


layui.define(['table', 'form'], function(exports){
    var $ = layui.$
        ,admin = layui.admin
        ,view = layui.view
        ,table = layui.table
        ,form = layui.form
        ,setter = layui.setter;

    //学生列表
    table.render({
        elem: '#LAY-admin-student-list'
        ,url: setter.userRole.admin.api + '/student'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-student-list'
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'number', title: "学号", minWidth: 125, align: 'center'}
            ,{field: 'name', title: "姓名", minWidth: 100, align: 'center'}
            ,{field: 'sex_name', title: "性别", minWidth: 60, align: 'center'}
            ,{field: 'user_name_id', title: "用户名（ID）", minWidth: 150, align: 'center'}
            ,{field: 'class_abbr_name', title: "所属班级", minWidth: 150, align: 'center'}
            ,{field: 'phone', title: "联系方式（手机）", minWidth: 150, align: 'center'}
            ,{field: 'identity_number', title: "身份证号码", minWidth: 180, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-student-list', minWidth: 225, unresize: true, align: 'center'}
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
    table.on('tool(LAY-admin-student-list)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
            var nowId = data.id;
            layer.confirm('确认删除' + data.name + '吗？', function(index){
                admin.req({
                    url: setter.userRole.admin.api + '/student/' + nowId
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
                        layui.table.reload('LAY-admin-student-list'); //重载表格
                        layer.close(index); //执行关闭
                    }
                });
            });
        } else if(obj.event === 'edit'){
            admin.popup({
                title: '编辑学生'
                ,area: ['400px', '520px']
                ,id: 'LAY-popup-user-add'
                ,success: function(layero, index){
                    view(this.id).render('admin/student/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-student');
                        //监听提交
                        var nowId = data.id;
                        form.on('submit(LAY-admin-student-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            //提交 Ajax 成功后，关闭当前弹层并重载表格
                            admin.req({
                                url: setter.userRole.admin.api + '/student/' + nowId
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
                                    layui.table.reload('LAY-admin-student-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            })
                        });
                    });
                }
            });
        } else if (obj.event === 'register') {
            admin.popup({
                title: '为'+ data.name +'创建用户'
                ,area: ['400px', '580px']
                ,id: 'Lay-popup-student-register'
                ,success: function (layero, index) {
                    view(this.id).render('admin/student/register', data).done(function () {
                        form.render(null, 'layuiadmin-form-user');
                        var nowId = data.id;
                        form.on('submit(LAY-admin-user-submit)', function (data) {
                            var field = data.field;
                            admin.req({
                                url: setter.userRole.admin.api + '/student/' + nowId + '/register'
                                ,type: 'POST'
                                ,contentType: 'application/json'
                                ,data: JSON.stringify(field)
                                ,dataType: 'json'
                                ,done: function(res) {
                                    layer.msg(res.msg, {
                                        offset: '15px'
                                        ,icon: 1
                                        ,time: 1000
                                    });
                                    layui.table.reload('LAY-admin-student-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            });
                        });
                    });
                }
            });
        }
    });

    // 学生列表（多选)
    table.render({
        elem: '#LAY-admin-student-checkbox-list'
        ,url: setter.userRole.admin.api + '/student'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-student-list'
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', width: 85, title: 'ID', unresize: true}
            ,{field: 'number', title: "工号"}
            ,{field: 'name', title: "姓名"}
            ,{field: 'sex_name', title: "性别", width: 60}
            ,{field: 'user_name_id', title: "用户名（ID）"}
            ,{field: 'phone', title: "联系方式（手机）"}
            ,{field: 'created_at', title: "创建时间"}
            ,{field: 'updated_at', title: "修改时间"}
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

    exports('admin/student', {})
});