/**
 @Name班级信息管理
 */


layui.define(['table', 'form'], function(exports){
    var $ = layui.$
        ,admin = layui.admin
        ,view = layui.view
        ,table = layui.table
        ,form = layui.form
        ,setter = layui.setter;

    //班级列表
    table.render({
        elem: '#LAY-student-class-list'
        ,url: setter.userRole.student.api + '/class'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'abbr_name', title: "班级缩写名称", minWidth: 120, align: 'center'}
            ,{field: 'grade_name', title: "年级", minWidth: 90, align: 'center'}
            ,{field: 'major_name', title: "专业", minWidth: 180, align: 'center'}
            ,{field: 'num', title: '班级号', minWidth: 90, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-student-class-list', minWidth: 100, unresize: true, align: 'center'}
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
    table.on('tool(LAY-student-class-list)', function(obj){
        let data = obj.data;
        if(obj.event === 'check'){
            admin.popup({
                title: '查看班级信息'
                ,area: ['400px', '450px']
                ,id: 'LAY-student-class-update'
                ,success: function(layero, index){
                    view(this.id).render('student/class/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-class');
                        //监听提交
                        var nowId = data.id;
                        form.on('submit(LAY-admin-class-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            //提交 Ajax 成功后，关闭当前弹层并重载表格
                            admin.req({
                                url: setter.userRole.student.api + '/class/' + nowId
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
                                    layui.table.reload('LAY-student-class-list'); //重载表格
                                    layer.close(index); //执行关闭
                                }
                            })
                        });
                    });
                }
            });
        }
    });

    //班级列表（单选）
    table.render({
        elem: '#LAY-student-class-radio-list'
        ,url: setter.userRole.student.api + '/class'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'radio', fixed: 'left'}
            ,{fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'abbr_name', title: "班级缩写名称", minWidth: 120, align: 'center'}
            ,{field: 'grade_name', title: "年级", minWidth: 90, align: 'center'}
            ,{field: 'major_name', title: "专业", minWidth: 180, align: 'center'}
            ,{field: 'num', title: '班级号', minWidth: 90, align: 'center'}
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

    exports('student/class', {})
});