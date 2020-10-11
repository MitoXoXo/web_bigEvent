$(function() {
    var layer = layui.layer;
    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: "", //文章分类的Id
        state: "", //文章的发布状态
    };
    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        })
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //初始化分类
    var form = layui.form; //导入form
    initCate(); //调用函数
    //封装
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //赋值，渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //4.筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })
    var laypage = layui.laypage;

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的test1是ID.
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页
            //分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条数据的选择器

            //触发jump:分页初始化的时候，页码改变的时候
            jump: function(obj, first) {
                //obj：所有参数所在的对象;first:是否是第一次初始化分页;
                //改变当前页;
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //判断，不是第一次初始化分页，才能重新调用初始化文章列表;
                if (!first) {
                    //初始化文章列表
                    initTable();
                }
            }
        });
    }
    //删除
    var layer = layui.layer;
    $('tbody').on('click', 'btn-delete', function() {
        //!!!先获取Id，进入到函数中this代指就改变了
        var Id = $(this).attr('data-id');
        //显示对话框
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function() {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //因为我们更新成功了，所以要重新渲染页面中的数据

                    layer.msg('恭喜您，文章删除成功');
                    //页面汇总删除按钮个数等于1，页码大于1；
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        })
    })
})