// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(params) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    params.url = 'http://ajax.frontend.itheima.net' + params.url
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    //3.拦截所有响应，判断身份认证信息
    params.complete = function(res) {

        var obj = res.responseJSON;
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }
    }

});