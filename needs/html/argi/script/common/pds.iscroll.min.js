var pds = (typeof this.pds === 'undefined') ? {} : this.pds;
(function ($) {
	
	/** 变量定义    */
	var myScroll,
		pullDownEl, pullDownOffset,
		pullUpEl, pullUpOffset,
		generatedCount = 0;
	
	var pageNum   = 1;
	var pageSize  = 20;
	var total     = null;
	var _custom   = null;
	var statusObj = null;
	/** 
	 * 数据加载列表  
	 */
	var getDataList = function(loginId,statusJson,flag,callback){
		
		if(flag*1 == 1){
			pageNum = 1;
		}
		statusObj = statusJson;
		var params = $.extend({}, {"userId":_custom["userId"],"pageNum":pageNum,"pageSize":pageSize},statusObj);
		pds.ajaxSubmit({
			url:_custom["listUrl"],
			data:{"data":JSON.stringify(params)},
			success:function(e){
				var dataInter = e.data;
				total = e.total;
				if(dataInter && dataInter.length>0){
					pageNum++;
					var interText = doT.template($(_custom["rowTemplete"]).text());
					if(flag*1 == 1){
						$(_custom["container"]).html(interText(dataInter));
					}else{
						$(_custom["container"]).append(interText(dataInter));
					}
				}
				if(callback){
					callback.call(null);
				}
			},
			error:function(e){
				api.alert({msg:"服务器错误，请联系管理员!"});
			}
		});
	}

	/**
	 * 下拉刷新 （自定义实现此方法）
	 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
	 */
	var pullDownAction = function(){
		setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
			
			getDataList(_custom["userId"],statusObj,1,function(){
				myScroll.refresh();		//数据加载完成后，调用界面更新方法   Remember to refresh when contents are loaded (ie: on ajax completion)
			});
			
		}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
	}

	/**
	 * 滚动翻页 （自定义实现此方法）
	 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
	 */
	var pullUpAction = function() {
		setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
			
			getDataList(_custom["userId"],statusObj,0,function(){
				myScroll.refresh();		//数据加载完成后，调用界面更新方法   Remember to refresh when contents are loaded (ie: on ajax completion)
			});
			
		}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
	}

	/**
	 * 初始化iScroll控件
	 */
	var loaded = function(){
		pullDownEl = document.getElementById('pullDown');
		pullDownOffset = pullDownEl.offsetHeight;
		pullUpEl = document.getElementById('pullUp');	
		pullUpOffset = pullUpEl.offsetHeight;
		
		myScroll = new iScroll('wrapper', {
			scrollbarClass: 'myScrollbar', /* 重要样式 */
			useTransition: false, /* 此属性不知用意，本人从true改为false */
			topOffset: pullDownOffset,
			onRefresh: function () {
				if (pullDownEl.className.match('loading')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				} else if (pullUpEl.className.match('loading')) {
					pullUpEl.className = '';
					//pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				}
			},
			onScrollMove: function () {
				if (this.y > 5 && !pullDownEl.className.match('flip')) {
					pullDownEl.className = 'flip';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
					this.minScrollY = 0;
				} else if (this.y < 5 && pullDownEl.className.match('flip')) {
					pullDownEl.className = '';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
					this.minScrollY = -pullDownOffset;
				} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
					pullUpEl.className = 'flip';
					//pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
					this.maxScrollY = this.maxScrollY;
				} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
					pullUpEl.className = '';
					//pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
					this.maxScrollY = pullUpOffset;
				}
			},
			onScrollEnd: function () {
				if (pullDownEl.className.match('flip')) {
					pullDownEl.className = 'loading';
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
					pullDownAction();
				} else if (pullUpEl.className.match('flip')) {
					pullUpEl.className = 'loading';
					//pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
					pullUpAction();
				}
			}
		});
		setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
	}
	
	/** 初始化方法    */
	var initIscroll = function(option){
		/*  默认配置项  */
		var _default = {
			userId    : null,
			status    : null,
			statusName  : null,
			listUrl   : "",
			container :"",
			rowTemplete : "",
			params:null
		};
		// 客户化配置
		_custom = $.extend({}, _default, option);
		
		statusObj = _custom["statusObj"];
			
		getDataList(_custom["userId"],statusObj,1,null);
	}
	
	$.extend(pds,{
		"getDataList":getDataList,
    	"initIscroll":initIscroll,
    	"loaded":loaded
	});
})(Zepto)