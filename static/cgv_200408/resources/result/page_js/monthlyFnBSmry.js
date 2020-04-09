var chart01, chart02, chart03, chart04;
var chart_swiper;
// var movFrCnt, movToCnt;

/** ************[ INIT S ]******************* */
function fn_init() {
	// 다른 탭에서 검색한 일자가 있는경우
	if (srchDate) {
		var flagDate = fn_getFlagDate("m", true).replace(/-/gi, "");
		if (Number(srchDate) < Number(flagDate))
			$(".btn-next").css("visibility", "visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	} else{
		$("#srchDate").val(fn_getFlagDate("m"));
		srchDate = $("#srchDate").val().replace(/-/gi, "");
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
		$(".tab02.rsltTbl thead tr th").eq(0).text($(e.target).text());
		
		if(tabType == "st"){
			fn_getMonthlyFnBResultByStore();
		}else if(tabType == "pd"){
			fn_getMonthlyFnBResultByProduct();
		}else if(tabType == "ch"){
			fn_getMonthlyFnBResultByChannel();
		}
//		if($(e.target).hasClass("type-ch")){ //채널별
//			var txt = $(e.target).text();
//			$(".tab02.rsltTbl thead tr th").eq(0).text(txt);
//			$(e.target).addClass("active");
//			fn_getMonthlyFnBResultByStore();
//		}else if($(e.target).hasClass("type-pd")){ //제품별
//			var txt = $(e.target).text();
//			$(".tab02.rsltTbl thead tr th").eq(0).text(txt);
//			$(e.target).addClass("active");
//			fn_getMonthlyFnBResultByProduct();
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

/* Monthly F&B 요약 대시보드 조회 */
function fn_getMonthlyFnBSmryBoard() {
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	console.log("param",params);
	
	transaction({
		url : '/result/getMonthlyFnBSmryBoard.do',
		params : params,
		complete : function(){}
	}, function(result, e) {
		if (!e) {
			console.log("TEST",result);
			fn_setSwiperData(result);
			fn_mkChart01(result.smryData02);
			fn_mkChart02(result.smryData03);
			fn_mkChart03(result.smryData04);
			fn_mkDashTbl(result.smryData05);
			fn_getMonthlyFnBResultByStore();
		} else {
			console.error(e);
		}
	});
}

/*매장별 실적 조회*/
function fn_getMonthlyFnBResultByStore(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	transaction({
		url : '/result/getMonthlyFnBResultByStore.do',
		params : params
	}, function(result, e) {
		if (!e) {
			console.log("ch",result);
			fn_mkRow(result.resultList);
			$(".tdSr").show();
			$(".tdAsp").show();
		} else {
			console.error(e);
		}
	});
}
/*제품별 실적 조회*/
function fn_getMonthlyFnBResultByProduct(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;
	
	transaction({
		url : '/result/getMonthlyFnBResultByProduct.do',
		params : params
	}, function(result, e) {
		if (!e) {
			console.log("pd",result);
			fn_mkRow(result.resultList);
			$(".tdSr").hide();
			$(".tdAsp").show();
		} else {
			console.error(e);
		}
	});
}
/*매장별 실적 조회*/
function fn_getMonthlyFnBResultByChannel(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = srchDate;

	transaction({
		url : '/result/getMonthlyFnBResultByChannel.do',
		params : params
	}, function(result, e) {
		if (!e) {
			console.log("ch",result);
			fn_mkRowForChannel(result.resultList);
//			$(".tdSr").show();
			$(".tdSr").hide();
			$(".tdAsp").hide();
		} else {
			console.error(e);
		}
	});
}
/** ************[ TRANSACTION E ]******************* */
/** ************[ FUNCTION S ]******************* */

// 조회,재조회
function fn_initSearch() {
	fn_getMonthlyFnBSmryBoard();
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
	$(".swiper-slide").eq(0).find(".sppDiff"    ).text(Math.abs(fn_setNumberUnit(data.smryData01[0].sppDiff)));
	$(".swiper-slide").eq(0).find(".asp"        ).text(fn_setNumberUnit(data.smryData01[0].asp));
	$(".swiper-slide").eq(0).find(".sr"         ).text(fn_setNumberUnit(data.smryData01[0].sr,"P"));
	$(".swiper-slide").eq(0).find(".fnbAmt"     ).text(fn_setNumberUnit(data.smryData01[0].fnbAmt,"M"));
	$(".swiper-slide").eq(0).find(".rlMrktUseRt").text(fn_setNumberUnit(data.smryData01[0].rlMrktUseRt,"P"));
	
	//Swiper 2p
	$(".swiper-slide").eq(1).find(".spp"    ).text(fn_setNumberUnit(data.smryData02[0].conf));
	$(".swiper-slide").eq(1).find(".sppDiff").text(fn_setNumberUnit(data.smryData02[0].plnConfPerDiff));
//	$(".swiper-slide").eq(1).find(".sppDay" ).text(fn_setNumberUnit(data.smryData02[0].ago1dConfPerDiff));
	$(".swiper-slide").eq(1).find(".sppYear").text(fn_setNumberUnit(data.smryData02[0].ago1yConfPerDiff));
	if(data.smryData02[0].plnConfPerDiff > 0) $(".swiper-slide").eq(1).find(".sppDiff").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(1).find(".sppDiff").removeClass("gain fall").addClass("fall");
//	if(data.smryData02[0].ago1dConfPerDiff > 0) $(".swiper-slide").eq(1).find(".sppDay").removeClass("gain fall").addClass("gain");
//	else $(".swiper-slide").eq(1).find(".sppDay").removeClass("gain fall").addClass("fall");
	if(data.smryData02[0].ago1yConfPerDiff > 0) $(".swiper-slide").eq(1).find(".sppYear").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(1).find(".sppYear").removeClass("gain fall").addClass("fall");
	
	//Swiper 3p
	$(".swiper-slide").eq(2).find(".sr"    ).text(fn_setNumberUnit(data.smryData03[0].conf)+"%");
	$(".swiper-slide").eq(2).find(".srDiff").text(fn_setNumberUnit(data.smryData03[0].plnConfPerDiff)+"%p");
//	$(".swiper-slide").eq(2).find(".srDay" ).text(fn_setNumberUnit(data.smryData03[0].ago1dConfPerDiff));
	$(".swiper-slide").eq(2).find(".srYear").text(fn_setNumberUnit(data.smryData03[0].ago1yConfPerDiff)+"%p");
	if(data.smryData03[0].plnConfPerDiff > 0) $(".swiper-slide").eq(2).find(".srDiff").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(2).find(".srDiff").removeClass("gain fall").addClass("fall");
//	if(data.smryData03[0].ago1dConfPerDiff > 0) $(".swiper-slide").eq(2).find(".srDay").removeClass("gain fall").addClass("gain");
//	else $(".swiper-slide").eq(2).find(".srDay").removeClass("gain fall").addClass("fall");
	if(data.smryData03[0].ago1yConfPerDiff > 0) $(".swiper-slide").eq(2).find(".srYear").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(2).find(".srYear").removeClass("gain fall").addClass("fall");
	
	//Swiper 4p
	$(".swiper-slide").eq(3).find(".asp"    ).text(fn_setNumberUnit(data.smryData04[0].conf));
	$(".swiper-slide").eq(3).find(".aspDiff").text(fn_setNumberUnit(data.smryData04[0].plnConfPerDiff));
//	$(".swiper-slide").eq(3).find(".aspDay" ).text(fn_setNumberUnit(data.smryData04[0].ago1dConfPerDiff));
	$(".swiper-slide").eq(3).find(".aspYear").text(fn_setNumberUnit(data.smryData04[0].ago1yConfPerDiff));
	if(data.smryData04[0].plnConfPerDiff > 0) $(".swiper-slide").eq(3).find(".aspDiff").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(3).find(".aspDiff").removeClass("gain fall").addClass("fall");
	if(data.smryData04[0].ago1dConfPerDiff > 0) $(".swiper-slide").eq(3).find(".aspDay").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(3).find(".aspDay").removeClass("gain fall").addClass("fall");
	if(data.smryData04[0].ago1yConfPerDiff > 0) $(".swiper-slide").eq(3).find(".aspYear").removeClass("gain fall").addClass("gain");
	else $(".swiper-slide").eq(3).find(".aspYear").removeClass("gain fall").addClass("fall");
};

// 1번차트 생성
function fn_mkChart01(data) {
	if (chart01) chart01.dispose();
	
	var chartData = [
		 { gubun : "실적" , rcd : data[0].conf      , color : COLOR_ARR[0] }
		,{ gubun : "계획" , rcd : data[0].plnConf   , color : COLOR_ARR[6] }
		,{ gubun : "전년" , rcd : data[0].ago1yConf , color : COLOR_ARR[5] }
//		,{ gubun : "전일" , rcd : data[0].ago1dConf , color : COLOR_ARR[16] }
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
		,{ gubun : "전년" , rcd : data[0].ago1yConf , color : COLOR_ARR[5] }
//		,{ gubun : "전일" , rcd : data[0].ago1dConf ,  color : COLOR_ARR[16]  }
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
		,{ gubun : "전년" , rcd : data[0].ago1yConf , color : COLOR_ARR[5] }
//		,{ gubun : "전일" , rcd : data[0].ago1dConf ,  color : COLOR_ARR[16]  }
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
	data = fn_convertDataToList(data[0]);
	var html = ``;
	for(var i in data){
		html+=`
			<tr>
				<td>
					${data[i].gubun}
				</td>
				<td class='align-r num' data-key='rcd' data-value='${data[i].rcd}'>
					${i==0? fn_setNumberUnit(data[i].rcd,'T'):
					  i==1? fn_setNumberUnit(data[i].rcd,'M'):
							fn_setNumberUnit(data[i].rcd)
					}${i == 4 ? '%' : i == 6 ? '%':''}
				</td>
				<td class='align-r'>
					<span class='num' data-key='pln' data-value='${data[i].pln}'>
						${i==2? fn_setNumberUnit(data[i].pln) : i==4 ? fn_setNumberUnit(data[i].pln) : i==5? "-": fn_setNumberUnit(data[i].pln,'P') }
					</span>
					<span class='s-font num' data-key='plnDiff' data-value='${data[i].plnDiff}'>
						${
						i==0? fn_setNumberUnit(data[i].plnDiff,'T'):
						i==1? fn_setNumberUnit(data[i].plnDiff,'M'):
						i==5? '' : fn_setNumberUnit(data[i].plnDiff)}${i==3? "%" : ""
						}
					</span>
				</td>
				<td class='align-r'>
					<span class='num' data-key='yAgo' data-value='${data[i].yAgo}'>
						${i==2? fn_setNumberUnit(data[i].yAgo) : i==4 ? fn_setNumberUnit(data[i].yAgo) : fn_setNumberUnit(data[i].yAgo,'P') }
					</span>
					<span class='s-font num' data-key='yAgoDiff' data-value='${data[i].yAgoDiff}'>
						${
						i==0? fn_setNumberUnit(data[i].yAgoDiff,'T'):
						i==1? fn_setNumberUnit(data[i].yAgoDiff,'M'):
						fn_setNumberUnit(data[i].yAgoDiff)}${i==3? "%" : i==5? "%" : ""
						}
					</span>
				</td>
			</tr>
		`
	}
	
	$("#tbl-dailyFnBSmry").empty().append(html)
	
	$("[data-key='pln']").each(function(i,e){
		var data = Number($(e).attr("data-value"));
		if(i==0 || i==1){
			if(data > 100 ) $(e).removeClass("f-color01 f-color02").addClass("f-color01")
			else $(e).removeClass("f-color01 f-color02").addClass("f-color02")
			$(e).text($(e).text()+"%");
		}else if(i==2 || i==4){
			if(data > 100 ) $(e).removeClass("gain fall").addClass("gain")
			else $(e).removeClass("gain fall").addClass("fall");
		}else if(i==3){
			if(data > 0 ) $(e).removeClass("gain fall").addClass("gain")
			else $(e).removeClass("gain fall").addClass("fall");
			$(e).text($(e).text()+"%p");
		}
	});
	$("[data-key='yAgo']").each(function(i,e){
		var data = Number($(e).attr("data-value"));
		if(i==0 || i==1){
			if(data > 0 ) $(e).removeClass("gain fall").addClass("gain")
			else $(e).removeClass("gain fall").addClass("fall");
			$(e).text($(e).text()+"%");
		}else if(i==2 || i==4){
			if(data > 0 ) $(e).removeClass("gain fall").addClass("gain")
			else $(e).removeClass("gain fall").addClass("fall");
		}else if(i==3 || i==5){
			if(data > 0 ) $(e).removeClass("gain fall").addClass("gain")
			else $(e).removeClass("gain fall").addClass("fall");
			$(e).text($(e).text()+"%p");
		}
	});

	$(".num").each(function(i,e){
		$(e).text($(e).text().trim());
		if($(e).text() != "-"){
			$(e).text($(e).text().replace(/-/gi,""));
		}
	});
}

/* 하단 채널별/제품별 테이블 */
function fn_mkRow(data){
	var html = ``;
	for(var i in data){
		html += `
		<tr class='${i==0 ? 'total' : data[i].grpSellChnlCd == '00'? 'point-bg02' : '' }'>
			<td class='${data[i].grpSellChnlCd != '00' ? 'indent': '' }'>
				<span> ${data[i].grpSellChnlNm} </span>
			</td>
			<td class='align-r'>
				<p> ${fn_setNumberUnit(data[i].pureSellAmt,'M')} </p>
				<span class='s-font'> ${fn_setNumberUnit(data[i].pureSellAmtPer,'P')}% </span>
			</td>
			<td class='align-r'>
				<p> ${fn_setNumberUnit(data[i].spp)} </p>
				<span class='${data[i].ago1ySppDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w'> ${fn_setNumberUnit(data[i].ago1ySppDiff,null,true)} </span>
			</td>
			<td class='align-r tdSr'>
				<p> ${fn_setNumberUnit(data[i].sr,'P')}% </p>
				<span class='${data[i].ago1ySrDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w' > ${fn_setNumberUnit(data[i].ago1ySrDiff,'P',true)}%p </span>
			</td>
			<td class='align-r'>
				<p> ${fn_setNumberUnit(data[i].asp)} </p>
				<span class='${data[i].ago1yAspDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w'> ${fn_setNumberUnit(data[i].ago1yAspDiff,null,true)} </span>
			</td>
		</tr>
		`;
	}
	
	if(!data.length){
		html = `<tr><td colspan=>데이터가 없습니다.</td></tr>`;
	};
	
	$(".tab02.rsltTbl tbody").empty().append(html);
	$(".tab02.rsltTbl tbody num").each(function(i,e){
		$(e).text($(e).text().replace(/-/gi,""));
	});
}

/*천명 , 억원 단위 절삭*/
function fn_setNumberUnit(number, numType, absFlag){
	if("number" != typeof number ) return number;
	var numType,convertedNum;
	
	if(absFlag) number = Math.abs(number);
	
	if(numType == "M"){
		if(number == 0) return "0"
		convertedNum = number/10000000;
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

/* 리스트 형식으로 데이터 변환 */
function fn_convertDataToList(data){
	console.log(data);
	if(!data) return null;
	data = sortObject(data);
	var rtnList = [];
	var rowObj = {};
	
	for(var key in data){
		var rowId = key.substr(0,1);
		var colId = key.substr(2,2);
		if(colId == "C0"){
			rowObj.gubun = data[key];
		}else if(colId == "C1"){
			rowObj.rcd = data[key];
		}else if(colId == "C2"){
			rowObj.pln = data[key];
		}else if(colId == "C3"){
			rowObj.plnDiff = data[key];
		}else if(colId == "C4"){
			rowObj.yAgo = data[key];
		}else if(colId == "C5"){
			rowObj.yAgoDiff = data[key];
		}
		
		if(colId == "C5"){
			rtnList.push(rowObj);
			rowObj = {};
		}
	}
	return rtnList;
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
					<p> ${fn_setNumberUnit(data[i].pureSellAmt,'M')} </p>
					<span class='s-font'> ${fn_setNumberUnit(data[i].pureSellAmtPer,'P')}% </span>
				</td>
				<td class='align-r'>
					<p> ${fn_setNumberUnit(data[i].spp)} </p>
					<span class='${data[i].ago1ySppDiff > 0 ? 'gain' : 'fall'} s-font num' data-toggle='w'> ${fn_setNumberUnit(data[i].ago1ySppDiff,null,true)} </span>
				</td>
			</tr>
		`;
	}
	$(".tab02.rsltTbl tbody").empty().append(html);
//	$(".tdSr").hide();
//	$(".tdAsp").hide();
}

//object를 키 이름으로 정렬하여 반환
function sortObject(o){
    var sorted = {},
    key, a = [];
    // 키이름을 추출하여 배열에 집어넣음
    for (key in o) {
        if (o.hasOwnProperty(key)) a.push(key);
    }
    // 키이름 배열을 정렬
    a.sort();
    // 정렬된 키이름 배열을 이용하여 object 재구성
    for (key=0; key<a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}