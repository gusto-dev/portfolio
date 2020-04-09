var chart01

function fn_init(){
	if(srchDate){
		var flagDate = fn_getFlagDate("d",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}else{
		$("#srchDate").val(fn_getFlagDate("d"));
		srchDate = $("#srchDate").val().replace(/-/gi,"");
	}
	
	//데이트피커호출
	gfn_setDatepicker($("#srchDate"));
	
	$("#srchType").attr("data-val",rsSiteType);
	if(rsSiteType == "all") $("#srchType").text("전체");
	else if(rsSiteType == "rs") $("#srchType").text("RS");
	else if(rsSiteType == "site") $("#srchType").text("SITE");
	
	//일자변경 이벤트
	$("#srchDate").on("change",function(e){
		srchDate = $(e.target).val().replace(/-/gi,"");
//		var flag = $("[name='resultType']:checked").val();
//		if(flag == "wtctm" ){//관람객
//			fn_getDailyDyWtctm();
//		}else if(flag == "ms"){//MS
//			fn_getDailyDyMS();
//		}else if(flag == "mnInd"){//실적요약
//			fn_getDailyDyMnInd();
//		}
		fn_initSearch();
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
	
	/* 검색 이벤트 */
	$("[name='rsSiteName']").on("change",function(e){
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm = $(e.target).text();
		rsSiteCd = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	fn_initSearch();
} /*******************[ INIT E ]********************/
/*********************[ TRANSACTION S ]************/

function fn_getDailyFnBPerDay() {
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	console.log("param",params);
	
	transaction({
		url : '/result/getDailyFnBPerDay.do',
		params : params
	}, function(result, e) {
		if (!e) {
			console.log("TEST",result);
			fn_mkRow(result.resultList);
			fn_mkChart01(result.resultList);
		} else {
			console.error(e);
		}
	});
}


/*********************[ TRANSACTION E ]************/
/*********************[ FUNCTION S ]***************/
function fn_initSearch(){
	fn_getDailyFnBPerDay();
//	fn_mkChart01(1);
//	$(".dataTypeBtn").eq(0).click();
}

//1번 차트 생성
function fn_mkChart01(data){
	
	if(chart01) chart01.dispose();
	var series,inversed;
	
	if(!data) return;
	
	data.splice(0,1);
	var chartData = JSON.parse(JSON.stringify(data));
	for(var i in chartData){
		chartData[i].basDy = chartData[i].basDy.substr(4,2)+"/"+chartData[i].basDy.substr(6,2);
	}
	
	chart01 = gfn_mkXYChart(chartData,{
		chartDivId : "chart01"
		,categoryName : "basDy"
		,inversed   : false
		,isWide     : true
		,cursor     : true
		,cursorFocus : chartData[0].basDy
		,series     : [
				,{type : "col"  , name : "ASP"       , valueKey : "asp" , color: COLOR_ARR[5] ,clusteredYn: true , padding : 10}
				,{type : "col"  , name : "SPP"        , valueKey : "spp" , color: COLOR_ARR[0] ,clusteredYn:true}
				,{type : "line" , name : "SR"       , valueKey : "sr" , color: COLOR_ARR[4] ,dash : 3.2 ,valueAxisType:2}
				,{type : "line" , name : "COMBO 비중" , valueKey : "cmbSellRt" , color: COLOR_ARR[3] , valueAxisType:2}
			]
	});
}

/*하단 그리드 생성*/
function fn_mkRow(data){
	var html = ``;
	if(!data.length) html = `<tr><td colspan=5 > 데이터가 없습니다. </td></tr>`;
	else{
		for(var i in data){
			var dateStr = data[i].basDy;
			var rowClass = "";
			if(dateStr && dateStr.length == 8){
				var date = new Date(dateStr.substr(0,4),Number(dateStr.substr(4,2))-1,dateStr.substr(6,2));
				if(date.getMonth()+1 != Number(srchDate.substr(4,2))) rowClass = "point-bg02"; 
				else if(date.format("yyyyMMdd") == srchDate) rowClass = "point-bg";
			}
			if(i == 0) rowClass = "total";
			html += `
			<tr class=${rowClass}>
				<td> ${fn_setDate(data[i].basDy)} </td>
				<td> ${gfn_numberFormat(data[i].spp)} </td>
				<td> ${data[i].sr.toFixed(1)}%</td>
				<td> ${gfn_numberFormat(data[i].asp)} </td>
				<td> ${data[i].cmbSellRt.toFixed(1)}%</td>
			</tr>
			`
		}
	}
	
	$(".dv-result tbody").empty().append(html);
}

function fn_setDate(dateStr){
	if(!dateStr || dateStr.length != 8) return dateStr;
	var dayNameList = ["일","월","화","수","목","금","토"];
	var date = new Date(dateStr.substr(0,4),Number(dateStr.substr(4,2))-1,dateStr.substr(6,2));
	var converted = date.format("MM/dd")+" ("+dayNameList[date.getDay()]+")";
	var addClass = "";
	if(date.getDay() == 0) addClass = "f-color01";
	else if(date.getDay() == 6) addClass = "f-color02";
	return "<span class="+addClass+">"+converted+"<span>";
}
/*********************[ FUNCTION E ]***************/
