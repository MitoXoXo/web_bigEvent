//入口函数
$(function() {
    //获取用户信息
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        })
    })
});
//获取用户信息，封装到入口函数的外面了
//原因，后面其他的页面要调用.
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            //渲染用户头像
            renderAvatar(res.data);
        },
        // 无论成功或者失败，都是触发complete方法
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html'
        //     }
        // }
    });
}
//渲染用户
function renderAvatar(user) {
    //1.获取用户名
    var name = user.nickname || user.username;
    //2.渲染用户名
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //3.渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}