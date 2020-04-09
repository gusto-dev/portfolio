/*************************************************************************
 * API TRANSACTION
 * @param uri : 서비스 호출 경로
 * @param inDs : Input Dataset
 * @parm outDs : output Dataset
 * @param param : 검색 조건 등 파라메타
 * @param callback : 비동기 호출 callback 함수
 ************************************************************************/
const context = $("#context").val();

const expiredTime = (24 * 60 * 60 * 1000);

//권한 사이트 목록이 0 개일때 사이트검색 버튼 삭제
$(function(){
	gfn_getSiteList(function(data){
		if (data) {
			if(data.length == 1) {
				$("#siteSearchBtn").remove();
			}
		}
	});
});

function transaction(uri, inDs, outDs, param, callback,asyncFlag,lodingFlag) {
	if (!param) param = {};
	if (inDs) param.inDs = inDs;
	if (outDs) param.outDs = outDs;

	param.uri = uri;
	var data = {};
	data.jsonParam = JSON.stringify(param);

	if(!lodingFlag) {
		gfn_showLoadingBar();
	}

	$.ajax( {
		type : 'POST',
		url : context + "/mobile/api.do",
		data : data,
		async: asyncFlag != null ? asyncFlag : true,
		success : function(result) {
			if(!lodingFlag) {
				gfn_hideLoadingBar();
			}

			//# XSS 필터 원복
			var xssResultStr = JSON.stringify(result);
			xssResultStr = xssResultStr.replace("&lt;", "<").replace("&gt;", ">");
			result = JSON.parse(xssResultStr);
			//# XSS 필터 원복 //
			
			if(result.mobile_return_code == "E999"){
			//	gfn_showMessage("MSG_COM_ERR_025","세션이 만료되었습니다.");
				sessionStorage.clear();
				location.replace("/login.do");
				return false;
			}else{
				if(result.mobile_return_code != "S000"){
//					var e = result;
					callback(null,result);
				}else{
					callback(result,null);
				}
			}
		}, error : function(e) {
			console.error(e);
			location.replace("/error500.html");
		//	gfn_showMessage("MSG_COM_ERR_001");
			return false;
//			callback(null, e);
		}
	});
}


/*************************************************************************
 * gfn_dateStrChange : 문자열 날짜 형식으로 변환
 *         str       : 문자형식의 날짜
 * ***********************************************************************/

function gfn_dateStrChange(str) {
    var y = str.substr(0, 4);
    var m = str.substr(4, 2);
    var d = str.substr(6, 2);
    return new Date(y,m-1,d);
}


/*************************************************************************
 * API TRANSACTION
 * @param uri : 서비스 호출 경로
 * @param inDs : Input Dataset
 * @param formId : 파일 폼 아이디
 * @param param : 검색 조건 등 파라메타
 * @param callback : 비동기 호출 callback 함수
 ************************************************************************/
function transactionFile(uri, inDs, formId, param, callback, asyncFlag){
	if (!param) param = {};
	if (inDs) param.inDs = inDs;
	param.uri = uri;

	var formDara = new FormData($("#"+formId)[0]);
	var jsonParam = JSON.stringify(param);
	formDara.append("jsonParam",jsonParam);

	gfn_showLoadingBar();
	$.ajax( {
		type : 'POST',
		url  : context + "/mobile/api/file.do",
		data : formDara,
		processData: false,
		contentType: false,
		async: asyncFlag != null ? asyncFlag : true,
		success : function(result) {
			gfn_hideLoadingBar();
			if(result.mobile_return_code == "E999"){
				gfn_showMessage("MSG_COM_ERR_025","세션이 만료되었습니다.");
				sessionStorage.clear();
				location.replace("/login.do");
			}else{
				if(result.mobile_return_code != "S000"){
					var e = result.mobile_return_code;
					callback(null,e);
				}else{
					callback(result,null);
				}
			}
		}, error : function(e) {
			gfn_showMessage("MSG_COM_ERR_001");
			return false;
		}
	});
}

/*************************************************************************
 * API TRANSACTION
 * @param uri : 서비스 호출 경로
 * @param inDs : Input Dataset
 * @param formId : 파일 폼 아이디
 * @param param : 검색 조건 등 파라메타
 * @param callback : 비동기 호출 callback 함수
 ************************************************************************/
function transactionFileUpload(uri, inDs, formId, param, callback, asyncFlag){
	if (!param) param = {};
	if (inDs) param.inDs = inDs;
	param.uri = uri;

	var formDara = new FormData($("#"+formId)[0]);
	var jsonParam = JSON.stringify(param);
	formDara.append("jsonParam",jsonParam);

	gfn_showLoadingBar();
	$.ajax( {
		type : 'POST',
		url  : context + "/mobile/api/fileUpload.do",
		data : formDara,
		processData: false,
		contentType: false,
		async: asyncFlag != null ? asyncFlag : true,
		success : function(result) {
			gfn_hideLoadingBar();
			if(result.mobile_return_code == "E999"){
				gfn_showMessage("MSG_COM_ERR_025","세션이 만료되었습니다.");
				sessionStorage.clear();
				location.replace("/login.do");
			}else{
				if(result.mobile_return_code != "S000"){
					var e = result.mobile_return_code;
					callback(null,e);
				}else{
					callback(result,null);
				}
			}
		}, error : function(e) {
			gfn_showMessage("MSG_COM_ERR_001");
			return false;
		}
	});
}
/*************************************************************************
 * gfn_gotoLocation : 화면 전환 이벤트
 * @param location : /home
 * ex) gfn_locationHref("/home");
 ************************************************************************/
function gfn_locationHref(location, param) {
	if (!location || location.length == 0) {
		return;
	}

	if (location == "/home") {
		var empFgCd = gfn_getSessionData("userInfo", "g_empFgCd");
		if (empFgCd == "A" || empFgCd == "S") {
			window.location.href = context + "/home" + ".do";
		} else {
			alert("사용자 구분 코드가 없습니다.\n관리자에게 문의하세요.");
			sessionStorage.clear();
			localStorage.removeItem("userInfo");
			window.location.href = '/login.do';
		}
	} else {
		var getParam = "";
		if (location.indexOf("?") > 0) {
			getParam = location.substring(location.indexOf("?")+1);
		}
		var idx = location.lastIndexOf(".do");
		if (idx != -1) {
			location = location.substring(0, idx);
		}
		if (param) {
			window.location.href = context + location + ".do?param=" + JSON.stringify(param);
		} else {
			if (getParam.length > 0) {
				window.location.href = context + location + ".do?" + getParam;
			} else {
				window.location.href = context + location + ".do";
			}
		}
	}
}

/*************************************************************************
 * gfn_shakeHand : 흔들어서 통합검색
 ************************************************************************/
function gfn_shakeHand() {

	var workInfo = gfn_getSessionData("workInfo");

	if(  workInfo.status.indexOf("before") > -1 ||  workInfo.status.indexOf("dayoff") > -1 ) {
		//gfn_showMessage("MSG_COM_SUC_999","통합정보조회는 업무시간에만 이용 가능합니다");
		return false;

	} else {

		var toDayTime =  parseInt(gfn_getToDayTime().substring(0,4));
		var checkWorkTime = workInfo.ltwTm == null ?  parseInt(workInfo.expctLtwTm) : parseInt(workInfo.ltwTm);
		var nowCheckTime = checkWorkTime > 2400 && toDayTime < 1300 ?  toDayTime +2400 : toDayTime ;

		if( checkWorkTime + 200 < nowCheckTime ) {
			//gfn_showMessage("MSG_COM_SUC_999","통합정보조회는 업무시간에만 이용 가능합니다");
			return false;
		}
	}
	gfn_locationHref("/customer/integrationInformationSelect.do");
}

/*************************************************************************
 * divToJson : div 요소 -> JSON 형태로 변경
 * @param el : DIV 선택자
 * ex) $("#div").divToJson();
 ************************************************************************/
$.fn.divToJson = function(){
	var div = $(this);

	var childInput = div.find("input");
	var childSelect = div.find("select");
	var childTxtarea = div.find("textarea");
	var cnt = childInput.length;
	var dataMap = {};

	for(var i=0; i<cnt; i++){
		if(childInput[i].type == "checkbox"){
        	if(childInput[i].checked){
            	// 객체 삽입
            	dataMap[$(childInput[i]).attr("name")] = $(childInput[i]).val();
            }
        }else if(childInput[i].type == "radio"){
        	if(childInput[i].checked){
            	// 객체 삽입
            	dataMap[$(childInput[i]).attr("name")] = $(childInput[i]).val();
            }
		}else{
            // 객체 삽입
			if($(childInput[i]).attr("data-code")){
				dataMap[$(childInput[i]).attr("name")] = $(childInput[i]).attr("data-code");
			}else{
				dataMap[$(childInput[i]).attr("name")] = $(childInput[i]).val();
			}
        }
	}

	var cnt = childSelect.length;
	for(var i=0; i<cnt; i++){
        // 객체 삽입
        dataMap[$(childSelect[i]).attr("name")] = $(childSelect[i]).val();
	}

	var cnt = childTxtarea.length;
	for(var i=0; i<cnt; i++){
        // 객체 삽입
        dataMap[$(childTxtarea[i]).attr("name")] = $(childTxtarea[i]).val();
	}

	var jsonData = dataMap;
    return jsonData;
}

/*************************************************************************
 * fn_getCommonCode : 공통 코드 조회
 * @param commgrpCd : 그룹코드
 * ex)  var testDs = fn_getCommonCode("1200");
 * default : asyncFlag : false (동기방식)
 ************************************************************************/
function gfn_getCommonCode(commgrpCd ,callBack,asyncFlag,lodingFlag) {
	var uri = "cj.cgv.common.mobile.service.MobileCommonCodeService.getBackofficeCommCodeInfoListWithGrpCd";
	var inDs  = {};
	var outDs  = {};
	var params = { commgrpCd : commgrpCd };

	transaction(uri, inDs, outDs, params, function(result, e) {
		if (!e) {
			callBack(result.codeList);
		} else {
			console.error(e);
			gfn_showMessage("MSG_COM_ERR_001");
			callBack(null);
			return false;
		}
	},asyncFlag != null ? asyncFlag : false,lodingFlag);
}

/*************************************************************************
 * fn_getCommonCode : 공통코드명 조회
 * @param ds : 데이터셋 (리스트)
 * @param code : 코드
 * @param codeKey : 코드키
 * @param codeNmKey : 코드네임 키
 * ex)  var codeNm = fn_getCodeNm(ds_result,"02");
 ************************************************************************/
function fn_getCodeNm(ds,code,codeKey,codeNmKey){
	if(!codeKey) codeKey = "commCd";
	if(!codeNmKey) codeNmKey = "commCdNm";
	var codeName;

	for(var i in ds){
		if(ds[i][codeKey] == code){
			codeName = ds[i][codeNmKey];
			return codeName;
		}
	}
}
/*************************************************************************
 * fn_commCodeSelBox : 초기세팅 공통코드 데이터 조회
 ************************************************************************/
function gfn_getGdsCommonCode(callback){
	var uri = "cj.cgv.common.mobile.service.MobileCommonCodeService.getBackofficeCommCodeInfoList";
	var inDs   = {};
	var outDs = { gds_site:"gds_site"	};
	var params  = {};

	transaction(uri, inDs, outDs, params, function(result, e) {
		if (!e) {
			callback(result);
		} else {
			console.error(e);
		}
	});
}

///*************************************************************************
// * gdsToSelect        : 세션에 담겨있는 공통 코드 데이터셋 목록을 셀렉트박스에 바인드
// * @param
//			elId      : 셀렉트박스 ID
//			gdsNm     : 데이터셋 리스트 NAME
//			type      : 셀렉트박스 최상단 표기
//			cdKey     : 데이터셋의 코드 키
//			cdNmKey   : 데이터셋의 코드명 키
// * ex)
//	gdsToSelect("ds_thatCd","gds_comComm","A");
//	gdsToSelect("ds_thatCd","gds_site","","thatCd","thatNm");
// ************************************************************************/
//function gdsToSelect(elName,gdsNm,type,cdKey,cdNmKey) {
//	var typeTxt = "";
//	var typeCd = "";
//	var dsList= sessionStorage.getItem(gdsNm);
//	dsList = JSON.parse(dsList);
//
//	switch (type) {
//	case "A":
//		typeTxt = "--전체--";
//		break;
//	case "B":
//		typeTxt = "--전체--";
//		typeCd = "ZZ";
//		break;
//	case "S":
//		typeTxt = "선택";
//		break;
//	default:
//		type = null;
//		break;
//	}
//
//	if(!cdKey) cdKey = "commCd";
//	if(!cdNmKey) cdNmKey = "commCdNm";
//
//	$("#"+elName).empty();
//
//	for(var i in dsList){
//		$("#"+elName).append("<option value='"+dsList[i][cdKey]+"'>"+dsList[i][cdNmKey]+"</option>");
//	}
//
//	if(type){
//		if(typeCd){
//			$("#"+elName).prepend("<option value='"+typeCd+"' selected >"+typeTxt+"</option>");
//			$("#"+elName).val(typeCd);
//			$("#"+elName).prev().text(typeTxt);
//		}else{
//			$("#"+elName).prepend("<option value='' selected >"+typeTxt+"</option>");
//			$("#"+elName).val('');
//			$("#"+elName).prev().text(typeTxt);
//		}
//	}else{
//		$("#"+elName).val($("#"+elName).find("option").eq(0).val());
//		$("#"+elName).prev().text($("#"+elName).find("option").eq(0).text());
//	}
//}

/*************************************************************************
 * dsToSelect       : 데이터셋 목록을 셀렉트박스에 바인드
 * @param
			elId      : 셀렉트박스 ID
			dsList    : 데이터셋 리스트
			type      : 셀렉트박스 최상단 표기
			cdKey     : 데이터셋의 코드 키
			cdNmKey   : 데이터셋의 코드명 키
 * ex)
	dsToSelect("ds_thatGroup",codeList,"A");
	dsToSelect("ds_thatGroup",codeList,"A","commCd","commCdNm");
 ************************************************************************/
function gfn_dsToSelect(elName,dsList,type,cdKey,cdNmKey){
	var typeTxt = "";
	var typeCd = "";

	switch (type) {
	case "A":
		typeTxt = "-전체-";
		break;
	case "B":
		typeTxt = "-전체-";
		typeCd = "ZZ";
		break;
	case "S":
		typeTxt = "-선택-";
		break;
	default:
		type = null;
		break;
	}
	if(!cdKey) cdKey = "commCd";
	if(!cdNmKey) cdNmKey = "commCdNm";

	$("#"+elName).empty();

	for(var i in dsList){
		$("#"+elName).append("<option value='"+dsList[i][cdKey]+"'>"+dsList[i][cdNmKey]+"</option>");
	}

	if(type){
		if(typeCd){
			$("#"+elName).prepend("<option value='"+typeCd+"' selected >"+typeTxt+"</option>");
			$("#"+elName).val(typeCd);
			$("#"+elName).prev().text(typeTxt);
		}else{
			$("#"+elName).prepend("<option value='' selected >"+typeTxt+"</option>");
			$("#"+elName).val('');
			$("#"+elName).prev().text(typeTxt);
		}
	}else{
		$("#"+elName).val($("#"+elName).find("option").eq(0).val());
		$("#"+elName).prev().text($("#"+elName).find("option").eq(0).text());
	}
}

/*************************************************************************
 * fn_commCodeSelBox : 공통 코드 조회,바인드 (셀렉트박스)
 * @param
			el        :  셀렉트박스 element
			commgrpCd :  공통코드 그룹
			option    :  셀렉트박스에서 처음 보여줄 데이터
			             - A : 전체
			             - S : 선택
 * ex)
	fn_commCodeSelBox($("#ds_test"),"4560", "A");
	fn_commCodeSelBox($("#ds_test"),"4560", "S");
	fn_commCodeSelBox($("#ds_test"),"4560");
 ************************************************************************/
function gfn_getCommCodeSelBox(elId, commgrpCd, option, code){

	var uri = "cj.cgv.common.mobile.service.MobileCommonCodeService.getBackofficeCommCodeInfoListWithGrpCd";
	var inDs  = {};
	var outDs  = {};
	var params = { commgrpCd : commgrpCd };

	if(option){
		switch (option) {
		case "A":
			option = "--전체--";
			break;
		case "B":
			option = "--전체--";
			code = "ZZ";
			break;
		case "S":
			option = "선택";
			break;
		default:
			option = null;
			break;
		}
	}

	transaction(uri, inDs, outDs, params, function(result, e) {
		if (!e) {
			var codeList = result.codeList;
			$(this).empty();
			for(var i in codeList){
				$("#"+elId).append("<option value="+codeList[i].commCd+">"+codeList[i].commCdNm+"</option>");
			}

			if(option){
				if(code){
					$("#"+elId).prepend("<option value='"+code+"'>"+option+"</option>");
					$("#"+elId).val(code);
					$("#"+elId).prev().text(option);
				}else{
					$("#"+elId).prepend("<option value=''>"+option+"</option>");
					$("#"+elId).val("");
					$("#"+elId).prev().text(option);
				}
			}else{
				$("#"+elId).val($("#"+elId).find("option").eq(0).val());
				$("#"+elId).prev().text($("#"+elId).find("option").eq(0).text());
			}
		} else {
			console.error(e);
		}
	});
}

/*************************************************************************
 * 판매번호의 포맷을 구분자 포함하여 변경
 * @param
 * 			strSaleNo :  판매번호
 * ex)
	gfn_dateFormat(strSaleNo)
 ************************************************************************/
function gfn_saleNoFormat(strSaleNo){
	var rtnSaleNo = "";

	if (strSaleNo != null && strSaleNo != "") {
		rtnSaleNo = strSaleNo.substring(0,4) + "-" + strSaleNo.substring(4,8) + "-" + strSaleNo.substring(8,12);
		rtnSaleNo += "-" + strSaleNo.substring(12,16);
	}

	return rtnSaleNo;
}

/*************************************************************************
 * fn_getToDay      : 현재일조회
 * @param
			sep     :  구분자
			type    :  D - 데이트 타입 리턴 (default : String)
 * ex)
	gfn_getToDay("-","D");
	gfn_getToDay("-");
 ************************************************************************/
function gfn_getToDay(sep, type){
	var date = new Date();
	
	if (date.getHours() <= 6) {
		date = new Date(date.getTime() - (1000*60*60*24));
	}
	
	if (!sep) {
		sep = "";
	}
	
	if(type=="D") {
		return date;
	} else {
		return date.format("yyyy" + sep + "MM" + sep + "dd");
	}
}

/*************************************************************************
 * fn_getToDay      : 현재시간조회
* @param
			sep     :  구분자
			type    :  D - 데이트 타입 리턴 (default : String)
 * ex)
	fn_getToDayTime(":","D");
	fn_getToDayTime(":");
 ************************************************************************/
function gfn_getToDayTime(sep, type){
	var date = new Date();
	if (!sep) {
		sep = "";
	}
	if(type=="D") {
		return date;
	} else if (type == 'C') {
		if (date.getHours() <= 6) {
			return "" + (date.getHours() + 24) + sep + gfn_Lpad(""+date.getMinutes(), 2);
		} else {
			return "" + gfn_Lpad(""+date.getHours(), 2) + sep + gfn_Lpad(""+date.getMinutes(), 2);
		}
	} else {
		return date.format("HH" + sep + "mm" + sep + "ss");
	}
}

/*************************************************************************
 * dateDiff       : 두개의 날짜를 비교하여 차이를 알려준다.
 * @param
			_date1   : 시작일
			_date2  :  종료일
 * ex)
	if(dateDiff($("#frDate").val(),$("#toDate").val()) < 5) return;
 ************************************************************************/
function gfn_dateDiff(_date1, _date2, hasSign) {
    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1.substring(0,4),Number(_date1.substring(4,6))-1,_date1.substring(6,8));
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2.substring(0,4),Number(_date2.substring(4,6))-1,_date2.substring(6,8));

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth(), diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth(), diffDate_2.getDate());

    var diff;
    if (hasSign) {
    	diff = diffDate_2.getTime() - diffDate_1.getTime();
    } else {
    	diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    }

    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
}
/*************************************************************************
 * calcDate       : 기준일부터 특정일 전, 후 날짜를 알려준다.
 * @param
			_date : 기준일
			_num  : 소요일
			_sep  : 구분자
 * ex)
	if(dateDiff($("#frDate").val(), $("#toDate").val()) < 5) return;
 ************************************************************************/
function gfn_calcDate(_date, _num, _sep) {
	if(_date == null || _date == ""){
		var date = new Date();
	}else{
		var date = _date instanceof Date ? _date : new Date(_date);
	}

	date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + parseInt(_num));

	if (!_sep) {
		_sep = "";
	}
	return date.format("yyyy" + _sep + "MM" + _sep + "dd");
}

/*************************************************************************
 * 날짜의 포맷을 YYYYMMDD 형태로 변경
 * @param strFrom	: 일자
 * @return			: String
*************************************************************************/
function gfn_dateConvert(strDate) {
	var rtnDate;
	rtnDate = strDate.replace(/-/g,"");
	rtnDate = rtnDate.replace(/:/g,"");
	rtnDate = rtnDate.replace(/ /g,"");

	return rtnDate;
}

/*************************************************************************
 * 날짜의 포맷을 구분자 포함하여 변경
 * @param
 * 			strDate :  일자
			sep     :  구분자
 * ex)
	gfn_dateFormat(saleDy, "-")
 ************************************************************************/
function gfn_dateFormat(strDate, sep){
	var rtnDate = "";
	if (!sep) sep = "";
	if (strDate != null && strDate != "") {
		// 연·월·일 (20190620)
		rtnDate = strDate.substring(0,4) + sep + strDate.substring(4,6) + sep + strDate.substring(6,8);
		// 연·월·일·시·분·초 (20190620190930)
		if(strDate.length == 14){
			rtnDate += " " + strDate.substring(8,10) + ":" + strDate.substring(10,12);
		}
	}

	return rtnDate;
}


/*************************************************************************
 * 분실물 날짜의 포맷을 구분자 포함하여 변경
 * @param
 * 			strDate :  일자
			sep     :  구분자
 * ex)
	gfn_dateFormat(saleDy, "-")
 ************************************************************************/
function gfn_lostDateFormat(strDate, sep){
	var rtnDate = "";
	if (!sep) sep = "";
	if (strDate != null && strDate != "") {
		// 연·월·일 (20190620)
		rtnDate = strDate.substring(0,4) + sep + strDate.substring(4,6) + sep + strDate.substring(6,8);
	}

	return rtnDate;
}







/*************************************************************************
 * 분실물 일자  포맷을 구분자 포함하여 변경
 * @param
 * 			strDate :  일자
			sep     :  구분자
 * ex)
	gfn_dateFormat(saleDy, "-")
 ************************************************************************/
function gfn_lostDateFormat(strDate, sep){
	var rtnDate = "";
	if (!sep) sep = "";
	if (strDate != null && strDate != "") {
		// 연·월·일 (20190620)
		rtnDate = strDate.substring(0,4) + sep + strDate.substring(4,6) + sep + strDate.substring(6,8);
		// 연·월·일·시·분·초 (20190620190930)
		/*
		if(strDate.length == 14){
			rtnDate += " " + strDate.substring(8,10) + ":" + strDate.substring(10,12);
		}
		*/
	}

	return rtnDate;
}


/*************************************************************************
 * 시간의 포맷을 구분자 포함하여 변경
 * @param
 * 			strTime :  시간
			sep     :  구분자
 * ex)
	gfn_timeFormat(scnFrTm, "-")
 ************************************************************************/
function gfn_timeFormat(strTime, sep){
	var regexp = /^[0-9]*$/;
	if(strTime == null) return "";
	if( !regexp.test(strTime) ) return strTime;

	var rtnTime = "";
	if (!sep) sep = "";

	if(strTime != null && strTime != ""){
		rtnTime = strTime.substring(0,2) + sep + strTime.substring(2,4);
	}

	return rtnTime;
}
/*************************************************************************
 * 시간의 포맷을 구분자 포함하여 변경 추가
 * @param
 * 			strTime :  시간
			sep     :  구분자
 * ex)
	gfn_timeFormat(scnFrTm, ":")
 ************************************************************************/
function gfn_newTimeFormat(strTime, sep){
	var rtnTime = "";

	if (!sep) {
		sep = "";
	}

	if(strTime != null && strTime != ""){
		rtnTime = strTime.substring(0,2) + sep + strTime.substring(2,4) + sep + strTime.substring(4,6);
	}

	return rtnTime;
}
/*************************************************************************
 * 세션 데이터 값을 세팅한다.
 * ex)
	fn_setSessionData("userInfo", jsonObj);
 ************************************************************************/
function gfn_setSessionData(sKey, jsonObj) {
	try {
		if (sKey == "userInfo" || sKey == "gds_site") {
			localStorage.setItem(sKey, JSON.stringify(jsonObj));
			localStorage.setItem("userExpired", new Date(new Date().getTime() + expiredTime).format("yyyyMMddHHmmss"));

		} else if (sKey == "gds_message") {
			localStorage.setItem(sKey, JSON.stringify(jsonObj));

		} else {
			sessionStorage.setItem(sKey, JSON.stringify(jsonObj));
		}
	} catch (e) {
	}
}

/*************************************************************************
 * 세션 데이터 값을 조회한다.
 * @param
			sKey	: 세션키
			key	: jsonKey
 * ex)
	getSessionData("userInfo", "g_coCd");
	getSessionData("userInfo");
 ************************************************************************/
function gfn_getSessionData(sKey, key) {
	try {
		var storage;
		if (sKey == "userInfo" || sKey == "gds_site") {
			var userExpired = localStorage.getItem("userExpired");
			if (userExpired < new Date().format("yyyyMMddHHmmss")) {
				localStorage.removeItem("userExpired");
				localStorage.removeItem("userInfo");
				localStorage.removeItem("gds_site");
				localStorage.removeItem("gds_message");
				storage = null;
			} else {
				storage = localStorage.getItem(sKey);
				localStorage.setItem("userExpired", new Date(new Date().getTime() + expiredTime).format("yyyyMMddHHmmss"));
			}
		} else if (sKey == "gds_message") {
			storage = localStorage.getItem(sKey);
		} else {
			storage = sessionStorage.getItem(sKey);
		}

		if (!storage) {
			return "";
		}

		var session = JSON.parse(storage);

		if (key) {
			return session[key];
		} else {
			return session;
		}
	} catch (e) {
		return "";
	}
}
/*************************************************************************
 * fn_gridSort       : 그리드(표)를 오름차순/내림차순으로 정렬
 * @param
			datas      : 정렬할 데이터
			dataType   : 정렬할 컬럼(기준)
			sortType   : A - ASC 오름차순 리턴 (default : A)
			           : D - DESC 내림차순 리턴
 * ex)
	var datas = result.ds_bktSeat;
	gfn_gridSort(datas,"scnFrTm");
	gfn_gridSort(datas,"scnFrTm","D");
 ************************************************************************/
function gfn_gridSort(datas, dataType, sortType){
	if(!sortType) sortType="A";

	datas.sort(function(a, b) {
		if(sortType.toUpperCase() == "D"){
			return a[dataType] > b[dataType] ? -1 : a[dataType] < b[dataType] ? 1 : 0;
		}else{
			return a[dataType] < b[dataType] ? -1 : a[dataType] > b[dataType] ? 1 : 0;
		}
	});
}

/*************************************************************************
 * 사이트 목록 조회
 * @param
 * ex)
	fn_getSiteList("g_coCd");
 ************************************************************************/
function gfn_getSiteList(callBack) {
	var gds_site = gfn_getSessionData("gds_site");
	callBack(gds_site, null);
	/**
	var uri = "cj.cgv.common.mobile.service.MobileCommonCodeService.getSiteList";
	var inDs  = {};
	var outDs  = {};
	var params = {};

	transaction(uri, inDs, outDs, params, function(result, e) {
		if (!e) {
			var siteList = result.siteList;
			var validData = [];
			for(var i in siteList) {
				if(siteList[i].thatCd.trim()) validData.push(siteList[i]);
			}
			callback(validData, e);
		} else {
			console.error(e);
		}
	});
	*/
}

/***************************************************************************************************
 * 일반적인 메시지를 오픈
 * @param	obj 		component object
 * @param	pMsgCd		메세지 코드 or 메세지
 * @param	pBindInfo	메세지 코드에 바인딩할 정보(바인딩 정보가 여러건일경우 "|"로 구분 ex: "사용자|부서|직급"
 * @param	[pTitle]	메세지 창 타이틀에 보여줄 정보
***************************************************************************************************/
function gfn_showMessage(pMsgCd, pBindInfo) {
	var msg;
	if (pMsgCd == null || pMsgCd.trim() == "") {
		alert("메시지 코드가 정의되지 않았습니다.");
	}else{
		msg = gfn_getMessage(pMsgCd, pBindInfo);
		if (msg == "-1") {
			gfn_getGdsMessage(function(msg) {
				gfn_setSessionData("gds_message", msg.gds_message);
			}, false, true);
			msg = gfn_getMessage(pMsgCd, pBindInfo);
			alert(msg);
		} else {
			alert(msg);
		}
		return true;
	}
}

/***************************************************************************************************
 * confirm 메시지 오픈
 * @param	obj 		component object
 * @param	pMsgCd		메세지 코드 or 메세지
 * @param	pBindInfo	메세지 코드에 바인딩할 정보(바인딩 정보가 여러건일경우 "|"로 구분 ex: "사용자|부서|직급"
 * @param	[pTitle]	메세지 창 타이틀에 보여줄 정보
***************************************************************************************************/
function gfn_showConfirm(pMsgCd, pBindInfo) {
	var msg;
	if (pMsgCd == null || pMsgCd.trim() == "") {
		alert("메시지 코드가 정의되지 않았습니다.");
	}else{
		msg = gfn_getMessage(pMsgCd, pBindInfo);
		if (msg == "-1") {
			gfn_getGdsMessage(function(msg) {
				gfn_setSessionData("gds_message", msg.gds_message);
			}, false, true);
			msg = gfn_getMessage(pMsgCd, pBindInfo);
			return confirm(msg);
		} else {
			return confirm(msg);
		}
	}
}

/***************************************************************************************************
 * 메시지코드에 따른 메시지를 반환
 * @param  pMsgCd 		등록된 메시지 코드
 * @param  pBindInfo 	1개이면 일반 Variable, 복수이면 "|" 구분
 * @return  pMsgCd
 * ex) gfn_getMessage(MSG_SA_SUC_002,"test|20");
***************************************************************************************************/
function gfn_getMessage(pMsgCd, pBindInfo) {
	//메세지
	var strMessage;

	//메세지 목록
	var msgList = gfn_getSessionData("gds_message");

	for(var i in msgList){
		if(msgList[i].code == pMsgCd){
			strMessage = msgList[i].message;
			break;
		}
	}

	if(!strMessage){
		strMessage = "-1";
	}

	if (pBindInfo) {
		var arrBind = pBindInfo.split("|");
		if(arrBind.length != 0){
			for(var i in arrBind){
				strMessage = strMessage.replace("{" + i + "}",arrBind[i]);
			}
		}
	}
	return strMessage;
}

/*************************************************************************
* 메세지 resource 를 gds_message 에 담는다.
************************************************************************/
function gfn_getGdsMessage(callback, asyncFlag, loadingFlag) {
	var uri   = "cj.cgv.common.mobile.service.MobileCommonCodeService.getMessageList";
	var inDs  = {};									//  Input Dataset
	var outDs = {gds_message:"gds_message"};		// Output Dataset
	var params = {};

	transaction(uri, inDs, outDs, params, function(result, e) {
		if(!e){
			callback(result);
		}
	}, asyncFlag, loadingFlag);
}

/*************************************************************************
* 좌측 채우기
************************************************************************/
function gfn_Lpad(n,width) {
	if(!n){
//		console.log("대상문자열이 비어있음");
		return n;
	}
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

/*************************************************************************
* 우측 채우기
************************************************************************/
function gfn_Rpad(n,width) {
	if(!n){
		//console.log("대상문자열이 비어있음");
		return n;
	}
	n = n + '';
	return n.length >= width ? n : n + new Array(width - n.length + 1).join('0');
}

/*************************************************************************
* 메뉴 목록을 트리구조로 변환한다.
************************************************************************/
var treeModel = function (arrayList, rootId) {
	var rootNodes = [];
	var traverse = function (nodes, item, index) {
		if (nodes instanceof Array) {
			return nodes.some(function (node) {
				if (node.pgmNo === item.parPgmNo) {
					node.children = node.children || [];
					return node.children.push(arrayList.splice(index, 1)[0]);
				}

				return traverse(node.children, item, index);
			});
		}
	};

	while (arrayList.length > 0) {
		arrayList.some(function (item, index) {
			if (item.parPgmNo === rootId) {
				return rootNodes.push(arrayList.splice(index, 1)[0]);
			}

			return traverse(rootNodes, item, index);
		});
	}

	return rootNodes;
};

/*************************************************************************
* 날짜 포맷 변환 함수
************************************************************************/
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var weekNameShort = ["일", "월", "화", "수", "목", "금", "토"];
    var weekNameEng = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|EE|E|e|hh|mm|ss|mi|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekNameShort[d.getDay()];
            case "EE": return weekName[d.getDay()];
            case "e": return weekNameEng[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "mi": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            case "A/P": return d.getHours() < 12 ? "AM" : "PM";
            default: return $1;
        }
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/*************************************************************************
 * gfn_phoneNumber : 전화번호 구분자 넣어서 return
 * @param
			num : 전화번호
			sep : 구분자
 * ex)gfn_phoneNumber("01012345678", "-")
 ************************************************************************/
function gfn_phoneNumber(num, sep) {
	if(!num) return "";
    var number = num.replace(/-/g,"");
    var phone = "";

    if(number.length < 7) {
        return number;
    } else if(number.length == 7) {
        phone += number.substr(0, 3);
        phone += "-";
        phone += number.substr(3);
    } else if (number.length == 8) {
    	phone += number.substr(0, 4);
        phone += "-";
        phone += number.substr(4);
    } else if (number.length == 9) {
    	var first = number.substr(0, 2);
    	if (first == "02") {
    		phone += number.substr(0, 2);
    		phone += "-";
    		phone += number.substr(2, 3);
    		phone += "-";
    		phone += number.substr(5);
    	}
    } else if(number.length < 11) {
    	var first = number.substr(0, 3);
    	if (first.startsWith("02")) {
    		phone += number.substr(0, 2);
    		phone += "-";
    		phone += number.substr(2, 4);
    		phone += "-";
    		phone += number.substr(6);
    	} else {
    		phone += number.substr(0, 3);
    		phone += "-";
    		phone += number.substr(3, 3);
    		phone += "-";
    		phone += number.substr(6);
    	}
    } else {
        phone += number.substr(0, 3);
        phone += "-";
        phone += number.substr(3, 4);
        phone += "-";
        phone += number.substr(7);
    }

    return phone;
}

/*************************************************************************
* 팝업 내용제거
************************************************************************/
function gfn_popClean(){
	$(".layer input").val("");
	$(".layer select").empty();
	$(".layer table").empty();
	$(".layer ul").empty();
}

/*************************************************************************
* 탭 클릭
 * @param  tabClass 		탭 그룹 클래스
 * @param  resultAreaId 	해당 탭 하위에 결과 div ID
 * @param  searchFunction 	해당 탭 조회 function();
 *
 * ex) gfn_switchTab("sellTab","refundArea",function(){
 * 			searchRefund();
 * 		});
************************************************************************/
function gfn_switchTab(tabId, resultAreaId ,searchFunction){
	//선택한 탭 버튼
	var tabBtnEl = $("#"+tabId);
	//탭 버튼 그룹 클래스명 (해당 탭 태그 속성에 data-tab-grp 를 탭 클래스 명을 넣어준다)
	var tabBtnCls = tabBtnEl.attr("data-tab");
	//선택한 탭결과 영역
	var tabRsltArea = $("#"+resultAreaId);
	//선택한 탭결과 영역 그룹 클래스
	var tabRsltCls = tabRsltArea.attr("data-rslt-grp");

	//탭 태그 속성에 data-tab-grp가 없는경우 디폴트 클래스명
	if(!tabBtnCls) tabBtnCls = "tab";
	//데이터 여부
	var isData = (tabRsltArea.attr("data-flag") == "1");
	//데이터가 없다면 콜백 실행
	if(!isData) searchFunction(tabId);

	//active 효과 부여
	$(".tab_btn").removeClass("active")
	tabBtnEl.addClass("active");

	//결과영역 show hide
	$(".tab_rslt").hide();
	tabRsltArea.show();
}

/*********************************************************
 * FUNCTION NAME    : gfn_saveMenuBtnLog(파일이름, 버튼 객체, 엑셀 필드 이름)
					  ex)gfn_saveMenuBtnLog('SH020101.xml', obj, '이름,부서,합계...등등')
 * FUNCTION DESC	: 버튼 클릭시 로그 남기는 버튼.

 * @param
       params :
				pgmNm : 프로그램명 (EX : 관리번호종합조회, 일정산)
 				atnCd :(행위 : 조회:1 / 수정:2 / 삭제:3 / 출력:4 / 다운로드:5 / 기타:9)
				selItem : 조회항목(고유식별정보:1 / 그외:2)
						(고유식별정보 : 주민등록번호/여권번호/운전면허번호/외국인등록번호 등)
				selCnt : 건수
				infoMain : 식별자 (1건이면 고객코드 등 식별할 수 있는 값, 1건 이상이면 공백)
 * DATE : 2014.04.21
 * Author  :
 * @return
 *********************************************************/
function gfn_custInfoBtnLog(pgmNm,atnCd,selItem,selCnt,infoMain) {
	var uri   = "cj.cgv.system.mobile.service.MobileComBackOfficeService.custBtnLog";
	var inDs  = {};
	var outDs = {};
	var params = {};

//	params.coCd = getSessionData("userInfo", "g_coCd");
//	params.userNo = getSessionData("userInfo", "g_userId");
	params.pgmNm = pgmNm;
	params.atnCd = atnCd;
	params.selItem = selItem;
	params.selCnt = selCnt;
	params.infoMain = infoMain;
	//FIXME
//	params.userIp = ip();


	transaction(uri, inDs, outDs, params, function(result, e) {
		if(!e){

		}else{
			console.error(e);
		}
	});
}

/*************************************************************************
* 사이트 자동완성
 * @param  el 		input element
 * @param  callback 콜백함수
 *
 * ex) gfn_getSite($("#site"),function(code){
 * 			console.log(code);
 * 		});
************************************************************************/
function gfn_getSite(el,callback){
	//FIXME 사이트목록 조회
	this.gfn_getSiteList(function(orgSiteList){
		var siteList = [];
		for(var i in orgSiteList){
			var site = {};
			site.label = orgSiteList[i].thatNm;
			site.value = orgSiteList[i].thatNm
			site.code = orgSiteList[i].thatCd
			siteList.push(site)
		}

		//param으로 넘어온 element에 자동완성 바인드
		el.autocomplete({
			 source: siteList
			,minLength: 2
			,select: function(event, ui) {
				el.attr("data-code",ui.item.code);
				callback(ui.item.code);
			}
		});
	});
}

/*************************************************************************
* 천(3자리마다)단위 콤마
 * @param  num 숫자
 *
 * ex) gfn_numberFormat(1000); -> 1,000
************************************************************************/
function gfn_numberFormat(num) {
	var rtnNum = '';
	if (num != null && num != "") {
		rtnNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} else if(num == 0){
		rtnNum = num +"";
	}

    return rtnNum;
}

/*****************************************************************************
 * [미소지기용]
 *  var params = fn_getParam();
 *****************************************************************************/
function fn_getParam(){
	var param = {};
	var ymd = $("#searchDate").val();

	param.thatCd = $("#thatCd").attr("data-code");
	param.year  = ymd.substring(0,4);
	param.month = ymd.substring(4,6);

	//스케줄 대상기간 시작일자
	param.tgtTrmFrDy = $("#tgtTrmFrDy").val();

	return param;
}

/*****************************************************************************
 * 리스트 정렬
 * @param  datas: 리스트
 * @param  col: 정렬기준컬럼명
 * @param  type: 오름/내림
 *  gfn_sort(dataList,"movCd");
 *****************************************************************************/
function gfn_sort(datas,col,type){
	for(var i in datas){
		datas.sort(function(a, b) { // 오름차순
			return a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0;
		});
	}
}

/*****************************************************************************
 * 리스트 복제
 * @param  datas: 리스트
 * var newList = gfn_dplList(oldList);
 *****************************************************************************/
function gfn_dplList(data){
	var rtnList = [];
	if(data){
		for(var i in data){
			rtnList.push(data[i]);
		}
	}
	return rtnList;
}

/*****************************************************************************
 * SHOW 레이어 팝업
 * @param  popHref: ELEMENTS ID
 * gfn_layerPopup("#popCertyConfirm");//딤영역 클릭시 닫힘방지
 * gfn_layerPopup("#popCertyConfirm", false);//딤영역 클릭시 닫힘방지
 * gfn_layerPopup("#popCertyConfirm", true); //딤영역 클릭시 닫힘
 *****************************************************************************/
function gfn_layerPopup(popHref, isCancelable, key) {

	var el = $('[data-pop="'+popHref+'"]');
	if (key) {
		el.attr("data-key", key);
	}
	var isDim = el.siblings().hasClass('pop-bg');

	//dimmed 레이어를 감지하기 위한 boolean 변수
	isDim ? el.parents('.pop-dimed').addClass('show-pop') : el.addClass('show-pop');

	// 닫기버튼 클릭 시 레이어 닫힘
	el.find('.pop-close').click(function (e) {
		e.preventDefault();
	      isDim ? $('.pop-dimed').removeClass('show-pop') : el.removeClass('show-pop');
		return false;
	});

	// 백그라운드 클릭 시 레이어 닫힘
	$('.pop-dimed .pop-bg').click(function (e) {
		if (isCancelable) {
			e.preventDefault();
			$('.pop-dimed').removeClass('show-pop');
		}
		return false;
	});
}

function gfn_dismissLayerPopup(popHref) {
	var el = $('[data-pop="'+popHref+'"]');
	var isDim = el.siblings().hasClass('pop-bg');
	el.siblings().parent().removeClass("show-pop");
}

/*****************************************************************************
 * 개행 문자열을 변경한다.
 * @param  text
 * @param br <br> tag 등
 * gfn_replaceCarriageReturn(text, "<br>");
 *****************************************************************************/
function gfn_replaceCarriageReturn(text, br) {
	if (br) {
		return text.replace(/(\r\n|\n|\r)/g, br);
	} else {
		return text.replace(/(\r\n|\n|\r)/g, "<br />");
	}
}

/*****************************************************************************
 * 지정 일로부터 앞/뒤 일까지 일자를 배열로 받는다.
 * @param  d
 * @param diff
 * gfn_getBetweenDateArray("2019-01-01", 30);"
 *****************************************************************************/
function gfn_getBetweenDateArray(d, diff) {
	var result = [];
	var date = new Date(d);
	date.setDate(date.getDate() - diff);
	for (var i = 0; i<(diff*2); i++) {
		date.setDate(date.getDate() + 1);
		result.push({
			"date" : date.format("yyyy-MM-dd"),
			"d" : date.format("dd"),
			"e" : date.format("E")
		});
	}
	return result;
}


/*************************************************************************
 * gfn_dsToLiList       : 데이터셋 목록을 Ul에 Li로 바인드
 * @param
			elId      : 셀렉트박스 ID
			dsList    : 데이터셋 리스트
			type      : 셀렉트박스 최상단 표기
			cdKey     : 데이터셋의 코드 키
			cdNmKey   : 데이터셋의 코드명 키
 * ex)
	dsToSelect("ds_thatGroup",codeList,"A");
	dsToSelect("ds_thatGroup",codeList,"A","commCd","commCdNm");
 ************************************************************************/
function gfn_dsToLiList(ulId,dsList,type,cdKey,cdNmKey){

	var typeTxt = "";
	var typeCd = "";
	var dataVal = "";

	switch (type) {
	case "A":
		typeTxt = "전체";
		break;
	case "B":
		typeTxt = "전체";
		typeCd = "ZZ";
		break;
	case "S":
		typeTxt = "선택";
		break;
	default:
		type = null;
		break;
	}

	if(!cdKey && !cdNmKey) dataVal = "addVal";
	if(!cdKey) cdKey = "commCd";
	if(!cdNmKey) cdNmKey = "commCdNm";

	$("#"+ulId).empty();

	for(var i in dsList){
		var length = String(dsList[i][cdNmKey]).length;
		var addClassNm = "";
		if (length > 12) {
			addClassNm = " font-resize-s ";
		}
		if (ulId =="ul_scnSeq") {
			addClassNm += "flex-direction-in "; // vip 좌석 상세조회 팝업
		}
		if (cdKey == "commCd" && cdNmKey == "commCdNm") {
			var html = '<li class=" '+addClassNm+'" onclick="fn_sel_'+ulId+'(this)"  data-code="'+dsList[i][cdKey]+'" data-name="'+dsList[i][cdNmKey]+'" data-addVal="'+dsList[i][dataVal]+'">';
		} else {
			var html = '<li class=" '+addClassNm+'" onclick="fn_sel_'+ulId+'(this)"  data-code="'+dsList[i][cdKey]+'" data-name="'+dsList[i][cdNmKey]+'">';
		}

		html += String(dsList[i][cdNmKey]);

		if(ulId =="ul_scnSeq"){ // vip 좌석 상세조회 팝업
			html += '<span class="f-color03 mg-l5">' + gfn_timeFormat(dsList[i].scnFrTm,":") + '</span>';
		}

		html += '</li>';
		$("#"+ulId).append(html);
	}

	if(type){
		if(typeCd){
			var html = '<li class="active '+addClassNm+'" onclick="fn_sel_'+ulId+'(this)" data-code="'+typeCd+'" data-name="'+dsList[i][cdNmKey]+'">';
			html += String(typeTxt);
			html += '</li>';
			$("#"+ulId).prepend(html);
		}else{
			var html = '<li class="active '+addClassNm+'" onclick="fn_sel_'+ulId+'(this)" data-code="">';
			html += String(typeTxt);
			html += '</li>';
			$("#"+ulId).prepend(html);
		}
	}else{
		$("#"+ulId).find("li").eq(0).addClass("active");
	}
}

//일자 포맷 변경
function gfn_convertYmd(paramDate,sep){
	if(paramDate instanceof Date){
		if(!sep) sep = "";
		var y = paramDate.getFullYear();
		var m = (paramDate.getMonth()+1);
		var d = paramDate.getDate();

		if(m < 10) m = "0"+m;
		if(d < 10) d = "0"+d;

		return y+ sep + m + sep + d;
	}else{
		var y = paramDate.substring(0,4);
		var m = paramDate.substring(4,6);
		var d = paramDate.substring(6,8);
		return new Date(y,Number(m)-1,d);
	}
}

// Array Disticnt
function gfn_arrDistinct(array){
	array.filter((item, index) => array.indexOf(item) === index);
	return array.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
}

// 데이터 바인드 (명명규칙 필수)
function gfn_dataBind(perfix,data,attr,isHtml){
	var selEl
	for(var key in data){
		if(!data[key]) data[key] = "";
		if(attr == "name"){
			selEl = $("[name="+perfix+key+"]");
		}else{
			selEl = $("#"+perfix+key);
		}
		var nodeNm = selEl.prop('nodeName');

		if(nodeNm){
			if(nodeNm == "INPUT") selEl.val(data[key]);
			else{
				if(isHtml) selEl.html(data[key]);
				else selEl.text(data[key]);
			}
		}
	}
}

//데이터 지우기 (명명규칙 필수) 키워드로 시작 하는 모든 아아디의 요소의 내용 지우기
function gfn_dataRemove(keyword){
	$("[id^="+keyword+"]").each(function() {
		var nodeNm = $(this).prop('nodeName');
		if(nodeNm == "INPUT") $(this).val();
		else $(this).text("");
	});
}

//Slider DatePicker
function gfn_setSlideDayPicker(divEl,datepickerEl){
	var paramDate = datepickerEl.text();
	if(!paramDate) paramDate = this.gfn_getToDay("-");
	gfn_resetDateArr(paramDate,divEl);

	//현재일 element
	var nowDateEl = $("[data-date='"+paramDate+"']");
	//초기 중앙 정렬
	var elWidth = Math.round(Number(nowDateEl.css("width").replace("px","")));
	var divPad  = Math.round(Number($(divEl).css("padding-right").replace("px","")));
	var offset = nowDateEl.offset();
	$(divEl).animate({scrollLeft:(offset.left - (elWidth*3))- Math.round(divPad*2)});

	//Datepicker 선택 이벤트
	$(document).on("change",".items",function(){
//		$(".items.active").removeClass("active")
//		$(this).addClass("active");

		var cnt = 0;
		var selDate = $(this).attr("data-date");
		$(".items").each(function(i){
			if(selDate == $(this).attr("data-date")) cnt = i;
		});

		var elOffset = (elWidth * (Number(cnt)-3)) + Math.round(divPad/2);

//		var itemWidth = divEl.children().first().width();
//		var centerPos = Math.floor(dateArr.length / 2) - Math.floor(perViewCount / 2) - 1;
//		var elOffset = itemWidth * centerPos;

		$(divEl).animate({scrollLeft:elOffset});
		$(divEl).attr("data-date",$(this).attr("data-date"));
		$(datepickerEl).attr("data-date",$(this).attr("data-date"));
		$(datepickerEl).text($(this).attr("data-date"));
//		$(datepickerEl).trigger("change");
	});

	//sliderpicer 선택 이벤트
	$(document).on("click",".items",function(){
		var cnt = 0;
		var selDate = $(this).attr("data-date");
		$(".items").each(function(i){
			if(selDate == $(this).attr("data-date")) cnt = i;
		});

		var elOffset = (elWidth * (Number(cnt)-3)) + Math.round(divPad/2);
//		var itemWidth = divEl.children().first().width();
//		var centerPos = Math.floor(dateArr.length / 2) - Math.floor(7 / 2) - 1;
//		var elOffset = itemWidth * centerPos;

//		$(divEl).animate({scrollLeft:elOffset});
		$(divEl).attr("data-date",$(this).attr("data-date"));
		$(datepickerEl).attr("data-date",$(this).attr("data-date"));
		$(datepickerEl).text($(this).attr("data-date"));
		$(datepickerEl).trigger("change");
//		$(divEl).trigger("change");
	});
}
//Slider DatePicker > reset
function gfn_resetDateArr(paramDate,divEl){
	var dateArr = this.gfn_getBetweenDateArray(paramDate,30);
	var activeClass = "";

	$(divEl).empty();
	for(var i in dateArr){
		if(dateArr[i].e == "일") sunClass = "items-sun";
		else sunClass = "";

		if(dateArr[i].date == paramDate) activeClass = "active";
		else activeClass = "";

		var html = ""
		html += '<div class="items '+activeClass+' '+sunClass+'" data-date="'+dateArr[i].date+'"><div>';
		html += '<p class="date">'+dateArr[i].e+'</p>';
		html += '<p class="day">'+dateArr[i].d+'</p>';
		html += '</div></div>';
		$(divEl).append(html);
	}
}

//해당 월의 마지막일자 조회
function gfn_getLastDate(date,type,sep){
	if(!sep) sep = "";
	if(!date) date = new Date();

	//스트링일때

	date instanceof Date  ? date : date = new Date(date.substring(0,4),date.substring(4,6),date.substring(6,8));

//	if(! date instanceof Date){
//		var y,m,d;
//		y = ;
//		m = ;
//		d = ;
//		date = new Date(y,m,d);
//	}

	if(type == "D"){
		return new Date(date.getFullYear(),date.getMonth(),0);
	}else{
		var lastDate = new Date(date.getFullYear(), date.getMonth(), 0);
		var y =  lastDate.getFullYear();
		var m =  lastDate.getMonth()+1;
		var d =  lastDate.getDate();

		if(m < 10) m = "0"+m;
		if(d < 10) d = "0"+d;

		return y+sep+m+sep+d;
	}
}

/*************************************************************************
 * 2019-07-17 추가 버튼으로 수정 사용
 * gfn_dsToBtnList       : 데이터셋 목록을 DIV에 BUTTON로 바인드
 * @param
			elId      : 셀렉트박스 ID
			dsList    : 데이터셋 리스트
			type      : 셀렉트박스 최상단 표기
			cdKey     : 데이터셋의 코드 키
			cdNmKey   : 데이터셋의 코드명 키
 * ex)
	dsToSelect("ds_thatGroup",codeList,"A");
	dsToSelect("ds_thatGroup",codeList,"A","commCd","commCdNm");
 ************************************************************************/
function gfn_dsToBtnList(divId,dsList,type,cdKey,cdNmKey){
	var typeTxt = "";
	var typeCd = "";
	var dataVal = "";

	switch (type) {
	case "A":
		typeTxt = "전체";
		break;
	case "B":
		typeTxt = "전체";
		typeCd = "ZZ";
		break;
	case "S":
		typeTxt = "선택";
		break;
	default:
		type = null;
		break;
	}

	if(!cdKey && !cdNmKey) dataVal = "addVal";
	if(!cdKey) cdKey = "commCd";
	if(!cdNmKey) cdNmKey = "commCdNm";

	$("#"+divId).empty();

	for(var i in dsList){
		if(cdKey == "commCd" && cdNmKey == "commCdNm"){
			var html = '<button type="button" class="" onclick="fn_sel_'+divId+'(this)" data-code="'+dsList[i][cdKey]+'" data-addVal="'+dsList[i][dataVal]+'">';
		}else{
			var html = '<button type="button" class="" onclick="fn_sel_'+divId+'(this)" data-code="'+dsList[i][cdKey]+'">';
		}
		html += String(dsList[i][cdNmKey]);
		html += '</button>';

		$("#"+divId).append(html);
	}

	if(type){
		if(typeCd){
			var html = '<button type="button" class="active" onclick="fn_sel_'+divId+'(this)" data-code="'+typeCd+'">';
		}else{
			var html = '<button type="button" class="active" onclick="fn_sel_'+divId+'(this)" data-code="">';
		}
		html += String(typeTxt);
		html += '</button>';

		$("#"+divId).prepend(html);
	}else{
		$("#"+divId).find("li").eq(0).addClass("active");
	}
}

/*************************************************************************
 * 2019-07-19 라인 프로그래스
 * gfn_setLineProgress : 최대값과 현재 값을 넣으면 해당 영역에
 *                       프로그래스 라인을 만들어준다
 * @param option{
 * 					el      : [필수] 프로그래스 표기영역 element
 * 					maxVal  : [필수] 최대값
 * 					nowVal  : [필수] 현재값
 * 					color   : 색상
 * 					type    : 표기를 현재값으로 할지 , 퍼센트로 할지.
 * 				}
 * ex)
	gfn_setLineProgress({
		 el:$("#div")
		,maxVal : 20
		,nowVal : 3
		,color  : #fb4357
		,type   : 'cnt'
	});
 ************************************************************************/
function  gfn_setLineProgress(option){
	const clsNm = '.percentCount'
	const numType = 'number';
	var percent = 0;

	var maxVal = option.maxVal;
	var nowVal = option.nowVal;

	if(numType != typeof maxVal) maxVal = Number(maxVal);
	if(numType != typeof nowVal) nowVal = Number(nowVal);

	var color  = option.color;
	var el     = option.el;

	var percent = (nowVal / maxVal) * 100;
	percent = Math.round(Number(percent));

	if(!color) color = '#fb4357';

	var lp = $(el).LineProgressbar({
		percentage: percent,
		fillBackgroundColor:color,
		height: '18px',
		unit: '',
		animation: false
	});

	if(option.type == "cnt"){
		$(el).find(clsNm).html(nowVal);
	}
}

function gfn_isNull(sValue) {
	if ( sValue instanceof String ) {
		var sVal = new String(sValue);
		if (sVal.valueOf() == "undefined" || sValue == null || sValue == "null" || sValue.trim().length <= 0 ) return true;
	} else {
		if(typeof(sValue) == "undefined" || sValue == "null" || sValue == "undefined" || sValue == null || sValue == undefined || sValue.length == 0 ) return true;
	}

    var v_ChkStr = new String(sValue);
    if (v_ChkStr == null||v_ChkStr.length == 0 ) return true;

    return false;
}

/// 안드로이드 뒤로가기 처리
function gfn_historyBack() {
	if ($("#p01_saleDetailUseTab.show-pop").is(":visible")) {
		if(parentView){
			fn_changeTab(parentView);
		}
		$(".show-pop").hide(); //고객정보>판매정보 닫기
		
	} else if ($("[data-pop='#empBarcode']:visible").length > 0) {
		fn_hideBarcode(); //바코드 닫기
		
	} else if ($(".show-pop").is(":visible")) {
		$(".show-pop").hide(); //팝업 노출 시 제거

	} else if ($(".cgv-mobile.toggled").length > 0) {
		$(".cgv-mobile.toggled").removeClass("toggled"); //drawer 노출시 닫기

	} else if ($(".more-box.on").length > 0) {
		$(".more.on").removeClass("on"); //버튼 되돌리기
		$(".more-box.on").removeClass("on"); //바로가기 닫기
		$(".pop-bg.on").removeClass("on");//dim닫기
	} else {
		return true;
	}
	return false;
}

function gfn_showLoadingBar() {
	if ($(".page-mask").length < 1) {
		var mask = "<div class='page-mask'></div>";
		var loadingImg = '';
		loadingImg += "<div class='loading-img'>";
		loadingImg += "		<img src='" + context + "/resources/images/loading.gif'/>";
		loadingImg += "</div>";
		$('body').append(mask).append(loadingImg);
	}

	var maskHeight = $(document).height(); 
	var maskWidth = window.document.body.clientWidth;
	$('.page-mask').css({ 'width' : maskWidth , 'height': maskHeight , 'opacity' : '0.3' });
	$('.page-mask').show();
	$('.loading-img').show();
}

function gfn_hideLoadingBar() { 
	$('.page-mask, .loading-img').hide();
	$('.page-mask, .loading-img').remove(); 
}

/*****************************************************************************
 * 슬라이더 생성
 * @param  option
 * [requird] option.div       : 슬라이드가 생길 영역
 * [requird] option.list      : 슬라이드를 만들 object 배열
 * [requird] option.valueKey  : 슬라이드에 표기할 object의 key
 * [requird] option.classNm   : 슬라이드 생성 class명 (Swiper는 클래스로 동작함)
 * option.change              : 변경후 콜백 이벤트
 * option.init                : 초기화 콜백 이벤트
 * option.key                 : 슬라이드 참조값에 넣을 object의 key
 * option.initVal             : 슬라이드 초기 세팅값
 * --------------------------------------------------------------------------
 * ex)
 * gfn_setSwiper({
		 div      : $("#t02_date")
		,list     : dsplTermArr
		,key      : "week"
		,initVal  : 2
		,classNm  : "t02_swiper_term"
		,valueKey : "term"
		,change   : function(term,weekCnt){
			fn_getSchdWrtList(weekCnt);
		}
	});
 *****************************************************************************/
function gfn_setDateSwiper(option){
	var mySwiper
	var div = $(option.div);
	var list = option.list;
	var _cdKey = option.key;
	var _valueKey = option.valueKey;
	var classNm   = option.classNm;
	var initVal   = option.initVal;
	var bfData;

	for(var i in list){
		var html = "";
		html +="<div class='swiper-slide' ";
//		html +="data-ref='' " ;
		html +="data-ref='"+list[i][_cdKey]+"' >";
		html +=	list[i][_valueKey] + "</div>";
		div.append(html);
	}

	mySwiper = new Swiper('.'+classNm, {
		initialSlide: initVal? initVal:0,
		navigation: {
			prevEl: option.btnCls[0],
			nextEl: option.btnCls[1],
		},
		centeredSlides: true,
		loop: option.loop == null? false : option.loop,
		on : {
			init : function(){
				if(option.init) option.init(this);
			},
			slideChangeTransitionEnd: function(){
				var idx = this.activeIndex;
				var activeSlide = this.slides[idx];
				var ref = $(activeSlide).data("ref");
				console.log("ref",ref)
				if(option.change) option.change(activeSlide,ref);
			}
		}
	});

	return mySwiper;
}


function gfn_getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


//툴팁 딤처리 선택시 툴팁 제거
//$(document).on("click",".tooldim.pop-bg",function() {
//	$("section").removeClass('dim-on');
//	$(this).remove();
//});

//툴팁생성
function gfn_mkTooltip(option){
	var title = option.title;
	if(!title) return;
	var sTitle = option.sTitle;
	if(!sTitle) sTitle = "";
	$(".tooldim").remove();
	var role = $(option.target).attr("role");

	if(role != "gridcell"){
		option.target = $(option.target).parent();
	}

	var trg_offset = $(option.target).offset(); // td 위치

	var tooltipHtml = '<div class="tooldim pop-bg" style="cursor:pointer;">';
		tooltipHtml += '<div id="dv_tooltip" role="tooltip" class="ui-tooltip ui-corner-all ui-widget-shadow ui-widget ui-widget-content" style="display:none;">';
		tooltipHtml += '<div class="ui-tooltip-content">';
		tooltipHtml += '<p class="movie" id="title"></p>';
		tooltipHtml += '<p class="auditorium" id="sTitle"></p>';
		tooltipHtml += '</div></div></div>';

	$('body').append(tooltipHtml);

	$("#title").text(title);
	$("#sTitle").text(sTitle);

	var tt_width_txt = $("#dv_tooltip").css("width").replace("px","");
	var trg_width_txt = $(option.target).css("width").replace("px","");
	var tt_width = Number(tt_width_txt)/2; // tt width 50%
	var trg_width = Number(trg_width_txt)/2; // td width 50%
	$("#dv_tooltip").offset({top:trg_offset.top - 50 , left:trg_offset.left - tt_width + trg_width});

	$("#dv_tooltip").show();
	$("section").addClass('dim-on');
	var tooltip = $("#dv_tooltip");

	if (tooltip.offset().left <= 0 ) {
		tooltip.offset({left:10});
		tooltip.addClass("positionleft");
	}

	//툴팁 딤처리 선택시 툴팁 제거 이벤트 바인딩
	$(".tooldim").bind("click",function(){
		$("section").removeClass('dim-on');
		$(this).remove();
	})
}

// 그리드 목록 데이터 없는 경우 데이터 없습니다 처리
function gfn_displayEmptyText(grdEl,flag){
	var colCnt = $("th[role='columnheader']").length;
	var emptyText = "<tr><td colspan="+colCnt+"> 데이터가 없습니다. </td></tr>";
	if (flag)  grdEl.find("tbody").append(emptyText);

}

//그리드 초기화
function gfn_gridInit(option){
	var tableEl = option.table;
	var colNms = option.colNms;
	var colMdls = option.colMdls;
	var height = $("section").height() + $("footer .menu").height();
	var width  = $(tableEl).parents(".content-full").width();

	if(!option.height) $(".content-sub").css("overflow-y","hidden");
	
	height = option.height ? option.height:height;
	width  = option.width ? option.width:width;
	
	var search = option.search ? option.search:false;
	var cmTemplate = option.cmTemplate ? option.cmTemplate : null;
	var cnt = 0;
	
	$(tableEl).jqGrid({
		search     : search,
		datatype   : "local",
		height     : height,
		width      : width,
		rowNum     : 999999,
		colNames   : colNms,
		colModel   : colMdls,
		cmTemplate : cmTemplate,
		multiselect: option.multiselect? option.multiselect:false,
		onCellSelect : function(rowId,idx,content,event){
			if(option.onCellSelect) option.onCellSelect(rowId,idx,content,event);
		},
		onSelectRow : function(id){
			var rowData = tableEl.jqGrid('getRowData',id);
			if(option.onSelectRow) option.onSelectRow(id,rowData);
		},
		onSelectAll: function(aRowids,status) { //전체선택
			if(option.onSelectAll) option.onSelectAll(aRowids,status);
		},
		loadComplete: function(e){
			if(option.loadComplete) option.loadComplete($(this));
			var th_height = $(".ui-jqgrid-hdiv").outerHeight();
			
			if(!option.height){
				$(tableEl).setGridHeight(height);
				$(".ui-jqgrid-bdiv").bind("scroll",function(e){
					
					var a = $(e.target).scrollTop(); // 스크롤 상단 높이값
					var b = $(e.target).children("div").height(); //스크롤 영역 하위 div의 높이 (총 목록의 높이)
					var c = $(e.target).height(); //스크롤이 보여지는 영역의 높이
					
					if(a+c >= b-1){ //스크롤이 최하단에 닿았을때
						var footerH = $("footer .menu").height(); //해당 테이블의 헤더 높이값
						var headerH = $(e.target).parents(".ui-jqgrid").find(".ui-jqgrid-hdiv").height();
						var titH = $(".content-title").height();
						$(e.target).css("padding-bottom",footerH+headerH+titH); // 하단에 헤더 높이값만큼 패딩을 넣어준다.
						console.log("padding - on" ,footerH+headerH+titH); 
					}
				});
			}
			
		},
		onSortCol: function(columnName, columnIndex, sortOrder) {        // 헤더 클릭 이벤트 : 칼럼명, 인덱스, 정렬순서
			if(option.onSortCol){
				return option.onSortCol(columnName, columnIndex, sortOrder)
			}
		},
		beforeSelectRow: function(rowid, e) { //행 선택 전
			if(option.beforeSelectRow){
				return option.beforeSelectRow(rowid, e)
			}
		},
		afterInsertRow : function(rowid,rowdata,rowelem){
			if(!option.height){
				var footerH = $("footer .menu").height(); //푸터 높이값
				var headerH = $(".ui-jqgrid-bdiv").parents(".ui-jqgrid").find(".ui-jqgrid-hdiv").height(); //헤더 높이값
				
				var rowH    = $(this).find(".jqgrow.ui-row-ltr.ui-widget-content").eq(0).height();
				var tblH    = $(this).height(); // 테이블의 높이값
				var titH = $(".content-title").height();
				var viewH   = $("section").height()-headerH; // 보여지는 높이값

				if(viewH+footerH+rowH >= tblH){
					console.log("padding - on" , footerH+headerH);
					$(".ui-jqgrid-bdiv").css("padding-bottom",headerH+footerH+titH); // 하단에 헤더 높이값만큼 패딩을 넣어준다.
				}else{
					console.log("padding - off",footerH+headerH);
					$(".ui-jqgrid-bdiv").css("padding-bottom",0);  
				}
  			}
		}
	});
}

//이름 마스킹
function gfn_nameMasking(name){
	var mskName = "";
	if(!name) return name;
	if(name.length == 2){
		mskName = name[0]+"*"
	}else if(name.length == 3){
		mskName = name[0]+"*"+name[2];
	}else if(name.length > 3){
		var temp = name.substr(3)
		mskName = name[0]+"**"+temp;
	}
	return mskName;
}

