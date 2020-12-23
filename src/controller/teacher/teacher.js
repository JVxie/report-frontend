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
        elem: '#LAY-teacher-teacher-list'
        ,url: setter.userRole.teacher.api + '/teacher'
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
            ,{field: 'number', title: "工号", minWidth: 125, align: 'center'}
            ,{field: 'name', title: "姓名", minWidth: 100, align: 'center'}
            ,{field: 'sex_name', title: "性别", minWidth: 60, align: 'center'}
            ,{field: 'phone', title: "联系方式（手机）", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-teacher-teacher-list', unresize: true, minWidth: 120, align: 'center'}
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
    table.on('tool(LAY-teacher-teacher-list)', function(obj){
        var data = obj.data;
        if(obj.event === 'check'){
            admin.popup({
                title: '查看教师信息'
                ,area: ['400px', '450px']
                ,id: 'LAY-popup-teacher-edit'
                ,success: function(layero, index){
                    view(this.id).render('teacher/teacher/form', data).done(function(){

                    });
                }
            });
        }
    });


    exports('teacher/teacher', {})
});