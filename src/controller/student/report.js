layui.define(['admin', 'form'], function (exports) {
    var $ = layui.$
        , admin = layui.admin
        , form = layui.form
        , setter = layui.setter
        , view = layui.view
        ,router = layui.router()
        ,search = router.search
    ;

    let areaMapProvince = [];
    let areaMapCity = [];
    let areaMapArea = [];

    const BASE_AREA_MAP_PROVINCE_OPTION_HTML = '<option value="">请选择省/直辖市</option>';
    const BASE_AREA_MAP_CITY_OPTION_HTML = '<option value="">请选择市</option>';
    const BASE_AREA_MAP_AREA_OPTION_HTML = '<option value="">请选择区/县</option>';

    admin.req({
        url: setter.apiUrl + '/area_map/'
        , type: 'GET'
        , dataType: 'json'
        , async:false
        , done: function (res) {
            // console.log(res);
            layui.each(res.data, function(index, item) {
                areaMapProvince.push(item);
                layui.each(item.list, function(index, item) {
                    areaMapCity.push(item);
                    layui.each(item.list, function(index, item) {
                       areaMapArea.push(item);
                    });
                });
            });
            let options = BASE_AREA_MAP_PROVINCE_OPTION_HTML + getOptions(areaMapProvince);
            $('.area-map-province').html(options);
            $('.area-map-city').html(BASE_AREA_MAP_CITY_OPTION_HTML)
            $('.area-map-area').html(BASE_AREA_MAP_AREA_OPTION_HTML);
            form.render('select');
        }
    });


    function getOptions(data, selectIndex = -1) {
        let options = '';
        // console.log(112233);
        // console.log(data);
        layui.each(data, function (index, item) {
            // console.log(item);
            options += getOptionHtml(item.id, item.ext_name, item.id == selectIndex);
            // console.log(options);
        });
        return options;
    }

    function getOptionHtml(value, name, selected = false) {
        return '<option value="' + value + '"' + (selected ? ' selected' : '') +'>' + name + '</option>';
    }

    // form.render();

    form.on('select(province)', function ({elem, value, othis}) {
        let flag = false;
        let classNames = elem.className.split(' ');
        layui.each(areaMapProvince, function (index, item) {
            // console.log(item);
            if (item.id == value) {
                flag = true;
                let options = BASE_AREA_MAP_CITY_OPTION_HTML + getOptions(item.list);
                $('.' + classNames[0] + '.area-map-city').html(options);

            }
        });
        if (!flag) {
            $('.' + classNames[0] + '.area-map-city').html(BASE_AREA_MAP_CITY_OPTION_HTML);
        }
        $('.' + classNames[0] + '.area-map-area').html(BASE_AREA_MAP_AREA_OPTION_HTML);
        form.render('select');
    });

    form.on('select(city)', function ({elem, value, othis}) {
        let flag = false;
        let classNames = elem.className.split(' ');
        layui.each(areaMapCity, function (index, item) {
            if (item.id == value) {
                flag = true;
                let options = BASE_AREA_MAP_AREA_OPTION_HTML + getOptions(item.list);
                $('.' + classNames[0] + '.area-map-area').html(options);
            }
        });
        if (!flag) {
            $('.' + classNames[0] + '.area-map-area').html(BASE_AREA_MAP_AREA_OPTION_HTML);
        }
        form.render('select');
    });

    let isFeverCough = new Set();

    function renderIsFeverCough() {
        isFeverCough = new Set();
        layui.each($('.is-fever-cough'), function (index, item) {
            // console.log(item);
            if (item.checked) {
                isFeverCough.add(parseInt(item.value));
            }
        });
        // console.log(isFeverCough);
        form.render('checkbox');
    }

    form.on('checkbox(nothing)' , function ({elem, value, othis}) {
        let classNames = elem.className.split(' ');
        if (elem.checked) {
            $('.' + classNames[0] + '.one').prop("checked", false);
        }
        renderIsFeverCough();
    });

    form.on('checkbox(is-fever-cough)', function ({elem, value, othis}) {
        let classNames = elem.className.split(' ');
        if (elem.checked) {
            // console.log(111);
            $('.' + classNames[0] + '.nothing').prop("checked", false);
        }
        renderIsFeverCough();
    });

    form.on('checkbox(accept)', function ({elem, value, othis}) {
        if (elem.checked) {
            $('#student-report-submit').removeClass('layui-btn-disabled').attr("disabled",false);
        } else {
            $('#student-report-submit').addClass('layui-btn-disabled').attr("disabled",true);
        }
    });

    form.on('submit(LAY-student-report-submit)', function (data) {
        data.field.is_fever_cough_set = Array.from(isFeverCough);
        admin.req({
            url: setter.userRole.student.api + '/report'
            , type: 'POST'
            , data: JSON.stringify(data.field)
            , contentType: 'application/json'
            , dataType: 'json'
            , done: function (res_p) {
                layer.alert(res_p.msg, {
                      title: '提示'
                    , icon: 1
                    , skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                }, function () {
                    location.hash = search.redirect ? decodeURIComponent(search.redirect) : '/';
                });
            }
        });
    });

    form.verify({
        other_required: function (value, item) {
            if (isFeverCough.size <= 0) {
                return '必须选择是否发烧咳嗽';
            }
            // console.log(item.type);
            if ($('input[name=is_covid]:checked').val() === undefined) {
                return '必须选择是否确诊新型肺炎';
            }
            if ($('input[name=is_infection]:checked').val() === undefined) {
                return '必须选择是否疑似感染';
            }
            if ($('input[name=area_level]:checked').val() === undefined) {
                return '必须选择目前居住地疫情风险等级';
            }
            if ($('input[name=is_health_code]:checked').val() === undefined) {
                return '必须选择是否有防疫健康信息绿码';
            }
            if ($('input[name=is_back_foreign]:checked').val() === undefined) {
                return '必须选择是否从国（境）外返回';
            }
            if ($('input[name=is_touch_foreigner]:checked').val() === undefined) {
                return '必须选择是否接触国（境）外返回的人员';
            }
        }
    });


    admin.req({
        url: setter.userRole.student.api + '/report'
        , type: 'GET'
        , dataType: 'json'
        , async: false
        , done: function (res_p) {
            let student = res_p.data;
            if (res_p.data.report_today != null) {
                layer.alert( '您今日已填报过！', {
                      skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                    , title: '提示'
                }, function (index) {
                    // console.log(111);
                    location.hash = search.redirect ? decodeURIComponent(search.redirect) : '/';
                    layer.close(index);
                });
            } else {
                let reportRecent = res_p.data.report_recent;
                form.val('layuiadmin-form-student', student);
                if (reportRecent) {
                    form.val('layuiadmin-form-student-report', reportRecent);

                    let nowProvinceOptions = BASE_AREA_MAP_PROVINCE_OPTION_HTML + getOptions(areaMapProvince, reportRecent.now_province_id);
                    $('.report-now.area-map-province').html(nowProvinceOptions);
                    let nowCityOptions = BASE_AREA_MAP_CITY_OPTION_HTML + getOptions(areaMapCity, reportRecent.now_city_id);
                    $('.report-now.area-map-city').html(nowCityOptions);
                    let nowAreaOptions = BASE_AREA_MAP_AREA_OPTION_HTML + getOptions(areaMapArea, reportRecent.now_area_id);
                    $('.report-now.area-map-area').html(nowAreaOptions);

                    let homeProvinceOptions = BASE_AREA_MAP_PROVINCE_OPTION_HTML + getOptions(areaMapProvince, reportRecent.home_province_id);
                    $('.report-home.area-map-province').html(homeProvinceOptions);
                    let homeCityOptions = BASE_AREA_MAP_CITY_OPTION_HTML + getOptions(areaMapCity, reportRecent.home_city_id);
                    $('.report-home.area-map-city').html(homeCityOptions);
                    let homeAreaOptions = BASE_AREA_MAP_AREA_OPTION_HTML + getOptions(areaMapArea, reportRecent.home_area_id);
                    $('.report-home.area-map-area').html(homeAreaOptions);

                    layui.each(reportRecent.is_fever_cough_set, function (index, item) {
                        $('input[name=is_fever_cough_' + item + ']').attr("checked",true);
                        // console.log($('checkbox[name=is_fever_cough_' + item + ']'));
                    });
                    isFeverCough = new Set(reportRecent.is_fever_cough_set);

                    let isCovidIndex = reportRecent.is_covid != 1 ? 1 : 0;
                    $('input:radio[name=is_covid]')[isCovidIndex].checked = true;

                    let isInfectionIndex = reportRecent.is_infection != 1 ? 1 : 0;
                    $('input:radio[name=is_infection]')[isInfectionIndex].checked = true;

                    $('input:radio[name=area_level]')[reportRecent.area_level].checked = true;

                    let isHealthCodeIndex = reportRecent.is_health_code != 1 ? 1 : 0;
                    $('input:radio[name=is_health_code]')[isHealthCodeIndex].checked = true;

                    let isBackForeignIndex = reportRecent.is_back_foreign != 1 ? 1 : 0;
                    $('input:radio[name=is_back_foreign]')[isBackForeignIndex].checked = true;

                    let isTouchForeignerIndex = reportRecent.is_touch_foreigner != 1 ? 1 : 0;
                    $('input:radio[name=is_touch_foreigner]')[isTouchForeignerIndex].checked = true;
                }

                form.render();
            }
        }
    });

    // form.val('layuiadmin-form-student-report', {
    //     now_province_id: 35
    // });

    // form.render();

    exports('student/report', {})
});