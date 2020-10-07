$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
        // 通过 form.verify() 函数自定义校验规则
    form.verify({
        //密码规则
        pwd: [/^[\S]{6,16}$/, "密码必须6-16位，且不能输入空格"],
        //确认密码规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
                //比较
            if (value !== pwd) {
                return "两次密码输入不一致";
            }

        }
    });
    //3.注册功能
    $('#form_reg').on('submit', function(e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                $('#link_login').click();
                $('#form_reg')[0].reset();
            }
        })
    });
    //登录功能
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                //校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //提示信息，保存token，跳转页面
                layer.msg('恭喜您，登陆成功！');
                //保存token，未来的接口要使用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = '/index.html';
            }

        })
    })
})