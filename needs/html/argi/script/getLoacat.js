var pds = (typeof this.pds === 'undefined') ? {} : this.pds;
(function ($) {

	var map = null;
	var doubles = null;
	var db =null;
	var arry = new Array();
	var getLocation = function() {
	   map.getLocation({
		    accuracy: '10m',
		    autoStop: false,
		    filter: 1
	    }, function(back, err){
	         if(back.status){
		          var userId = $api.getStorage("userId");
	              var sysDate = new Date();
	              var sysTime = sysDate.getFullYear()+"-"+(sysDate.getMonth()*1+1)+"-"+sysDate.getDate()+" "+sysDate.getHours()+":"+sysDate.getMinutes()+":"+sysDate.getSeconds(); 

		          //把数据插入到本地据库中
		          db.executeSql({
					   name: 'pointData',
					   sql: "INSERT INTO Point (userId, logTime,longitude,latitude,type) VALUES ('"+userId+"', '"+sysTime+"','"+back.lon+"','"+back.lat+"','1')"   
				  }, function(ret, err){
					  
				  });    
		     }
        });	
	};
   
   function setInterval(){
       ajaxtimer = window.setInterval(sabmit, 20000);
       return ajaxtimer;
   }
   
  function sabmit(){
       //首先读取数据库
        db.selectSql({
		    name: 'pointData',
		    sql: 'SELECT * FROM Point where type="1"'
		}, function(ret, err){  
		   if( ret.status ){
		     pds.ajaxSubmit({
				url:"app/farmland/record",
				data:{value:ret.data},
				success:function(e){
				    //把全部数据type修改成“2”
				    db.executeSql({
					    name: 'pointData',
					    sql: "UPDATE Point SET type = '2'"   
					}, function(ret, err){        
					 
					});
				//把经纬度添加到地图页面
				},
				error:function(e){
					alert("服务器异常，请联系管理员!");
				}
			});
		}else{
		        alert( JSON.stringify( err ) );
		    }
		});
  }
   
  var getMap = function(){
        if(map==null)map = api.require('bMap');
   		return map;
   }
   
   var getLocat = function(){
      getLocation();
   }
   
   var getDb = function(){
      db = api.require('db');
      return db;
   }

	$.extend(pds,{
    	"getLocat":getLocat,
    	"getMap":getMap,
    	"sabmit":sabmit,
    	"setInterval":setInterval,
    	"getDb":getDb
	});
})(jQuery)
//})(Zepto)