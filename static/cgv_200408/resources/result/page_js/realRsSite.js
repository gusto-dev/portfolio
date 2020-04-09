//최근집계일시
var lastTotDtm;
var sortType;
//var userInfo = JSON.parse(localStorage.getItem("userInfo"));
function fn_init(){
	fn_getLastTotDtm();
	
	$("[name='rsSiteType']").on("change",function(e){
		sortType = "d";
		$(".sortTh").removeAttr("sort-type");
		
		var value = $(e.target).val();
		if(value == "rs"){
			fn_getRealRsSiteRs();
		}else if(value == "site"){
			fn_getRealRsSiteSite();
		}
	});
	
	sortType = "d";
	$(".sortTh").on("click",function(e){
		var dataType = $(e.target).siblings().eq(0).text();
		
		if(!sortType){
			sortType = "d";
		}else if(sortType == "d" && $(e.target).hasClass("sort-active")){
			sortType = "a";
		}else if(sortType == "a" && $(e.target).hasClass("sort-active")){
			sortType = "d";
		}else{
			sortType = "d";
		}
		
		var colNm = $(e.target).attr("colNm");
		
		if(dataType == "SITE"){
			fn_getRealRsSiteSite(sortType,colNm);
		}else if(dataType == "RS"){
			fn_getRealRsSiteRs(sortType,colNm)
		}
		
		if(sortType == "d") $(e.target).attr("sortType","a");
		else if(sortType == "a") $(e.target).attr("sortType","d");
		
	});
	
	//RSSITE 하이라이트
	$(document).on("DOMNodeInserted", "tr", function(e){
		var rsCd = userInfo.g_bizGrpNo;
		var thatCd = userInfo.g_thatCd;
		if(rsCd){
			var a = $(e.target).find("td[data-cd='"+rsCd+"']");
			if(a.length){
				$(e.target).addClass("point-bg");
			}
		}
		if(thatCd){
			var a = $(e.target).find("td[data-cd='"+thatCd+"']");
			if(a.length){
				$(e.target).addClass("point-bg");
			}
		}
	});
	
	fn_initSearch();
}

//최근 집계 일시 조회
function fn_getLastTotDtm(){
	transaction({
		url : '/result/getLastTotDtm.do'
		,asyncFlag : false
	},function(result,e){
		if(!e){
			console.log(result.lastTotDtm)
			if(!result.lastTotDtm) return;
			lastTotDtm = result.lastTotDtm;
			
			var y = lastTotDtm.substr(0,4);
			var m = lastTotDtm.substr(4,2);
			var d = lastTotDtm.substr(6,2);
			var hh = lastTotDtm.substr(8,2);
			var mi = lastTotDtm.substr(10,2);
			console.log(y+"-"+m+"-"+d+" "+hh+":"+mi);
			$("#lastTotDtm").text(y+"-"+m+"-"+d+" "+hh+":"+mi);
		}else{
			console.error(e);
		}
	});
}

//조회,재조회
function fn_initSearch(){
	$("#ex_rd1").prop("checked",true);
	$(".sortTh").removeAttr("sort-type");
	fn_getRealRsSiteRs();
	$(".sort-active").attr("sortType","d");
}

//RS별 실적 조회
function fn_getRealRsSiteRs(sortType,sortCol){
	if(!sortType) sortType = "d";
	if(!sortCol) sortCol = "bktQty";
	var params = {lastTotDtm : lastTotDtm,sortType:sortType,sortCol:sortCol};
	transaction({
		url : '/result/getRealRsSiteRs.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log(result)
			fn_mkRow01(result);
			$(".sortTh").removeClass("sort-active");
			if(result.realRsSiteRs.length != 0){
				$(".sortTh[colNm='"+sortCol+"']").addClass("sort-active");
				fn_getSortIcon($(".sort-active"),sortType);
			}
		}else{
			console.error(e);
		}
	});
}

//SITE별 실적 조회
function fn_getRealRsSiteSite(sortType,sortCol){
	if(!sortType) sortType = "d";
	if(!sortCol) sortCol = "bktQty";
	var params = {lastTotDtm : lastTotDtm,sortType:sortType,sortCol:sortCol};
	transaction({
		url : '/result/getRealRsSiteSite.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log(result)
			fn_mkRow02(result);
			$(".sortTh").removeClass("sort-active");
			if(result.realRsSiteSite.length != 0){
				$(".sortTh[colNm='"+sortCol+"']").addClass("sort-active");
				fn_getSortIcon($(".sort-active"),sortType);
			}
		}else{
			console.error(e);
		}
	});
}

//RS별 실적 테이블 생성
function fn_mkRow01(data){
	$("#th_rsSiteType").text("RS");
	$("#resultTable").empty();
	
	if(data.realRsSiteRs.length == 0){
		$("#resultTable").append("<tr><td class='align-c' colspan='5'> 데이터가 없습니다. </td></tr>");
		return false;
	}
	
	var html = "<tr class='total'>";
	html +="<td class='r-line' >총계</td>"
	html +="<td>"+ gfn_numberFormat( data.realRsSiteRsTot[0].bktQty ) +"</td>";
	html +="<td>"+ fn_getPercentFormat( data.realRsSiteRsTot[0].bktWgt.toFixed(1) ) +"</td>";
	html +="<td>"+ gfn_numberFormat( data.realRsSiteRsTot[0].seqCnt ) +"</td>";
	html +="<td>"+ gfn_numberFormat( data.realRsSiteRsTot[0].seatCnt ) +"</td>";
	html +="<tr>";
	$("#resultTable").append(html);
	
	html = "";
	for(var i in data.realRsSiteRs){
//		if(userInfo.g_bizGrpNo == data.realRsSiteRs[i].commCd) html += "<tr class='point-bg'"; //rs bg 색
//		else
		html += "<tr";
		html += " onclick='fn_getRsDetail("+JSON.stringify(data.realRsSiteRs[i])+")' >";
		html +="<td class='r-line' data-cd='"+data.realRsSiteRs[i].commCd+"'>"+ data.realRsSiteRs[i].commCdNm +"</td>";
		html +="<td>"+ gfn_numberFormat( data.realRsSiteRs[i].bktQty ) +"</td>";
		html +="<td>"+ fn_getPercentFormat( data.realRsSiteRs[i].bktWgt.toFixed(1) ) +"</td>";
		html +="<td>"+ gfn_numberFormat( data.realRsSiteRs[i].seqCnt ) +"</td>";
		html +="<td>"+ gfn_numberFormat( data.realRsSiteRs[i].seatCnt ) +"</td>";
		html += "</tr>";
	}
	$("#resultTable").append(html);
}

//SITE별 실적 테이블 생성
function fn_mkRow02(data){
	$("#th_rsSiteType").text("SITE");
	$("#resultTable").empty();
	
	if(data.realRsSiteSite.length == 0){
		$("#resultTable").append("<tr><td class='align-c' colspan='5'> 데이터가 없습니다. </td></tr>");
		return false;
	}
	
	fn_flNullData(data);
	var html = "<tr class='total'>";
	html +="<td class='r-line'>총계</td>"
	html +="<td>"+ gfn_numberFormat( data.realRsSiteSiteTot[0].bktQty ) +"</td>";
	html +="<td>"+ fn_getPercentFormat( data.realRsSiteSiteTot[0].bktWgt.toFixed(1) ) +"</td>";
	html +="<td>"+ gfn_numberFormat( data.realRsSiteSiteTot[0].seqCnt ) +"</td>";
	html +="<td>"+ gfn_numberFormat( data.realRsSiteSiteTot[0].seatCnt ) +"</td>";
	html +="<tr>";
	$("#resultTable").append(html);
	
	html = "";
	for(var i in data.realRsSiteSite){
		html += "<tr onclick='fn_goRealSmry("+JSON.stringify(data.realRsSiteSite[i])+")'>";
		/*
		 * 2020.02.27
		 * 임승진님 요청사항.
		 * 실시간 > RS/SITE > SITE 별 > 테이블 > 사이트명 앞에 숫자를 붙여주세요
		 *  */
		html += "<td class='r-line' data-cd='"+data.realRsSiteSite[i].thatCd+"'>"+(Number(i)+1)+"."+ gfn_removeCGVTxt( data.realRsSiteSite[i].thatNm ) +"</td>";
		html += "<td>"+ gfn_numberFormat( data.realRsSiteSite[i].bktQty ) +"</td>";
		html += "<td>"+ fn_getPercentFormat( data.realRsSiteSite[i].bktWgt.toFixed(1) ) +"</td>";
		html += "<td>"+ gfn_numberFormat( data.realRsSiteSite[i].seqCnt ) +"</td>";
		html += "<td>"+ gfn_numberFormat( data.realRsSiteSite[i].seatCnt ) +"</td>";
		html += "</tr>";
	}
	$("#resultTable").append(html);
}

function fn_goRealSmry(obj){
	var url = "/result/realSmry.do";
	url += "?rsSiteType=site";
	url += "&rsSiteNm="+gfn_removeCGVTxt(obj.thatNm);
	url += "&rsSiteCd="+obj.thatCd;
	location.href = url;
}

//null 일때 %처리
function fn_getPercentFormat(perStr){
	if(perStr == "-"){
		return perStr;
	}else{
		return perStr+"%";
	}
}

//정렬 아이콘 추가
function fn_getSortIcon(el,orderType){
	el.removeClass("asc desc");
	if(!orderType){
		el.addClass("desc");
	}else if(orderType == "d"){
		el.addClass("desc");
	}else if(orderType == "a"){
		el.addClass("asc");
	}
}
