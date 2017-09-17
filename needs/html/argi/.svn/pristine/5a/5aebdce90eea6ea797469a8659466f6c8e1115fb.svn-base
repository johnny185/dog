var deleteModule = ( typeof this.deleteModule === 'undefined') ? {} : this.deleteModule;
(function($) {

	var deletes = function(resourceListId, callback) {
		//				*******************左滑删除*********************************************

		$("#" + resourceListId).width($("body").width()).css({
			"overflowX" : "hidden"
		});
		$("#" + resourceListId).children("div").each(function(num, el) {
			var deleteBtnWidth = 60;
			var minChangeX = 20;
			var listID = $(this).attr("id");
			var status = $(this).attr("data-status");
			// 列表行高
			var resourceListH = $("#" + listID).height();
			var screenWidth = $("body").width();

			var touchstartPageX, //觸摸開始位置
			touchmovePageX, //觸摸移動實時位置
			touchendPageX, //觸摸結束位置
			changePageX, //觸摸位移距離
			marginLeft;
			//tr-marginLeft屬性值
			// 修改样式
			$("#" + listID).css({
				"width" : screenWidth + "px",
				"overflowX" : "auto",
			}).append(
			//删除按钮
			$("<span>删除</span>").css({
				"float" : "left",
				"marginLeft" : screenWidth,
				"marginTop" : "-62px",
				"width" : deleteBtnWidth + "px",
				"height" : resourceListH + "px",
				"background" : "rgba(230,50,50,0.9)",
				//						"border":"solid 5px red",
				"color" : "#fff",
				"lineHeight" : resourceListH + "px",
				"textAlign" : "left",
				"textIndent" : "1em"
			}).click(function() {
				// 回调函数
				callback(listID,status);
			}))
			//				绑定触摸开始事件
			.on("touchstart", function(event) {
				event.stopPropagation();
				// 触摸事件开始，修改——当前事件对象的 同级兄弟div元素left 样式；
				$(this).siblings('div').animate({
					marginLeft : 0
				}, 300);
				//					记录触摸开始列表左偏移量
				marginLeft = $(this).css("marginLeft");
				// touchstartPageX记录触摸开始位置
				touchstartPageX = event.originalEvent.targetTouches[0].pageX;
			})
			//				绑定滑动事件
			.on("touchmove", function(event) {
				event.stopPropagation();
				touchmovePageX = event.originalEvent.targetTouches[0].pageX;
				changePageX = touchstartPageX - touchmovePageX;
				if (marginLeft == "0px") {
					if (changePageX > 0 && changePageX < deleteBtnWidth) {
						$(this).css('marginLeft', changePageX * -1);
					} else if (changePageX >= deleteBtnWidth) {
						$(this).css('marginLeft', -deleteBtnWidth);
					}
				} else if (marginLeft == -deleteBtnWidth + "px") {
					if (changePageX < 0 && changePageX > -deleteBtnWidth) {
						$(this).css('marginLeft', -deleteBtnWidth + changePageX * -1);
					} else if (changePageX <= -deleteBtnWidth) {
						$(this).css('marginLeft', 0);
					} else {
						$(this).css('marginLeft', -deleteBtnWidth);
					}
				}
			})
			// 给div绑定触摸结束事件，触摸结束时修改tr left属性
			.on('touchend', function(event) {
				event.stopPropagation();
				touchendPageX = event.originalEvent.changedTouches[0].pageX;
				changePageX = touchstartPageX - touchendPageX;
				if (marginLeft == "0px") {
					if (changePageX > 0 && changePageX < minChangeX) {
						$(this).animate({
							marginLeft : 0
						}, 300);
					} else if (changePageX >= minChangeX && changePageX < deleteBtnWidth) {
						$(this).animate({
							marginLeft : -deleteBtnWidth
						}, 300);
					}
				} else if (marginLeft == -deleteBtnWidth + "px") {
					if (changePageX < 0 && changePageX > -minChangeX) {
						$(this).animate({
							marginLeft : -deleteBtnWidth
						}, 300);
					} else if (changePageX <= -minChangeX && changePageX > -deleteBtnWidth) {
						$(this).animate({
							marginLeft : 0
						}, 300);
					}
				}
			});
		})
	}
	// 声明要被调用的方法，只有被声明的才能被调用
	$.extend(deleteModule, {
		"deletes" : deletes
	});
})(jQuery)
//})(Zepto)