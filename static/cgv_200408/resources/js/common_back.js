/*************************************************************************
 * API TRANSACTION 
 * @param uri : 서비스 호출 경로
 * @param inDs : Input Dataset
 * @parm outDs : output Dataset
 * @param param : 검색 조건 등 파라메타
 * @param callback : 비동기 호출 callback 함수
 ************************************************************************/
function transaction(uri, inDs, outDs, param, callback) {
	if (!param) {
		param = {};
	}

	if (inDs) {
		param.inDs = inDs;
	}

	if (outDs) {
		param.outDs = outDs;
	}
	
	param.uri = uri;
	var data = {};
	data.jsonParam = JSON.stringify(param);

	$.ajax( {
		type : 'POST',
		url : "/mobile/api.do",
		data : data,
		success : function(result) {
			callback(result, null);

		}, error : function(e) {
			callback(null, e);
		}
	});
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
 ************************************************************************/
function gfn_getCommonCode(commgrpCd ,callBack) {
	var uri = "cj.cgv.common.mobile.service.MobileCommonCodeService.getBackofficeCommCodeInfoListWithGrpCd";
	var inDs  = {};
	var outDs  = {};
	var params = { commgrpCd : commgrpCd };

	transaction(uri, inDs, outDs, params, function(result, e) {
		if (!e) {
			callBack(result.codeList);
		} else {
			console.error(e);
		}
	});
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
	var outDs = {gds_comComm:"gds_comComm",
				 gds_site:"gds_site"};
	var params  = {};

	transaction(uri, inDs, outDs, params, function(result, e) {
		if (!e) {
			console.log(result);
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
//		console.log("@@@",$("#"+elName).find("option").eq(0).val());
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
			// console.log(result.codeList);
			var codeList = result.codeList;
			$(this).empty();
			for(var i in codeList){
				//console.log(codeList[i].commCd+" / "+codeList[i].commCdNm);
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
function gfn_dateDiff(_date1, _date2) {
    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
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
	
	if (!sep) {
		sep = "";
	}
	
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
 * 시간의 포맷을 구분자 포함하여 변경
 * @param
 * 			strTime :  시간
			sep     :  구분자
 * ex)
	gfn_timeFormat(scnFrTm, "-")
 ************************************************************************/
function gfn_timeFormat(strTime, sep){
	var rtnTime = "";
	
	if (!sep) {
		sep = "";
	}
	
	if(strTime != null && strTime != ""){
		rtnTime = strTime.substring(0,2) + sep + strTime.substring(2,4);
	}
	
	return rtnTime;
}

/*************************************************************************
 * 세션 데이터 값을 세팅한다.
 * ex)
	fn_setSessionData("userInfo", jsonObj);
 ************************************************************************/
function gfn_setSessionData(key, jsonObj) {
	try {
		sessionStorage.setItem(key, JSON.stringify(jsonObj));
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
		var storage = sessionStorage.getItem(sKey);
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
	console.log("fn_showMessage",pMsgCd);
	var msg;
	if (pMsgCd == null || pMsgCd.trim() == "") {
		alert("메시지 코드가 정의되지 않았습니다.");
	}else{
		msg = gfn_getMessage(pMsgCd, pBindInfo);
	}
//	console.log("test",msg);
	alert(msg);
	return true;
}

/***************************************************************************************************
 * confirm 메시지 오픈
 * @param	obj 		component object
 * @param	pMsgCd		메세지 코드 or 메세지
 * @param	pBindInfo	메세지 코드에 바인딩할 정보(바인딩 정보가 여러건일경우 "|"로 구분 ex: "사용자|부서|직급"
 * @param	[pTitle]	메세지 창 타이틀에 보여줄 정보
***************************************************************************************************/
function gfn_showConfirm(pMsgCd, pBindInfo) {
	console.log("fn_showConfirm",pMsgCd);
	var msg;
	if (pMsgCd == null || pMsgCd.trim() == "") {
		alert("메시지 코드가 정의되지 않았습니다.");
	}else{
		msg = gfn_getMessage(pMsgCd, pBindInfo);
	}
//	console.log("test",msg);
	return confirm(msg);
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
		strMessage = "정의되지 않은 메세지 입니다.";
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
function gfn_getGdsMessage(callback) {
	var uri   = "cj.cgv.common.mobile.service.MobileCommonCodeService.getMessageList";
	var inDs  = {};									//  Input Dataset
	var outDs = {gds_message:"gds_message"};		// Output Dataset
	var params = {};
	
	transaction(uri, inDs, outDs, params, function(result, e) {
		if(!e){
			callback(result);
		}
	});
}

/*************************************************************************
* 좌측 채우기
************************************************************************/ 
function gfn_Lpad(n,width) {
	if(!n){
		console.log("대상문자열이 비어있음");
		return n;
	}
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

/*************************************************************************
* 우측 채우기
************************************************************************/ 
function gfn_Rpad(str,char,cnt) {
	if(!str){
		console.log("대상문자열이 비어있음");
		return str;
	}
	
	var rtnStr = "";
	
	var size = str.length;
	if(cnt > size){
		rtnStr += str;
		for(var i = 0 ; i < size ; i ++){
			rtnStr += char;
		}
	}else{
		rtnStr += str;
	}
	
	return rtnStr;
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
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


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
	//데이터 여부
	var isData = false;
	//선택한 탭 영역
	var tabEl = $("#"+tabId);
	//탭 그룹 클래스명 (해당 탭 태그 속성에 data-tab-grp 를 탭 클래스 명을 넣어준다)
	var tabCls = tabEl.attr("data-tab-grp");
	//탭 태그 속성에 data-tab-grp가 없는경우 디폴트 클래스명
	if(!tabCls) tabCls = "tab";
	//선택한 영역의 태그 형식
//	var type = tabEl[0].tagName;
	
//	switch(type){
//		case "TABLE": isData = tabEl.find("tbody tr").length == 0; break;
//		case "DIV"  : isData = tabEl.children("#result tbody length").length == 0;       break;
//	}
	isData = tabEl.find("tbody tr").length == 0;
	
	console.log("TEST",tabEl.find("tbody tr").length);
	console.log("TEST2",tabEl.children().length);
//	console.log("TEST3",type);
	console.log("TEST4",isData);
	console.log("TEST5",tabId);
	console.log("TEST6",tabCls);
	
	if(isData) searchFunction();
	
	$("."+tabCls).hide();
	$("#"+tabId).show();
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
	params.userIp = ip();
	
	console.log("TEST2",params);
	
	transaction(uri, inDs, outDs, params, function(result, e) {
		if(!e){
			console.log(result);
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
		console.log(site);
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
				console.log(ui.item.code);
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
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
 * null 체크
 * @param  sValue: 변수값 
 *  gfn_isNull(sValue); 
 *****************************************************************************/

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