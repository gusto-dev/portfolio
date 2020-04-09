var lastTotDtm , rsSiteNm , rsSiteCd , rsSiteType;
var chart01 , chart02
var movFrCnt, movToCnt;
var test = 0;

//native return
function fn_appCallback(name, result) {
	console.log("fn_appCallback", name + " : " + result);
	if (name == "getPushIntent") {
		if (result && result != "") {
			console.log("getPushIntent", result);
			gfn_locationHref(result);
		}
	}
}

function fn_init(){
	
	if(!rsSiteCd) rsSiteCd = "";
	if(!rsSiteType) rsSiteType = "all";
	
	$("#srchType").attr("data-val",rsSiteType);
	if(rsSiteType == "all") $("#srchType").text("전체");
	else if(rsSiteType == "rs") $("#srchType").text("RS");
	else if(rsSiteType == "site") $("#srchType").text("SITE");
	
	/* 페이지 하단 탭 (영화 , 회차 , 포맷, 상영관) 클릭 이벤트 */
	$(".tab02").on("click",function(evnt){
		gfn_tabSwith(evnt.target,function(tabInfo){
			if(tabInfo == "#fxcont1"){ //영화
				fn_getRealSmryCurstsMov();
			}else if(tabInfo == "#fxcont2"){ //회차
				fn_getRealSmryCurstsSeq();
			}else if(tabInfo == "#fxcont3"){ //포맷
				fn_getRealSmryCurstsFormat();
			}else if(tabInfo == "#fxcont4"){ //상영관
				fn_getRealSmryCurstsScn();
			}
		});
	});
		
	/*시간 / 회차별 차트변경*/
	$(".sub-tab01").on("click",function(e){
		$(e.target).siblings().removeClass("active");
		$(e.target).addClass("active");
		var chartType = $(e.target).attr("data-type");
		if(chartType == "tm"){
			fn_getRealSmryWtctmTm();
		}else if(chartType =="seq"){
			fn_getRealSmryWtctmSeq();
		}
	});
	
	
	/* 검색 셀렉트박스 선택 이벤트 */
	$("#srchType").on("select",function(){
		var srchType = $(this).attr("data-val");
		if(srchType == "rs"){
			gfn_searchRs("[name='rsSiteName']");
		}else if(srchType == "site"){
			gfn_searchSite("[name='rsSiteName']");
		}else{
			rsSiteType = "all";
			rsSiteNm = "";
			rsSiteCd = "";
			fn_initSearch();
		}
	});
	
	/* RS/SITE 검색 후 */
	$("[name='rsSiteName']").on("change",function(e){
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm   = $(e.target).text();
		rsSiteCd   = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	/*더보기*/
	$("#moreBtn1").on("click",function(){
		movFrCnt = movFrCnt + 10;
		movToCnt = movToCnt + 10;
		fn_getRealSmryCurstsMov();
	});
	
	fn_initSearch(); //조회,재조회
	gfn_callApp("getPushIntent");
}

//조회,재조회
function fn_initSearch(){
//	console.log("rsSiteNm_final",rsSiteNm);
//	console.log("rsSiteCd_final",rsSiteCd);
//	console.log("rsSiteType_final",rsSiteType);
	
	fn_contentEmpty(); //테이블 및 더보기 변수 초기화
	gfn_setRsSiteName(rsSiteType,rsSiteNm);
	
	fn_getLastTotDtm(); //최근 집계 일시 조회 = async false;
	fn_getRealSmryWtctm(); //관람객 현황 조회      //dim non off
	fn_getRealSmryChnlWtctmWgt(); //채널별 조회  //dim non off
	fn_getRealSmryFnbCursts(); //F&B 현황          //dim non off
	
	fn_getRealSmryWtctmTm(); //시간별 추이 조회
	fn_getRealWtctmPlan();//관람객 계획/계획비
	
	$(".tab02").removeAttr("data-flag","");
	$(".tab02[data-area='#fxcont1']").trigger("click");
}

//테이블 및 변수 초기화
function fn_contentEmpty(){
	movFrCnt = 1;
	movToCnt = 10;
	
	$("#moreBtn1").show();

	$("#realSmryCurstsMovContent tbody").empty();
	$("#realSmryCurstsSeqContent tbody").empty();
	$("#realSmryCurstsFormatContent tbody").empty();
	$("#realSmryCurstsScnContent tbody").empty();
}

/******************************[ TRANSACTION S ]**********************************/

//최근 집계 일시 조회
function fn_getLastTotDtm(){
	transaction({
		url : '/result/getLastTotDtm.do'
		,asyncFlag : false
		,complete : function(){}
	},function(result, e){
		
		if(!e){
			console.log("최근 집계 일시", result.lastTotDtm);
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
			
		}
	});
}

//관람객 현황 조회
function fn_getRealSmryWtctm(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	
	transaction({
		url : '/result/getRealSmryWtctm.do'
		,params : params
		,complete : function(){}
	},function(result){
		console.log("관람객 현황",result);
		
		for(var key in result){
			if(key == "bktPer"){
				if(!result[key]){
					result[key] = "-";
				}else{
					result[key] = Number(result[key]).toFixed(1) + "%";
				}
			}
			if(!result[key]) result[key] = "-";
			
			var temp = {};
			temp[key] = gfn_numberFormat(result[key]);
			gfn_dataBind(temp);
		}
	});
}

//시간별 추이 조회
function fn_getRealSmryWtctmTm(){
	var params = {};
	params.srchType   = rsSiteType;
	params.srchValue  = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	params.bfWeekDate = fn_getBfWeekDate();
	
	transaction({
		url : '/result/getRealSmryWtctmTm.do'
		,params : params
	},function(result,e){
		console.log("tm",result);
		if(!e){
			fn_mkChart01(result.resultList,"tm");
		}else{
			console.error(e);
		}
	});
}
//회차별 추이 조회
function fn_getRealSmryWtctmSeq(){
	var params = {};
	params.srchType   = rsSiteType;
	params.srchValue  = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	params.bfWeekDate = fn_getBfWeekDate();
	
	transaction({
		url : '/result/getRealSmryWtctmSeq.do'
		,params : params
	},function(result,e){
		console.log("seq",result);
		if(!e){
			fn_mkChart01(result.resultList,"seq");
		}else{
			console.error(e);
		}
	});
}

/* 실시간 관람객 계획/계획비 조회 */
function fn_getRealWtctmPlan(){
	var params = {};
	params.srchType   = rsSiteType;
	params.srchValue  = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	params.srchDate = lastTotDtm.substr(0,8);
	
	transaction({
		url : '/result/getRealWtctmPlan.do'
		,params : params
	},function(result,e){
		if(!e){
			var plan = result.wtctmPlan[0].plan;
			var planRt = result.wtctmPlan[0].planRt;
			$("#plan").text(gfn_numberFormat(plan));
			$("#planRt").text(planRt);
		}else{
			console.error(e);
		}
	});
}


/******************************[ TRANSACTION E ]**********************************/

//시간 & 회차별 차트
function fn_mkChart01(data,type){
	if(chart01) chart01.dispose();
	if(data.length == 0){
//		var html = "<p class='no-data01'>일시적인 서버 장애로 인해 <br>조회가 불가합니다. <br>잠시 후 다시 시도해 주십시오.</p>";
		$("#chart01").empty().append(ERR_HTML_TYPE01);
		$(".lgnd-area02").hide();
		return;
	}
	
	$(".lgnd-area02").show();
	var categoryName,cursor;
	if(type =="tm") categoryName = "scnTm";
	else if(type =="seq") categoryName = "scnSeq";
	else return;
	
	var nowTime = new Date().getHours();
	if(nowTime < 10) nowTime = "0"+nowTime;
	
	chart01 = gfn_mkXYChart(data,{
		chartDivId : "chart01"
		,categoryName : categoryName
		,isWide     : true
		,inversed   : false
		,cursor     : true
		,cursorLine : true
		,cursorFocus : nowTime+""
		,alwaysTooltip : true
		,series : [
			 {type : "line" , name : "전주"   , valueKey : "bktQtyLastWeek" , color: COLOR_ARR[4] ,dash : 3.3}
			,{type : "line" , name : "오늘"   , valueKey : "bktQtyToday"    , color: COLOR_ARR[0] ,isBullet : true }
		]
	});
	
//	console.log("chart01",chart01.series.template);
//	chart01.series.template.zIndex = 300;
}

//실시간 F&B 조회
function fn_getRealSmryFnbCursts(){
	var params = {};
	params.srchType   = rsSiteType;
	params.srchValue  = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	
	transaction({
		url : '/result/getRealSmryFnbCursts.do'
		,params : params
		,complete : function(){}
	},function(result,e){
		if(!e){
			console.log("F&B",result);
			var data = result.realSmryFnbCursts;
			fn_flNullData(data);
			
			if(data[0].srPer != "-") data[0].srPer = data[0].srPer.toFixed(1)+"%";
			if(data[0].salePrc != "-") data[0].salePrc = Math.round(Number(data[0].salePrc)/100)/10;
			for(var key in result.realSmryFnbCursts[0]){
				var temp = {};
				temp[key] = gfn_numberFormat(result.realSmryFnbCursts[0][key]);
				gfn_dataBind(temp);
			}
//			if(data[0].salePrc != "-") $("#salePrc").append("<span class='unit'>천원</span>");
			if(data[0].salePrc != "-") $("#salePrc").append("<span class='unit'> 백만원</span>");
		}else{
			console.error(e);
		}
		
	});
}

//채널별 관람객 비중 조회
function fn_getRealSmryChnlWtctmWgt(){
	var params = {};
	params.srchType   = rsSiteType;
	params.srchValue  = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	
	transaction({
		url : '/result/getRealSmryChnlWtctmWgt.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("fn_getRealSmryChnlWtctmWgt",result.chnlWtctmWgt);
			
			fn_mkChart02(result.chnlWtctmWgt);
//			for(var key in result.chnlWtctmWgt[0]){
//				var temp = {};
//				temp[key] = gfn_numberFormat(result.chnlWtctmWgt[0][key]) ? gfn_numberFormat(result.chnlWtctmWgt[0][key]) : "-";
//				gfn_dataBind(temp);
//			}
		}else{
			console.error(e);
		}
		
	});
}

//채널별 차트
function fn_mkChart02(data){
	if(chart02) chart02.dispose();
	
	if(data.length == 0){
//		var html = "<p class='no-data02'>일시적인 서버 장애로 인해 조회가 불가합니다. <br>잠시 후 다시 시도해 주십시오.</p>";
		$("#chart02").empty().append(ERR_HTML_TYPE02);
		return;
	}

	data[0].cate = "recode";
	chart02 = gfn_mkXYChartForPer(data,{
		chartDivId : "chart02"
		,categoryName : "cate"
		,series : [
			 {valueKey : "pos"    , name : "POS"    , color: COLOR_ARR[4]}
			,{valueKey : "tp"     , name : "티판기"  , color: COLOR_ARR[5]}
			,{valueKey : "mob"    , name : "모바일 APP"  , color: COLOR_ARR[19]}
			,{valueKey : "mobWeb" , name : "모바일 WEB"  , color: COLOR_ARR[20]}
			,{valueKey : "hp"     , name : "홈페이지", color: COLOR_ARR[18]}
			,{valueKey : "cp"     , name : "CP & 통신사"     , color: COLOR_ARR[2]}
//			{valueKey : "pos" , name : "POS"    , color: COLOR_ARR[4]}
//			,{valueKey : "tp"  , name : "티판기"  , color: COLOR_ARR[5]}
//			,{valueKey : "mob" , name : "모바일"  , color: COLOR_ARR[0]}
//			,{valueKey : "hp"  , name : "홈페이지", color: COLOR_ARR[1]}
//			,{valueKey : "cp"  , name : "CP"     , color: COLOR_ARR[18]}
//			,{valueKey : "mobWeb"  , name : "통신사"  , color: COLOR_ARR[2]}
		]
	});
}

function fn_getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

//실시간 관람객 현황 - 영화별 조회
function fn_getRealSmryCurstsMov(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	params.frCnt = movFrCnt;
	params.toCnt = movToCnt;
	
	transaction({
		url : '/result/getRealSmryCurstsMov.do'
		,params : params
	},function(result){
		console.log("영화별 관람객 현황",result);
		fn_mkRow1(result); //영화별 그리드 출력
	});
}

//실시간 관람객 현황 - 회차별 조회
function fn_getRealSmryCurstsSeq(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;

	transaction({
		url : '/result/getRealSmryCurstsSeq.do'
		,params : params
	},function(result){
		console.log("회차별 관람객 현황",result);
		fn_mkRow2(result); //영화별 그리드 출력
	});
}

//실시간 관람객 현황 - 포맷별 조회
function fn_getRealSmryCurstsFormat(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;

	transaction({
		url : '/result/getRealSmryCurstsFormat.do'
		,params : params
	},function(result){
		console.log("포맷별 관람객 현황",result);
		fn_mkRow3(result); //영화별 그리드 출력
	});
}

//실시간 관람객 현황 - 상영관별 조회
function fn_getRealSmryCurstsScn(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;

	transaction({
		url : '/result/getRealSmryCurstsScn.do'
		,params : params
	},function(result){
		console.log("상영관별 관람객 현황",result);
		fn_mkRow4(result); //영화별 그리드 출력
	});
}

//영화별 그리드 출력
function fn_mkRow1(result){
	if(movFrCnt == 1) $("#realSmryCurstsMovContent tbody").empty();

	var tblLength = $("#realSmryCurstsMovContent tbody tr").length;
	if(result.realSmryCurstsMov.length == 0){
		if(tblLength == 0){
			$("#realSmryCurstsMovContent tbody").empty();
			gfn_displayEmptyText("realSmryCurstsMovContent"); //데이터가 없습니다 처리
			$("#moreBtn1").hide();
			return false;
		}else{
			$("#moreBtn1").hide();
		}
	}else if(result.realSmryCurstsMov.length < 10){
		$("#moreBtn1").hide();
	}
	
	var content = "";
	var totData = result.realSmryCurstsMovTot;
	if(tblLength == 0){
		for(var i in totData){
			var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
			var seatCnt 	= totData[i].seatCnt 	? gfn_numberFormat(totData[i].seatCnt) : "-";
			var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
			var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
			var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
			
			content += "<tr class='total'>";
			content += "<td><strong>총계</strong></td>";
			content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
			content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
			content += "<td>"+bktPer+"</td>"; //객석률
			content += "</tr>";
		}
	}
	
	var data = result.realSmryCurstsMov;
	for(var i in data){
		var movNm 		= data[i].movNm 	? data[i].rn + ". " + data[i].movNm : "-";
		var movKndNm 	= data[i].movKndNm 	? data[i].movKndNm : "-";
		var bktQty 		= data[i].bktQty 	? gfn_numberFormat(data[i].bktQty) : "-";
		var seatCnt 	= data[i].seatCnt 	? gfn_numberFormat(data[i].seatCnt) : "-";
		var bktWgt 		= data[i].bktWgt 	? data[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= data[i].seatWgt 	? data[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= data[i].bktPer 	? data[i].bktPer.toFixed(1)+"%" : "-";
		var movPrntCd 	= data[i].movPrntCd;
		
		if(data[i].rnKnd == "0"){
			content += "<tr>";
			content += "<td class='movie-name' title>"+movNm+"</td>"; //영화명
			content += "<td onclick='fn_getDetail("+movPrntCd+")'>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
			content += "<td onclick='fn_getDetail("+movPrntCd+")'>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
			content += "<td onclick='fn_getDetail("+movPrntCd+")'>"+bktPer+"</td>"; //객석률
			content += "</tr>";
		}else if(data[i].rnKnd == "1"){
			content += "<tr class='f-color03'>";
			content += "<td class='indent' title>"+movKndNm+"</td>"; //포맷명
			content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
			content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
			content += "<td>"+bktPer+"</td>"; //객석률
			content += "</tr>";
		}
	}
	
	$("#realSmryCurstsMovContent tbody").append(content);
}

//회차별 그리드 출력
function fn_mkRow2(result){
	$("#realSmryCurstsSeqContent tbody").empty();
	
	if(result.realSmryCurstsSeq.length == 0){
		gfn_displayEmptyText("realSmryCurstsSeqContent"); //데이터가 없습니다 처리
		return false;
	}

	var content = "";
	var totData = result.realSmryCurstsSeqTot;
	for(var i in totData){
		var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
		var seatCnt 	= totData[i].seatCnt 	? gfn_numberFormat(totData[i].seatCnt) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
		
		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	var data = result.realSmryCurstsSeq;
	for(var i in data){
		var scnSeq 		= data[i].scnSeq 	? data[i].scnSeq : "0";
		var bktQty 		= data[i].bktQty 	? gfn_numberFormat(data[i].bktQty) : "-";
		var seatCnt 	= data[i].seatCnt 	? gfn_numberFormat(data[i].seatCnt) : "-";
		var bktWgt 		= data[i].bktWgt 	? data[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= data[i].seatWgt 	? data[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= data[i].bktPer 	? data[i].bktPer.toFixed(1)+"%" : "-";
		
		content += "<tr>";
		content += "<td title>"+scnSeq+"회차</td>"; //회차
		content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	$("#realSmryCurstsSeqContent tbody").append(content);
}

//포맷별 그리드 출력
function fn_mkRow3(result){
	$("#realSmryCurstsFormatContent tbody").empty();

	if(result.realSmryCurstsFormat.length == 0){
		gfn_displayEmptyText("realSmryCurstsFormatContent"); //데이터가 없습니다 처리
		return false;
	}
	
	var content = "";
	var totData = result.realSmryCurstsFormatTot;
	for(var i in totData){
		var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
		
		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td>"+bktWgt+"</td>"; //점유율
		content += "<td>"+bktQty+"</td>"; //관람객
		content += "</tr>";
	}
	
	var data = result.realSmryCurstsFormat;
	for(var i in data){
		var movKndNm 	= data[i].movKndNm 	? data[i].movKndNm : "-";
		var bktQty 		= data[i].bktQty 	? gfn_numberFormat(data[i].bktQty) : "-";
		var bktWgt 		= data[i].bktWgt 	? data[i].bktWgt.toFixed(1)+"%" : "-";
		
		content += "<tr>";
		content += "<td title>"+movKndNm+"</td>"; //포맷
		content += "<td>"+bktWgt+"</td>"; //점유율
		content += "<td>"+bktQty+"</span></td>"; //관람객
		content += "</tr>";
	}
	
	$("#realSmryCurstsFormatContent tbody").append(content);
}

//상영관별 그리드 출력
function fn_mkRow4(result){
	$("#realSmryCurstsScnContent tbody").empty();

	if(result.realSmryCurstsScn.length == 0){
		gfn_displayEmptyText("realSmryCurstsScnContent"); //데이터가 없습니다 처리
		return false;
	}
	
	var content = "";
	var totData = result.realSmryCurstsScnTot;
	for(var i in totData){
		var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
		var seatCnt 	= totData[i].seatCnt 	? gfn_numberFormat(totData[i].seatCnt) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
		
		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	var data = result.realSmryCurstsScn;
	for(var i in data){
		var commCdNm 	= data[i].commCdNm 	? data[i].commCdNm : "-";
		var bktQty 		= data[i].bktQty 	? gfn_numberFormat(data[i].bktQty) : "-";
		var seatCnt 	= data[i].seatCnt 	? gfn_numberFormat(data[i].seatCnt) : "-";
		var bktWgt 		= data[i].bktWgt 	? data[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= data[i].seatWgt 	? data[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= data[i].bktPer 	? data[i].bktPer.toFixed(1)+"%" : "-";
		
		content += "<tr>";
		content += "<td title>"+commCdNm+"</td>"; //상영관
		content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	$("#realSmryCurstsScnContent tbody").append(content);
}

//전주 일자 조회
function fn_getBfWeekDate(){
	var today = new Date();
	var y,m,d;
	y = today.getFullYear();
	m = today.getMonth();
	d = today.getDate() -7;
	return new Date(y,m,d).format("yyyyMMdd");
}