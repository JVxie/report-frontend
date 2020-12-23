/**
 @Name：年级信息管理
 */


layui.define(['table', 'form'], function(exports){
    var $ = layui.$
        ,admin = layui.admin
        ,view = layui.view
        ,table = layui.table
        ,form = layui.form
        ,setter = layui.setter;

    //年级列表
    table.render({
        elem: '#LAY-admin-grade-list'
        ,url: setter.userRole.admin.api + '/grade'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{field: 'id', title: 'ID', width: 85, unresize: true, fixed: 'left', align:'center'}
            ,{field: 'name', title: "年级名称", minWidth: 100, align:'center'}
            ,{field: 'created_at', title: "创建时间", align:'center', minWidth: 150}
            ,{field: 'updated_at', title: "修改时间", align:'center', minWidth: 150}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-grade-list', width: 150, unresize: true, align:'center'}
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
    table.on('tool(LAY-admin-grade-list)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
            var nowId = data.id;
            layer.confirm('确认删除' + data.name + '吗？注意：该操作会删除年级包含的所有专业、班级。', function(index){
                admin.req({
                    url: setter.userRole.admin.api + '/grade/' + nowId
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
                        layui.table.reload('LAY-admin-grade-list'); //重载表格
                        layer.close(index); //执行关闭
                    }
                });
            });
        } else if(obj.event === 'edit'){
            admin.popup({
                title: '编辑年级'
                ,area: ['350px', '250px']
                ,id: 'LAY-popup-user-add'
                ,success: function(layero, index){
                    view(this.id).render('admin/grade/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-grade');
                        //监听提交
                        var nowId = data.id;
                        form.on('submit(LAY-admin-grade-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            //提交 Ajax 成功后，关闭当前弹层并重载表格
                            admin.req({
                                url: setter.userRole.admin.api + '/grade/' + nowId
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
                                    layui.table.reload('LAY-admin-grade-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            })
                        });
                    });
                }
            });
            console.log();
        }
    });

    // 学院列表（单选）
    table.render({
        elem: '#LAY-admin-grade-radio-list'
        ,url: setter.userRole.admin.api + '/grade'
        // ,toolbar: '#LAY-admin-college-radio-list-toolbar'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'radio', fixed: 'left'}
            ,{field: 'id', title: 'ID', width: 85, unresize: true, fixed: 'left', align:'center'}
            ,{field: 'name', title: "年级名称", minWidth: 100, align:'center'}
            ,{field: 'created_at', title: "创建时间", align:'center', minWidth: 150}
            ,{field: 'updated_at', title: "修改时间", align:'center', minWidth: 150}
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

    exports('admin/grade', {})
});