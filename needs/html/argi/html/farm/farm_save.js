var pageParam = null;
var farmId = null;
apiready = function() {
	pageParam = api.pageParam;
};
// 得到json对象
function getJsonObj() {
	var farm = {};
	farm.farmName = $('#farmName').val();
	farm.farmArea = $('#farmArea').val();
	farm.farmUserName = $('#farmUserName').val();
	farm.farmMobile = $('#farmMobile').val();
	farm.farmProvinceCode = $('#farmProvinceCode').val();
	farm.farmCityCode = $('#farmCityCode').val();
	farm.farmCountyCode = $('#farmCountyCode').val();
	farm.farmAddress = $('#farmAddress').val();
	farm.limitYears = $('#limitYears').val();
	farm.farmStorageArea = $('#farmStorageArea').val();
	farm.farmRemark = $('#farmRemark').val();
	farm.farmOfficeId = pageParam.farmOfficeId;
	farm.address = $('#address').val();
	if (farmId != null && farmId > 0) {
		farm.id = farmId;
	}
	return farm;
}

// 保存
function saveFarmInfo() {
	// 提交按钮失效,避免重复添加
	//$("#submitId").attr("disabled", "disabled");
	// 得到json对象
	var farm = getJsonObj();
	// 校验数据
	if (!checkFarmInfo(farm)) {
		// 让提交按钮恢复
		//$('#submitId').removeAttr("disabled");
		return;
	}

	pds.ajaxSubmit({
		url : "app/farm/saveFarmData",
		data : {
			"data" : JSON.stringify(farm)
		}, //
		success : function(e) {
			if (e.status == 'error') {
				// 让提交按钮生效
				//$('#submitId').removeAttr("disabled");
				api.alert({
					msg : e.message
				});
			} else {
				// 得到新增基地的ID
				farmId = e.data.id;
				// 保存成功之后将按键置灰
				//$('#submitId').addClass("argi-btn-disabled")
				api.alert({
					msg : "添加成功"
				});
			}
		},
		error : function(e) {
			// 让提交按钮生效
			//$('#submitId').removeAttr("disabled");
			api.alert({
				msg : "服务器错误，请联系管理员!"
			});
		}
	});
}

// 进入地块详情
function goLand() {
	if (farmId > 0) {
		$api.openWin({
			name : 'parcel_information',
			url : 'widget://html/land/parcel_information.html',
			selecteIndex:'4',//点亮导航栏第4个按键
			pageParam : {
				"farmId" : farmId,
				"sourceName":"farm_save"
			}
		});
	} else {
		api.alert({
			msg : "请先保存基地信息"
		});
	}
}

// 进入植保详情
function goCropProtection() {
	if (farmId > 0) {
		$api.openWin({
			name : 'crop_message',
			url : 'widget://html/mysetting/mysettings/crop/crop_message.html',
			selecteIndex:'4',//点亮导航栏第4个按键
			pageParam : {
				"farmId" : farmId
			}
		});
	} else {
		api.alert({
			msg : "请先保存基地信息"
		});
	}
}

//返回
function back() {
	api.closeWin({
	});
	// 执行win_home窗口里的exec()方法
	api.execScript({
		name : pageParam.sourceName, //win窗口名字
		frameName:pageParam.sourceName,
		script : "exec();"
	});
}

//跳转到省市区县选择页面
function selectAddress() {
	$api.openWin({
		name : 'adress_province',
		url : 'widget://html/mysetting/mysettings/address/address_province.html',
		//reload : true,
		animation : {
			type : "movein", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300 //动画过渡时间，默认300毫秒
		},
		//selecteIndex:'4',//点亮导航栏第4个按键
		// name指定的是回跳的窗口名，fun指定的是回调用的方法名
		pageParam : {
			"name" : "farm_save",
			"fun" : "getAddressCode"
		}
	});
}

// 获取选择省市的code码
function getAddressCode(addressName, proCode, cityCode, countryCode) {
	$("#address").val(addressName);
	$("#farmProvinceCode").val(proCode);
	$("#farmCityCode").val(cityCode);
	$("#farmCountyCode").val(countryCode);
}

// 手机正则
var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
// 数字正则
var numReg = /^(0\.|[1-9]+\.{0,1})\d*$/;
// 校验数据
function checkFarmInfo(farm) {
	
	if (farm.farmName == null || farm.farmName.length <= 0 || farm.farmName.replace(/\ +/g, "").length <= 0) {
		api.alert({
			msg : "基地名称不能为空"
		});
		return false;
	}
	if (farm.farmArea == null || farm.farmArea.length <= 0 || farm.farmArea.replace(/\ +/g, "").length <= 0) {
		api.alert({
			msg : "基地面积不能为空"
		});
		return false;
	} else {
		if (!numReg.test(farm.farmArea)) {
			api.alert({
				msg : "请填写正确的数据"
			});
			return false;
		} else {
			if (farm.farmArea <= 0) {
				api.alert({
					msg : "基地面积必须大于0"
				});
				return false;
			}
		}
	}

	if (farm.farmUserName == null || farm.farmUserName.length <= 0 || farm.farmUserName.replace(/\ +/g, "").length <= 0) {
		api.alert({
			msg : "负责人不能为空"
		});
		return false;
	}
	if (farm.farmMobile == null || farm.farmMobile.length <= 0 || farm.farmMobile.replace(/\ +/g, "").length <= 0) {
		api.alert({
			msg : "手机号不能为空"
		});
		return false;
	} else {
		if (!phoneReg.test(farm.farmMobile)) {
			api.alert({
				msg : "手机号格式错误"
			});
			return false;
		}
	}
	if (farm.farmProvinceCode == null || farm.farmProvinceCode.length <= 0) {
		api.alert({
			msg : "请选择基地地址"
		});
		return false;
	}
	if (farm.farmAddress == null || farm.farmAddress.length <= 0 || farm.farmAddress.replace(/\ +/g, "").length <= 0) {
		api.alert({
			msg : "基地详细地址不能为空"
		});
		return false;
	}
	if (farm.limitYears != null && farm.limitYears.length > 0) {
		if (!numReg.test(farm.limitYears)) {
			api.alert({
				msg : "请填写正确的数据"
			});
			return false;
		} else {
			if (farm.limitYears <= 0) {
				api.alert({
					msg : "流转年限必须大于0"
				});
				return false;
			}
		}
	}
	if (farm.farmStorageArea != null && farm.farmStorageArea.length > 0) {
		if (!numReg.test(farm.farmStorageArea)) {
			api.alert({
				msg : "请填写正确的数据"
			});
			return false;
		} else {
			if (farm.farmStorageArea <= 0) {
				api.alert({
					msg : "冷库面积必须大于0"
				});
				return false;
			}

		}
	}
	return true;
}