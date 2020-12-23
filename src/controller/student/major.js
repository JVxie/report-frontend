/**
 @Name：专业信息管理
 */


layui.define(['table', 'form'], function(exports){
    var $ = layui.$
        ,admin = layui.admin
        ,view = layui.view
        ,table = layui.table
        ,form = layui.form
        ,setter = layui.setter;

    //专业列表
    table.render({
        elem: '#LAY-student-major-list'
        ,url: setter.userRole.student.api + '/major'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', width: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'name', title: "专业名称", minWidth: 200, align: 'center'}
            ,{field: 'college_name', title: "所属学院", minWidth: 150, align: 'center'}
            ,{field: 'category_name', title: "专业类别", minWidth: 100, align: 'center'}
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

    // 专业列表（单选)
    table.render({
        elem: '#LAY-student-major-radio-list'
        ,url: setter.userRole.student.api + '/major'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {type: 'radio', fixed: 'left'}
            ,{fixed: 'left', field: 'id', width: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'name', title: "专业名称", minWidth: 200, align: 'center'}
            ,{field: 'college_name', title: "所属学院", minWidth: 150, align: 'center'}
            ,{field: 'category_name', title: "专业类别", minWidth: 100, align: 'center'}
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

    exports('student/major', {})
});