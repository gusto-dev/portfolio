var chart01;
var rsSiteNm, rsSiteCd, srchDate, rsSiteType;
function fn_init(){
	
	if(srchDate){
		var flagDate = fn_getFlagDate("m",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}
	else $("#srchDate").val(fn_getFlagDate("m"));
	
	//AnyPicker 설정
	$("#srchDate").dateAnyPicker({
		  maxDate : [fn_getFlagDate("m").split("-")[0],fn_getFlagDate("m").split("-")[1]-1]
		 ,format  : "yyyy-MM"
		, onChange: function(date){
			fn_isOverDate (date)
			$("#srchDate").trigger("change");
		}
	});
	
	$("#srchType").attr("data-val",rsSiteType);
	if(rsSiteType == "all") $("#srchType").text("전체");
	else if(rsSiteType == "rs") $("#srchType").text("RS");
	else if(rsSiteType == "site") $("#srchType").text("SITE");
	
	//일자변경 이벤트
	$("#srchDate").on("change",function(e){
		srchDate = $(e.target).val().replace(/-/gi,"");
		var flag = $("[name='resultType']:checked").val();
		if(flag == "wtctm" ){//관람객
			fn_getMonthlyDyWtctm();
		}else if(flag == "ms"){//MS
			fn_getMonthlyDyMS();
		}else if(flag == "mnInd"){//실적요약
			fn_getMonthlyDyMnInd();
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
	
	$("[name='rsSiteName']").on("change",function(e){
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm = $(e.target).text();
		rsSiteCd = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	//관람객 , MS , 주요지표 라디오박스 이벤트
	$("[name='resultType']").on("change",function(e){
		var flag = $(e.target).val();
		if(flag == "wtctm" ){//관람객
			fn_getMonthlyDyWtctm();
		}else if(flag == "ms"){//MS
			fn_getMonthlyDyMS();
		}else if(flag == "mnInd"){//실적요약
			fn_getMonthlyDyMnInd();
		}
		$(".lgnd-area").hide();
		$("#"+flag).show();
	});
	
	fn_initSearch();
} // INIT END ======================================

//일자별 관람객 조회
function fn_getMonthlyDyWtctm(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	
	transaction({
		url : '/result/getMonthlyDyWtctm.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("dyWtctm",result);
			console.log("dyWtctmTot",result.dyWtctmTot);
			fn_mkChart01(JSON.parse(JSON.stringify(result.dyWtctm)),1);
			fn_flNullData(result.dyWtctm);
			fn_mkTable(result.dyWtctm,1,result.dyWtctmTot);
			
			fn_getMonthlyDyWtctmGr(); //관람객 진척률 조회
		}else{
			console.log(e);
		}
	});
}

//월별 MS 조회
function fn_getMonthlyDyMS(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	
	transaction({
		url : '/result/getMonthlyDyMS.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("dyMS",result);
			fn_mkChart01(JSON.parse(JSON.stringify(result.dyMs)),2);
			fn_flNullData(result.dyMs);
			fn_mkTable(result.dyMs,2,result.dyMsTot);
		}else{
			console.log(e);
		}
	});
}

//주요지표 조회
function fn_getMonthlyDyMnInd(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	
	transaction({
		url : '/result/getMonthlyDyMnInd.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("mnInd",result);
			fn_mkChart01(JSON.parse(JSON.stringify(result.dyMnInd)),3);
			fn_flNullData(result.dyMs);
			fn_mkTable(result.dyMnInd,3,result.dyMnIndTot);
		}else{
			console.log(e);
		}
	});
}

//관람객 진척률 조회
function fn_getMonthlyDyWtctmGr(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	
	transaction({
		url : '/result/getMonthlyDyWtctmGr.do'
			,params : params
	},function(result,e){
		if(!e){
			console.log("getMonthlyDyWtctmGr",result);
			fn_flNullData(result.resultList);
			fn_setGr(result.resultList); //진척률 세팅
		}else{
			console.log(e);
		}
	});
}

/*****************************************************************************************************************/

//초기화 조회
function fn_initSearch(){
	var dataType = $("[name='resultType']:checked").val();
	if(dataType == "wtctm" ){//관람객
		fn_getMonthlyDyWtctm();
	}else if(dataType == "ms"){//MS
		fn_getMonthlyDyMS();
	}else if(dataType == "mnInd"){//실적요약
		fn_getMonthlyDyMnInd();
	}
	gfn_setRsSiteName(rsSiteType,rsSiteNm);
}

//1번차트 생성
function fn_mkChart01(data,flag){
	if(chart01) chart01.dispose();
	if(data.length == 0){
//		var html = "<p class='no-data01'>일시적인 서버 장애로 인해 <br>조회가 불가합니다. <br>잠시 후 다시 시도해 주십시오.</p>";
		$("#chart01").append(ERR_HTML_TYPE01);
		return;
	}
	var series,inversed;
	if(flag == 1){ // 관람객
		series = [
			 {type : "col"  , name : "계획"    , valueKey : "plnCgvSpctCnt" , color: COLOR_ARR[5] ,clusteredYn: true , padding : 10}
			,{type : "col"  , name : "실적"    , valueKey : "cgvSpctCnt" , color: COLOR_ARR[0] ,clusteredYn:true}
			,{type : "line" , name : "MS 계획" , valueKey : "msPln" , color: COLOR_ARR[4] ,dash : 3.2 ,valueAxisType:2}
			,{type : "line" , name : "MS 실적" , valueKey : "ms" , color: COLOR_ARR[3] , valueAxisType:2}
		];
//		inversed = false;
	}else if(flag == 2){ // MS
		series = [
			{type : "col"  , name : "MS 계획"   , valueKey : "msPln"   ,color: COLOR_ARR[5] ,clusteredYn: true , padding : 10 ,tooltipText:"{valueY.value}%"}
			,{type : "col"  , name : "MS"       , valueKey : "ms"      , color: COLOR_ARR[0] ,clusteredYn:true ,tooltipText:"{valueY.value}%"}
			,{type : "line" , name : "BO MS"     , valueKey : "boMs"    , color: COLOR_ARR[3] , tooltipText:"{valueY.value}%"}
			,{type : "line" , name : "BO MS 계획" , valueKey : "boMsPln" , color: COLOR_ARR[4] ,dash : 3.2 , tooltipText:"{valueY.value}%"}
		];
//		inversed = false;
	}else if(flag == 3){ // 주요지표
		series = [
			{type : "col"  , name : "SPP"     , valueKey : "spp" , color: COLOR_ARR[3] ,clusteredYn:true, padding : 10}
			,{type : "col"  , name : "ATP" , valueKey : "atp" , color: COLOR_ARR[0] ,clusteredYn: true}
			,{type : "line" , name : "ATP_SPP"  , valueKey : "atpSpp" , dash : 3.2 , color: COLOR_ARR[4] }
		]
//		inversed = false;
	}
	
	var msPlnMaxData = 0;
	var msMaxData = 0;
	for(var i in data){
		if(msPlnMaxData < data[i].msPln ) msPlnMaxData = data[i].msPln;
		if(msMaxData < data[i].ms ) msMaxData = data[i].ms;
		
		data[i].stdYm = data[i].stdYm.substr(0,2) + "-" + data[i].stdYm.substr(2,2);
	}
	
	chart01 = gfn_mkXYChart(data,{
		chartDivId : "chart01"
		,categoryName : "stdYm"
		,inversed   : false
		,isWide     : true
		,cursor     : true
		,cursorFocus : data[0].stdYm
		,series : series
	});
	
	//관람객일 경우 선그래프 최대값 설정
	if(flag == 1){ // 관람객
		chart01.events.on("ready",function(){
			if(msMaxData > msPlnMaxData){
				chart01.yAxes.values[1].max = msMaxData * 1.3; //ms계획
			}else if(msPlnMaxData > msMaxData){
				chart01.yAxes.values[2].max = msPlnMaxData * 1.3; //ms실적
			}
		});
	}
}

//일자형식
function fn_convertDateFmt(dateStr,type){
	if(!dateStr) return "";
	var replaced = dateStr.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3');
	if(type =="chart"){
		return replaced;
	}else{
		return fn_addDayName(dateStr);
	}
}
//요일이름
function fn_addDayName(dateStr){
	var rtnDateStr =  dateStr.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3');
	var date = new Date(gfn_convertDateFmt(dateStr));
	var day = date.getDay();
	switch(day){
		case 0 : rtnDateStr+="(일)"; break;
		case 1 : rtnDateStr+="(월)"; break;
		case 2 : rtnDateStr+="(화)"; break;
		case 3 : rtnDateStr+="(수)"; break;
		case 4 : rtnDateStr+="(목)"; break;
		case 5 : rtnDateStr+="(금)"; break;
		case 6 : rtnDateStr+="(토)"; break;
	}
	return rtnDateStr;
}

//테이블 그리기
function fn_mkTable(resData,flag,sumData){
	var html;
	
	var headerHtml,bodyHtml,tblId;
	
//	if(flag != 1){
//		$(".freezer").empty();
//		var tableHtml = '';
//		tableHtml += '<span class="icon-x-scroll">x-scroll</span>';
//		tableHtml += '<table class="txt-c table-freeze-multi" data-scroll-height="auto" data-cols-number="1" id="tbl-'+flag+'">';
//		tableHtml += '</table>';
//		$(".freezer").eq(flag-2).append(tableHtml);
//		headerHtml = fn_mkFreezeArea(flag);
//	}
	
	bodyHtml = fn_mkRow(resData,flag);
	
	console.log(resData.length);
	if(resData.length == 0){
		if(flag == 1){ //관람객
			bodyHtml = '<tr><td></td><td colspan=4> 데이터가 없습니다. </td><tr>';
		}else if(flag == 2){ //MS
			bodyHtml = '<tr><td></td><td colspan=4> 데이터가 없습니다. </td><tr>';
		}else if(flag == 3){ //주요지표
			bodyHtml = '<tr><td></td><td colspan=4> 데이터가 없습니다. </td><tr>';
		}
	}
	
	headerHtml? html = headerHtml + bodyHtml : html = bodyHtml;
	
	$(".dv-result").hide();
	$("#tbl-"+flag).empty().append(html);
	$("#tbl-"+flag).parents(".dv-result").show();
	
	//합계,평균 ROW 생성
	if(resData.length != 0){
		fn_flNullData(sumData);
		var sumHtml = fn_mkSumRow(sumData,flag);
		$("#tbl-"+flag).prepend(sumHtml);
	}
}

//좌측 틀고정영역 생성
function fn_mkFreezeArea(flag){
	var txtArr;
	if(flag == "2"){
		txtArr = ["관객 MS","BO MS"];
	}else if(flag == "3"){
		txtArr = ["ATP","SPP"];
	}
	
	var html = "";
	html += '	<colgroup>                        ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '</colgroup>                          ';
	html += '<thead>                              ';
	html += '	<tr>                              ';
	html += '		<th rowspan="2">일자</th>     ';
	html += '		<th colspan="3">'+txtArr[0]+'</th>  ';
	html += '		<th colspan="3">'+txtArr[1]+'</th>    ';
	html += '	</tr>                             ';
	html += '	<tr>                              ';
	html += '		<th>실적</th>                 ';
	html += '		<th>계획</th>                 ';
	html += '		<th>계획차</th>               ';
	html += '		<th>실적</th>                 ';
	html += '		<th>계획</th>                 ';
	html += '		<th>계획차</th>               ';
	html += '	</tr>                             ';
	html += '</thead>                             ';
	return html;
}

//DATA row 생성
function fn_mkRow(resData,flag){
	fn_flNullData(resData);
	var html = "";
	var srchMonth = $("#srchDate").val().replace(/-/gi,"").substring(2,4);
	
	for(var i in resData){
		resData[i].stdYmAttr = resData[i].stdYm;
		resData[i].stdYm = resData[i].stdYm.substr(0,2) + "-" + resData[i].stdYm.substr(2,2);
		if(flag == 1){ //관람객
			if(resData[i].stdYmAttr.substring(0,2) == srchMonth){
				html += "<tr onclick='fn_goMonthlySmry("+JSON.stringify(resData[i])+")'>";
			}else{
				html += "<tr class='point-bg02' onclick='fn_goMonthlySmry("+JSON.stringify(resData[i])+")'>";
			}
			html += "<td>"+resData[i].stdYm+"</td>";
			html += "<td class='r-line'>"+gfn_numberFormat( resData[i].boxSpctCnt )+"</td>"; /*전국관람객*/
			html += "<td>"+gfn_numberFormat( resData[i].cgvSpctCnt ); /*CGV관람객*/
			html += "<span class='s-font f-color04'>"+ fn_getPercentFixed2(resData[i].ms)+"</span>"; /*MS*/
			html += "</td>";
			html += "<td>";
			if(resData[i].plnCgvSpctCntWgt == "-"){ /*계획비차*/
				html += "<span>-</span>";
			}else if(resData[i].plnCgvSpctCntWgt < 100){
				html += "<span class='f-color02'>"+ fn_getPercentFormat( Math.abs(resData[i].plnCgvSpctCntWgt) ) +"</span></br>";
			}else if(resData[i].plnCgvSpctCntWgt > 100){
				html += "<span class='f-color01'>"+ fn_getPercentFormat( Math.abs(resData[i].plnCgvSpctCntWgt) ) +"</span></br>";
			}
			html += "<span class='s-font f-color04'>"+gfn_numberFormat( resData[i].plnCgvSpctCnt )+"</span>"; /*계획비*/
			html += "</td>";
//			html += "<td>"+fn_getPercentFormat( resData[i].cgvScnSeatCntWgt )+"</td>"; /*객석률*/
			html += "<td>";
			if(resData[i].ago1ySpctCntWgt == "-"){ /*전년비차*/
				html += "<span>-</span>";
			}else if(resData[i].ago1ySpctCntWgt < 0){
				html += "<span class='fall'>"+ fn_getPercentFormat( Math.abs(resData[i].ago1ySpctCntWgt) ) +"</span></br>";
			}else if(resData[i].ago1ySpctCntWgt > 0){
				html += "<span class='gain'>"+ fn_getPercentFormat( Math.abs(resData[i].ago1ySpctCntWgt) ) +"</span></br>";
			}
			html += "<span class='s-font f-color04'>"+gfn_numberFormat( resData[i].ago1yCgvSpctCnt )+"</span>"; /*전년비*/
			html += "</td>";
			html += "</tr>";
		}else if(flag == 2){ //MS
			if(resData[i].stdYmAttr.substring(0,2) == srchMonth){
				html += "<tr onclick='fn_goMonthlySmry("+JSON.stringify(resData[i])+")'>";
			}else{
				html += "<tr class='point-bg02' onclick='fn_goMonthlySmry("+JSON.stringify(resData[i])+")'>";
			}
			html += "<td>"+resData[i].stdYm+"</td>";
			html += "<td>"+fn_getPercentFixed2( resData[i].ms )+"</td>"; /*MS실적*/
			html += "<td class='r-line'>"+fn_getPercentFixed2( resData[i].msPln );
			if(resData[i].msDfPln == "-"){ /*MS계획차*/
				html += "<br> <span>-</span>";
			}else if(resData[i].msDfPln < 0){
				html += "<br> <span class='fall'>"+fn_getPercentPointFixed2( Math.abs(resData[i].msDfPln) )+"</span>";
			}else if(resData[i].msDfPln > 0){
				html += "<br> <span class='gain'>"+fn_getPercentPointFixed2( Math.abs(resData[i].msDfPln) )+"</span>";
			}
			html += "</td>"; /*MS계획*/
			html += "<td>"+fn_getPercentFixed2( resData[i].boMs )+"</td>"; /*BO실적*/
			html += "</tr>";
		}else if(flag == 3){ //주요지표
			if(resData[i].stdYmAttr.substring(0,2) == srchMonth){
				html += "<tr onclick='fn_goMonthlySmry("+JSON.stringify(resData[i])+")'>";
			}else{
				html += "<tr class='point-bg02' onclick='fn_goMonthlySmry("+JSON.stringify(resData[i])+")'>";
			}
			html += "<td>"+resData[i].stdYm+"</td>";
			if(resData[i].atpDfPln == "-"){ /*ATP계획차*/
				html += "<td>-</td>";
			}else if(resData[i].atpDfPln < 0){
				html += "<td><span class='fall'>"+ gfn_numberFormat( Math.abs(resData[i].atpDfPln) ) +"</span></td>";
			}else if(resData[i].atpDfPln > 0){
				html += "<td><span class='gain'>"+ gfn_numberFormat( Math.abs(resData[i].atpDfPln) ) +"</span></td>";
			}
			
			var a = resData[i].atp == "-" ? 0 : resData[i].atp;
			var s = resData[i].spp == "-" ? 0 : resData[i].spp;
			html += "<td>"+gfn_numberFormat( resData[i].atp )+"</td>"; /*ATP실적*/
			html += "<td>"+gfn_numberFormat( resData[i].spp )+"</td>"; /*SPP실적*/
			html += "<td>"+gfn_numberFormat( resData[i].atpSpp ) +"</td>"; /*ATP+SPP실적*/
//			html += "<td>"+gfn_numberFormat( resData[i].atpPln )+"</td>"; /*ATP계획*/
//			if(resData[i].atpDfPln == "-"){ /*ATP계획차*/
//				html += "<td>-</td>";
//			}else if(resData[i].atpDfPln < 0){
//				html += "<td><span class='fall'>"+ gfn_numberFormat( Math.abs(resData[i].atpDfPln) ) +"</span></td>";
//			}else if(resData[i].atpDfPln > 0){
//				html += "<td><span class='gain'>"+ gfn_numberFormat( Math.abs(resData[i].atpDfPln) ) +"</span></td>";
//			}
//			html += "<td>"+gfn_numberFormat( resData[i].sppPln )+"</td>"; /*SPP계획*/
//			if(resData[i].sppDfPln == "-"){ /*SPP계획차*/
//				html += "<td>-</td>";
//			}else if(resData[i].sppDfPln < 0){
//				html += "<td><span class='fall'>"+ gfn_numberFormat( Math.abs(resData[i].sppDfPln) ) +"</span></td>";
//			}else if(resData[i].sppDfPln > 0){
//				html += "<td><span class='gain'>"+ gfn_numberFormat( Math.abs(resData[i].sppDfPln) ) +"</span></td>";
//			}
			html += "</tr>";
		}
	}
	return html;
}

//합계,평균 ROW 생성
function fn_mkSumRow(data,flag){
	fn_flNullData(data);
	var html = "";
	var dataCode = "";
	console.log(data);
	if(flag == 1){
		for(var i in data){
			html += "<tr class='total'>";
			html += "<td>금년<br/>누계</td>";
			html += "<td class='r-line'>"+gfn_numberFormat( data[i].boxSpctCnt )+"</td>"; /*전국관람객*/
			html += "<td>"+gfn_numberFormat( data[i].cgvSpctCnt ); /*CGV관람객*/
			html += "<span class='s-font f-color04'>"+ fn_getPercentFixed2( data[i].ms ) +"</span>" /*MS*/
			html += "</td>";
			html += "<td>";
			if(data[i].plnCgvSpctCntWgt == "-"){ /*계획비*/
				html += "<span>-</span>";
			}else if(data[i].plnCgvSpctCntWgt < 100){
				html += "<span class='f-color02'>"+ fn_getPercentFormat( Math.abs(data[i].plnCgvSpctCntWgt) ) +"</span></br>";
			}else if(data[i].plnCgvSpctCntWgt > 100){
				html += "<span class='f-color01'>"+ fn_getPercentFormat( Math.abs(data[i].plnCgvSpctCntWgt) ) +"</span></br>";
			}
			html += "<span class='s-font f-color04'>"+gfn_numberFormat( data[i].plnCgvSpctCnt )+"</span>"; /*계획비*/
			html += "</td>";
//			html += "<td>"+fn_getPercentFormat( data[i].cgvScnSeatCntWgt )+"</td>"; /*객석률*/
			html += "<td>";
			if(data[i].ago1ySpctCntWgt == "-"){ /*전년비*/
				html += "<span>-</span>";
			}else if(data[i].ago1ySpctCntWgt < 0){
				html += "<span class='fall'>"+ fn_getPercentFormat( Math.abs(data[i].ago1ySpctCntWgt) ) +"</span></br>";
			}else if(data[i].ago1ySpctCntWgt > 0){
				html += "<span class='gain'>"+ fn_getPercentFormat( Math.abs(data[i].ago1ySpctCntWgt) ) +"</span></br>";
			}
			html += "<span class='s-font f-color04'>"+gfn_numberFormat( data[i].ago1yCgvSpctCnt )+"</span>"; /*전년비*/
			html += "</td>";
			html += "</tr>";
		}
	}else if(flag == 2){
		for(var i in data){
			var className = "";
			var msDfPln = "-";
			
			html += "<tr class='total'>";
			html += "<td class='pdl0'>금년누계</td>";
			html += "<td>"+fn_getPercentFixed2( data[i].ms )+"</td>"; /*MS실적*/
			html += "<td class='r-line'>"+fn_getPercentFixed2( data[i].msPln );
			if(data[i].msDfPln == "-"){ /*MS계획차*/
				className = "";
				msDfPln = "-";
			}else if(data[i].msDfPln < 0){
				className = "fall";
				msDfPln = fn_getPercentPointFixed2( Math.abs(data[i].msDfPln) );
			}else if(data[i].msDfPln > 0){
				className = "gain";
				msDfPln = fn_getPercentPointFixed2( Math.abs(data[i].msDfPln) );
			}
			html += "</br><span class='"+className+"'>"+msDfPln+"</span>"
			html += "</td>"; /*MS계획*/
			html += "<td>"+fn_getPercentFixed2( data[i].boMs )+"</td>"; /*BO실적*/
			html += "</tr>";
		}
	}else if(flag == 3){
		for(var i in data){
			var a = data[i].atp == "-" ? 0 : data[i].atp;
			var s = data[i].spp == "-" ? 0 : data[i].spp;
			html += "<tr class='total'>";
			html += "<td class='pdl0'>금년누계</td>";
			html += "<td>"+gfn_numberFormat( data[i].atp )      +"</td>"; /*ATP실적*/
			html += "<td>"+gfn_numberFormat( data[i].spp )      +"</td>"; /*SPP실적*/
			html += "<td>"+gfn_numberFormat( data[i].atpSpp ) +"</td>"; /*ATP+SPP실적*/
			
//			html += "<td>"+gfn_numberFormat( data[i].atpPln )   +"</td>"; /*ATP계획*/
//			if(data[i].atpDfPln == "-"){ /*ATP계획차*/
//				html += "<td>-</td>";
//			}else if(data[i].atpDfPln < 0){
//				html += "<td><span class='fall'>"+ gfn_numberFormat( Math.abs(data[i].atpDfPln) ) +"</span></td>";
//			}else if(data[i].atpDfPln > 0){
//				html += "<td><span class='gain'>"+ gfn_numberFormat( Math.abs(data[i].atpDfPln) ) +"</span></td>";
//			}
//			html += "<td>"+gfn_numberFormat( data[i].sppPln )   +"</td>"; /*SPP계획*/
//			if(data[i].sppDfPln == "-"){                                /*SPP계획차*/
//				html += "<td>-</td>";
//			}else if(data[i].sppDfPln < 0){
//				html += "<td><span class='fall'>"+ gfn_numberFormat( Math.abs(data[i].sppDfPln) ) +"</span></td>";
//			}else if(data[i].sppDfPln > 0){
//				html += "<td><span class='gain'>"+ gfn_numberFormat( Math.abs(data[i].sppDfPln) ) +"</span></td>";
//			}
			html += "</tr>";
		}
	}
	return html;
}

//진척률 세팅
function fn_setGr(data){
	$("#yearGr").removeClass("f-color01 f-color02");

	var gr = data[0].gr;
	if(gr >= 100){
		$("#yearGr").addClass("f-color01");
		$("#yearGrText").text("초과");
	}else if(gr < 100){
		$("#yearGr").addClass("f-color02");
		$("#yearGrText").text("잔여");
	}else{
		$("#yearGr").addClass("f-color02");
		$("#yearGrText").text("잔여");
	}
	
	$("#yearPln").text(gfn_numberFormat( data[0].plnYrTotVal + "천명"));
	$("#yearGr").text(gr + "%");
	$("#yearPlnDiff").text(gfn_numberFormat( data[0].gap + "천명"));
}

function fn_flNullData(data,fillStr){
	if(!fillStr) fillStr = "-";
	for(var i in data){
		for(var key in data[i]){
			if(!data[i][key]){
				data[i][key] = fillStr;
			}
		}
	}
}

//Summary 로 이동
function fn_goMonthlySmry(obj){
	var url = "/result/monthlySmry.do";
	url += "?pageId="+pageId;
	url += "&rsSiteType="+rsSiteType;
	url += "&rsSiteNm="+rsSiteNm;
	url += "&rsSiteCd="+rsSiteCd;
	url += "&srchDate=20"+obj.stdYmAttr;
	location.href = url;
}

//null 일때 %처리 소수점 1자리
function fn_getPercentFormat(data){
	var dataConv = data.toString().replace(/,/gi,"");
	if(data != "-"){
		return gfn_numberFormat( Number(dataConv).toFixed(1) )+"%";
	}else{
		return dataConv;
	}
}

//null 일때 %처리 소수점 2자리
function fn_getPercentFixed2(data){
	var dataConv = data.toString().replace(/,/gi,"");
	if(data != "-"){
		return gfn_numberFormat( Number(dataConv).toFixed(2) )+"%";
	}else{
		return dataConv;
	}
}

//소수점 2자리, 퍼센트p 붙이기
function fn_getPercentPointFixed2(data){
	var dataConv = data.toString().replace(/,/gi,"");
	if(data != "-"){
		return gfn_numberFormat( Number(dataConv).toFixed(2) )+"%p";
	}else{
		return dataConv;
	}
}