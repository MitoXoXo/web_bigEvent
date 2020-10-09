$(function() {
    //自定义校验规则
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度为1~6位之间！';
            }
        }
    })

    //2.初始化用户信息
    initUserInfo();
    var layer = layui.layer;

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //成功后渲染
                form.val('formUserInfo', res.data);
            }
        })
    }
    //3.表单重置
    $('#btnReset').on('click', function(e) {
            e.preventDefault();
            initUserInfo()
        })
        //修改用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！')
                }
                layer.msg('恭喜您，修改用户信息成功！');
                window.parent.getUserInfo()
            }
        })
    })
})