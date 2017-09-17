/**
  * zepto插件：向左滑动删除动效
  * 使用方法：$('.itemWipe').touchWipe({itemDelete: '.item-delete'});
  * 参数：itemDelete  删除按钮的样式名
  * liujunyi
  * 2016-06-25
  */
var pds = (typeof this.pds === 'undefined') ? {} : this.pds;
(function($) {
   var touchWipe = function(option) {
   		 /**
   		  * 默认
   		  */
	     var defaults = {
	       container:".list-li",
	       itemDelete: '.item-delete' //删除元素
	     };
	     
	     
	     var opts = $.extend({}, defaults, option); //配置选项
	 
	     var delWidth = $(opts.itemDelete).width();
	 	 //var that = $(opts.container)[0];	
	 	
	     var initX; //触摸位置
	     var moveX; //滑动时的位置
	     var X = 0; //移动距离
	     var objX = 0; //目标对象位置
	     
	     /**
	      * touchstart:手指触摸屏幕上的时候触发 
	      * touchmove:手指在屏幕上移动的时候触发 
	      * touchend:手指从屏幕上拿起的时候触发 
	      * touchcancel:系统取消touch事件的时候触发
	      */
	     $(opts.container).off('touchstart');
	     $("body").on('touchstart',opts.container, function(event) {
		       //event.preventDefault();
		       var obj = this;
		       initX = event.targetTouches[0].pageX;
		       objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;	      
		       if (objX == 0) {
			       	 $(obj).off('touchmove');
			         $(obj).on('touchmove', function(event) {
				           var obj = this;
				           moveX = event.targetTouches[0].pageX;
				           X = moveX - initX;
				           obj.style.transition = "all 0";
				           if (X >= 0) {
				             	obj.style.WebkitTransform = "translateX(" + 0 + "px)";
				           } else if (X < 0) {
					             var l = Math.abs(X);
					             obj.style.WebkitTransform = "translateX(" + -l + "px)";
					             if (l > delWidth) {
					               l = delWidth;
					               obj.style.WebkitTransform = "translateX(" + -l + "px)";
					             }
				           }
				           obj.style.transition = "all 0";
			         });
		       } else if (objX < 0) {
			       	 $(obj).off('touchmove');
			         $(obj).on('touchmove', function(event) {
				           var obj = this;
				           moveX = event.targetTouches[0].pageX;
				           X = moveX - initX;
				           obj.style.transition = "all 0";
				           if (X >= 0) {
					             var r = -delWidth + Math.abs(X);
					             obj.style.WebkitTransform = "translateX(" + r + "px)";
					             if (r > 0) {
					               r = 0;
					               obj.style.WebkitTransform = "translateX(" + r + "px)";
					             }
				           } else { //向左滑动
				             obj.style.WebkitTransform = "translateX(" + -delWidth + "px)";
				           }
				           obj.style.transition = "all 0";
			         });
		       }
	 
	     })
	     $(opts.container).off('touchend');
	     $("body").on('touchend',opts.container, function(event) {
		       var obj = this;
		       objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
		       if (objX > -delWidth / 2) {
			         obj.style.transition = "all 0";
			         obj.style.WebkitTransform = "translateX(" + 0 + "px)";
			         obj.style.transition = "all 0";
			         objX = 0;
		       } else {
			         obj.style.transition = "all 0";
			         obj.style.WebkitTransform = "translateX(" + -delWidth + "px)";
			         obj.style.transition = "all 0";
			         objX = -delWidth;
		       }
	     })
	     //链式返回
	     return this;
   };
 	
   	$.extend(pds,{
    	"touchWipe":touchWipe
	});
 })(Zepto);