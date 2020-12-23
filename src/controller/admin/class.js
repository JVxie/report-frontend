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
        elem: '#LAY-admin-class-list'
        ,url: setter.userRole.admin.api + '/class'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-class-list'
        ,cols: [[
            {type: 'checkbox', fixed: 'left'}
            ,{fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'abbr_name', title: "班级缩写名称", minWidth: 120, align: 'center'}
            ,{field: 'grade_name', title: "年级", minWidth: 90, align: 'center'}
            ,{field: 'major_name', title: "专业", minWidth: 180, align: 'center'}
            ,{field: 'num', title: '班级号', minWidth: 90, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-class-list', minWidth: 150, unresize: true, align: 'center'}
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
    table.on('tool(LAY-admin-class-list)', function(obj){
        let data = obj.data;
        if(obj.event === 'del'){
            var nowId = data.id;
            layer.confirm('确认删除' + data.name + '吗？', function(index){
                admin.req({
                    url: setter.userRole.admin.api + '/class/' + nowId
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
                        layui.table.reload('LAY-admin-class-list'); //重载表格
                        layer.close(index); //执行关闭
                    }
                });
            });
        } else if(obj.event === 'edit'){
            admin.popup({
                title: '编辑班级'
                ,area: ['400px', '450px']
                ,id: 'LAY-admin-class-update'
                ,success: function(layero, index){
                    view(this.id).render('admin/class/form', data).done(function(){
                        form.render(null, 'layuiadmin-form-class');
                        //监听提交
                        var nowId = data.id;
                        form.on('submit(LAY-admin-class-submit)', function(data){
                            var field = data.field; //获取提交的字段
                            //提交 Ajax 成功后，关闭当前弹层并重载表格
                            admin.req({
                                url: setter.userRole.admin.api + '/class/' + nowId
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
                                    layui.table.reload('LAY-admin-class-list'); //重载表格
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
        elem: '#LAY-admin-class-radio-list'
        ,url: setter.userRole.admin.api + '/class'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-class-list'
        ,cols: [[
            {type: 'radio', fixed: 'left'}
            ,{fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'abbr_name', title: "班级缩写名称", minWidth: 120, align: 'center'}
            ,{field: 'grade_name', title: "年级", minWidth: 90, align: 'center'}
            ,{field: 'major_name', title: "专业", minWidth: 180, align: 'center'}
            ,{field: 'num', title: '班级号', minWidth: 90, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
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

    //班级列表（教师设置页）
    table.render({
        elem: '#LAY-admin-class-list-teachers'
        ,url: setter.userRole.admin.api + '/class'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        // , toolbar: '#table-admin-class-list'
        ,cols: [[
            {fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'abbr_name', title: "班级缩写名称", minWidth: 120, align: 'center'}
            ,{field: 'grade_name', title: "年级", minWidth: 90, align: 'center'}
            ,{field: 'major_name', title: "专业", minWidth: 180, align: 'center'}
            ,{field: 'num', title: '班级号', minWidth: 90, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-class-list-teachers', minWidth: 120, unresize: true, align: 'center'}
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

    table.on('tool(LAY-admin-class-list-teachers)', function (obj) {
        let data = obj.data;
        if (obj.event === 'check') {
            // layer.msg(data);
            admin.popup({
                title: '查看' + data.abbr_name + '的分管教师'
                , area: ['350px', '450px']
                , id: 'Lay-admin-class-teachers-select'
                , success: function (layero, index) {
                    view(this.id).render('admin/teacher/checkbox_list', data).done(function () {
                        admin.req({
                            url: setter.userRole.admin.api + '/class/' + data.id + '/teachers'
                            ,type: 'GET'
                            ,dataType: 'json'
                            ,done: function (res) {
                                res.data.forEach(function (item) {
                                    $('#teachers-button').append(getTeacherButtonHtml(item));
                                });
                                $('.layui-btn.teacher-id').on('click', function() {
                                    let teacherId = getTeacherIdByButtonId(this.id);
                                    admin.req({
                                        url: setter.userRole.admin.api + '/teacher/' + teacherId
                                        ,type: 'GET'
                                        ,dataType: 'json'
                                        ,done: function (res_p) {
                                            admin.popup({
                                                title: '教师信息'
                                                ,area: ['400px', '350px']
                                                ,success: function (layero, index) {
                                                    view(this.id).render('admin/teacher/look_form', res_p.data);
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            });

        }

        function getTeacherButtonHtml(item) {
            return '<button class="layui-btn teacher-id layui-btn-primary" id="'
                + 'teacher-select-id-' + item.id
                + '">'
                + item.name + '(' + item.number + ')'
                + '</button>';
        }

        function getTeacherIdByButtonId(buttonId) {
            let _data = buttonId.split('-');
            return parseInt(_data.pop());
        }
    });

    //班级列表（多选）
    table.render({
        elem: '#LAY-admin-class-checkbox-list'
        ,url: setter.userRole.admin.api + '/class'
        ,headers: {
            'Authorization': setter.request.tokenPrefix + layui.data(setter.tableName).token
        }
        ,request: {
            pageName: 'page_num' //页码的参数名称，默认：page
            ,limitName: 'page_size' //每页数据量的参数名，默认：limit
        }
        ,cols: [[
            {fixed: 'left', field: 'id', minWidth: 85, title: 'ID', unresize: true, align: 'center'}
            ,{field: 'abbr_name', title: "班级缩写名称", minWidth: 120, align: 'center'}
            ,{field: 'grade_name', title: "年级", minWidth: 90, align: 'center'}
            ,{field: 'major_name', title: "专业", minWidth: 180, align: 'center'}
            ,{field: 'num', title: '班级号', minWidth: 90, align: 'center'}
            ,{field: 'created_at', title: "创建时间", minWidth: 150, align: 'center'}
            ,{field: 'updated_at', title: "修改时间", minWidth: 150, align: 'center'}
            ,{title: '操作', fixed: 'right', toolbar: '#table-admin-class-checkbox-list', minWidth: 85, unresize: true, align: 'center'}
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

    table.on('tool(LAY-admin-class-checkbox-list)', function(obj) {
        let data = obj.data;
        let classIdSet = new Set();
        if (obj.event === 'add') {
            // layer.msg(JSON.stringify(data));
            $('#classes-button').children('button').each(function (key, item) {
                classIdSet.add(getClassIdByButtonId(item.id));
            });
            if (!(classIdSet.has(data.id))) {
                $('#classes-button').append(getClassButtonHtml(data));
                // 重新监听
                $('.layui-btn.class-id').on('click', function() {
                    $(this).remove();
                });
            }
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

    exports('admin/class', {})
});