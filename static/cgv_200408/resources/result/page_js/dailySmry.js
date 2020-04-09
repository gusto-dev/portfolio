var chart01,chart02,chart03,chart04;
var rsSiteNm, rsSiteCd, srchDate, rsSiteType;
var chart_swiper;
var movFrCnt, movToCnt;

function fn_init(){
	
	if(srchDate){
		var flagDate = fn_getFlagDate("d",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}
	else $("#srchDate").val(fn_getFlagDate("d"));
	
	gfn_setDatepicker($("#srchDate"));
	
	$("#srchType").attr("data-val",rsSiteType);
	if(rsSiteType == "all") $("#srchType").text("전체");
	else if(rsSiteType == "rs") $("#srchType").text("RS");
	else if(rsSiteType == "site") $("#srchType").text("SITE");
	
	$("#srchDate").on("change",function(e){
		srchDate = $(e.target).val().replace(/-/gi,"");
		fn_initSearch(); //조회,재조회
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
	
	/* 검색 후 이벤트 */
	$("[name='rsSiteName']").on("change",function(e){
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm   = $(e.target).text();
		rsSiteCd   = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	/* 페이지 하단 탭 (영화 , 회차 , 포맷, 상영관) 클릭 이벤트 */
	$(".tab02").on("click",function(evnt){
		gfn_tabSwith(evnt.target,function(tabInfo){
			if(tabInfo == "#fxcont1"){ //영화
				fn_getDailyWtctmMov(); //Summary 영화별
			}else if(tabInfo == "#fxcont2"){ //상영관
				fn_getDailyWtctmScn(); //Summary 상영관
			}else if(tabInfo == "#fxcont3"){ //RS
				fn_getDailyWtctmRsSite("rs"); //Summary RS별
			}else if(tabInfo == "#fxcont4"){ //SITE
				fn_getDailyWtctmRsSite("site"); //Summary SITE별
			}
		});
	});
	
	$(".btn-tbltoggle span.s-font").on("click",function(e){
		$(e.target).parent("button").click();
	});
	
	/* 토글버튼 이벤트 */
	$(".btn-tbltoggle").on("click",function(e){
		fn_toggleTh(e.target);
	});
	
	/*더보기*/
	$("#moreBtn1").on("click",function(e){
		movFrCnt = movFrCnt + 10;
		movToCnt = movToCnt + 10;
		fn_getDailyWtctmMov();
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
	
	fn_initSearch(); //조회,재조회
} // ------ END INIT

//조회,재조회
function fn_initSearch(){
	movFrCnt = 1;
	movToCnt = 10;
	$("#moreBtn1").show();
	fn_getDailySmryBoard(); //Daily 관람객 조회
	gfn_setRsSiteName(rsSiteType,rsSiteNm);
}

//요약 대시보드
function fn_getDailySmryBoard(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	
	transaction({
		url : '/result/getDailySmryBoard.do'
		,params : params
		,complete : function(){}
	},function(result,e){
		if(!e){
			fn_mkChart01(result.smryData);
			fn_mkChart02(result.smryData);
			fn_mkChart03(result.smryData);
			fn_mkChart04(result.smryData);
			initSwiper();
			
			fn_bindRowDailyWtctmAll(result.smryData); //Daily 관람객 전국 출력
			fn_bindRowDailyWtctm(result.smryData); //Daily 관람객 출력
			fn_bindRowDailyMSSpct(result.smryData); //Daily MS 관객 출력
			fn_bindRowDailyMSBO(result.smryData); //Daily MS BO 출력
			fn_bindRowDailyATP(result.smryData); //Daily 주요지표 ATP 출력
			fn_bindRowDailySPP(result.smryData); //Daily 주요지표 SPP 출력
			fn_bindRowDailyBktPer(result.smryData); //Daily 주요지표 객석률 출력
			fn_bindRowDailyAtpSpp(result.smryData); //Daily 주요지표 ATP+SPP 출력
			
			fn_bindDataInSwiper(result);
			
			$(".tab02").removeAttr("data-flag","");
			$(".tab02[data-area='#fxcont1']").trigger("click");
		}else{
			console.error(e);
		}
	});
}

//CGV 관람객 출력
function fn_getCgvSmry(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");

	transaction({
		url : '/result/getDailyCgvWtctm.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("Daily CGV 관람객",result);
			fn_bindRowDailyCgv(result); //Daily 관람객 출력
		}else{
			console.log(e);
		}
	});
}

////Daily 관람객 조회
//function fn_getDailyWtctm(){
//	var params = {};
//	params.srchType = rsSiteType;
//	params.srchValue = rsSiteCd;
//	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
//
//	transaction({
//		url : '/result/getDailyWtctm.do'
//		,params : params
//	},function(result,e){
//		if(!e){
//			console.log("Daily 관람객",result);
//			fn_mkChart01(result);
//			fn_mkChart02(result);
//			fn_mkChart03(result);
//			fn_mkChart04(result);
//			initSwiper();
//			
//			fn_bindRowDailyWtctmAll(result); //Daily 관람객 전국 출력
//			fn_bindRowDailyWtctm(result); //Daily 관람객 출력
//			fn_bindRowDailyMSSpct(result); //Daily MS 관객 출력
//			fn_bindRowDailyMSBO(result); //Daily MS BO 출력
//			fn_bindRowDailyATP(result); //Daily 주요지표 ATP 출력
//			fn_bindRowDailySPP(result); //Daily 주요지표 SPP 출력
//			fn_bindRowDailyBktPer(result); //Daily 주요지표 객석률 출력
//			fn_bindRowDailyAtpSpp(result); //Daily 주요지표 ATP+SPP 출력
//			
//			fn_bindDataInSwiper(result);
//			
//			$(".tab02").removeAttr("data-flag","");
//			$(".tab02[data-area='#fxcont1']").trigger("click");
//		}else{
//			console.log(e);
//		}
//	});
//}


//차트스와이퍼 생성
function initSwiper(){
	if(chart_swiper) chart_swiper.destroy(true,true);
	chart_swiper = new Swiper('.chart-swiper-box', {
		loop: false,
		speed: 500,
		setWrapperSize: true,
		initialSlide: 0,
		freeModeMomentumBounce: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
		},
	});
}

//1번차트 생성
function fn_mkChart01(data){
	if(chart01) chart01.dispose();
	if(!data[0].cgvDayCnt && !data[0].boxDayCnt){
		$("#chart01").parent(".info").removeClass("w50").addClass("w100").next().hide();
		$("#chart01").empty().append(ERR_HTML_TYPE01);
		return;
	}else{
		$("#chart01").parent(".info").removeClass("w100").addClass("w50").next().show();
	}
	
	var chartData = [
		 { tit: "계획비"
		 , tot : 100
		 , cgvPlnPer : data[0].cgvPlnPer }
//		 , cgvPlnPer : 107.3}
	]

	chart01 = gfn_mkRadarChart(chartData,{
		chartDivId : "chart01"
		,categoryName : "tit"
		,maxGrpName : "tot"
		,compGrpName : "cgvPlnPer"
		,color : COLOR_ARR[0]
		,max : 100
		,innerLabelFontSize : 12
		,innerLabelText : chartData[0].cgvPlnPer+"%"
		,freeLabel: {text : gfn_numberFormat(data[0].cgvSpctCnt)}
	});
	chart01.chartContainer.minHeight = 200;
	chart01.chartContainer.dy = -35;
}

//2번차트 생성
function fn_mkChart02(data){
	if(chart02) chart02.dispose();
	if(
		!data[0].cgvSpctCnt
	  &&!data[0].cgvDayCnt
	  &&!data[0].cgvWeekCnt
	  &&!data[0].cgvPlnCnt
	  &&!data[0].boxPlnCnt
	  &&!data[0].boxWeekCnt
	  &&!data[0].boxDayCnt
	  &&!data[0].boxSpctCnt
	){
//		var html = "<p class='no-data01'>일시적인 서버 장애로 인해 <br>조회가 불가합니다. <br>잠시 후 다시 시도해 주십시오.</p>";
		$("#chart02").parent(".info").removeClass("w70").addClass("w100").next().hide();
		$(".lgnd-area").hide();
		$("#chart02").empty().append(ERR_HTML_TYPE01);
		return;
	}else{
		$(".lgnd-area").show();
		$("#chart02").parent(".info").removeClass("w100").addClass("w70").next().show();
	}
	
	var chartData = [
        { rcdTyp : "R" , rcdNm : "실적" , all : data[0].boxSpctCnt , rsSite : data[0].cgvSpctCnt   }
       ,{ rcdTyp : "P" , rcdNm : "계획" , all : data[0].boxPlnCnt  , rsSite : data[0].cgvPlnCnt  }
       ,{ rcdTyp : "W" , rcdNm : "전주" , all : data[0].boxWeekCnt , rsSite : data[0].cgvWeekCnt }
       ,{ rcdTyp : "D" , rcdNm : "전일" , all : data[0].boxDayCnt  , rsSite : data[0].cgvDayCnt  }
	]
	
	var maxDataAll = 0;
	var maxDataRsSite = 0;
	for(var i in chartData){
		if(maxDataAll < chartData[i].all) maxDataAll = chartData[i].all;
		if(maxDataRsSite < chartData[i].rsSite) maxDataRsSite = chartData[i].rsSite;
	}
	var maxData = 0;
	maxDataAll < maxDataRsSite ? maxData = maxDataRsSite : maxData = maxDataAll;
	
	chart02 = gfn_mkXYChart(chartData,{
		chartDivId : "chart02"
		,categoryName : "rcdNm"
		,cursor     : true
		,label      : true
		,cursor     : true
		,max        : maxData * 1.3
		,series : [
			{type:"col", valueKey:"all", name:"rcdNm" ,clusteredYn: true, padding : 10 , color:COLOR_ARR[5]}
			,{type:"col", valueKey:"rsSite", name:"rcdNm" ,clusteredYn: true, color: COLOR_ARR[0]}
		]
	});
}

//3번차트 생성
function fn_mkChart03(data){
	
	if(
	!data[0].msSpctPer
	&&!data[0].msDayPer
	&&!data[0].msWeekPer
	&&!data[0].msPlnPer
	&&!data[0].msBoSpctPer
	&&!data[0].msBoDayPer
	&&!data[0].msBoWeekPer
	&&!data[0].msBoPlnPer
	){
//		var html = "<p class='no-data01'>일시적인 서버 장애로 인해 <br>조회가 불가합니다. <br>잠시 후 다시 시도해 주십시오.</p>";
		$("#chart03").parent(".info").removeClass("w65").addClass("w100").next().hide();
		$("#chart03").empty().append(ERR_HTML_TYPE01);
		return;
	}else{
		$("#chart03").parent(".info").removeClass("w100").addClass("w65").next().show();
	}
	var chartData = [
        { rcdTyp : "R" , rcdNm : "실적" , ms : data[0].msSpctPer , boMs : data[0].msBoSpctPer }
       ,{ rcdTyp : "P" , rcdNm : "계획" , ms : data[0].msPlnPer  , boMs : data[0].msBoPlnPer }
       ,{ rcdTyp : "W" , rcdNm : "전주" , ms : data[0].msWeekPer , boMs : data[0].msBoWeekPer  }
       ,{ rcdTyp : "D" , rcdNm : "전일" , ms : data[0].msDayPer  , boMs : data[0].msBoDayPer }
	]
	
	var maxDataMs = 0;
	var maxDataBo = 0;
	for(var i in chartData){
		if(maxDataMs < chartData[i].ms) maxDataMs = chartData[i].ms;
		if(maxDataBo < chartData[i].boMs) maxDataBo = chartData[i].boMs;
	}
	var maxData = 0;
	maxDataMs < maxDataBo ? maxData = maxDataBo : maxData = maxDataMs;
	
	chart03 = gfn_mkXYChart(chartData,{
		chartDivId : "chart03"
		,categoryName : "rcdNm"
		,cursor     : true
		,label      : true
		,cursor     : true
		,max        : maxData * 1.3
		,series : [
			{type:"col", valueKey:"boMs", name:"rcdNm" ,clusteredYn: true, padding : 10 , color: COLOR_ARR[3]}
			,{type:"col", valueKey:"ms", name:"rcdNm" ,clusteredYn: true, color:COLOR_ARR[0]}
		]
	});
	
}

//4번차트 생성
function fn_mkChart04(data){

	if(
	  !data[0].atpSpctPer
	&&!data[0].atpDayPer
	&&!data[0].atpWeekPer
	&&!data[0].atpPlnPer
	
	&&!data[0].sppSpctPer
	&&!data[0].sppDayPer
	&&!data[0].sppWeekPer
	&&!data[0].sppPlnPer
	){
//		var html = "<p class='no-data01'>일시적인 서버 장애로 인해 <br>조회가 불가합니다. <br>잠시 후 다시 시도해 주십시오.</p>";
		$("#chart04").parent(".info").removeClass("w65").addClass("w100").next().hide();
		$("#chart04").empty().append(ERR_HTML_TYPE01);
		return;
	}else{
		$("#chart04").parent(".info").removeClass("w100").addClass("w65").next().show();
	}
		
	var chartData = [
        { rcdTyp : "R" , rcdNm : "실적" , atp : data[0].atpSpctPer , spp : data[0].sppSpctPer}
       ,{ rcdTyp : "P" , rcdNm : "계획" , atp : data[0].atpPlnPer  , spp : data[0].sppPlnPer }
       ,{ rcdTyp : "W" , rcdNm : "전주" , atp : data[0].atpWeekPer , spp : data[0].sppWeekPer  }
       ,{ rcdTyp : "D" , rcdNm : "전일" , atp : data[0].atpDayPer , spp : data[0].sppDayPer }
	]
	
	var maxDataAtp = 0;
	var maxDataSpp = 0;
	for(var i in chartData){
		if(maxDataAtp < chartData[i].atp) maxDataAtp = chartData[i].atp;
		if(maxDataSpp < chartData[i].spp) maxDataSpp = chartData[i].spp;
	}
	var maxData = 0;
	maxDataAtp < maxDataSpp ? maxData = maxDataSpp : maxData = maxDataAtp;
	
	chart04 = gfn_mkXYChart(chartData,{
		chartDivId : "chart04"
		,categoryName : "rcdNm"
		,cursor     : true
		,label      : true
		,cursor     : true
		,max        : maxData * 1.3
		,series : [
			 {type:"col",  valueKey:"atp", name:"rcdNm" ,clusteredYn: true, color: COLOR_ARR[0]}
			,{type:"line", valueKey:"spp", name:"rcdNm" ,clusteredYn: true, color: COLOR_ARR[3] ,tensionX : 0.7}
		]
	});
}

//Daily 관람객 전국 출력
function fn_bindRowDailyWtctmAll(data){
	$("#spctBox1").text("");
	$("#spctBox2").text("");
	$("#spctBox3").text("");
	$("#spctBox4").text("");
	$("#spctBox2small").text("");
	$("#spctBox3small").text("");
	$("#spctBox4small").text("");
	
	fn_flNullData(data);
	$("#spctBox1").text(gfn_numberFormat(data[0].boxSpctCnt)); //전국실적
	$("#spctBox2small").text(gfn_numberFormat(data[0].boxPlnCnt)); //전국계획
	$("#spctBox3small").text(gfn_numberFormat(data[0].boxWeekCnt)); //전국전주
	$("#spctBox4small").text(gfn_numberFormat(data[0].boxDayCnt)); //전국전일
	fn_getRedBlue($("#spctBox2"),data[0].boxPlnPer); //전국계획비
	fn_getFallGain($("#spctBox3"),data[0].boxWeekPer); //전국전주비 + 증감 출력
	fn_getFallGain($("#spctBox4"),data[0].boxDayPer); //전국전일비 + 증감 출력
	if(data[0].boxPlnPer != "-") $("#spctBox2").text( fn_getPercentFormat($("#spctBox2").text()) );
	if(data[0].boxWeekPer != "-") $("#spctBox3").text( fn_getPercentFormat($("#spctBox3").text()) );
	if(data[0].boxDayPer != "-") $("#spctBox4").text( fn_getPercentFormat($("#spctBox4").text()) );
}

//Daily 관람객 출력
function fn_bindRowDailyWtctm(data){
	$("#spctCgv1").text("");
	$("#spctCgv2").text("");
	$("#spctCgv3").text("");
	$("#spctCgv4").text("");
	$("#spctCgv2small").text("");
	$("#spctCgv3small").text("");
	$("#spctCgv4small").text("");
	
	fn_flNullData(data);
	$("#spctCgv1").text(gfn_numberFormat(data[0].cgvSpctCnt)); //관람객실적
	$("#spctCgv2small").text(gfn_numberFormat(data[0].cgvPlnCnt)); //관람객계획
	$("#spctCgv3small").text(gfn_numberFormat(data[0].cgvWeekCnt)); //관람객전주
	$("#spctCgv4small").text(gfn_numberFormat(data[0].cgvDayCnt)); //관람객전일
	fn_getRedBlue($("#spctCgv2"),data[0].cgvPlnPer); //관람객계획비
	fn_getFallGain($("#spctCgv3"),data[0].cgvWeekPer); //관람객전주비 + 증감 출력
	fn_getFallGain($("#spctCgv4"),data[0].cgvDayPer); //관람객전일비 + 증감 출력
	if(data[0].cgvPlnPer != "-") $("#spctCgv2").text( fn_getPercentFormat($("#spctCgv2").text()) );
	if(data[0].cgvWeekPer != "-") $("#spctCgv3").text( fn_getPercentFormat($("#spctCgv3").text()) );
	if(data[0].cgvDayPer != "-") $("#spctCgv4").text( fn_getPercentFormat($("#spctCgv4").text()) );
}

//Daily MS 관객 출력
function fn_bindRowDailyMSSpct(data){
	$("#msSpct1").text("");
	$("#msSpct2").text("");
	$("#msSpct3").text("");
	$("#msSpct4").text("");
	$("#msSpct2small").text("");
	$("#msSpct3small").text("");
	$("#msSpct4small").text("");
	
	fn_flNullData(data);
	$("#msSpct1").text(fn_getPercentFixed2( data[0].msSpctPer )); //MS관객
	$("#msSpct2small").text(fn_getPercentFixed2( data[0].msPlnPer )); //MS계획
	$("#msSpct3small").text(fn_getPercentFixed2( data[0].msWeekPer )); //MS전주
	$("#msSpct4small").text(fn_getPercentFixed2( data[0].msDayPer )); //MS전일
	fn_getFallGain($("#msSpct2"),data[0].msPlnDfPer); //MS계획비 + 증감 출력
	fn_getFallGain($("#msSpct3"),data[0].msWeekDfPer); //MS전주비 + 증감 출력
	fn_getFallGain($("#msSpct4"),data[0].msDayDfPer); //MS전주비 + 증감 출력
	if(data[0].msPlnDfPer != "-") $("#msSpct2").text( fn_getPercentPointFixed2($("#msSpct2").text()) );
	if(data[0].msWeekDfPer != "-") $("#msSpct3").text( fn_getPercentPointFixed2($("#msSpct3").text()) );
	if(data[0].msDayDfPer != "-") $("#msSpct4").text( fn_getPercentPointFixed2($("#msSpct4").text()) );
}

//Daily MS BO 출력
function fn_bindRowDailyMSBO(data){
	$("#msBo1").text("");
	$("#msBo2").text("");
	$("#msBo3").text("");
	$("#msBo4").text("");
	$("#msBo2small").text("");
	$("#msBo3small").text("");
	$("#msBo4small").text("");
	
	fn_flNullData(data);
	$("#msBo1").text(fn_getPercentFixed2(data[0].msBoSpctPer )); //BO관객
	$("#msBo2small").text(fn_getPercentFixed2( data[0].msBoPlnPer )); //BO계획
	$("#msBo3small").text(fn_getPercentFixed2( data[0].msBoWeekPer )); //BO전주
	$("#msBo4small").text(fn_getPercentFixed2( data[0].msBoDayPer )); //BO전일
	fn_getFallGain($("#msBo2"),data[0].msBoPlnDfPer); //BO계획차 + 증감 출력
	fn_getFallGain($("#msBo3"),data[0].msBoWeekDfPer); //BO전주차 + 증감 출력
	fn_getFallGain($("#msBo4"),data[0].msBoDayDfPer); //BO전일차 + 증감 출력
	if(data[0].msBoPlnDfPer != "-") $("#msBo2").text( fn_getPercentPointFixed2($("#msBo2").text()) );
	if(data[0].msBoWeekDfPer != "-") $("#msBo3").text( fn_getPercentPointFixed2($("#msBo3").text()) );
	if(data[0].msBoDayDfPer != "-") $("#msBo4").text( fn_getPercentPointFixed2($("#msBo4").text()) );
}

//Daily 주요지표 ATP 출력
function fn_bindRowDailyATP(data){
	$("#atp1").text("");
	$("#atp2").text("");
	$("#atp3").text("");
	$("#atp4").text("");
	$("#atp2small").text("");
	$("#atp3small").text("");
	$("#atp4small").text("");
	
	fn_flNullData(data);
	$("#atp1").text(gfn_numberFormat(data[0].atpSpctPer)); //ATP관객
	$("#atp2small").text(gfn_numberFormat(data[0].atpPlnPer)); //ATP계획
	$("#atp3small").text(gfn_numberFormat(data[0].atpWeekPer)); //ATP전주
	$("#atp4small").text(gfn_numberFormat(data[0].atpDayPer)); //ATP전일
	fn_getFallGain($("#atp2"),data[0].atpPlnDfPer); //ATP계획차 + 증감 출력
	fn_getFallGain($("#atp3"),data[0].atpWeekDfPer); //ATP전주차 + 증감 출력
	fn_getFallGain($("#atp4"),data[0].atpDayDfPer); //ATP전일차 + 증감 출력
}

//Daily 주요지표 SPP 출력
function fn_bindRowDailySPP(data){
	$("#spp1").text("");
	$("#spp2").text("");
	$("#spp3").text("");
	$("#spp4").text("");
	$("#spp2small").text("");
	$("#spp3small").text("");
	$("#spp4small").text("");
	
	fn_flNullData(data);
	$("#spp1").text(gfn_numberFormat(data[0].sppSpctPer)); //SPP관객
	$("#spp2small").text(gfn_numberFormat(data[0].sppPlnPer)); //SPP계획
	$("#spp3small").text(gfn_numberFormat(data[0].sppWeekPer)); //SPP전주
	$("#spp4small").text(gfn_numberFormat(data[0].sppDayPer)); //SPP전일
	fn_getFallGain($("#spp2"),data[0].sppPlnDfPer); //SPP계획차 + 증감 출력
	fn_getFallGain($("#spp3"),data[0].sppWeekDfPer); //SPP전주차 + 증감 출력
	fn_getFallGain($("#spp4"),data[0].sppDayDfPer); //SPP전일차 + 증감 출력
}

//Daily 주요지표 객석률 출력
function fn_bindRowDailyBktPer(data){
	$("#bkt1").text("");
	$("#bkt3").text("");
	$("#bkt4").text("");
	$("#bkt3small").text("");
	$("#bkt4small").text("");
	
	fn_flNullData(data);
	$("#bkt1").text(fn_getPercentFormat( data[0].bktSpctPer )); //객석률
	$("#bkt3small").text(fn_getPercentFormat( data[0].bktWeekPer )); //전주
	$("#bkt4small").text(fn_getPercentFormat( data[0].bktDayPer )); //전일
	fn_getFallGain($("#bkt3"),data[0].bktWeekDfPer); //전주차
	fn_getFallGain($("#bkt4"),data[0].bktDayDfPer); //전일차
	if(data[0].bktWeekDfPer != "-") $("#bkt3").text( fn_getPercentPointFormat( $("#bkt3").text() ) );
	if(data[0].bktDayDfPer != "-") $("#bkt4").text( fn_getPercentPointFormat( $("#bkt4").text() ) );
}

//Daily 주요지표 ATP+SPP 출력
function fn_bindRowDailyAtpSpp(data){
	$("#atpSpp1").text("");
	$("#atpSpp2").text("");
	$("#atpSpp3").text("");
	$("#atpSpp4").text("");
	$("#atpSpp2small").text("");
	$("#atpSpp3small").text("");
	$("#atpSpp4small").text("");
	
	fn_flNullData(data);
	$("#atpSpp1").text(gfn_numberFormat(data[0].atpSppSpctPer)); //ATP+SPP관객
	$("#atpSpp2small").text(gfn_numberFormat(data[0].atpSppPlnPer)); //ATP+SPP계획
	$("#atpSpp3small").text(gfn_numberFormat(data[0].atpSppWeekPer)); //ATP+SPP전주
	$("#atpSpp4small").text(gfn_numberFormat(data[0].atpSppDayPer)); //ATP+SPP전일
	fn_getFallGain($("#atpSpp2"),data[0].atpSppPlnDfPer); //ATP+SPP계획차 + 증감 출력
	fn_getFallGain($("#atpSpp3"),data[0].atpSppWeekDfPer); //ATP+SPP전주차 + 증감 출력
	fn_getFallGain($("#atpSpp4"),data[0].atpSppDayDfPer); //ATP+SPP전일차 + 증감 출력
}

//Summary 영화별
function fn_getDailyWtctmMov(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.frCnt = movFrCnt;
	params.toCnt = movToCnt;

	transaction({
		url : '/result/getDailyWtctmMov.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("영화별",result);
			fn_mkRow1(result);
		}else{
			console.log(e);
		}
	});
}

////Summary 회차별
//function fn_getDailyWtctmSeq(){
//	var params = {};
//	params.srchType = rsSiteType;
//	params.srchValue = rsSiteCd;
//	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
//
//	transaction({
//		url : '/result/getDailyWtctmSeq.do'
//		,params : params
//	},function(result,e){
//		if(!e){
//			console.log("회차별",result);
//			fn_mkRow4(result);
//		}else{
//			console.log(e);
//		}
//	});
//}

////Summary 포맷별
//function fn_getDailyWtctmFormat(){
//	var params = {};
//	params.srchType = rsSiteType;
//	params.srchValue = rsSiteCd;
//	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
//
//	transaction({
//		url : '/result/getDailyWtctmFormat.do'
//		,params : params
//	},function(result,e){
//		if(!e){
//			console.log("포맷별",result);
//			fn_mkRow3(result);
//		}else{
//			console.log(e);
//		}
//	});
//}

//summary > RS/SITE 별
function fn_getDailyWtctmRsSite(type){
	var params = {};
	params.srchType  = type;
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	transaction({
		url : '/result/getDailyWtctmRsSite.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("RS/SITE 별",result);
			fn_mkRow3(result,type);
		}else{
//			console.log(e);
		}
	});
}

//Summary 상영관별
function fn_getDailyWtctmScn(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");

	transaction({
		url : '/result/getDailyWtctmScn.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("상영관별",result);
			fn_mkRow2(result);
		}else{
			console.log(e);
		}
	});
}

//영화별 그리드 출력
function fn_mkRow1(result){
	if(movFrCnt == 1) $("#tblContent1 tbody").empty();

	var tblLength = $("#tblContent1 tbody tr").length;
	if(result.wtctmMov.length == 0){
		if(tblLength == 0){
			$("#tblContent1 tbody").empty();
			fn_displayEmptyText("tblContent1"); //데이터가 없습니다 처리
			$("#moreBtn1").hide();
			return false;
		}else{
			$("#moreBtn1").hide();
		}
	}else if(result.wtctmMov.length < 10){
		$("#moreBtn1").hide();
	}
	
	var content = "";
	var totData = result.wtctmMovTot;
	if(tblLength == 0){
		for(var i in totData){
			var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
			var seatCnt 	= totData[i].seatCnt 	? gfn_numberFormat(totData[i].seatCnt) : "-";
			var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
			var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
			var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
			
			//추가 2019.11.11
			var msGap 		= totData[i].msGap  	? totData[i].msGap.toFixed(2)+"%" : "-";
			var bktMs 		= totData[i].bktMs  	? totData[i].bktMs.toFixed(2)+"%" : "-";
			var seatMs 		= totData[i].seatMs  	? totData[i].seatMs.toFixed(2)+"%" : "-";
			
			//추가 2019.11.22
			var wgtGap 		= fn_getPercentFormat(totData[i].wgtGap);
			
			content += "<tr class='total'>";
			content += "<td><strong>총계</strong></td>";
			
			content += "<td data-colNm='bkt' data-toggle='1' >"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
			content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+bktQty+"<span class='s-font f-color04'>"+bktMs+"</span></td>"; //관람객,MS
			
//			content += "<td data-colNm='seat' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
//			content += "<td data-colNm='seat'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
			content += "<td data-colNm='bkt' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
			content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
			
//			content += "<td>"+msGap+"</td>"; //GAP
			content += "<td data-colNm='bkt' data-toggle='1' >"+wgtGap+"</td>"; //비중GAP
			content += "<td data-colNm='bkt' data-toggle='2' style='display:none;'>"+msGap+"</td>"; //GAP
			
			content += "<td>"+bktPer+"</td>"; //객석률
			content += "</tr>";
		}
	}
	var data = result.wtctmMov;
	for(var i in data){
		var movNm 		= data[i].movNm 	? data[i].rn + ". " + data[i].movNm : "-";
		var movKnd 		= data[i].movKnd 	? data[i].movKnd : "-";
		var bktQty 		= data[i].bktQty 	? gfn_numberFormat(data[i].bktQty) : "-";
		var seatCnt 	= data[i].seatCnt 	? gfn_numberFormat(data[i].seatCnt) : "-";
		var bktWgt 		= data[i].bktWgt 	? data[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= data[i].seatWgt 	? data[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= data[i].bktPer 	? data[i].bktPer.toFixed(1)+"%" : "-";
		var movPrntCd 	= data[i].movPrntCd;
		
		var msGap 		= data[i].msGap  	? data[i].msGap.toFixed(2)+"%" : "-";
		var bktMs 		= data[i].bktMs  	? data[i].bktMs.toFixed(2)+"%" : "-";
		var seatMs 		= data[i].seatMs  	? data[i].seatMs.toFixed(2)+"%" : "-";
		
		//추가 2019.11.22
		var wgtGap 		= fn_getPercentFormat(data[i].wgtGap);
		
		var clickEvnt = "";
		var tdClassNm = "";
		var trClassNm = "";
		var firstCol  = "";
		if(data[i].rnKnd == "0"){
			clickEvnt = "onclick=fn_getDetail("+movPrntCd+")";
			trClassNm = "";
			tdClassNm = "movie-name";
			firstCol = movNm;
		}else if(data[i].rnKnd == "1"){
			clickEvnt = "";
			trClassNm = "f-color03";
			tdClassNm = "down";
			firstCol = movKnd;
		}
		
		content += "<tr class='"+trClassNm+"' >";
		content += "<td class='"+tdClassNm+"' title>"+firstCol+"</td>"; //영화명
		content += "<td data-colNm='bkt'  data-toggle='1' "+clickEvnt+">"+ bktQty  + "<span class='s-font f-color04'>"+bktWgt+"</spna></td>";
		content += "<td data-colNm='bkt'   data-toggle='2' "+clickEvnt+ " style='display:none;'>"+ bktQty  + "<span class='s-font f-color04'>"+bktMs+"</spna></td>";
//		content += "<td data-colNm='seat' data-toggle='1' "+clickEvnt+">"+ seatCnt + "<span class='s-font f-color04'>"+seatWgt+"</spna></td>";
//		content += "<td data-colNm='seat'  data-toggle='2' "+clickEvnt+ " style='display:none;'>"+ seatCnt + "<span class='s-font f-color04'>"+seatMs+"</spna></td>";
		content += "<td data-colNm='bkt' data-toggle='1' "+clickEvnt+">"+ seatCnt + "<span class='s-font f-color04'>"+seatWgt+"</spna></td>";
		content += "<td data-colNm='bkt'  data-toggle='2' "+clickEvnt+ " style='display:none;'>"+ seatCnt + "<span class='s-font f-color04'>"+seatMs+"</spna></td>";
//		content += "<td "+clickEvnt+">"+ msGap   + "</td>";
		content += "<td "+clickEvnt+" data-colNm='bkt' data-toggle='1' >"+wgtGap+"</td>"; //비중GAP
		content += "<td "+clickEvnt+" data-colNm='bkt' data-toggle='2' style='display:none;'>"+msGap+"</td>"; //GAP
		
		content += "<td "+clickEvnt+">"+ bktPer  + "</td>";
		content += "</tr>";
		
	}
	
	$("#tblContent1 tbody").append(content);
}

/*//회차별 그리드 출력
function fn_mkRow4(result){
	
	if(result.wtctmSeq.length == 0){
		fn_displayEmptyText("tblContent2"); //데이터가 없습니다 처리
		return false;
	}

	var content = "";
	var totData = result.wtctmSeqTot;
	for(var i in totData){
		var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
		var seatCnt 	= totData[i].seatCnt 	? gfn_numberFormat(totData[i].seatCnt) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
		
		//추가 2019.11.11
		var msGap 		= totData[i].msGap  	? totData[i].msGap.toFixed(1)+"%" : "-";
		var bktMs 		= totData[i].bktMs  	? totData[i].bktMs.toFixed(1)+"%" : "-";
		var seatMs 		= totData[i].seatMs  	? totData[i].seatMs.toFixed(1)+"%" : "-";

		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td data-colNm='bkt' data-toggle='1' >"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+bktQty+"<span class='s-font f-color04'>"+bktMs+"</span></td>"; //관람객,관람비중
		
		content += "<td data-colNm='seat' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td data-colNm='seat'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,관람비중
		
		content += "<td>"+msGap+"</td>"; //GAP
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	var data = result.wtctmSeq;
	for(var i in data){
		var scnSeq 		= data[i].scnSeq 	? data[i].scnSeq : "0";
		var bktQty 		= data[i].bktQty 	? gfn_numberFormat(data[i].bktQty) : "-";
		var seatCnt 	= data[i].seatCnt 	? gfn_numberFormat(data[i].seatCnt) : "-";
		var bktWgt 		= data[i].bktWgt 	? data[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= data[i].seatWgt 	? data[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= data[i].bktPer 	? data[i].bktPer.toFixed(1)+"%" : "-";
		
		//추가 2019.11.11
		var msGap 		= totData[i].msGap  	? totData[i].msGap.toFixed(1)+"%" : "-";
		var bktMs 		= totData[i].bktMs  	? totData[i].bktMs.toFixed(1)+"%" : "-";
		var seatMs 		= totData[i].seatMs  	? totData[i].seatMs.toFixed(1)+"%" : "-";
		
		
		content += "<tr>";
		content += "<td title>"+scnSeq+"회차</td>"; //회차
		content += "<td>"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td>"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	$("#tblContent2 tbody").empty().append(content);
}

//포맷별 그리드 출력
function fn_mkRow3(result,type){
	var tblId,col1,col2,col3,col4;
	if(type == "rs"){
		tblId = "tblContent3";
	}else if(type == "site"){
		tblId = "tblContent4";
	}
	
	if(result.wtctmRsSite.length == 0){
		fn_displayEmptyText(tblId); //데이터가 없습니다 처리
		return false;
	}
		
	var content = "";
	var totData = result.wtctmRsSiteTot;
	for(var i in totData){
		var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";

		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td>"+bktWgt+"</td>"; //점유율
		content += "<td>"+bktQty+"</td>"; //관람객
		content += "</tr>";
	}
	
	var data = result.wtctmRsSite;
	for(var i in data){
		var movKnd 		= data[i].movKnd 	? data[i].movKnd : "-";
		var spctCnt 	= data[i].spctCnt 	? gfn_numberFormat(data[i].spctCnt) : "-";
		var spctWgt 	= data[i].spctWgt 	? data[i].spctWgt.toFixed(1)+"%" : "-";
		content += "<tr>";
		content += "<td>"+movKnd+"</td>"; //포맷
		content += "<td>"+spctWgt+"</td>"; //점유율
		content += "<td>"+spctCnt+"</span></td>"; //관람객
		content += "</tr>";
	}
	$("#"+tblId).find("tbody").empty().append(content);
}*/

//상영관별 그리드 출력
function fn_mkRow2(result){
	if(result.wtctmScn.length == 0){
		fn_displayEmptyText("tblContent2"); //데이터가 없습니다 처리
		return false;
	}
	
	var content = "";
	var totData = result.wtctmScnTot;
	for(var i in totData){
		var bktQty 		= totData[i].bktQty 	? gfn_numberFormat(totData[i].bktQty) : "-";
		var seatCnt 	= totData[i].seatCnt 	? gfn_numberFormat(totData[i].seatCnt) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
		//추가 2019.11.11
		var msGap 		= totData[i].msGap  	? totData[i].msGap.toFixed(2)+"%" : "-";
		var spctMs 		= totData[i].spctMs  	? totData[i].spctMs.toFixed(2)+"%" : "-";
		var seatMs 		= totData[i].seatMs  	? totData[i].seatMs.toFixed(2)+"%" : "-";

		//추가 2019.11.22
		var wgtGap 		= fn_getPercentFormat(totData[i].wgtGap);

		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td data-colNm='bkt' data-toggle='1' >"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+bktQty+"<span class='s-font f-color04'>"+spctMs+"</span></td>"; //관람객,MS
//		content += "<td data-colNm='seat' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
//		content += "<td data-colNm='seat'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
		content += "<td data-colNm='bkt' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
//		content += "<td>"+msGap+"</td>"; //GAP
		content += "<td data-colNm='bkt' data-toggle='1' >"+wgtGap+"</td>"; //비중GAP
		content += "<td data-colNm='bkt' data-toggle='2' style='display:none;'>"+msGap+"</td>"; //GAP
		
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	var data = result.wtctmScn;
	for(var i in data){
		var commCdNm 	= data[i].commCdNm 	? data[i].commCdNm : "-";
		var spctCnt 	= data[i].spctCnt 	? gfn_numberFormat(data[i].spctCnt) : "-";
		var seatCnt 	= data[i].seatCnt 	? gfn_numberFormat(data[i].seatCnt) : "-";
		var spctWgt 	= data[i].spctWgt 	? data[i].spctWgt.toFixed(1)+"%" : "-";
		var seatWgt 	= data[i].seatWgt 	? data[i].seatWgt.toFixed(1)+"%" : "-";
		var seatRt 		= data[i].seatRt 	? data[i].seatRt.toFixed(1)+"%" : "-";
		//추가 2019.11.11
		var msGap 		= data[i].msGap  	? data[i].msGap.toFixed(2)+"%" : "-";
		var spctMs 		= data[i].spctMs  	? data[i].spctMs.toFixed(2)+"%" : "-";
		var seatMs 		= data[i].seatMs  	? data[i].seatMs.toFixed(2)+"%" : "-";
		
		//추가 2019.11.22
		var wgtGap 		= fn_getPercentFormat(data[i].wgtGap);
		
		content += "<tr>";
		content += "<td>"+commCdNm+"</td>"; //상영관
		content += "<td data-colNm='bkt' data-toggle='1' >"+spctCnt+"<span class='s-font f-color04'>"+spctWgt+"</span></td>"; //관람객,관람비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+spctCnt+"<span class='s-font f-color04'>"+spctMs+"</span></td>"; //관람객,MS
//		content += "<td data-colNm='seat' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
//		content += "<td data-colNm='seat'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
		content += "<td data-colNm='bkt' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
//		content += "<td>"+msGap+"</td>"; //GAP
		content += "<td data-colNm='bkt' data-toggle='1' >"+wgtGap+"</td>"; //비중GAP
		content += "<td data-colNm='bkt' data-toggle='2' style='display:none;'>"+msGap+"</td>"; //GAP
		
		content += "<td>"+seatRt+"</td>"; //객석률
		content += "</tr>";
	}
	
	$("#tblContent2 tbody").empty().append(content);
}

//RS/SITE 별 그리드
function fn_mkRow3(result,type){
	var tblId ;
	if(type == "rs") tblId = "tblContent3";
	else if(type == "site") tblId = "tblContent4";
	
	if(result.wtctmRsSite.length == 0){
		fn_displayEmptyText(tblId); //데이터가 없습니다 처리
		return false;
	}	
	
	var content = "";
	var totData = result.wtctmRsSiteTot;
	for(var i in totData){

		var bktQty 		= totData[i].cgvSpctCnt ? gfn_numberFormat(totData[i].cgvSpctCnt) : "-";
		var bktWgt 		= totData[i].bktWgt 	? totData[i].bktWgt.toFixed(1)+"%" : "-";
		var seatCnt 	= totData[i].cgvTotCnt 	? gfn_numberFormat(totData[i].cgvTotCnt) : "-";
		var seatWgt 	= totData[i].seatWgt 	? totData[i].seatWgt.toFixed(1)+"%" : "-";
		var bktPer 		= totData[i].bktPer 	? totData[i].bktPer.toFixed(1)+"%" : "-";
		//추가 2019.11.11
		var msGap 		= totData[i].msGap  	? totData[i].msGap.toFixed(2)+"%" : "-";
		var bktMs 		= totData[i].bktMs  	? totData[i].bktMs.toFixed(2)+"%" : "-";
		var seatMs 		= totData[i].seatMs  	? totData[i].seatMs.toFixed(2)+"%" : "-";
		
		//추가 2019.11.22
		var wgtGap 		= fn_getPercentFormat(totData[i].wgtGap);

		content += "<tr class='total'>";
		content += "<td><strong>총계</strong></td>";
		content += "<td data-colNm='bkt' data-toggle='1' >"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+bktQty+"<span class='s-font f-color04'>"+bktMs+"</span></td>"; //관람객,MS
//		content += "<td data-colNm='seat' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
//		content += "<td data-colNm='seat'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
		content += "<td data-colNm='bkt' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
//		content += "<td>"+msGap+"</td>"; //GAP
		content += "<td data-colNm='bkt' data-toggle='1' >"+wgtGap+"</td>"; //비중GAP
		content += "<td data-colNm='bkt' data-toggle='2' style='display:none;'>"+msGap+"</td>"; //GAP
		
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	
	var data = result.wtctmRsSite;
	for(var i in data){
		var cd 	= data[i].cd 	? data[i].cd : "-";
		var nm 	= data[i].nm 	? data[i].nm : "-";
		
		//관람객
		var bktQty 		= data[i].cgvSpctCnt ? gfn_numberFormat(data[i].cgvSpctCnt) : "-";
		//관람객 비중
		var bktWgt 		= data[i].bktWgt 	 ? data[i].bktWgt.toFixed(1)+"%" : "-";
		//좌석수
		var seatCnt 	= data[i].cgvTotCnt  ? gfn_numberFormat(data[i].cgvTotCnt) : "-";
		//좌석비중
		var seatWgt 	= data[i].seatWgt 	 ? data[i].seatWgt.toFixed(1)+"%" : "-";
		//객석률
		var bktPer 		= data[i].bktPer 	 ? data[i].bktPer.toFixed(1)+"%" : "-";
		//추가 2019.11.11
		var msGap 		= data[i].msGap  	 ? data[i].msGap.toFixed(2)+"%" : "-";
		var bktMs 		= data[i].bktMs  	 ? data[i].bktMs.toFixed(2)+"%" : "-";
		var seatMs 		= data[i].seatMs  	 ? data[i].seatMs.toFixed(2)+"%" : "-";
		//추가 2019.11.22
		var wgtGap 		= fn_getPercentFormat(data[i].wgtGap);
		
		content += "<tr>";
		content += "<td data-cd='"+cd+"'>"+gfn_removeCGVTxt( nm )+"</td>"; //RSSITE
		content += "<td data-colNm='bkt' data-toggle='1' >"+bktQty+"<span class='s-font f-color04'>"+bktWgt+"</span></td>"; //관람객,관람비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+bktQty+"<span class='s-font f-color04'>"+bktMs+"</span></td>"; //관람객,MS
//		content += "<td data-colNm='seat' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
//		content += "<td data-colNm='seat'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
		content += "<td data-colNm='bkt' data-toggle='1' >"+seatCnt+"<span class='s-font f-color04'>"+seatWgt+"</span></td>"; //좌석수,좌석비중
		content += "<td data-colNm='bkt'  data-toggle='2' style='display:none;'>"+seatCnt+"<span class='s-font f-color04'>"+seatMs+"</span></td>"; //관람객,MS
//		content += "<td>"+msGap+"</td>"; //GAP
		content += "<td data-colNm='bkt' data-toggle='1' >"+wgtGap+"</td>"; //비중GAP
		content += "<td data-colNm='bkt' data-toggle='2' style='display:none;'>"+msGap+"</td>"; //GAP
		
		content += "<td>"+bktPer+"</td>"; //객석률
		content += "</tr>";
	}
	$("#"+tblId+" tbody").empty().append(content);
}

//스와이퍼 우측 데이터 바인딩
function fn_bindDataInSwiper(data){
	console.log("fn_bindDataInSwiper",data);
	$("#ms").text(   data.smryData[0].msSpctPer    );
	$("#boMs").text( data.smryData[0].msBoSpctPer  );
	$("#atp").text(  gfn_numberFormat(data.smryData[0].atpSpctPer) );
	$("#spp").text(  gfn_numberFormat(data.smryData[0].sppSpctPer) );
	if(data.smryData[0].msSpctPer != "-") 		$("#ms").text(   Number(data.smryData[0].msSpctPer).toFixed(2)    );
	if(data.smryData[0].msBoSpctPer != "-")		$("#boMs").text( Number(data.smryData[0].msBoSpctPer).toFixed(2)    );
	
	fn_getRedBlue($("#wtctmPlnPer"),data.smryData[0].cgvPlnPer);
	fn_getFallGain($("#wtctmWeekPer"),data.smryData[0].cgvWeekPer);
	fn_getFallGain($("#wtctmDayPer"),data.smryData[0].cgvDayPer);
	$("#wtctmSpctCnt").text(gfn_numberFormat(data.smryData[0].cgvSpctCnt));
	if(data.smryData[0].cgvPlnPer != "-") $("#wtctmPlnPer").text( fn_getPercentFormat( $("#wtctmPlnPer").text() ) );
	if(data.smryData[0].cgvWeekPer != "-") $("#wtctmWeekPer").text( fn_getPercentFormat( $("#wtctmWeekPer").text() ) );
	if(data.smryData[0].cgvDayPer != "-") $("#wtctmDayPer").text( fn_getPercentFormat( $("#wtctmDayPer").text() ) );
	
	fn_getFallGain($("#msSpctDfPln")  ,data.smryData[0].msPlnDfPer);
	fn_getFallGain($("#msWeekDfPln")  ,data.smryData[0].msWeekDfPer);
	fn_getFallGain($("#msDayDfPln")   ,data.smryData[0].msDayDfPer);
	fn_getFallGain($("#boMsSpctDfPln"),data.smryData[0].msBoPlnDfPer);
	fn_getFallGain($("#boMsWeekDfPln"),data.smryData[0].msBoWeekDfPer);
	fn_getFallGain($("#boMsDayDfPln") ,data.smryData[0].msBoDayDfPer);
	if(data.smryData[0].msPlnDfPer != "-") 		$("#msSpctDfPln").text( fn_getPercentPointFixed2( $("#msSpctDfPln").text() ) );
	if(data.smryData[0].msWeekDfPer != "-") 	$("#msWeekDfPln").text( fn_getPercentPointFixed2( $("#msWeekDfPln").text() ) );
	if(data.smryData[0].msDayDfPer != "-") 		$("#msDayDfPln").text( fn_getPercentPointFixed2( $("#msDayDfPln").text() ) );
	if(data.smryData[0].msBoPlnDfPer != "-") 	$("#boMsSpctDfPln").text( fn_getPercentPointFixed2( $("#boMsSpctDfPln").text() ) );
	if(data.smryData[0].msBoWeekDfPer != "-") 	$("#boMsWeekDfPln").text( fn_getPercentPointFixed2( $("#boMsWeekDfPln").text() ) );
	if(data.smryData[0].msBoDayDfPer != "-") 	$("#boMsDayDfPln").text( fn_getPercentPointFixed2( $("#boMsDayDfPln").text() ) );
	
	fn_getFallGain($("#atpPlnDfPer") ,data.smryData[0].atpPlnDfPer);
	fn_getFallGain($("#atpWeekDfPer") ,data.smryData[0].atpWeekDfPer);
	fn_getFallGain($("#atpDayDfPer") ,data.smryData[0].atpDayDfPer);
	fn_getFallGain($("#sppPlnDfPer") ,data.smryData[0].sppPlnDfPer);
	fn_getFallGain($("#sppWeekDfPer") ,data.smryData[0].sppWeekDfPer);
	fn_getFallGain($("#sppDayDfPer") ,data.smryData[0].sppDayDfPer);
	
	$("#fnbSppSpctPer").text( gfn_numberFormat(data.smryData[0].sppSpctPer) ); //SPP
	$("#fnbAspSpctPer").text( gfn_numberFormat(data.smryData[0].aspSpctPer) ); //ASP
	$("#fnbTotAmt").text( gfn_numberFormat(data.smryData[0].fnbTotAmt) ); //매점매출
	$("#fnbSrSpctPer").text( data.smryData[0].srSpctPer ); //SR
	$("#fnbCobSpctPer").text( data.smryData[0].cobSpctPer ); //콤보비중
	fn_getFallGain($("#fnbSppPlnDfPer")  ,data.smryData[0].sppPlnDfPer); //spp 차
	$("#fnbSppPlnDfBox").removeClass("gain-box fall-box");
	if(data.smryData[0].sppPlnDfPer != "-"){ 
		if(data.smryData[0].sppPlnDfPer > 0){
			$("#fnbSppPlnDfBox").addClass("gain-box");
		}else{
			$("#fnbSppPlnDfBox").addClass("fall-box");
		}
	}else{
		$("#fnbSppPlnDfBox").addClass("gain-box");
	}
	if(data.smryData[0].srSpctPer != "-")  $("#fnbSrSpctPer").text( Number(data.smryData[0].srSpctPer).toFixed(1) ); //SR
	if(data.smryData[0].cobSpctPer != "-") $("#fnbCobSpctPer").text( Number(data.smryData[0].cobSpctPer).toFixed(1) ); //콤보비중
}

function fn_bindRowDailyCgv(data){
	$("#spctCgv1").text("");
	$("#spctCgv2").text("");
	$("#spctCgv3").text("");
	$("#spctCgv4").text("");
	$("#spctCgv2small").text("");
	$("#spctCgv3small").text("");
	$("#spctCgv4small").text("");
	
	fn_flNullData(data);
	$("#spctCgv1").text(gfn_numberFormat(data[0].cgvSpctCnt)); //관람객실적
	$("#spctCgv2small").text(gfn_numberFormat(data[0].cgvPlnCnt)); //관람객계획
	$("#spctCgv3small").text(gfn_numberFormat(data[0].cgvWeekCnt)); //관람객전주
	$("#spctCgv4small").text(gfn_numberFormat(data[0].cgvDayCnt)); //관람객전일
	fn_getFallGain($("#spctCgv2"),data[0].cgvPlnPer); //관람객계획비 + 증감 출력
	fn_getFallGain($("#spctCgv3"),data[0].cgvWeekPer); //관람객전주비 + 증감 출력
	fn_getFallGain($("#spctCgv4"),data[0].cgvDayPer); //관람객전일비 + 증감 출력
	if(data[0].cgvPlnPer != "-") $("#spctCgv2").text( fn_getPercentFormat($("#spctCgv2").text()) );
	if(data[0].cgvWeekPer != "-") $("#spctCgv3").text( fn_getPercentFormat($("#spctCgv3").text()) );
	if(data[0].cgvDayPer != "-") $("#spctCgv4").text( fn_getPercentFormat($("#spctCgv4").text()) );
}


//증감 출력
function fn_getFallGain(childEl, per){
	childEl.parent().removeClass("gain fall");
	if(per != "-"){
		if(per > 0){
			childEl.parent().addClass("gain");
			childEl.text( gfn_numberFormat(Math.abs(per)) );
		}else{
			childEl.parent().addClass("fall");
			childEl.text( gfn_numberFormat(Math.abs(per)) );
		}
	}else{
		childEl.text("-");
	}
}

//수치 100 대비 화살표 없는 증감 출력
function fn_getRedBlue(childEl, per){
	childEl.parent().removeClass("f-color01 f-color02");
	if(per != "-"){
		if(per > 100){
			childEl.parent().addClass("f-color01");
			childEl.text( gfn_numberFormat(Math.abs(per)) );
		}else{
			childEl.parent().addClass("f-color02");
			childEl.text( gfn_numberFormat(Math.abs(per)) );
		}
	}else{
		childEl.text("-");
	}
}

//퍼센트 붙이기
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

//퍼센트p 붙이기
function fn_getPercentPointFormat(data){
	var dataConv = data.toString().replace(/,/gi,"");
	if(data != "-"){
		return gfn_numberFormat( Number(dataConv).toFixed(1) )+"%p";
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

//토글버튼 이벤트
function fn_toggleTh(toggle){
	var nowTgl = $(toggle);
	var nowTglColNm = nowTgl.attr("data-colNm");
	var nowTglDataType = nowTgl.attr("data-toggle");
	
	var chgTgl = $(toggle).siblings().not("[data-toggle='"+nowTglDataType+"']");
	var chgTglColNm = chgTgl.attr("data-colNm");
	var chgTglDataType = chgTgl.attr("data-toggle");
	
	var targetTable = $(toggle).parents("table");
	
	targetTable.find("[data-colNm='"+nowTglColNm+"']").each(function(i,item){
		if($(item).attr("data-toggle") == nowTglDataType) $(item).hide();
		else $(item).show();
	});
}

//데이터가 없습니다 표기
function fn_displayEmptyText(tblId){
	console.log("tblId",tblId);
	console.log("tblEl",$("#"+tblId))
	var colCnt = $("#"+tblId).find("thead th").length;
	var emptyText = "<tr><td colspan="+colCnt+"> 데이터가 없습니다. </td></tr>";
	$("#"+tblId).find("tbody").empty().append(emptyText);
}
