/**
 @Name：学生疫情信息管理
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
        ,url: setter.userRole.admin.api + '/student/report'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-student-list'
        ,cols: [[
            // {type: 'checkbox', fixed: 'left'}
            // {fixed: 'left', field: 'id', minWidth: 85, title: '学生ID', unresize: true, align: 'center'}
            {field: 'number', title: "学号", minWidth: 125, align: 'center'}
            ,{field: 'name', title: "姓名", minWidth: 100, align: 'center'}
            ,{field: 'sex_name', title: "性别", width: 60, align: 'center'}
            ,{field: 'user_name_id', title: "用户名（ID）", minWidth: 150, align: 'center'}
            ,{field: 'class_abbr_name', title: "所属班级", minWidth: 150, align: 'center'}
            ,{fixed: 'right', field:'status', title:'填报状态', minWidth:100, templet: '#table-admin-student-report-status', unresize: true, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-student-list', minWidth: 85, unresize: true, align: 'center'}
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
            var nowId = data.report_today.id;
            layer.confirm('确认删除' + data.name + '的今日填报信息吗？', function(index){
                admin.req({
                    url: setter.userRole.admin.api + '/student/report/' + nowId
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
        } else if(obj.event === 'check'){
            admin.popup({
                title: '查看学生填报信息'
                ,area: ['400px', '520px']
                ,id: 'LAY-popup-user-add'
                ,success: function(layero, index){
                    view(this.id).render('admin/student/report/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-student');
                    });
                }
            });
        }
    });


    exports('admin/student/report', {})
});