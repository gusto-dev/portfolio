var chart01, chart02, chart03, chart04;
var chart_swiper;
// var movFrCnt, movToCnt;

/** ************[ INIT S ]******************* */
function fn_init() {
	// 다른 탭에서 검색한 일자가 있는경우
	if (srchDate) {
		var flagDate = fn_getFlagDate("d", true).replace(/-/gi, "");
		if (Number(srchDate) < Number(flagDate))
			$(".btn-next").css("visibility", "visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	} else{
		$("#srchDate").val(fn_getFlagDate("d"));
		srchDate = $("#srchDate").val().replace(/-/gi, "");
	}

	// 데이트피커호출
	gfn_setDatepicker($("#srchDate"));

	$("#srchType").attr("data-val",rsSiteType);
	if(rsSiteType == "all") $("#srchType").text("전체");
	else if(rsSiteType == "rs") $("#srchType").text("RS");
	else if(rsSiteType == "site") $("#srchType").text("SITE");
	
	/* 일자변경 이벤트 */
	$("#srchDate").on("change", function(e) {
		srchDate = $(e.target).val().replace(/-/gi, "");
		fn_initSearch(); // 조회,재조회
	});

	/* 검색 타입 변경시 이벤트 */
	$("#srchType").on("select", function() {
		rsSiteType = $(this).attr("data-val").trim();
		if (rsSiteType == "rs") {
			gfn_searchRs("[name='rsSiteName']");
		} else if (rsSiteType == "site") {
			gfn_searchSite("[name='rsSiteName']");
		} else {
			rsSiteType = "all";
			rsSiteNm = "";
			rsSiteCd = "";
			fn_initSearch();
		}
	});

	/* RS/SITE 검색후 변경 이벤트 */
	$(".rsSiteName").on("change", function(e) {
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm = $(e.target).text();
		rsSiteCd = $(e.target).attr("data-code");
		fn_initSearch();
	});

	/* 채널/제품별 버튼 클릭 이벤트 */
	$(".tab02").on("click", function(e) {
		$(e.target).addClass("active").siblings().removeClass("active");
		var tabType = $(e.target).attr("data-tab-type");
		if(tabType == "st"){
			fn_getDailyFnBResultByStore();
		}else if(tabType == "pd"){
			fn_getDailyFnBResultByProduct();
		}else if(tabType == "ch"){
			fn_getDailyFnBResultByChannel();
		}
		$(".tab02.rsltTbl thead tr th").eq(0).text($(e.target).text());
		//		if($(e.target).hasClass("type-ch")){ //채널별
//			var txt = $(e.target).text();
//			$(".tab02.rsltTbl thead tr th").eq(0).text(txt);
//			$(e.target).addClass("active");
//			fn_getDailyFnBResultByStore();
//		}else if($(e.target).hasClass("type-pd")){ //제품별
//			var txt = $(e.target).text();
//			$(".tab02.rsltTbl thead tr th").eq(0).text(txt);
//			$(e.target).addClass("active");
//			fn_getDailyFnBResultByProduct();
//		}
	});
	
	/* 전주차 , 전일자 필터 버튼 클릭 */
	$(".filter li").on("click",function(e){
		$(e.target).siblings("li").removeClass("active");
		$(e.target).addClass("active");
		
		var dataFlag = $(this).attr("data-toggle");
		if(dataFlag == "w"){
			$('span[data-toggle="d"]').hide();
			$('span[data-toggle="w"]').show();
		}else if(dataFlag == "d"){
			$('span[data-toggle="w"]').hide();
			$('span[data-toggle="d"]').show();
		}
	});

	/* 테이블 토글버튼 클릭 이벤트 */
	 $(".btn-tbltoggle").on("click",function(){
		 var dataFlag = $(this).attr("data-toggle");
		 if(dataFlag == "1"){
			 //전일비차 가져오기
			 $('[data-toggle="1"]').hide();
			 $('[data-toggle="2"]').show();
		 }else if(dataFlag == "2"){
			 //전주비차 가져오기
			 $('[data-toggle="2"]').hide();
			 $('[data-toggle="1"]').show();
		 }
	 });
	
	fn_initSearch(); // 조회,재조회
}/** ************[ INIT E ]******************* */

/** ************[ TRANSACTION S ]******************* */

/*스와이퍼 및 대시보드 데이터 조회*/
function fn_getDailyFnBSmryBoard() {
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	transaction({
		url : '/result/getDailyFnBSmryBoard.do',
		params : params,
		complete:function(){}
	}, function(result, e) {
		if (!e) {
			fn_setSwiperData(result);
			fn_mkChart01(result.smryData02);
			fn_mkChart02(result.smryData03);
			fn_mkChart03(result.smryData04);
			fn_mkDashTbl(result.smryData05);
			fn_getDailyFnBResultByStore();
		} else {
			console.error(e);
		}
	});
}
/*채널별 실적 조회*/
function fn_getDailyFnBResultByChannel(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	transaction({
		url : '/result/getDailyFnBResultByChannel.do',
		params : params
	}, function(result, e) {
		if (!e) {
			fn_mkRowForChannel(result.resultList);
		} else {
			console.error(e);
		}
	});
}

/*매장별 실적 조회*/
function fn_getDailyFnBResultByStore(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	transaction({
//		url : '/result/getDailyFnBResultByChannel.do',
		url : '/result/getDailyFnBResultByStore.do',
		params : params
	}, function(result, e) {
		if (!e) {
			fn_mkRow("st",result.resultList);
		} else {
			console.error(e);
		}
	});
}

/*제품별 실적 조회*/
function fn_getDailyFnBResultByProduct(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	transaction({
		url : '/result/getDailyFnBResultByProduct.do',
		params : params
	}, function(result, e) {
		if (!e) {
			fn_mkRow("pd",result.resultList);
		} else {
			console.error(e);
		}
	});
}

/** ************[ TRANSACTION E ]******************* */
/** ************[ FUNCTION S ]******************* */

// 조회,재조회
function fn_initSearch() {
	fn_getDailyFnBSmryBoard();
	gfn_setRsSiteName(rsSiteType, rsSiteNm);
	initSwiper();
	$(".tab02").eq(0).addClass("active").siblings().removeClass("active");
}

// 차트스와이퍼 생성
function initSwiper() {
	if (chart_swiper)
		chart_swiper.destroy(true, true);
	chart_swiper = new Swiper('.chart-swiper-box', {
		loop : false,
		speed : 500,
		setWrapperSize : true,
		initialSlide : 0,
		freeModeMomentumBounce : true,
		pagination : {
			el : '.swiper-pagination',
			type : 'bullets',
		},
	});
}

/*스와이퍼 데이터 세팅*/
function fn_setSwiperData(data){
	//Swiper 1p
	//증감표기
	if(data.smryData01[0].sppDiff > 0) $(".swiper-slide").eq(0).find(".sppDiff").parent("span").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(0).find(".sppDiff").parent("span").removeClass("gain fall").addClass("fall");
	//팝콘
	if(data.smryData01[0].sppDiff > 0) $(".swiper-slide").eq(0).find(".sppDiff").parents(".anichart1").removeClass("gain-box fall-box").addClass("gain-box");
	else $(".swiper-slide").eq(0).find(".sppDiff").parents(".anichart1").removeClass("gain-box fall-box").addClass("fall-box");
	
	$(".swiper-slide").eq(0).find(".spp"        ).text(fn_setNumberUnit(data.smryData01[0].spp));
	$(".swiper-slide").eq(0).find(".sppDiff"    ).text(fn_setNumberUnit(Math.abs(data.smryData01[0].sppDiff)));
	$(".swiper-slide").eq(0).find(".asp"        ).text(fn_setNumberUnit(data.smryData01[0].asp));
	$(".swiper-slide").eq(0).find(".sr"         ).text(fn_setNumberUnit(data.smryData01[0].sr,"P"));
	$(".swiper-slide").eq(0).find(".fnbAmt"     ).text(fn_setNumberUnit(data.smryData01[0].fnbAmt,"M"));
	$(".swiper-slide").eq(0).find(".rlMrktUseRt").text(fn_setNumberUnit(data.smryData01[0].rlMrktUseRt,"P"));
	
	//Swiper 2p
	$(".swiper-slide").eq(1).find(".spp"    ).text(fn_setNumberUnit(data.smryData02[0].conf));
	$(".swiper-slide").eq(1).find(".sppDiff").text(fn_setNumberUnit(data.smryData02[0].plnConfPerDiff));
	$(".swiper-slide").eq(1).find(".sppDay" ).text(fn_setNumberUnit(data.smryData02[0].ago1dConfPerDiff));
	$(".swiper-slide").eq(1).find(".sppWeek").text(fn_setNumberUnit(data.smryData02[0].ago1wConfPerDiff));
	if(data.smryData02[0].plnConfPerDiff > 0) $(".swiper-slide").eq(1).find(".sppDiff").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(1).find(".sppDiff").removeClass("gain fall").addClass("fall");
	if(data.smryData02[0].ago1dConfPerDiff > 0) $(".swiper-slide").eq(1).find(".sppDay").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(1).find(".sppDay").removeClass("gain fall").addClass("fall");
	if(data.smryData02[0].ago1wConfPerDiff > 0) $(".swiper-slide").eq(1).find(".sppWeek").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(1).find(".sppWeek").removeClass("gain fall").addClass("fall");
	
	//Swiper 3p
	$(".swiper-slide").eq(2).find(".sr"    ).text(fn_setNumberUnit(data.smryData03[0].conf)+"%");
	$(".swiper-slide").eq(2).find(".srDiff").text(fn_setNumberUnit(data.smryData03[0].plnConfPerDiff)+"%p");
	$(".swiper-slide").eq(2).find(".srDay" ).text(fn_setNumberUnit(data.smryData03[0].ago1dConfPerDiff)+"%p");
	$(".swiper-slide").eq(2).find(".srWeek").text(fn_setNumberUnit(data.smryData03[0].ago1wConfPerDiff)+"%p");
	if(data.smryData03[0].plnConfPerDiff > 0) $(".swiper-slide").eq(2).find(".srDiff").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(2).find(".srDiff").removeClass("gain fall").addClass("fall");
	if(data.smryData03[0].ago1dConfPerDiff > 0) $(".swiper-slide").eq(2).find(".srDay").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(2).find(".srDay").removeClass("gain fall").addClass("fall");
	if(data.smryData03[0].ago1wConfPerDiff > 0) $(".swiper-slide").eq(2).find(".srWeek").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(2).find(".srWeek").removeClass("gain fall").addClass("fall");
	
	//Swiper 4p
	$(".swiper-slide").eq(3).find(".asp"    ).text(fn_setNumberUnit(data.smryData04[0].conf));
	$(".swiper-slide").eq(3).find(".aspDiff").text(fn_setNumberUnit(data.smryData04[0].plnConfPerDiff));
	$(".swiper-slide").eq(3).find(".aspDay" ).text(fn_setNumberUnit(data.smryData04[0].ago1dConfPerDiff));
	$(".swiper-slide").eq(3).find(".aspWeek").text(fn_setNumberUnit(data.smryData04[0].ago1wConfPerDiff));
	if(data.smryData04[0].plnConfPerDiff > 0) $(".swiper-slide").eq(3).find(".aspDiff").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(3).find(".aspDiff").removeClass("gain fall").addClass("fall");
	if(data.smryData04[0].ago1dConfPerDiff > 0) $(".swiper-slide").eq(3).find(".aspDay").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(3).find(".aspDay").removeClass("gain fall").addClass("fall");
	if(data.smryData04[0].ago1wConfPerDiff > 0) $(".swiper-slide").eq(3).find(".aspWeek").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(3).find(".aspWeek").removeClass("gain fall").addClass("fall");
};

// 1번차트 생성
function fn_mkChart01(data) {
	if (chart01) chart01.dispose();
	
	var chartData = [
		 { gubun : "실적" , rcd : data[0].conf      , color : COLOR_ARR[0] }
		,{ gubun : "계획" , rcd : data[0].plnConf   , color : COLOR_ARR[6] }
		,{ gubun : "전주" , rcd : data[0].ago1wConf , color : COLOR_ARR[5] }
		,{ gubun : "전일" , rcd : data[0].ago1dConf , color : COLOR_ARR[16] }
	]
	
	chart01 = gfn_mkXYChart(chartData, {
		chartDivId : "chart01",
		categoryName : "gubun",
		cursor : true,
		series : [ { type : "col",valueKey : "rcd"} ]
	});
	
	chart01.paddingBottom = 0;
	chart01.paddingTop = 0;
	chart01.paddingLeft = 0;
	chart01.paddingRight = 0;
}

// 2번차트 생성
function fn_mkChart02(data) {
	if (chart02) chart02.dispose();
	
	var chartData = [
		 { gubun : "실적" , rcd : data[0].conf      ,  color : COLOR_ARR[0]  }
		,{ gubun : "계획" , rcd : data[0].plnConf   ,  color : COLOR_ARR[6] }
		,{ gubun : "전주" , rcd : data[0].ago1wConf ,  color : COLOR_ARR[5]  }
		,{ gubun : "전일" , rcd : data[0].ago1dConf ,  color : COLOR_ARR[16]  }
	]
	
	chart02 = gfn_mkXYChart(chartData, {
		chartDivId : "chart02",
		categoryName : "gubun",
		cursor : true,
		series : [ { type : "col",valueKey : "rcd"} ]
	});
	
	chart02.paddingBottom = 0;
	chart02.paddingTop = 0;
	chart02.paddingLeft = 0;
	chart02.paddingRight = 0;
}

// 3번차트 생성
function fn_mkChart03(data) {
	if (chart03) chart03.dispose();
	var chartData = [
		 { gubun : "실적" , rcd : data[0].conf      ,  color : COLOR_ARR[0]  }
		,{ gubun : "계획" , rcd : data[0].plnConf   ,  color : COLOR_ARR[6] }
		,{ gubun : "전주" , rcd : data[0].ago1wConf ,  color : COLOR_ARR[5]  }
		,{ gubun : "전일" , rcd : data[0].ago1dConf ,  color : COLOR_ARR[16]  }
	]
	
	chart03 = gfn_mkXYChart(chartData, {
		chartDivId : "chart03",
		categoryName : "gubun",
		cursor : true,
		series : [ { type : "col",valueKey : "rcd"} ]
	});
	
	chart03.paddingBottom = 0;
	chart03.paddingTop = 0;
	chart03.paddingLeft = 0;
	chart03.paddingRight = 0;
}

// 대시보드 하단 테이블
function fn_mkDashTbl(data){
	$(".idx").each(function(i,item){
		$(item).find(".gubun").html(data[i].gubun);
	});
	//실적 컬럼
	$(".idx").eq(0).find(".conf").text(fn_setNumberUnit(data[0].conf));
	$(".idx").eq(1).find(".conf").text(fn_setNumberUnit(data[1].conf,"M"));
	/////이용객수 열 추가
	$(".idx").eq(2).find(".conf").text(fn_setNumberUnit(data[2].conf));

	$(".idx").eq(3).find(".conf").text(fn_setNumberUnit(data[3].conf));
	$(".idx").eq(4).find(".conf").text(fn_setNumberUnit(data[4].conf,"P")+"%");
	$(".idx").eq(5).find(".conf").text(fn_setNumberUnit(data[5].conf));
	$(".idx").eq(6).find(".conf").text(fn_setNumberUnit(data[6].conf,"P")+"%");
	
	//계획 컬럼
	$(".idx").eq(0).find(".plnPer").text(fn_setNumberUnit(data[0].plnConfPerDiff,"P")+"%");
	$(".idx").eq(0).find(".plnConf").text(fn_setNumberUnit(data[0].plnConf));
	$(".idx").eq(1).find(".plnPer").text(fn_setNumberUnit(data[1].plnConfPerDiff,"P")+"%");
	$(".idx").eq(1).find(".plnConf").text(fn_setNumberUnit(data[1].plnConf,"M"));
	/////이용객수 열 추가
	$(".idx").eq(2).find(".plnPer").text(fn_setNumberUnit(data[2].plnConfPerDiff,"P")+"%");
	$(".idx").eq(2).find(".plnConf").text(fn_setNumberUnit(data[2].plnConf));

	$(".idx").eq(3).find(".plnPer").text(fn_setNumberUnit(data[3].plnConfPerDiff));
	$(".idx").eq(3).find(".plnConf").text(fn_setNumberUnit(data[3].plnConf));
	$(".idx").eq(4).find(".plnPer").text(fn_setNumberUnit(data[4].plnConfPerDiff,"P")+"%p");
	$(".idx").eq(4).find(".plnConf").text(fn_setNumberUnit(data[4].plnConf,"P")+"%");
	$(".idx").eq(5).find(".plnPer").text(fn_setNumberUnit(data[5].plnConfPerDiff));
	$(".idx").eq(5).find(".plnConf").text(fn_setNumberUnit(data[5].plnConf));
	$(".idx").eq(6).find(".plnPer").text("-");
	
	//전주 컬럼
	$(".idx").eq(0).find(".weekPer").text(fn_setNumberUnit(data[0].ago1wConfPerDiff,"P")+"%");
	$(".idx").eq(0).find(".weekConf").text(fn_setNumberUnit(data[0].ago1wConf));
	$(".idx").eq(1).find(".weekPer").text(fn_setNumberUnit(data[1].ago1wConfPerDiff,"P")+"%");
	$(".idx").eq(1).find(".weekConf").text(fn_setNumberUnit(data[1].ago1wConf,"M"));
	/////이용객수 열 추가
	$(".idx").eq(2).find(".weekPer").text(fn_setNumberUnit(data[2].ago1wConfPerDiff,"P")+"%");
	$(".idx").eq(2).find(".weekConf").text(fn_setNumberUnit(data[2].ago1wConf));

	$(".idx").eq(3).find(".weekPer").text(fn_setNumberUnit(data[3].ago1wConfPerDiff));
	$(".idx").eq(3).find(".weekConf").text(fn_setNumberUnit(data[3].ago1wConf));
	$(".idx").eq(4).find(".weekPer").text(fn_setNumberUnit(data[4].ago1wConfPerDiff,"P")+"%p");
	$(".idx").eq(4).find(".weekConf").text(fn_setNumberUnit(data[4].ago1wConf,"P")+"%");
	$(".idx").eq(5).find(".weekPer").text(fn_setNumberUnit(data[5].ago1wConfPerDiff));
	$(".idx").eq(5).find(".weekConf").text(fn_setNumberUnit(data[5].ago1wConf));
	$(".idx").eq(6).find(".weekPer").text(fn_setNumberUnit(data[6].ago1wConfPerDiff,"P")+"%p");
	$(".idx").eq(6).find(".weekConf").text(fn_setNumberUnit(data[6].ago1wConf,"P")+"%");
	
	//전일 컬럼
	$(".idx").eq(0).find(".dayPer").text(fn_setNumberUnit(data[0].ago1dConfPerDiff,"P")+"%");
	$(".idx").eq(0).find(".dayConf").text(fn_setNumberUnit(data[0].ago1dConf));
	$(".idx").eq(1).find(".dayPer").text(fn_setNumberUnit(data[1].ago1dConfPerDiff,"P")+"%");
	$(".idx").eq(1).find(".dayConf").text(fn_setNumberUnit(data[1].ago1dConf,"M"));
	/////이용객수 열 추가
	$(".idx").eq(2).find(".dayPer").text(fn_setNumberUnit(data[2].ago1dConfPerDiff,"P")+"%");
	$(".idx").eq(2).find(".dayConf").text(fn_setNumberUnit(data[2].ago1dConf));

	$(".idx").eq(3).find(".dayPer").text(fn_setNumberUnit(data[3].ago1dConfPerDiff));
	$(".idx").eq(3).find(".dayConf").text(fn_setNumberUnit(data[3].ago1dConf));
	$(".idx").eq(4).find(".dayPer").text(fn_setNumberUnit(data[4].ago1dConfPerDiff,"P")+"%p");
	$(".idx").eq(4).find(".dayConf").text(fn_setNumberUnit(data[4].ago1dConf,"P")+"%");
	$(".idx").eq(5).find(".dayPer").text(fn_setNumberUnit(data[5].ago1dConfPerDiff));
	$(".idx").eq(5).find(".dayConf").text(fn_setNumberUnit(data[5].ago1dConf));
	$(".idx").eq(6).find(".dayPer").text(fn_setNumberUnit(data[6].ago1dConfPerDiff,"P")+"%p");
	$(".idx").eq(6).find(".dayConf").text(fn_setNumberUnit(data[6].ago1dConf,"P")+"%");
	
	for(var i in data){
		//증감표기
		if(i < 3){
			//계획
			if(data[i].plnConfPerDiff > 100) $(".idx").eq(i).find(".plnPer").removeClass("f-color01 f-color02").addClass("f-color01")
			else $(".idx").eq(i).find(".plnPer").removeClass("f-color01 f-color02").addClass("f-color02");
			//전주
			if(data[i].ago1wConfPerDiff > 100) $(".idx").eq(i).find(".weekPer").removeClass("gain fall").addClass("gain");
			else $(".idx").eq(i).find(".weekPer").removeClass("gain fall").addClass("fall");
			//전일
			if(data[i].ago1wConfPerDiff > 100) $(".idx").eq(i).find(".dayPer").removeClass("gain fall").addClass("gain");
			else $(".idx").eq(i).find(".dayPer").removeClass("gain fall").addClass("fall");
			
		}/*else if(i==2){
			//계획
			if(data[i].plnConfPerDiff >0) $(".idx").eq(i).find(".plnPer").removeClass("f-color01 f-color02").addClass("f-color01")
			else $(".idx").eq(i).find(".plnPer").removeClass("f-color01 f-color02").addClass("f-color02");
			//전주
			if(data[i].ago1wConfPerDiff > 0) $(".idx").eq(i).find(".weekPer").removeClass("gain fall").addClass("gain");
			else $(".idx").eq(i).find(".weekPer").removeClass("gain fall").addClass("fall");
			//전일
			if(data[i].ago1wConfPerDiff > 0) $(".idx").eq(i).find(".dayPer").removeClass("gain fall").addClass("gain");
			else $(".idx").eq(i).find(".dayPer").removeClass("gain fall").addClass("fall");
		}*/else{
			//계획
			if(i != 6){
				if(data[i].plnConfPerDiff > 0) $(".idx").eq(i).find(".plnPer").removeClass("gain fall").addClass("gain")
				else $(".idx").eq(i).find(".plnPer").removeClass("gain fall").addClass("fall");
			}
			//전주
			if(data[i].ago1wConfPerDiff > 0) $(".idx").eq(i).find(".weekPer").removeClass("gain fall").addClass("gain");
			else $(".idx").eq(i).find(".weekPer").removeClass("gain fall").addClass("fall");
			//전일
			if(data[i].ago1wConfPerDiff > 100) $(".idx").eq(i).find(".dayPer").removeClass("gain fall").addClass("gain");
			else $(".idx").eq(i).find(".dayPer").removeClass("gain fall").addClass("fall");
		}
	}
	
	//증감 부호 제거
	$(".num").each(function(i,item){
		if($(item).text() != "-"){
			$(item).text($(item).text().replace(/-/gi,""));
		}
	});
}

/*채널별 테이블*/
function fn_mkRowForChannel(data){
	console.log(data);
	var html = ``;
	for(var i in data){
		html += `
			<tr class='${i==0 ? 'total' : '' }'>
				<td>
					<span>${data[i].saleChnlNm}</span>
				</td>
				<td class='align-r'>
					<p> ${fn_setNumberUnit(data[i].pureSellAmt,'T')} </p>
					<span class='s-font'> ${fn_setNumberUnit(data[i].pureSellAmtPer,'P')}% </span>
				</td>
				<td class='align-r'>
					<p> ${fn_setNumberUnit(data[i].spp)} </p>
					<span class='${data[i].ago1wSppDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w'> ${fn_setNumberUnit(data[i].ago1wSppDiff,null,true)} </span>
					<span class='${data[i].ago1dSppDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='d' style='display:none;'> ${fn_setNumberUnit(data[i].ago1dSppDiff,null,true)} </span>
				</td>
			</tr>
		`;
	}
	$(".tab02.rsltTbl tbody").empty().append(html);
	$(".tdSr").hide();
	$(".tdAsp").hide();
}

/* 하단 매장별/제품별 테이블 */
function fn_mkRow(type,data){
	var html = ``;
	for(var i in data){
		html += `
		<tr class='${i==0 ? 'total' : data[i].grpSellChnlCd == '00'? 'point-bg02' : '' }'>
			<td class='${data[i].grpSellChnlCd != '00' ? 'indent': '' }'>
				<span> ${data[i].grpSellChnlNm} </span>
			</td>
			<td class='align-r'>
				<p> ${fn_setNumberUnit(data[i].pureSellAmt,'T')} </p>
				<span class='s-font'> ${fn_setNumberUnit(data[i].pureSellAmtPer,'P')}% </span>
			</td>
			<td class='align-r'>
				<p> ${fn_setNumberUnit(data[i].spp)} </p>
				<span class='${data[i].ago1wSppDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w'> ${fn_setNumberUnit(data[i].ago1wSppDiff,null,true)} </span>
				<span class='${data[i].ago1dSppDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='d' style='display:none;'> ${fn_setNumberUnit(data[i].ago1dSppDiff,null,true)} </span>
			</td>
			<td class='align-r tdSr'>
				<p> ${fn_setNumberUnit(data[i].sr,'P')}% </p>
				<span class='${data[i].ago1wSrDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w' > ${fn_setNumberUnit(data[i].ago1wSrDiff,'P',true)}%p </span>
				<span class='${data[i].ago1dSrDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='d' style='display:none;' > ${fn_setNumberUnit(data[i].ago1dSrDiff,'P',true)}%p </span>
			</td>
			<td class='align-r' tdAsp>
				<p> ${fn_setNumberUnit(data[i].asp)} </p>
				<span class='${data[i].ago1wAspDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w'> ${fn_setNumberUnit(data[i].ago1wAspDiff,null,true)} </span>
				<span class='${data[i].ago1dAspDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='d' style='display:none;' > ${fn_setNumberUnit(data[i].ago1dAspDiff,null,true)} </span>
			</td>
		</tr>
		`;
	}
	
	if(!data.length) html = `<tr><td colspan=>데이터가 없습니다.</td></tr>`;
	
	$(".tab02.rsltTbl tbody").empty().append(html);
	$(".tab02.rsltTbl tbody num").each(function(i,e){
		$(e).text($(e).text().replace(/-/gi,""));
	});
	
	if(type == "pd"){
		$(".tdSr").hide();
		$(".tdAsp").show();
	}else{
		$(".tdSr").show();
		$(".tdAsp").show();
	}
}

/*천명 , 억원 단위 절삭*/
function fn_setNumberUnit(number, numType, absFlag){
	if("number" != typeof number ) return number;
	var numType,convertedNum;
	
	if(absFlag) number = Math.abs(number);
	
	if(numType == "M"){
		if(number == 0) return "0.0"
		convertedNum = number/1000000;
		convertedNum = Math.round(convertedNum);
	}else if(numType == "T"){
		if(number == 0) return "0"
		convertedNum = number/1000;
		convertedNum = Math.round(convertedNum);
	}else if(numType =="P"){
		convertedNum = Number(number).toFixed(1);
	}else if(numType =="P2"){
		convertedNum = Number(number).toFixed(2);
	}else{
		convertedNum = number;
	}
	
	convertedNum = gfn_numberFormat(convertedNum);
	return convertedNum;
};