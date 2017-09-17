// 农事数据ID
var farmingDataId = 0;
var pageParam = null;
var map = null;
var errMsg = "服务器错误，请联系管理员!";
apiready = function() {//alert("farming");
	pageParam = api.pageParam;
	if (pageParam.farmId <= 0) {
		api.alert({
			msg : "基地ID错误"
		});
	} else {
		// 加载百度地图模块
		map = api.require('bMap');
		// 根据传来的基地ID获取下级所有地块
		getLandsByFarmId(pageParam.farmId);
		// 获得品名列表
		getCategoryListByFarmId(pageParam.farmId);
		// 根据基地ID查询工序
		//getProcessListByFarmId(pageParam.farmId);
	}
};
/*返回*/
function closeWin() {
	//api.closeWin();
	//
	api.closeToWin({
		name : 'agriculturalData'
	});
}

// 跳转到作物数据采集页面
function goFieldData() {
	$api.openWin({
		name : 'fieldData',
		url : 'widget://html/farmData/fieldData.html',
		selecteIndex : '4', //点亮导航栏第4个按键
		pageParam : {
			"farmId" : pageParam.farmId
		}
	});
}

// 获取年月日
function getTime() {
	var d = new Date();
	var month = d.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var date = d.getDate();
	if (date < 10) {
		date = "0" + date;
	}
	var hour = d.getHours();
	if (hour < 10) {
		hour = "0" + hour;
	}
	var minute = d.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	var second = d.getSeconds();
	if (second < 10) {
		second = "0" + second;
	}
	return d.getFullYear() + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

// 获取定位地点
function getAddress() {
	map.getLocation({
		// 定位精度，默认100m
		accuracy : '10m',
		// 获取到位置信息后是否自动停止定位
		autoStop : true,
		// 位置更新所需的最小距离（单位米），autoStop 为 true 时，此参数有效
		filter : 1
	}, function(ret, err) {
		if (ret.status) {
			$("#lon").val(ret.lon.toFixed(6));
			$("#lat").val(ret.lat.toFixed(6));
			//alert(JSON.stringify(ret));
			// 根据坐标获取位置
			map.getNameFromCoords({
				lon : ret.lon,
				lat : ret.lat
			}, function(ret, err) {
				if (ret.status) {
					//alert(JSON.stringify(ret));
					$("#address").val(ret.address);
					// 获取日期
					$("#date").val(getTime());
				} else {
					api.alert({
						msg : err.msg
					});
				}
			});
		} else {
			api.alert({
				msg : err.msg
			});
		}
	});
}

// 存放该基地下所有地块信息
var landData = null;
// 根据基地ID获取下级所有地块
function getLandsByFarmId(farmId) {
	pds.ajaxSubmit({
		url : "app/land/list?landfarmId=" + pageParam.farmId,
		success : function(e) {
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				// alert(JSON.stringify(e.data));
				$.each(e.data, function(index, item) {
					//alert(JSON.stringify(item));
					$("#farmLandId").append("<option value=" + item.id + ">" + item.landName + "</option>");
				});
				landData = e.data;
			}
		},
		error : function(e) {
			alert(JSON.stringif(e));
			api.alert({
				msg : errMsg + "87"
			});
		}
	});
}

// 根据基地ID获得品名下拉列表
function getCategoryListByFarmId(farmId) {
	pds.ajaxSubmit({
		url : "app/farmingdataresource/coprList?farmId=" + pageParam.farmId,
		success : function(e) {
			//alert(JSON.stringify(e));
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				// alert(JSON.stringify(e.data));
				// 追加之前先清空所有数据
				$.each(e.data, function(index, item) {
					//alert(JSON.stringify(item));
					$("#catalogId").append("<option value=" + item.id + ">" + item.catName + "</option>");
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e))
			api.alert({
				msg : errMsg + "56"
			});
		}
	});
}

function clearChildren() {
	$(document).ready(function() {
		// 清除品种
		$("#categoryId").empty();
		$("#categoryId").append("<option value='0'>请选择</option>");
		// 清除工序
		$("#processId").empty();
		$("#processId").append("<option value='0'>请选择</option>");
		// 清楚工序标准
		$("#proName").val("");
	});
}

// 根据品名ID获取品种列表
function changeCatlog(catalogId) {
	if (catalogId <= 0) {
		//alert("参数错误：品名ID不能为空");
		api.alert({
			msg : "参数错误：品名ID不能为空"
		});
		return;
	}
	pds.ajaxSubmit({
		url : "app/farmingdataresource/getSubCatList",
		success : function(e) {
			//alert(JSON.stringify(e.data));
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				// 清除品种及其子集
				clearChildren();
				$.each(e.data, function(index, item) {
					//alert(JSON.stringify(item));
					if (catalogId == item.parentId) {
						//alert(JSON.stringify(item));
						$("#categoryId").append("<option value=" + item.id + ">" + item.catName + "</option>");
					}
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e))
			//alert("服务器错误，请联系管理员!3");
			api.alert({
				msg : errMsg + "5555"
			});
		}
	});
}

function clearProcess() {
	$(document).ready(function() {
		// 清除工序
		$("#processId").empty();
		$("#processId").append("<option value='0'>请选择</option>");
		// 清楚工序标准
		$("#proName").val("");
	});
}

/**
 * 根据品种ID获取工序列表
 * @param {int} categoryIdParam 品种ID
 */
function changeCategory(categoryId) {//alert(categoryIdParam)
	if (categoryId <= 0) {
		api.alert({
			msg : "参数错误：品种ID不能为空"
		});
		return;
	}
	//categoryId = categoryIdParam;
	pds.ajaxSubmit({
		url : "app/farmingdataresource/cateList?cateId=" + categoryId,
		success : function(e) {
			//alert(JSON.stringify(e.data));
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				processData = e.data;
				// 清除工序下拉列表和工序标准
				clearProcess();
				$.each(e.data, function(index, item) {
					//alert(JSON.stringify(item));
					//alert(item.id + "=" + item.proName);
					$("#processId").append("<option value=" + item.id + ">" + item.proName + "</option>");
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e))
			api.alert({
				msg : "4:" + errMsg
			});
		}
	});
}

// 根据基地ID查询工序列表
//function getProcessListByFarmId(farmId) {
//	if (farmId <= 0) {
//		api.alert({msg:"参数错误：基地ID不能为空"});
//		return;
//	}
//	//categoryId = categoryIdParam;
//	pds.ajaxSubmit({
//		url : "common/getBasProcessListByFarmId?farmId=" + farmId,
//		success : function(e) {
//			//alert(JSON.stringify(e.data));
//			if (e.status == 'error') {
//				api.alert({
//					msg : e.message
//				});
//			} else {
//				processData = e.data;
//				// 清除工序下拉列表和工序标准
//				//clearProcess();
//				$.each(e.data, function(index, item) {
//					//alert(JSON.stringify(item));
//					//alert(item.id + "=" + item.proName);
//					$("#processId").append("<option value=" + item.id + ">" + item.proName + "</option>");
//				});
//			}
//		},
//		error : function(e) {alert(JSON.stringify(e))
//			alert("服务器错误，请联系管理员!4");
//		}
//	});
//}

var processData = null;
// 根据工序ID带出工序标准
function changeProcess(processId) {
	// 清空工序标准
	$("#proName").val("");
	$.each(processData, function(index, item) {
		if (item.id == processId) {
			//alert(item.proStandard);
			$("#proStandard").val(item.proStandard);
			return;
		}
	});
}

//点击上传照片的方法
function imageUpload(dom) {
	var Flag = dom.getAttribute("flag");
	api.getPicture({
		sourceType : 'camera', //从照相机获取
		encodingType : 'jpg', //格式
		mediaValue : 'pic', //视频格式
		destinationType : 'url', //
		allowEdit : true,
		quality : 10,
		saveToPhotoAlbum : false
	}, function(re, err) {
		if (re && re.data != "") {
			var $ul = $(dom).closest("ul");
			$(dom).html("上传中...");
			pds.ajaxSubmit({
				url : "attach/upload",
				fileData : {
					file : re.data
				},
				success : function(e) {
					if (e) {
						var data = e.data;
						data.fileBizType = Flag;
						data.fileBizPk = TaskId;
						imageMap[Flag] = data;
						$(dom).remove();
						$ul.append('<li onclick="imageUpload(this)" class="farmImag"><div class="imgbox2"><img src="' + re.data + '"></div><li>');
						if ($("img").length >= 3) {
							$("#submit").show();
						} else {
							$("#submit").hide();
						}
					} else {
						$(dom).html("上传失败...");
						//$ul.append('<li flag="15" bledflag="1" onclick="imageUpload(this)"><div class="imgbox"><i class="icon-plus"></i><p>图片上传</p></div></li>');
					}
				},
				error : function(e) {
					alert(JSON.stringify(e))
					api.alert({
						msg : errMsg + "5"
					});
				}
			});
			////////////////////////////////////////////
		}
		else {
		}
	});
}

// 返回要保存的数据
function getObj() {
	var obj = {};
	obj.farmId = pageParam.farmId;
	obj.date = $("#date").val();
	obj.address = $("#address").val();
	obj.lon = $("#lon").val();
	obj.lat = $("#lat").val();
	obj.farmLandId = $("#farmLandId").val();
	obj.catalogId = $("#catalogId").val();
	obj.categoryId = $("#categoryId").val();
	obj.processId = $("#processId").val();
	obj.proStandard = $("#proStandard").val();
	obj.remark = $("#remark").val();
	return obj;
}

// 校验数据
function checkData(obj) {
	if (obj.date.length < 1 || obj.address.length <= 0 || obj.lon.length <= 0 || obj.farmLandId <= 0 || obj.catalogId <= 0 || obj.categoryId <= 0 || obj.processId <= 0 || obj.proStandard.length <= 0) {
		return false;
	} else {
		return true;
	}
}

//保存
function saveFarmingData() {
	var obj = getObj();
	if (!checkData(obj)) {
		api.alert({
			msg : "除“备注”外都为必填项"
		});
		return;
	}
	$("#submit").attr("disabled", "disabled");
	api.confirm({
		title : '提示',
		msg : '保存之后不可更改，确定保存吗？',
		buttons : ['确定', '取消']
	}, function(ret, err) {
		var index = ret.buttonIndex;
		if (index == 1) {
			pds.ajaxSubmit({
				url : "app/farmingdataresource/saveFarmingData",
				data : {
					"data" : JSON.stringify(obj)
				},
				success : function(e) {
					if (e.status == 'error') {
						$('#submit').removeAttr("disabled");
						api.alert({
							msg : e.message
						});
					} else {
						farmingDataId = e.data;
						api.alert({
							msg : "保存成功!"
						});
						// 保存按钮置灰

						// 保存成功之后都不可选
						$("#farmLandId").attr("disabled", "disabled");
						$("#catalogId").attr("disabled", "disabled");
						$("#categoryId").attr("disabled", "disabled");
						$("#processId").attr("disabled", "disabled");
						$("#proStandard").attr("disabled", "disabled");
						$("#remark").attr("disabled", "disabled");
					}
				},
				error : function(e) {
					alert(JSON.stringify(e))
					$('#submit').removeAttr("disabled");
					api.alert({
						msg : errMsg + "6"
					});
				}
			});

		} else {
			$("#submit").removeAttr("disabled");
		}
	});

}

//加载农事资源列表
function getResources() {

	//删除所有的行
	$('#resourceListId').empty();
	// 清空总计
	if ($("#totalMoneyId")) {
		$("#totalMoneyId").remove();
	}
	pds.ajaxSubmit({
		url : "app/farmingdataresource/getResourceList",
		data : {
			"data" : JSON.stringify({
				"farmingDataId" : farmingDataId
			})
		},
		success : function(e) {
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				// 总金额
				var sumMoney = 0.0000;
				$.each(e.data, function(index, item) {
					var statusText = null;
					if (item.status == 0) {
						statusText = "未提交";
					} else {
						statusText = "已提交";
					}
					// 保留删除的代码
					//var result = "<div class='argi-lists-in'>" + "<div class='argi-flex'>" + "<div  onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-img resource-img'><img src='../../image/farm_map.jpg' /></div>" + "<div onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-infos2'>" + "	<div class='argi-p flex-full'><span>资源名称</span><span>" + item.resourceNameLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>亩数</span><span>" + item.muCount + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>数量</span><span>" + item.resourceNumber + item.resourceUnitLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>状态</span><span>" + statusText + "</span></div>" + "</div>" + "<div class='control-btn text-right' onclick='removeResource(" + item.id + "," + item.status + ")'>" + "	<p class='total-price' style='margin-bottom:5px;'><span>￥" + item.money.toFixed(2) + "</span></p>" + "  <button class='argi-btn argi-btn-gray argi-btn-sm'>删除</button>" + "</div>" + "</div>" + "</div>"
//					var result = "<div class='argi-lists-in'>" + "<div class='argi-flex'>" + "<div  onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-img resource-img'><img src='../../image/farm_map.jpg' /></div>" + "<div onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-infos2'>" + "	<div class='argi-p flex-full'><span>资源名称</span><span>" + item.resourceNameLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>亩数</span><span>" + item.muCount + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>数量</span><span>" + item.resourceNumber + item.resourceUnitLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>状态</span><span>" + statusText + "</span></div>" + "</div>" + "<div class='control-btn text-right' onclick='removeResource(" + item.id + "," + item.status + ")'>" + "	<p class='total-price' style='margin-bottom:5px;'><span>￥" + item.money.toFixed(2) + "</span></p>" + "</div>" + "</div>" + "</div>"
//					$("#resourceListId").append(result);
					var $tr = "<div class='argi-lists-in' id=" + item.id + " data-status="+item.status+">" + "<div class='argi-flex'>" + "<div  onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-img resource-img'><img src='../../image/farm_map.jpg' /></div>" + "<div onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-infos2'>" + "	<div class='argi-p flex-full'><span>资源名称</span><span>" + item.resourceNameLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>亩数</span><span>" + item.muCount + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm' style='margin-left:-40px;'><span>数量</span><span>" + item.resourceNumber + item.resourceUnitLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm' style='margin-left:-10px;'><span>状态</span><span>" + statusText + "</span></div>" + "</div>" + "<div class='control-btn text-right' style='margin-right:70px;'>" + "	<p class='total-price' style='margin-bottom:5px;'><span>￥" + item.money.toFixed(2) + "</span></p>" + "</div>" + "</div>" + "</div>"
					$("#resourceListId").append($tr);
					sumMoney += item.money;

				});

				if (e.data.length > 0) {
					var totalView = "<div id='totalMoneyId' class='argi-lists-in'>" + "<span >金额总计：</span>" + "<span >" + sumMoney.toFixed(2) + "元</span>" + "</div>"
					$("#resourceListId").after(totalView);
				}
				// 删除功能
				deleteModule.deletes("resourceListId", function(id, status) {
					if (status == 1) {
						api.alert({
							msg : "已提交数据不可删除"
						});
						return;
					}
					api.confirm({
						title : '提示',
						msg : '确定删除吗？',
						buttons : ['确定', '取消']
					}, function(ret, err) {
						var index = ret.buttonIndex;
						if (index == 1) {
							var farmingDataResource = {};
							farmingDataResource.id = id;
							pds.ajaxSubmit({
								url : "app/farmingdataresource/delete",
								data : {
									"data" : JSON.stringify(farmingDataResource)
								},
								success : function(e) {
									getResources();
									api.alert({
										msg : "删除成功!"
									});
									//$(_this).parent().remove();
								},
								error : function(e) {
									alert(JSON.stringify(e));
									api.alert({
										msg : "服务器错误，请联系管理员!"
									});
								}
							});
						}
					});

				});
			}

		},
		error : function(e) {
			alert(JSON.stringify(e));
			api.alert({
				msg : errMsg + "7"
			});
		}
	});
}

// 添加农事资源
function addFarmingResource() {
	if (farmingDataId > 0) {
		$api.openWin({
			name : "add_farming_source",
			url : "widget://html/newtask/add_farming_source.html",
			selecteIndex : '2', //点亮导航栏第2个按键
			reload : true,
			pageParam : {
				"farmingDataId" : farmingDataId,
				"sourceName" : "farming_data",
				"farmId" : pageParam.farmId
			},
			animation : {
				type : "movein", //动画类型（详见动画类型常量）
				subType : "from_right", //动画子类型（详见动画子类型常量）
				duration : 300 //动画过渡时间，默认300毫秒
			}
		});
	} else {
		api.alert({
			msg : "请先保存基本信息"
		});
	}

}

//编辑农事资源页面
function editFarmingDataResource(farmingDataResourceId) {

	$api.openWin({
		name : "edit_farming_source",
		url : "widget://html/newtask/edit_farming_source.html",
		reload : true,
		selecteIndex : '2', //点亮导航栏第2个按键
		pageParam : {
			"resourceId" : farmingDataResourceId,
			"sourceName" : "farming_data"

		},
		animation : {
			type : "movein", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		}
	});

}

//删除一行资源信息
function removeResource(id, status) {
	if (status == 1) {
		api.alert({
			msg : "已提交数据不可删除"
		});
		return;
	}
	api.confirm({
		title : '提示',
		msg : '确定删除吗？',
		buttons : ['确定', '取消']
	}, function(ret, err) {
		var index = ret.buttonIndex;
		if (index == 1) {
			var farmingDataResource = {};
			farmingDataResource.id = id;
			pds.ajaxSubmit({
				url : "app/farmingdataresource/delete",
				data : {
					"data" : JSON.stringify(farmingDataResource)
				},
				success : function(e) {
					api.alert({
						msg : "删除成功!"
					});
					//删除成功之后刷新资源列表
					getResources();
				},
				error : function(e) {
					alert(JSON.stringify(e))
					api.alert({
						msg : errMsg + "8"
					});
				}
			});
		}
	});

}
