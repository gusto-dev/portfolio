var chart01,chart02,chart03,chart04,chart05,chart06,srchDate;
var rsSiteNm, rsSiteCd, srchDate, rsSiteType;
var sortType,sortCol;
function fn_init(){
	
	if(srchDate){
		var flagDate = fn_getFlagDate("m",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}else {
		$("#srchDate").val(fn_getFlagDate("m"));
		srchDate = $("#srchDate").val().replace(/-/gi,"");
	}
	
	//AnyPicker 설정
	$("#srchDate").dateAnyPicker({
		  maxDate : [fn_getFlagDate("m").split("-")[0],fn_getFlagDate("m").split("-")[1]-1]
		 ,format  : "yyyy-MM"
		, onChange: function(date){
			fn_isOverDate (date)
			$("#srchDate").trigger("change");
		}
	});
	
	if(rsSiteType)$("#srchType").val(rsSiteType).prop("selected", true);
		
	$(".tab-contents").hide();
	$("#rs_type01").show();
	
	fn_getMonthlyRSWtctmWithBox();
	fn_getMonthlyRSWtctm();
	
	//라디오 변경이벤트
	$("[name='radio-rsSite']").on("change",function(e){
		var $el = $(e.target);
		$(".tab-contents").hide();
		
		if($el.val() == "rs") $("#rs_type01").show();
		else if($el.val() == "site"){
			$("#site_rank").show();
			$("#site_type01").show();
		}
		$("#tab-type").find("li").eq(0).click();
	});
	
	$("#tab-type").on("click",function(e){
		sortType = "d";
		var $el = $(e.target);
		$el.siblings().removeClass("active");
		$el.addClass("active");
		
		$(".tab-contents").hide();
		$(".rs_type").hide();
		
		if($("[name='radio-rsSite']:checked").val() == "rs"){
			if($el.attr("data-type") == "1"){
				fn_getMonthlyRSWtctmWithBox();
				fn_getMonthlyRSWtctm();
				$("#rs_type01").show();
			}else if($el.attr("data-type") == "2"){
				fn_getMonthlyRSMS();
				$("#rs_type02").show();
//				$("#site_type02").show();
			}else if($el.attr("data-type") == "3"){
				fn_getMonthlyRSMnInd();
				$("#rs_type03").show();
//				$("#site_type03").show();
			}
		}else if ($("[name='radio-rsSite']:checked").val() == "site"){
			$("#site_rank").show();
			if($el.attr("data-type") == "1"){
				$("#site_type01").show();
				fn_getMonthlySiteWtctm();
			}
			else if($el.attr("data-type") == "2"){
				fn_getMonthlySiteMS();
				$("#site_type02").show();
			}
			else if($el.attr("data-type") == "3"){
				fn_getMonthlySiteMnInd();
				$("#site_type03").show();
			}
		}
		
		$(".sortTh:visible").siblings(".sortTh").removeClass("sort-active");
		$(".sortTh:visible").eq(0).addClass("sort-active");
		fn_getSortIcon($(".sortTh:visible").eq(0),"d");
	});
	
	$("#srchDate").on("change",function(e){
		sortType = "d";
		$(".sortTh").removeAttr("sort-type");
		$(".sortTh").removeClass("sort-active");
		srchDate = $(e.target).val().replace(/-/gi,"");
		
		var $el = $("#tab-type").find(".active");
		if($("[name='radio-rsSite']:checked").val() == "rs"){
			if($el.attr("data-type") == "1"){
				fn_getMonthlyRSWtctmWithBox();
				fn_getMonthlyRSWtctm();
			}else if($el.attr("data-type") == "2"){
				fn_getMonthlyRSMS();
//				fn_getMonthlyRSMSGrd();
			}else if($el.attr("data-type") == "3"){
				fn_getMonthlyRSMnInd();
//				fn_getMonthlyRSMnIndGrd();
			}
		}else if ($("[name='radio-rsSite']:checked").val() == "site"){
			if($el.attr("data-type") == "1"){
				fn_getMonthlySiteWtctm();
			}else if($el.attr("data-type") == "2"){
				fn_getMonthlySiteMS();
			}else if($el.attr("data-type") == "3"){
				fn_getMonthlySiteMnInd();
			}
		}
		
		$(".sortTh:visible").siblings(".sortTh").removeClass("sort-active");
		$(".sortTh:visible").eq(0).addClass("sort-active");
		fn_getSortIcon($(".sortTh:visible").eq(0),"d");
	});
}

//SORTING
sortType = "d";
$(document).on("click",".sortTh",function(e){
//	if!($(e.target).hasClass("sortTh")) e.target = $(e.target).parent("sortTh");
//	console.log(e.target);
//	console.log(this);
	var sortTable = $(this).attr("dataType");
	sortCol = $(this).attr("sortCol");
	
	if(!sortType){
		sortType = "d";
	}else if(sortType == "d" && $(this).hasClass("sort-active")){
		sortType = "a";
	}else if(sortType == "a" && $(this).hasClass("sort-active")){
		sortType = "d";
	}else{
		sortType = "d";
	}
	
	$(this).siblings().removeClass("sort-active");
	$(this).addClass("sort-active");
	fn_getSortIcon($(".sort-active"),sortType);
	
	if($("[name='radio-rsSite']:checked").val() == "rs"){
		if(sortTable == "2"){
			fn_getMonthlyRSMSGrd(sortType,sortCol);
		}else if(sortTable == "3"){
			fn_getMonthlyRSMnIndGrd(sortType,sortCol);
		}
	}else if ($("[name='radio-rsSite']:checked").val() == "site"){
		if(sortTable == "1"){
			fn_getMonthlySiteWtctm(sortType,sortCol);
		}else if(sortTable == "2"){
			fn_getMonthlySiteMS(sortType,sortCol);
		}else if(sortTable == "3"){
			fn_getMonthlySiteMnInd(sortType,sortCol);
		}
	}
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

/******************************[ TRANSACTION START ]*************************************/

//전국대비 CGV 관람객 차트
function fn_getMonthlyRSWtctmWithBox(){
	var params = {srchDate:srchDate}
	console.log(params);
	transaction({
		url : '/result/getMonthlyRSWtctmWithBox.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("getMonthlyDyWtctm",result);
			if(result.rsWtctmWithBox.length != 0){
				fn_mkChart01(result.rsWtctmWithBox);
				$("#boxSpctAllCnt").text(gfn_numberFormat(result.rsWtctmWithBox[0].boxSpctAllCnt));
				$("#cgvDirSpctCnt").text(gfn_numberFormat( result.rsWtctmWithBox[0].cgvDirSpctCnt ));
				$("#cgvCntrSpctCnt").text(gfn_numberFormat( result.rsWtctmWithBox[0].cgvCntrSpctCnt ));
			}else{
				$("#chart01").empty().append(ERR_HTML_TYPE01);
			}
		}else{
			console.log(e);
		}
	});
}

//RS별 CGV 관람객 차트
function fn_getMonthlyRSWtctm(){
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate, srchType:srchType}
	transaction({
		url : '/result/getMonthlyRSWtctm.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("fn_getMonthlyRSWtctm",result.rsWtctm);
			if(result.rsWtctm.length != 0){
				fn_mkChart02(result.rsWtctm);
			}else{
				$("#chart02").empty().append(ERR_HTML_TYPE01);
			}
		}else{
			console.log(e);
		}
	});
}

//MS / BO MS 차트
function fn_getMonthlyRSMS(){
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate, srchType:srchType}
	transaction({
		url : '/result/getMonthlyRSMS.do'
		,params : params
		,complete : function(){}
	},function(result,e){
		if(!e){
			console.log("fn_getMonthlyRSMS",result);
			fn_mkChart03(result.rsms,"ms");
//			fn_mkChart04(result.rsms,"ms");
			fn_getMonthlyRSMSGrd();
		}else{
			console.log(e);
		}
	});
}

//RS > MS > 하단그리드
function fn_getMonthlyRSMSGrd(orderType,orderCol){
	if(!orderType && !orderCol){
		orderType = "d";
		orderCol = "ms";
	}
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate , srchType:srchType , orderType:orderType , orderCol:orderCol};
	transaction({
		url : '/result/getMonthlyRSMSGrd.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("getMonthlyRSMSGrd",result);
			fn_mkTableForRs(result.rsMsGrd,2,result.rsMsGrdAvg);
//			if(result.rsMsGrd.length != 0){
//				$(".sortTh").removeClass("sort-active");
//				$(".sortTh[sortCol='"+orderCol+"']").addClass("sort-active");
//				fn_getSortIcon($(".sort-active"),orderType);
//			}
		}else{
			console.log(e);
		}
	});
}

//주요지표 차트
function fn_getMonthlyRSMnInd(){
	var params = {srchDate:srchDate}
	transaction({
		url : '/result/getMonthlyRSMnInd.do'
		,params : params
		,complete : function(){}
	},function(result,e){
		if(!e){
			console.log("fn_getMonthlyRSMnInd",result);
			fn_mkChart05(result.mnInd);
//			fn_mkChart06(result.mnInd);
			fn_getMonthlyRSMnIndGrd();
		}else{
			console.log(e);
		}
	});
}

//RS > 주요지표 > 하단그리드
function fn_getMonthlyRSMnIndGrd(orderType,orderCol){
	if(!orderType && !orderCol){
		orderType = "d";
		orderCol = "atp";
	}
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate , orderType:orderType , orderCol:orderCol, srchType:srchType};
	transaction({
		url : '/result/getMonthlyRSMnIndGrd.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("getMonthlyRSMnIndGrd",result);
			fn_mkTableForRs(result.mnIndGrd,3,result.mnIndGrdAvg);
//			if(result.mnIndGrd.length != 0){
//				$(".sortTh").removeClass("sort-active");
//				$(".sortTh[sortCol='"+orderCol+"']").addClass("sort-active");
//				fn_getSortIcon($(".sort-active"),orderType);
//			}
		}else{
			console.log(e);
		}
	});
}

//사이트 > 관람객
function fn_getMonthlySiteWtctm(orderType , orderCol){
	if(!orderType && !orderCol){
		orderType = "d";
		orderCol = "cgvSpctCnt";
	}
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate , orderType:orderType , orderCol:orderCol, srchType:srchType};
	transaction({
		url : '/result/getMonthlySiteWtctm.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("fn_getMonthlySiteWtctm",result);
			fn_mkTableForSite(result.siteWtctm,1,orderCol,result.siteWtctmTot);
//			if(result.siteWtctm.length != 0){
//				$(".sortTh").removeClass("sort-active");
//				$(".sortTh[sortCol='"+orderCol+"']").addClass("sort-active");
//				fn_getSortIcon($(".sort-active"),orderType);
//			}
		}else{
			console.log(e);
		}
	});
}

//사이트 > MS
function fn_getMonthlySiteMS(orderType,orderCol){
	if(!orderType && !orderCol){
		orderType = "d";
		orderCol = "ms";
	}
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate , orderType:orderType , orderCol:orderCol, srchType:srchType};
	transaction({
		url : '/result/getMonthlySiteMS.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("fn_getMonthlySiteMS",result);
			fn_mkTableForSite(result.siteMs,2,orderCol,result.siteMsAvg);
//			if(result.siteMs.length != 0){
//				$(".sortTh").removeClass("sort-active");
//				$(".sortTh[sortCol='"+orderCol+"']").addClass("sort-active");
//				fn_getSortIcon($(".sort-active"),orderType);
//			}
		}else{
			console.log(e);
		}
	});
}
//사이트 > 주요지표
function fn_getMonthlySiteMnInd(orderType,orderCol){
	if(!orderType && !orderCol){
		orderType = "d";
		orderCol = "atp";
	}
	var srchType = $("[name='radio-rsSite']:checked").val();
	var params = {srchDate:srchDate , orderType:orderType , orderCol:orderCol, srchType:srchType};
	transaction({
		url : '/result/getMonthlySiteMnInd.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("fn_getMonthlySiteMnInd",result);
			fn_mkTableForSite(result.siteMnInd,3,orderCol,result.siteMnIndAvg);
//			if(result.siteMnInd.length != 0){
//				$(".sortTh").removeClass("sort-active");
//				$(".sortTh[sortCol='"+orderCol+"']").addClass("sort-active");
//				fn_getSortIcon($(".sort-active"),orderType);
//			}
		}else{
			console.log(e);
		}
	});
}
/******************************[ TRANSACTION END ]*************************************/
/******************************[ FUNCTION START ]**************************************/
function fn_mkChart01(data){
	if(chart01) chart01.dispose();
	var isEmpty = false;
	 
	var sampleData = [
		{
			sub : "CGV",
			recode : data[0].cgvSpctCnt,
			color : COLOR_ARR[0],
			subPieData: [
						{ s_name: "위탁", s_value: data[0].cgvCntrSpctCnt }
					  , { s_name: "직영", s_value: data[0].cgvDirSpctCnt }]
		}
		,{
			sub: "CGV 제외",
			recode: data[0].boxSpctCnt,
			color : COLOR_ARR[5],
		}
	];
	
	chart01 = gfn_mkPieOfPieChart(sampleData,{
	     chartDivId : "chart01"
	    ,categoryName : "sub"
	    ,valueName : "recode"
	    ,radius : 30
	    ,innerLabelText : "관람객"
	    //,legendDivId : "lgnd2"
	    ,labelText1 : "{category}\n{value.formatNumber('#,###')}"
    	,labelText2 : "{category}\n{value.percent}%\n"
//	    ,innerLabelTxt : percent.toFixed(1)+"% \n계획비"
	});
	
}

function fn_mkChart02(data){
	if(chart02) chart02.dispose();
	
	var maxData = 0;
	var chartData = [];
	for(var i in data){
		if(data[i].rsNm.length > 6 ) data[i].rsNm = data[i].rsNm.substr(0,5)+"..";
		if(data[i].rsCd == userInfo.g_bizGrpNo) data[i].pointColor = COLOR_ARR[0];
//		if(data[i].rsCd == "6000") continue;
		if(data[i].rsCd == "9000") continue;
		if(maxData < data[i].cgvSpctCnt ) maxData = data[i].cgvSpctCnt;
		chartData.push(data[i]);
	}
	
	chart02 = gfn_mkXYChart(chartData,{
		chartDivId : "chart02"
		,categoryName : "rsNm"
//		,valBreakStart : 10000
//		,valBreakEnd   : 3000
		,inversed   : true
		,pivot      : true
		,pointColor : true
		,cursor     : true
		,isLong     : true
		,label      : true
		,labelX     : -5
		,max : maxData * 1.3
		,onclick : function(target){
			fn_getRsDtlPop(target.dataItem.dataContext.rsCd);
		}
//		,labelTxtType : "val"
		,series : [
			{type : "col" , valueKey : "cgvSpctCnt" , color: COLOR_ARR[5] , labelColor : "#fff" , labelText : "{valueX.value}" , subDataKey :"rsCd" ,height:60 }
		]
	});
}

function fn_mkChart03(data,dataFlag){
	if(chart03) chart03.dispose();
	var chartData = [];
	var isEmpty = false;
	for(var i in data){
//		if(i > 3) continue;
		if(!data[i].recode && data[i].recode != 0) isEmpty = true;
		if(!data[i].diff) data[i].diff = null;
		if(!isEmpty){
			switch(data[i].rcdTyp){
				case "MS" : data[i].color = COLOR_ARR[0]; break;
				case "P" : data[i].color = COLOR_ARR[6]; break;
//				case "W" : data[i].color = COLOR_ARR[5]; break;
				case "BOMS" : data[i].color = COLOR_ARR[4]; break;
			}
			chartData.push(data[i]);
		}
	}
	if(isEmpty){
		$("#chart03").empty().append(ERR_HTML_TYPE01);
		return;
	}
	console.log(chartData);
	
//	var sampleData = [
//		 { rcdTyp : "ms" ,rcdNm : "실적" , recode : data[0].ms       , color : COLOR_ARR[0]}
//		,{ rcdTyp : "P" , rcdNm : "계획" , recode : data[0].msPln    , diff : data[0].msDfPln    , color : COLOR_ARR[4]}
//		,{ rcdTyp : "W" , rcdNm : "전주" , recode : data[0].msBfWeek , diff : data[0].msBfDfWeek , color : COLOR_ARR[5]}
//		,{ rcdTyp : "D" , rcdNm : "전일" , recode : data[0].msBfDy   , diff : data[0].msBfDfDy   , color : COLOR_ARR[6]}
//		];
	
	var maxData = 0;
	for(var i in chartData){
		if(maxData < chartData[i].recode) maxData = chartData[i].recode;
	}
	
	chart03 = gfn_mkXYChart(chartData,{
		 chartDivId : "chart03"
		,categoryName : "rcdNm"
		,pivot      : true
		,cursor     : true
		,inversed   : true
		,label      : true
		,labelX     : -10
//		,max : 100
		,max : maxData * 1.3
		,series : [
			{type:"col" , valueKey:"recode" , labelColor:"#fff" , labelText:"{valueX.value}", outLabelKey:"diff" , outLabelText:"{outVal}%p" ,tooltipText:"{valueX.value}%" ,height:50}]
	});
}

//function fn_mkChart04(data,dataFlag){
//	if(chart04) chart04.dispose();
//	var chartData = [];
//	var isEmpty = true;
//	for(var i in data){
//		if(i < 4) continue;
//		if(data[i].recode) isEmpty = false;
//		if(!data[i].diff) data[i].diff = null;
//		if(!isEmpty){
//			switch(data[i].rcdTyp){
//				case "BOMS" : data[i].color = COLOR_ARR[0]; break;
//				case "D" : data[i].color = COLOR_ARR[6]; break;
//				case "W" : data[i].color = COLOR_ARR[5]; break;
//				case "P" : data[i].color = COLOR_ARR[4]; break;
//			}
//			chartData.push(data[i]);
//		}
//	}
//	if(isEmpty){
//		$("#chart04").empty().append(ERR_HTML_TYPE01);
//		return;
//	}
//	console.log("test",chartData);
////	var sampleData = [
////		 { rcdTyp : "ms" ,rcdNm : "실적" , recode : data[0].boMs        , color : COLOR_ARR[0]}
////		,{ rcdTyp : "P" , rcdNm : "계획" , recode : data[0].boMsPln    , diff : data[0].boMsDfPln    , color : COLOR_ARR[4]}
////		,{ rcdTyp : "W" , rcdNm : "전주" , recode : data[0].boMsBfWeek , diff : data[0].boMsBfDfWeek , color : COLOR_ARR[5]}
////		,{ rcdTyp : "D" , rcdNm : "전일" , recode : data[0].boMsBfDy   , diff : data[0].boMsBfDfDy   , color : COLOR_ARR[6]}
////		];
//
//	chart04 = gfn_mkXYChart(chartData,{
//		 chartDivId : "chart04"
//		,categoryName : "rcdNm"
//		,pivot      : true
//		,cursor     : true
//		,label      : true
//		,inversed   : true
//		,labelX     : -10
//		,max : 100
//		,series : [
//			{type:"col" , valueKey:"recode" , labelColor:"#fff" , labelText:"{valueX.value}" , outLabelKey:"diff" , outLabelText:"{outVal}%p",tooltipText:"{valueX.value}%" }
//		]
//	});
//}

function fn_mkChart05(data,dataFlag){
	if(chart05) chart05.dispose();
	var chartData = [];
	var isEmpty = false;
	for(var i in data){
		if(!data[i].recode && data[i].recode != 0) isEmpty = true;
		if(!data[i].diff) data[i].diff = null;
		if(!isEmpty){
			switch(data[i].rcdTyp){
				case "ATP" : data[i].color = COLOR_ARR[0]; break;
				case "SPP" : data[i].color = COLOR_ARR[6]; break;
				case "ATP_SPP" : data[i].color = COLOR_ARR[5]; break;
			}
			chartData.push(data[i]);
		}
	}
	if(isEmpty){
		$("#chart05").empty().append(ERR_HTML_TYPE01);
		return;
	}
	
//	var sampleData = [
//		 { rcdTyp : "ms" ,rcdNm : "실적" , recode : 6 , color : COLOR_ARR[0]}
//		,{ rcdTyp : "P" , rcdNm : "계획" , recode : 5 , diff : data[0].boMsDfPln    , color : COLOR_ARR[4]}
//		,{ rcdTyp : "W" , rcdNm : "전주" , recode : 4 , diff : data[0].boMsBfDfWeek , color : COLOR_ARR[5]}
//		,{ rcdTyp : "D" , rcdNm : "전일" , recode : 6 , diff : data[0].boMsBfDfDy   , color : COLOR_ARR[6]}
//		];
	
	var maxData = 0;
	for(var i in chartData){
		if(maxData < chartData[i].recode ) maxData = chartData[i].recode;
	}
	
	chart05 = gfn_mkXYChart(chartData,{
		 chartDivId : "chart05"
		,categoryName : "rcdNm"
		,pivot      : true
		,cursor     : true
		,label      : true
		,inversed : true
		,labelX     : -10
		,max : maxData * 1.45
		,series : [
			{type:"col" , valueKey:"recode" , labelColor:"#fff" , labelText:"{valueX.value}" , outLabelKey:"diff" , outLabelText:"{outVal}" ,height:50}
		]
	});
}

//function fn_mkChart06(data,dataFlag){
//	if(chart06) chart06.dispose();
//	var chartData = [];
//	var isEmpty = true;
//	for(var i in data){
//		if(i > 3) continue;
//		if(data[i].recode) isEmpty = false;
//		if(!data[i].diff) data[i].diff = null;
//		if(!isEmpty){
//			switch(data[i].rcdTyp){
//				case "SPP" : data[i].color = COLOR_ARR[0]; break;
//				case "D" : data[i].color = COLOR_ARR[6]; break;
//				case "W" : data[i].color = COLOR_ARR[5]; break;
//				case "P" : data[i].color = COLOR_ARR[4]; break;
//			}
//			chartData.push(data[i]);
//		}
//	}
//	if(isEmpty){
//		$("#chart06").empty().append(ERR_HTML_TYPE01);
//		return;
//	}
//
////	var sampleData = [
////		 { rcdTyp : "ms" ,rcdNm : "실적" , recode : data[0].boMs        , color : COLOR_ARR[0]}
////		,{ rcdTyp : "P" , rcdNm : "계획" , recode : data[0].boMsPln    , diff : data[0].boMsDfPln    , color : COLOR_ARR[4]}
////		,{ rcdTyp : "W" , rcdNm : "전주" , recode : data[0].boMsBfWeek , diff : data[0].boMsBfDfWeek , color : COLOR_ARR[5]}
////		,{ rcdTyp : "D" , rcdNm : "전일" , recode : data[0].boMsBfDy   , diff : data[0].boMsBfDfDy   , color : COLOR_ARR[6]}
////		];
//	var maxData = 0;
//	for(var i in chartData){
//		if(maxData < chartData[i].recode ) maxData = chartData[i].recode;
//	}
//
//	console.log("TEST",chartData)
//
//	chart06 = gfn_mkXYChart(chartData,{
//		 chartDivId : "chart06"
//		,categoryName : "rcdNm"
//		,pivot      : true
//		,cursor     : true
//		,label      : true
//		,inversed   : true
//		,labelX     : -10
//		,max : maxData * 1.45
//		,series : [
//			{type:"col" , valueKey:"recode" , labelColor:"#fff" , labelText:"{valueX.value}" , outLabelKey:"diff" , outLabelText:"{outVal}" }
//		]
//	});
//}


//SITE 테이블 생성
function fn_mkTableForSite(data,dataFlag,orderCol,sumData){
	if(dataFlag == 1){ // 상단고정 테이블
		var html = "";
		if(data.length == 0) html = '<tr><td class="align-c" colspan=5> 데이터가 없습니다. <tr>';
		else{
			// null 또는 0 => - 변환
			fn_flNullData(data);
//			console.log("===========",data);
			//랭킹 1,2,3 순위입력
			fn_setRank(data,orderCol,dataFlag);
			//ROW 생성
			var fnTxt = "";
			var fnCnt = "";
			for(var i in data){
				if($("[name='radio-rsSite']:checked").val() == "site"){
					fnTxt = "onclick='fn_goMonthlySmry("+JSON.stringify(data[i])+")'";
					fnCnt = (Number(i)+1)+". ";
				}
				html += "<tr "+ fnTxt +" >";
				html += "<td data-cd='"+data[i].commCd+"'>"+ fnCnt +gfn_removeCGVTxt( data[i].commCdNm )+"</td>"; /*사이트*/
				html += "<td>"+gfn_numberFormat( data[i].cgvSpctCnt )+"</td>"; /*CGV관람객*/
				if(data[i].plnCgvSpctWgt == "-"){ /*계획비*/
					html += "<td>-</br>";
				}else if(data[i].plnCgvSpctWgt < 100){
					html += "<td><span class='f-color02'>"+ fn_getPercentFormat( Math.abs(data[i].plnCgvSpctWgt) )+"</span></br>";
				}else if(data[i].plnCgvSpctWgt > 100){
					html += "<td><span class='f-color01'>"+ fn_getPercentFormat( Math.abs(data[i].plnCgvSpctWgt) )+"</span></br>";
				}
				html += "<span class='s-font f-color04'>"+gfn_numberFormat(data[i].plnCgvSpctCnt)+"</span></td>"; /*계획비*/
				html += "<td>"+fn_getPercentFormat( data[i].cgvSpctWgt )+"</td>"; /*객석률*/
				html += "</tr>";
			}
		}
		//테이블 초기화
		$("#tbl-site-wtctm").empty();
		//데이터 입력
		$("#tbl-site-wtctm").append(html);
		
		//합계,평균 ROW 생성
		if(data.length != 0){
			fn_flNullData(sumData);
			var sumHtml = fn_mkSumRow(sumData,dataFlag);
			$("#tbl-site-wtctm").prepend(sumHtml);
		}
		
	}else{ // 좌측 고정 테이블
		
		fn_flNullData(data);
		//고정영역 초기화
//		$(".site-freezer").empty();
		//고정 테이블 생성
//		var tableHtml = "";
//		tableHtml += '<span class="icon-x-scroll">x-scroll</span>';
//		tableHtml += '<table class="txt-c table-freeze-multi" data-scroll-height="auto" data-cols-number="1" id="tbl-site-freezer">';
//		$(".site-freezer").append(tableHtml);
		
		//랭킹 1,2,3 순위입력
		fn_setRank(data,orderCol,dataFlag);
		
		//고정 영역 헤더 생성
//		var freezeAreaHtml = fn_mkFreezeArea(dataFlag);
//		$("#tbl-site-freezer").append(freezeAreaHtml);

		//고정 영역 ROW 생성
		var rowHtml = fn_mkFreezeRow(data,dataFlag);
		$("#tbl-site"+dataFlag).empty().append(rowHtml);
		
		//합계,평균 ROW 생성
		if(data.length != 0){
			fn_flNullData(sumData);
			var sumHtml = fn_mkSumRow(sumData,dataFlag);
			$("#tbl-site"+dataFlag).prepend(sumHtml);
		}
		
		//좌측 고정 함수 실행
//		fn_freezeTable();
		//이벤트 바인딩
//		bindScrollEvnt($(".freeze-multi-scroll-table-body"));
	}
}

//RS 테이블 생성
function fn_mkTableForRs(data,dataFlag,sumData){
	if(dataFlag == 1){ // 상단고정 테이블
		//empty
	}else{ // 좌측 고정 테이블
		fn_flNullData(data);
		
		//고정영역 초기화
//		$(".site-freezer").empty();
		//고정 테이블 생성
//		var tableHtml = "";
//		tableHtml += '<span class="icon-x-scroll">x-scroll</span>';
//		tableHtml += '<table class="txt-c table-freeze-multi" data-scroll-height="auto" data-cols-number="1" id="tbl-site-freezer">';
//		$(".site-freezer").append(tableHtml);
		
		//고정 영역 헤더 생성
//		var freezeAreaHtml = fn_mkFreezeArea(dataFlag);
//		$("#tbl-site-freezer").append(freezeAreaHtml);

		//ROW 생성
		var rowHtml = fn_mkFreezeRow(data,dataFlag);
		$("#tbl-rs"+dataFlag).empty().append(rowHtml);
		
		//합계,평균 ROW 생성
		if(data.length != 0){
			fn_flNullData(sumData);
			var sumHtml = fn_mkSumRow(sumData,dataFlag);
			$("#tbl-rs"+dataFlag).prepend(sumHtml);
		}
		
		//좌측 고정 함수 실행
//		fn_freezeTable();
		//이벤트 바인딩
//		bindScrollEvnt($(".freeze-multi-scroll-table-body"));
	}
}


//좌측 틀고정 ROW 생성
function fn_mkFreezeRow(data,flag){
	var html = "";

	if(data.length == 0) html = '<tr><td colspan=5> 데이터가 없습니다. </td><tr>';
	if(flag == 2){
		var fnTxt = "";
		var fnCnt = "";
		for(var i in data){
			if($("[name='radio-rsSite']:checked").val() == "site"){
				fnTxt = "onclick='fn_goMonthlySmry("+JSON.stringify(data[i])+")'";
				fnCnt = (Number(i)+1)+". ";
			}
//			if(dataCode == "rsCd") fnTxt = "onclick=fn_getRsDtlPop('"+data[i][dataCode]+"')";
			html += "<tr "+ fnTxt +" >";
			html += "<td class='align-l' data-cd='"+data[i]["commCd"]+"'>"+ fnCnt +gfn_removeCGVTxt( data[i]["commCdNm"] )+"</th>"; /*SITE,RS*/
			html += "<td>"+fn_getPercentFixed2( data[i].ms )+"</td>"; /*MS실적*/
			html += "<td class='r-line'>"+fn_getPercentFixed2( data[i].msPln ); /*MS계획*/
			if(data[i].msDfPln == "-"){ /*MS계획차*/
				html += "<br><span>-</span>";
			}else if(data[i].msDfPln < 0){
				html += "<br><span class='fall'>"+fn_getPercentPointFixed2( Math.abs(data[i].msDfPln) )+"</span>";
			}else if(data[i].msDfPln > 0){
				html += "<br><span class='gain'>"+fn_getPercentPointFixed2( Math.abs(data[i].msDfPln) )+"</span>";
			}
			html += "</td>";
			
			html += "<td>"+fn_getPercentFixed2( data[i].boMs )+"</td>"; /*BO실적*/
//			html += "<td>"+fn_getPercentFixed2( data[i].boMsPln )+"</td>"; /*BO계획*/
//			if(data[i].boMsDfPln == "-"){ /*BO계획차*/
//				html += "<td>-</td>";
//			}else if(data[i].boMsDfPln < 0){
//				html += "<td><span class='fall'>"+fn_getPercentPointFixed2( Math.abs(data[i].boMsDfPln) )+"</span></td>";
//			}else if(data[i].boMsDfPln > 0){
//				html += "<td><span class='gain'>"+fn_getPercentPointFixed2( Math.abs(data[i].boMsDfPln) )+"</span></td>";
//			}
			html += "</tr>";
		}
	}else{
		var fnTxt = "";
		var fnCnt = "";
		for(var i in data){
			if($("[name='radio-rsSite']:checked").val() == "site"){
				fnTxt = "onclick='fn_goMonthlySmry("+JSON.stringify(data[i])+")'";
				fnCnt = (Number(i)+1)+". ";
			}
//			if(dataCode == "rsCd") fnTxt = "onclick=fn_getRsDtlPop('"+data[i][dataCode]+"')";
			html += "<tr "+ fnTxt +" >";
			html += "<td class='align-l' data-cd='"+data[i]["commCd"]+"'>"+ fnCnt +gfn_removeCGVTxt(data[i]["commCdNm"])    +"</td>"; /*SITE,RS*/
			html += "<td>"+gfn_numberFormat( data[i].atp )      +"</td>"; /*ATP실적*/
//			html += "<td>"+gfn_numberFormat( data[i].atpPln )   +"</td>"; /*ATP계획*/
//			if(data[i].atpDfPln == "-"){ /*ATP계획차*/
//				html += "<td>-</td>";
//			}else if(data[i].atpDfPln < 0){
//				html += "<td><span class='fall'>"+ gfn_numberFormat( Math.abs(data[i].atpDfPln) ) +"</span></td>";
//			}else if(data[i].atpDfPln > 0){
//				html += "<td><span class='gain'>"+ gfn_numberFormat( Math.abs(data[i].atpDfPln) ) +"</span></td>";
//			}
			html += "<td>"+gfn_numberFormat( data[i].spp )      +"</td>"; /*SPP실적*/
			html += "<td>"										+ fn_getPercentFormat(data[i].grpSpctPer)			+ "<br>"; /*단체비중(전년차)*/
			if(data[i].grpSpctYearDiffPer == "-"){
				html += "<span>-</span>";
			}else if(data[i].grpSpctYearDiffPer < 0){
				html += "<span class='s-font fall'>"+ fn_getPercentFormat(Math.abs(data[i].grpSpctYearDiffPer)) +"</span></td>";
			}else if(data[i].grpSpctYearDiffPer > 0){
				html += "<span class='s-font gain'>"+ fn_getPercentFormat(data[i].grpSpctYearDiffPer) +"</span></td>";
			}
//			fn_getPercentFormat(data[i].grpSpctYearDiffPer)			+ "</td>"; /*단체비중(전년차)*/
			html += "<td>"		+ gfn_numberFormat(data[i].grpSpctCnt)			+ "<br>"; /*단체관람객(전년비)*/
			if(data[i].grpSpctYearPer == "-"){
				html += "<span>-</span>";
			}else if(data[i].grpSpctYearPer < 0){
				html += "<span class='s-font fall'>"+ fn_getPercentFormat(Math.abs(data[i].grpSpctYearPer)) +"</span></td>";
			}else if(data[i].grpSpctYearPer > 0){
				html += "<span class='s-font gain'>"+ fn_getPercentFormat(data[i].grpSpctYearPer) +"</span></td>";
			}
			html += "</tr>";
		}
	}
	return html;
}

//좌측 틀고정영역 생성
function fn_mkFreezeArea(flag){
	var txtArr,sortArr;
	if(flag == 2){
		txtArr = ["관객 MS","BO MS"];
		sortArr = [
			 " dataType=2 sortCol='ms' "
			," dataType=2 sortCol='msPln' "
			," dataType=2 sortCol='msDfPln' "
			," dataType=2 sortCol='boMs' "
			," dataType=2 sortCol='boMsPln' "
			," dataType=2 sortCol='boMsDfPln' "
		]
	}else if(flag == 3){
		txtArr = ["ATP","SPP"];
		sortArr = [
			 " dataType=3 sortCol='atp' "
			," dataType=3 sortCol='atpPln' "
			," dataType=3 sortCol='atpDfPln' "
			," dataType=3 sortCol='spp' "
			," dataType=3 sortCol='sppPln' "
			," dataType=3 sortCol='sppDfPln' "
		]
	}
	
	var html = "";
	
	html += '	<colgroup>                        ';
	html += '	<col width="100px">                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '	<col>                             ';
	html += '</colgroup>                          ';
	html += '<thead>                              ';
	html += '	<tr>                              ';
	if($("[name='radio-rsSite']:checked").val() == "rs"){
		html += '		<th rowspan="2">RS</th>     ';
	}else if ($("[name='radio-rsSite']:checked").val() == "site"){
		html += '		<th rowspan="2">SITE</th>     ';
	}else{
		html += '		<th rowspan="2">RS/SITE</th>     ';
	}
	html += '		<th colspan="3">'+txtArr[0]+'</th>  ';
	html += '		<th colspan="3">'+txtArr[1]+'</th>    ';
	html += '	</tr>                             ';
	html += '	<tr>                              ';
	html += '		<th class="sortTh" '+sortArr[0]+' >실적</th>   ';
	html += '		<th class="sortTh" '+sortArr[1]+' >계획</th>   ';
	html += '		<th class="sortTh" '+sortArr[2]+' >계획차</th> ';
	html += '		<th class="sortTh" '+sortArr[3]+' >실적</th>   ';
	html += '		<th class="sortTh" '+sortArr[4]+' >계획</th>   ';
	html += '		<th class="sortTh" '+sortArr[5]+' >계획차</th> ';
	html += '	</tr>                             ';
	html += '</thead>                             ';
	html += '<tbody id="tbdy-site-freezer">       ';
	html += '</tbody>                             ';
	return html;
}

//상위 3위 랭킹 세팅
function fn_setRank(data,colNm,dataFlag){
	if(data.length == 0 ) return false;
	var rankData = [];
	for(var i=0; i<3; i++){
		var rank = {}
		rank.thatNm = gfn_removeCGVTxt(data[i].commCdNm);
		rank.recode = gfn_numberFormat(data[i][colNm]);
		rankData.push(rank);
	}
	
	$("#fstNm" ).empty().text(rankData[0].thatNm);
	$("#scdNm" ).empty().text(rankData[1].thatNm);
	$("#thdNm" ).empty().text(rankData[2].thatNm);
	
	if(dataFlag == 2){
		$("#fstRcd").empty().text(fn_getPercentFixed2( rankData[0].recode ));
		$("#scdRcd").empty().text(fn_getPercentFixed2( rankData[1].recode ));
		$("#thdRcd").empty().text(fn_getPercentFixed2( rankData[2].recode ));
	}else{
		if("plnCgvSpctWgt" == colNm || "cgvSpctWgt" == colNm){
			$("#fstRcd").empty().text(fn_getPercentFormat( rankData[0].recode ));
			$("#scdRcd").empty().text(fn_getPercentFormat( rankData[1].recode ));
			$("#thdRcd").empty().text(fn_getPercentFormat( rankData[2].recode ));
		}else{
			$("#fstRcd").empty().text(rankData[0].recode);
			$("#scdRcd").empty().text(rankData[1].recode);
			$("#thdRcd").empty().text(rankData[2].recode);
		}
	}
}


//합계,평균 ROW 생성
function fn_mkSumRow(data,flag){
	var html = "";
	var dataNm = "";
	var dataCode = "";

	if(flag == 1){
		for(var i in data){
			html += "<tr class='total'>";
			html += "<td>총계</td>";
			html += "<td>"+gfn_numberFormat( data[i].cgvSpctCnt )+"</td>"; /*CGV관람객*/
			html += "<td>";
			if(data[i].plnCgvSpctWgt == "-"){ /*계획비차*/
				html += "<span>-</span>";
			}else if(data[i].plnCgvSpctWgt < 100){
				html += "<span class='f-color02'>"+ fn_getPercentFormat( Math.abs(data[i].plnCgvSpctWgt) ) +"</span></br>";
			}else if(data[i].plnCgvSpctWgt > 100){
				html += "<span class='f-color01'>"+ fn_getPercentFormat( Math.abs(data[i].plnCgvSpctWgt) ) +"</span></br>";
			}
			html += "<span class='s-font f-color04'>"+gfn_numberFormat( data[i].plnCgvSpctCnt )+"</span>"; /*계획비*/
			html += "</td>";
			html += "<td>"+fn_getPercentFormat( data[i].cgvSpctWgt )+"</td>"; /*객석률*/
			html += "</tr>";
		}
	}else if(flag == 2){
		for(var i in data){
			var msDfPln = data[i].msDfPln;
			var msDfPlnClass = "";
			
			if(data[i].msDfPln == "-"){ /*MS계획차*/
				msDfPlnClass = "";
			}else if(data[i].msDfPln < 0){
				msDfPlnClass = "fall";
				msDfPln = fn_getPercentPointFixed2( Math.abs(data[i].msDfPln) );
			}else if(data[i].msDfPln > 0){
				msDfPlnClass = "gain";
				msDfPln = fn_getPercentPointFixed2( Math.abs(data[i].msDfPln) );
			}
			
			html += "<tr class='total'>";
			html += "<td class='r-line'>총계</td>";
			html += "<td>"+fn_getPercentFixed2( data[i].ms )+"</td>"; /*MS실적*/
			html += "<td class='r-line'>"+fn_getPercentFixed2( data[i].msPln ); /*MS계획*/
			html += "<br><span class='"+msDfPlnClass+"'>"+msDfPln+"</span>"; /*MS계획차*/
			html += "</td>";
			html += "<td>"+fn_getPercentFixed2( data[i].boMs )+"</td>"; /*BO실적*/
			html += "</tr>";
			
//			html += "<td>"+fn_getPercentFixed2( data[i].boMsPln )+"</td>"; /*BO계획*/
//			if(data[i].boMsDfPln == "-"){ /*BO계획차*/
//				html += "<td>-</td>";
//			}else if(data[i].boMsDfPln < 0){
//				html += "<td><span class='fall'>"+fn_getPercentPointFixed2( Math.abs(data[i].boMsDfPln) )+"</span></td>";
//			}else if(data[i].boMsDfPln > 0){
//				html += "<td><span class='gain'>"+fn_getPercentPointFixed2( Math.abs(data[i].boMsDfPln) )+"</span></td>";
//			}
		}
	}else if(flag == 3){
		for(var i in data){
			html += "<tr class='total'>";
			html += "<td>직영</td>";
			html += "<td>"+gfn_numberFormat( data[i].atp )      +"</td>"; /*ATP실적*/
			html += "<td>"+gfn_numberFormat( data[i].spp )      +"</td>"; /*SPP실적*/
			html += "<td>"										+ fn_getPercentFormat(data[i].grpSpctPer)			+ "<br>"; /*단체비중(전년차)*/
			if(data[i].grpSpctYearDiffPer == "-"){
				html += "<span>-</span>";
			}else if(data[i].grpSpctYearDiffPer < 0){
				html += "<span class='s-font fall'>"+ fn_getPercentFormat(Math.abs(data[i].grpSpctYearDiffPer)) +"</span></td>";
			}else if(data[i].grpSpctYearDiffPer > 0){
				html += "<span class='s-font gain'>"+ fn_getPercentFormat(data[i].grpSpctYearDiffPer) +"</span></td>";
			}
			html += "<td>"		+ gfn_numberFormat(data[i].grpSpctCnt)			+ "<br>"; /*단체관람객(전년비)*/
			if(data[i].grpSpctYearPer == "-"){
				html += "<span>-</span>";
			}else if(data[i].grpSpctYearPer < 0){
				html += "<span class='s-font fall'>"+ fn_getPercentFormat(Math.abs(data[i].grpSpctYearPer)) +"</span></td>";
			}else if(data[i].grpSpctYearPer > 0){
				html += "<span class='s-font gain'>"+ fn_getPercentFormat(data[i].grpSpctYearPer) +"</span></td>";
			}
			html += "</tr>";
			
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
		}
	}
	return html;
}

//Summary 로 이동
function fn_goMonthlySmry(obj){
	var url = "/result/monthlySmry.do";
	url += "?pageId="+pageId;
	url += "&rsSiteType=site";
	url += "&rsSiteNm="+gfn_removeCGVTxt(obj.thatNm);
	url += "&rsSiteCd="+obj.thatCd;
	url += "&srchDate="+srchDate;
	location.href = url;
}

//null 일때 %처리
function fn_getPercentFormat(data){
	var dataConv = data.toString().replace(/,/gi,"");
	if(data != "-"){
		return gfn_numberFormat( Number(dataConv).toFixed(1) )+"%";
	}else{
		return dataConv;
	}
}

//null 일때 %처리
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
/******************************[ FUNCTION END ]**************************************/