//const BASE_URL = "http://doclever.cn:；8080/mock/597f470ce550c4121bbe101e"


(function(window) {
 //var host = 'http://192.168.1.144:808；0' //个人服务  辛庆强
   var host = 'http://192.168.31.194:8080' //个人服务  彭涛
//	  var host = 'http://121.42.230.107:8089/'
   // var host = 'http://172.16.33.177:8080' //个人服务  韩明成   等级查看接口
//var host = 'http://doclever.cn:8080/mock/597f470ce550c4121bbe101e'  //mock
//var host = 'http://60.205.185.177/'  //test
//var host = 'http://apps.pds-inc.com.cn:8080/'  //product
 //var host = 'http://doclever.cn:8080/mock/597f470ce550c4121bbe101e'  //show
//  var host = 'http://59.110.239.229/'  //show
//     var host = 'http://47.93.238.45/'  //release


    var basePath = '/app'

    var debug = true; // 打印错误信息，false不打印

    var url = function(path) {
        var u = host + basePath + path
        if (debug){
          console.log(u);
        }
        return u
    }

    window.remote = {
        url: url,
        debug: function(){
          return debug;
        },
        debugUserId: function(){
          return 1953
//        服务顾问    1877  1952
//        服务中心  1875   1953
        }
    }
})(window)
