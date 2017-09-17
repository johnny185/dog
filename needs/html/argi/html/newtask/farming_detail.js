// 基地ID
var farmId = 0;
// 农事数据ID
var farmingDataId = 0;
//
var map = null;
var errMsg = "服务器错误，请联系管理员!";
apiready = function() {
	farmingDataId = api.pageParam.id;
	getFarmingData(farmingDataId);
	//	// 根据传来的基地ID获取下级所有地块
	//	getLandsByFarmId(farmId);
	//	// 获得品名列表
	//	getCategoryListByFarmId(farmId);
	// 获得资源列表
	getResources();
};
/*返回*/
function closeWin() {
	//
	api.closeToWin({
		name : 'listCollect'
	});
}

// 跳转到作物数据采集页面
//function goFieldData() {alert(90);
//	api.openWin({
//		name : 'fieldData',
//		url : '../farmData/fieldData.html',
//		pageParam : {
//			"farmId" : farmId
//		}
//	});
//}

//var farmingData = null;
//根据农事数据ID查询基本信息
function getFarmingData(farmingDataId) {
	if (farmingDataId <= 0) {
		api.alert({
			msg : "参数错误：农事数据ID不能为空"
		});
		return;
	}
	// 查询农事数据
	pds.ajaxSubmit({
		url : "app/farmingdataresource/getFarmingData?id=" + farmingDataId,
		success : function(e) {
			if (e.status == 'ok') {
				f = e.data;
				$("#date").val(f.date);
				$("#address").val(f.address);
				$("#lon").val(f.lon);
				$("#lat").val(f.lat);
				//$("#farmLandId").val(f.farmLandId);
				//$("#catalogId").val(f.catalogId);
				//$("#categoryId").val(f.categoryId);
				//$("#processId").val(f.processId);
				$("#proStandard").val(f.proStandard);
				$("#remark").val(f.remark);
				farmId = f.farmId;
				//farmingData = e.data;
				// 得到地块下拉列表并回显之前的数据
				getLandsByFarmId(f.farmId, f.farmLandId);
				// 得到品名下拉列表并回显之前的数据
				getCategoryListByFarmId(f.farmId, f.catalogId);
				// 得到品种下拉列表并回显之前的数据
				changeCatlog(f.catalogId, f.categoryId);
				// 得到工序下拉列表并回显之前的数据
				changeCategory(f.categoryId, f.processId);
				//getProcessListByFarmId(f.farmId, f.processId);
			} else {
				api.alert({
					msg : e.message
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
			api.alert({
				msg : "服务器错误，请联系管理员!"
			});
		}
	});

}

// 根据基地ID获取下级所有地块
function getLandsByFarmId(farmId, farmLandId) {
	if (farmId <= 0) {
		api.alert({
			msg : "参数错误：基地ID不能为空"
		});
		return;
	}
	pds.ajaxSubmit({
		url : "app/land/list?landfarmId=" + farmId,
		success : function(e) {
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				// alert(JSON.stringify(e.data));
				$.each(e.data, function(index, item) {
					if (farmLandId == item.id) {
						$("#farmLandId").val(item.landName);
						return;
					}
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
			api.alert({
				msg : errMsg + "1"
			});
		}
	});
}

// 根据基地ID获得品名下拉列表
function getCategoryListByFarmId(farmId, catalogId) {
	if (farmId <= 0) {
		api.alert({
			msg : "参数错误：基地ID不能为空"
		});
		return;
	}
	if (catalogId <= 0) {
		api.alert({
			msg : "参数错误：品名ID不能为空"
		});
		return;
	}
	pds.ajaxSubmit({
		url : "app/farmingdataresource/coprList?farmId=" + farmId,
		success : function(e) {
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				// alert(JSON.stringify(e.data));
				//
				$.each(e.data, function(index, item) {
					if (item.id == catalogId) {
						$("#catalogId").val(item.catName);
						return;
					}
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
			api.alert({
				msg : errMsg + "2"
			});
		}
	});
}

// 根据品名ID获取品种列表
function changeCatlog(catalogId, categoryId) {
	if (catalogId <= 0) {
		alert("参数错误：品名ID不能为空");
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
				$.each(e.data, function(index, item) {
					//alert(JSON.stringify(item));
					if (catalogId == item.parentId) {
						if (item.id == categoryId) {
							$("#categoryId").val(item.catName);
							return;
						}
					}
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e))
			api.alert({
				msg : errMsg + "3"
			});
		}
	});
}

/**
 *  根据品种ID获取工序列表
 * @param {int} categoryIdParam 品种ID
 * @param {int} oldProcessId 添加农事数据时选中的ID
 */
function changeCategory(categoryIdParam, oldProcessId) {//alert(categoryIdParam)
	if (categoryIdParam <= 0) {
		api.alert({
			msg : "参数错误：品种ID不能为空"
		});
		return;
	}
	//categoryId = categoryIdParam;
	pds.ajaxSubmit({
		url : "app/farmingdataresource/cateList?cateId=" + categoryIdParam,
		success : function(e) {
			//alert(JSON.stringify(e.data));
			if (e.status == 'error') {
				api.alert({
					msg : e.message
				});
			} else {
				$.each(e.data, function(index, item) {
					if (item.id == oldProcessId) {//alert(oldProcessId)
						// 回显工序
						$("#processId").val(item.proName);
						return;

					}
				});
			}
		},
		error : function(e) {
			alert(JSON.stringify(e));
			api.alert({
				msg : errMsg + "5"
			});
		}
	});
}

//// 根据基地ID获取工序列表
//function getProcessListByFarmId(farmId, oldProcessId) {
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
//				$.each(e.data, function(index, item) {
//					if (item.id == oldProcessId) {
//						$("#processId").val(item.proName);
//						return;
//
//					}
//				});
//			}
//		},
//		error : function(e) {
//			alert("服务器错误，请联系管理员!");
//		}
//	});
//}

//加载农事资源列表
function getResources() {
	//清空
	$('#resourceListId').empty();
	//删除总计
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
			} else {//alert(JSON.stringify(e))
				// 总金额
				var sumMoney = 0.00;

				$.each(e.data, function(index, item) {
					var statusText = null;
					//alert(item.status)
					if (item.status == 0) {
						statusText = "未提交";
					} else {
						statusText = "已提交";
					}
					// 保留删除的代码
					//var $tr= "<div class='argi-lists-in'>" + "<div class='argi-flex'>" + "<div  onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-img resource-img'><img src='../../image/farm_map.jpg' /></div>" + "<div onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-infos2'>" + "	<div class='argi-p flex-full'><span>资源名称</span><span>" + item.resourceNameLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>亩数</span><span>" + item.muCount + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>数量</span><span>" + item.resourceNumber + item.resourceUnitLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>状态</span><span>" + statusText + "</span></div>" + "</div>" + "<div class='control-btn text-right' onclick='removeResource(" + item.id + "," + item.status + ")'>" + "	<p class='total-price' style='margin-bottom:5px;'><span>￥" + item.money.toFixed(2) + "</span></p>" + "  <button class='argi-btn argi-btn-gray argi-btn-sm'>删除</button>" + "</div>" + "</div>" + "</div>"
					//					var $tr = "<div class='argi-lists-in' id="+item.id+">" + "<div class='argi-flex'>" + "<div  onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-img resource-img'><img src='../../image/farm_map.jpg' /></div>" + "<div onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-infos2'>" + "	<div class='argi-p flex-full'><span>资源名称</span><span>" + item.resourceNameLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>亩数</span><span>" + item.muCount + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>数量</span><span>" + item.resourceNumber + item.resourceUnitLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>状态</span><span>" + statusText + "</span></div>" + "</div>" + "<div class='control-btn text-right' onclick='removeResource(" + item.id + "," + item.status + ")'>" + "	<p class='total-price' style='margin-bottom:5px;'><span>￥" + item.money.toFixed(2) + "</span></p>" + "</div>" + "</div>" + "</div>"
					//					$("#resourceListId").append($tr);
					var $tr = "<div class='argi-lists-in' id=" + item.id + " data-status="+item.status+">" + "<div class='argi-flex'>" + "<div  onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-img resource-img'><img src='../../image/farm_map.jpg' /></div>" + "<div onclick='editFarmingDataResource(" + item.id + ")' class='argi-flex-infos2'>" + "	<div class='argi-p flex-full'><span>资源名称</span><span>" + item.resourceNameLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm'><span>亩数</span><span>" + item.muCount + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm' style='margin-left:-40px;'><span>数量</span><span>" + item.resourceNumber + item.resourceUnitLabel + "</span></div>" + "	<div class='argi-p argi-flex-3 font-size-sm' style='margin-left:-10px;'><span>状态</span><span>" + statusText + "</span></div>" + "</div>" + "<div class='control-btn text-right' style='margin-right:70px;'>" + "	<p class='total-price' style='margin-bottom:5px;'><span>￥" + item.money.toFixed(2) + "</span></p>" + "</div>" + "</div>" + "</div>"
					$("#resourceListId").append($tr);
					sumMoney += item.money;
				});

				if (e.data.length > 0) {
					//					var tr = "<tr    class='alt'><td>" + "金额总计" + "</td><td colspan='5'>" + sumMoney.toFixed(2) + "元</td></tr>";
					//					$("#farmResources tbody").append(tr);
					var totalView = "<div id='totalMoneyId'  class='argi-lists-in'>" + "<span >金额总计：</span>" + "<span >" + sumMoney.toFixed(2) + "元</span>" + "</div>"
					$("#resourceListId").after(totalView);
				};
								
				// *************删除功能**************
				deleteModule.deletes("resourceListId", function (id, status) {
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
				msg : "服务器错误，请联系管理员!"
			});
		}
	});
}

//跳转到基地编辑页面
function editFarmingDataResource(resourceId) {
	$api.openWin({
		name : "edit_farming_source",
		url : "widget://html/newtask/edit_farming_source.html",
		reload : true,
		selecteIndex : '2', //点亮导航栏第2个按键
		pageParam : {
			"resourceId" : resourceId,
			"sourceName" : "farming_detail",
			"farmId" : farmId
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
	alert(id)
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

}

