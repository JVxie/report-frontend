/**
 @Name：教师信息管理
 */


layui.define(['table', 'form'], function(exports){
    var $ = layui.$
        ,admin = layui.admin
        ,view = layui.view
        ,table = layui.table
        ,form = layui.form
        ,setter = layui.setter;

    //教师列表
    table.render({
        elem: '#LAY-admin-teacher-list'
        ,url: setter.userRole.admin.api + '/teacher'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-teacher-list'
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', title: 'ID', unresize: true, minWidth: 85, align: 'center'}
            ,{field: 'number', title: "工号", minWidth: 125, align: 'center'}
            ,{field: 'name', title: "姓名", minWidth: 100, align: 'center'}
            ,{field: 'sex_name', title: "性别", minWidth: 60, align: 'center'}
            ,{field: 'user_name_id', title: "用户名（ID）", minWidth: 150, align: 'center'}
            ,{field: 'phone', title: "联系方式（手机）", minWidth: 150, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-teacher-list', unresize: true, minWidth: 225, align: 'center'}
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

    //监听教师列表工具条
    table.on('tool(LAY-admin-teacher-list)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
            var nowId = data.id;
            layer.confirm('确认删除' + data.name + '吗？', function(index){
                admin.req({
                    url: setter.userRole.admin.api + '/teacher/' + nowId
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
                        layui.table.reload('LAY-admin-teacher-list'); //重载表格
                        layer.close(index); //执行关闭
                    }
                });
            });
        } else if(obj.event === 'edit'){
            admin.popup({
                title: '编辑教师'
                ,area: ['400px', '450px']
                ,id: 'LAY-popup-teacher-edit'
                ,success: function(layero, index){
                    view(this.id).render('admin/teacher/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-teacher');
                        //监听提交
                        var nowId = data.id;
                        form.on('submit(LAY-admin-teacher-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            //提交 Ajax 成功后，关闭当前弹层并重载表格
                            admin.req({
                                url: setter.userRole.admin.api + '/teacher/' + nowId
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
                                    layui.table.reload('LAY-admin-teacher-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            });
                        });
                    });
                }
            });
        } else if (obj.event === 'register') {
            admin.popup({
                title: '为'+ data.name + '创建用户'
                ,area: ['400px', '580px']
                ,id: 'Lay-popup-teacher-register'
                ,success: function (layero, index) {
                    view(this.id).render('admin/teacher/register', data).done(function () {
                        form.render(null, 'layuiadmin-form-user');
                        var nowId = data.id;
                        form.on('submit(LAY-admin-user-submit)', function (data) {
                            var field = data.field;
                            admin.req({
                                url: setter.userRole.admin.api + '/teacher/' + nowId + '/register'
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
                                    layui.table.reload('LAY-admin-teacher-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            });
                        });
                    });
                }
            });
        }
    });

    //教师列表（班级设置页）
    table.render({
        elem: '#LAY-admin-teacher-list-classes'
        ,url: setter.userRole.admin.api + '/teacher'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            // {type: '', fixed: 'left'}
            // ,
            {fixed: 'left', field: 'id', title: 'ID', unresize: true, minWidth: 85, align: 'center'}
            ,{field: 'number', title: "工号", minWidth: 125, align: 'center'}
            ,{field: 'name', title: "姓名", minWidth: 100, align: 'center'}
            ,{field: 'sex_name', title: "性别", minWidth: 60, align: 'center'}
            ,{field: 'user_name_id', title: "用户名（ID）", minWidth: 150, align: 'center'}
            ,{field: 'phone', title: "联系方式（手机）", minWidth: 150, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-teacher-list', unresize: true, minWidth: 120, align: 'center'}
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

    table.on('tool(LAY-admin-teacher-list-classes)', function(obj) {
        let data = obj.data;
        if (obj.event === 'check') {
            admin.popup({
                title: '设置'+ data.name +'管理的班级'
                ,area: ['1000px', '700px']
                ,id: 'LAY-admin-teacher-classes-select'
                ,success: function (layero, index) {
                    view(this.id).render('admin/class/checkbox_list', data).done(function () {
                        admin.req({
                            url: setter.userRole.admin.api + '/teacher/' + data.id + '/classes'
                            ,type: 'GET'
                            ,dataType: 'json'
                            ,done: function (res) {
                                res.data.forEach(function (item) {
                                    $('#classes-button').append(getClassButtonHtml(item));
                                });
                                $('.layui-btn.class-id').on('click', function() {
                                    $(this).remove();
                                });
                            }
                        });

                        $('#LAY-admin-class-checkbox-list-select').on('click', function () {
                            let classIdSet = new Set();
                            $('#classes-button').children('button').each(function (key, item) {
                                // console.log(item.id);
                                classIdSet.add(getClassIdByButtonId(item.id));
                            });
                            admin.req({
                                url: setter.userRole.admin.api + '/teacher/' + data.id + '/classes'
                                ,type: 'POST'
                                ,data: JSON.stringify({
                                    class_id_set: Array.from(classIdSet)
                                })
                                ,contentType: 'application/json'
                                ,dataType: 'json'
                                ,done: function (res) {
                                    layer.msg(res.msg, {
                                        offset: '15px'
                                        ,icon: 1
                                        ,time: 1000
                                    });
                                    layui.table.reload('LAY-admin-teacher-list-classes');
                                    layer.close(index);
                                }
                            });
                        });
                    });
                }
            });
        }

        function getClassButtonHtml(item) {
            return '<button class="layui-btn class-id layui-btn-primary layui-btn-sm" id="'
                + 'class-select-id-' + item.id
                + '">'
                + item.abbr_name
                + '<i class="layui-icon layui-icon-close"></i></button>';
        }

        function getClassIdByButtonId(buttonId) {
            let _data = buttonId.split('-');
            return parseInt(_data.pop());
        }
    });

    exports('admin/teacher', {})
});