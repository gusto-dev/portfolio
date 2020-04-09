var chart01,chart02;
//,chart03,chart04;
var chart_swiper;

function fn_init(){
	
	//다른 탭에서 검색한 일자가 있는경우
	if(srchDate){
		var flagDate = fn_getFlagDate("m",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}
	else $("#srchDate").val(fn_getFlagDate("m"));
	
	srchDate = $("#srchDate").val().replace(/-/gi,"");
	
	//AnyPicker 설정
	$("#srchDate").dateAnyPicker({
		  maxDate : [fn_getFlagDate("m").split("-")[0],fn_getFlagDate("m").split("-")[1]-1]
		 ,format  : "yyyy-MM"
		, onChange: function(date){
			fn_isOverDate(date)
			$("#srchDate").trigger("change");
		}
	});
	
	//일자변경 이벤트
	$("#srchDate").on("change",function(e){
//		console.log("TEST",$(e.target).val());
		srchDate = $(e.target).val().replace(/-/gi,"");
		fn_getPalSmryDashBoard();
		fn_initSearch();
	});
	
	/*검색 타입 변경시 이벤트*/
	$("#srchType").on("change",function(){
		rsSiteType = $(this).val();
		if(rsSiteType == "rs"){
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
	
	/*RS/SITE 검색후 변경 이벤트*/
	$(".rsSiteName").on("change",function(e){
		rsSiteType = $("#srchType").attr("data-val");
		rsSiteNm = $(e.target).text();
		rsSiteCd = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	$(".dataType").on("click",function(e){
		$(e.target).siblings("li").removeClass("active")
		$(e.target).addClass("active")
	});
	
	/* 페이지 하단 탭 (전체 , 한국, 중국, 베트남...) 클릭 이벤트 */
	$(document).on("click",".dataType",function(evnt){
		$(".dataType").removeClass("active");
		$(evnt.target).addClass("active");
		fn_initSearch(); //조회,재조회
	});
	fn_getForeignLastTotMonth(); //최근 마감월 조회
	fn_getCtryList();
	initSwiper();
	fn_getPalSmryDashBoard();
	fn_initSearch(); //조회,재조회
}
/*=============[ INIT END ]=========================*/
/* 최근 마감월 조회 */
function fn_getForeignLastTotMonth(){
	transaction({
		url : '/result/getForeignLastTotMonth.do'
		,asyncFlag : false
	},function(result, e){
		if(!e){
			console.log("getForeignLastTotMonth",result);
			var lastTotMonth = result.basYm+"";
			var y = lastTotMonth.substr(0,4);
			var m = lastTotMonth.substr(4,2);
			$("#srchDate").val(y+"-"+m);
		}else{
			console.log(e);
		}
	});
}

/*국가 목록 조회*/
/* 국가 목록 조회 */
function fn_getCtryList(){
	transaction({
		url : '/result/getCtryList.do'
		,asyncFlag : false
		,complete:function(){}
	},function(result,e){
		if(!e){
			var ctryList = result.resultList;
			var html = ``;
			for(var i in ctryList){
				html += `
					<li class='dataType ${i==0? 'active':''}' data-code=${ctryList[i].ctryCd? ctryList[i].ctryCd:'' }>${ctryList[i].ctryNm}</li>
				`
			}
			$("#dataType").empty().append(html);
		}else{
			console.error(e);
		}
	});
}

/* 스와이프영역 차트 조회 */
function fn_getPalSmryDashBoard(){
//	console.log("srchDate",srchDate);
//	return;
	transaction({
		url : '/result/getForeignPalSmryDashBoard.do'
		,params : {srchDate : srchDate }
		,complete:function(){}
	},function(result,e){
		if(!e){
			fn_mkChart01(result.resultList01);
			fn_mkChart02(result.resultList02);
		}else{
			console.error(e);
		}
	});
}
/* 하단 테이블 조회 */
function fn_getForeignSmryList(){
	
	var ctryCd = $(".dataType.active").attr("data-code");
	if(!ctryCd) ctryCd = null;
	
	transaction({
		 url : '/result/getForeignSmryList.do'
		,params : {srchDate : srchDate , ctryCd : ctryCd }
	},function(result,e){
		if(!e){
			var data = fn_convertDataToList(result.resultList[0]);
			console.log(data);
			
			$("#data-tot-spct").text(fn_setNumberUnit(data[0].rcd,"T"));
			$("#data-pln-per").text(fn_setNumberUnit(data[0].pln,"P"));
			
			if($(".dataType.active").attr("data-code") == "80"){
				fn_mkRowType4Dx(data);
			}else if($(".dataType.active").attr("data-code") == "90"){
				fn_mkRowTypeScreenX(data);
			}else{
				fn_mkRow(data);
			}
		}else{
			console.error(e);
		}
	});
}

/*=============[ TRANSACTION END ]=========================*/

//function fn_getSmryDashBoard(){
//	fn_getPalSmryDashBoard();
//	var data = fn_mkTestData();
//	var data2 = fn_mkWaterFallTestData();
//	fn_mkChart01(data);
//	fn_mkChart02(data2);
//	fn_mkChart03(data);
//	fn_mkChart04(data2);
//}

/*=============[ FUNCTION END ]=========================*/
function fn_initSearch(){
	$(".btn.btn-accordion.full-view").removeClass("open").addClass("close");
	fn_getForeignSmryList();
}

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
/* 1번 차트 생성 (부채꼴 차트) */
function fn_mkChart01(data){
	for(var i in data){
		if(data[i].ctryCd == "01"){
			data[i].color = am4core.color(COLOR_ARR[8]);
			data[i].colorClass = "color06";
		}else if(data[i].ctryCd == "02"){
			data[i].color = am4core.color(COLOR_ARR[11]);
			data[i].colorClass = "color09";
		}else if(data[i].ctryCd == "03"){
			data[i].color = am4core.color(COLOR_ARR[10]);
			data[i].colorClass = "color08";
		}else if(data[i].ctryCd == "04"){
			data[i].color = am4core.color(COLOR_ARR[12]);
			data[i].colorClass = "color10";
		}else if(data[i].ctryCd == "05"){
			data[i].color = am4core.color(COLOR_ARR[14]);
			data[i].colorClass = "color12";
		}else if(data[i].ctryCd == "06"){
			data[i].color = am4core.color(COLOR_ARR[13]);
			data[i].colorClass = "color11";
		}else if(data[i].ctryCd == "07"){
			data[i].color = am4core.color(COLOR_ARR[15]);
			data[i].colorClass = "color12";
		}else if(data[i].ctryCd == "08"){
			data[i].color = am4core.color(COLOR_ARR[9]);
			data[i].colorClass = "color07";
		}else{
			data[i].color = am4core.color(COLOR_ARR[5]);
			data[i].colorClass = "color03";
		}
	}
	
	if(chart01) chart01.dispose();
	chart01 = gfn_mkHalfPieChart(data,{
		 chartDivId : "chart01"
		,category : "ctryNm"
		,valueKey : "conf"
		,colorField   : "color"
		,tooltipText : "{category} \n {value.formatNumber('#,###')} \n {value.percent.formatNumber('#.0')}%"
	});
	
	fn_mkLgnd(data);
	
	chart01.events.on("ready",function(re){
		chart01.series.values[0].slices.each(function(item){
			var dataCtryCd = item.dataItem.dataContext.ctryCd;
			if(dataCtryCd == "01") item.alwaysShowTooltip = true;
		});
		
		$("li.dataType").on("click",function(ce){
			var tabCtryCd = $(ce.target).attr("data-code");
			chart01.series.values[0].slices.each(function(item){
				var dataCtryCd = item.dataItem.dataContext.ctryCd;
				item.alwaysShowTooltip = false;
				item.tooltip.hide();
				if(tabCtryCd == dataCtryCd){
					item.alwaysShowTooltip = true;
				}
				
				if(!tabCtryCd && dataCtryCd == "01") item.alwaysShowTooltip = true;
				
			});
		});
	});
}

/* 차트 범례 생성 */
function fn_mkLgnd(data){
	var ulhtml = ``;
	var ulGrp = 0;
	
	$("#chart01Lgnd").empty();
	//create ul Tag
	for(var i=0; i<Math.ceil((data.length)/4); i++){
		ulhtml += `
			<ul class="lgnd-area style03 chart01" style="width:280px;"></ul>
		`;
		$("#chart01Lgnd").append(ulhtml);
	}
	for(var i=0; i<data.length; i++){
		var width;
		
		if(i%4==0){
			width = "width:80px;";
		}else if(i%4==1){
			width = "width:65px;";
		}else if(i%4==2){
			width = "width:70px;";
		}else if(i%4==3){
			width = "width:55px;";
		}
		
		var liHtml = `
			<li class="${data[i].colorClass} type-b" style="${width}">${data[i].ctryNm}</li>
		`;
		
		var ulIdx = Math.floor(i/4);
		$(".chart01.lgnd-area").eq(ulIdx).append(liHtml);
	}
}

/* 2번 차트 생성 (폭포 차트) */
function fn_mkChart02(data){
//	console.log("var data2 = fn_mkWaterFallTestData();",fn_mkWaterFallTestData());
// open - 데이터의 시작점
// step - 데이터 시작점 표기
// value - 데이터의 양
// display - 표기 데이터
	var totPln,totRcd;
	for(var i in data){
		var cnvtDataObj = {};
		if(i==0){ // 총계획
			data[i].color = COLOR_ARR[5];
			data[i].open = 0;
			data[i].value = data[i].constPln;
			data[i].step =  data[i].constPln;
			totPln = data[i].constPln;
			data[i].display = fn_setNumberUnit(data[i].constPln,"B").replace("-","");
		}else if( i == data.length-1){ //총 실적
			data[i].color = COLOR_ARR[16];
			data[i].open = 0;
			data[i].value = data[i]["const"];
			data[i].display = fn_setNumberUnit(data[i]["const"],"B").replace("-","");
		}else{ //국가별
			data[i].open  = totPln;
			data[i].step  = totPln-data[i]["constPlnDiff"];
			data[i].value = totPln-data[i]["constPlnDiff"];
			data[i].color = data[i]["constPlnDiff"] > 0 ? COLOR_ARR[17] : COLOR_ARR[13];
			totPln = totPln - data[i]["constPlnDiff"];
			data[i].display = fn_setNumberUnit(data[i]["constPlnDiff"],"B").replace("-","");
		}
		data[i].cd = data[i].ctryNm;
	}

	if(chart02) chart02.dispose();
	chart02 = gfn_mkWaterFallChart(data,{
		 chartDivId   : "chart02"
		,category     : "cd"
		,openValueKey : "open"
		,stepValueKey : "step"
		,valueKey     : "value"
		,colorField   : "color"
		,displayValue : "display"
	});
	chart02.paddingRight = 0;
	chart02.paddingLeft = 0;
	
	chart02.events.on("ready",function(re){
		$("li.dataType").on("click",function(ce){
			var tabCtryCd = $(ce.target).attr("data-code");
			chart02.series.values[0].columns.each(function(item){
				var dataCtryCd = item.dataItem.dataContext.ctryCd;
				
				item.alwaysShowTooltip = false;
				item.tooltip.hide();
				
				if(tabCtryCd == dataCtryCd){
					console.log(item);
					item.alwaysShowTooltip = true;
				}
			});
		});
	});
}

///* 2번 차트 생성 */
//function fn_mkChart02(data){
//	if(chart02) chart02.dispose();
//	chart02 = gfn_mkOverlapChart(data,{
//		 chartDivId : "chart02"
//		,category : "country"
//		,series : [
//			 { field : "sgna"       , name : "sgna"       , isStack : false , color : COLOR_ARR[7]    , width : 70}
//			,{ field : "stfCost"    , name : "stfCost"    , isStack : false , color : COLOR_ARR[13] , width : 40}
//			,{ field : "rentalUtil" , name : "rentalUtil" , isStack : true  , color : COLOR_ARR[10] , width : 40}
//		]
//	});
//}
///* 3번 차트 생성 */
//function fn_mkChart03(data){
//	if(chart03) chart03.dispose();
//	chart03 = gfn_mkOverlapChart(data,{
//		chartDivId : "chart03"
//		,category : "country"
//		,series : [
//			 { field : "totSale"    , name : "totSale"    , isStack : false , color : COLOR_ARR[7] , width : 70}
//			,{ field : "boSale"     , name : "boSale"     , isStack : false , color : COLOR_ARR[10] , width : 40}
//			,{ field : "conSale"    , name : "conSale"    , isStack : true  , color : COLOR_ARR[13] , width : 40}
//			,{ field : "boSalePer"  , name : "boSalePer"  , isStack : false , color : COLOR_ARR[15] , valueAxisType : 2}
//			,{ field : "conSalePer" , name : "conSalePer" , isStack : false , color : COLOR_ARR[8] , valueAxisType : 2}
//		]
//	});
//}

//폭포차트 테스트 데이터
function fn_mkWaterFallTestData(){
	var countryList = [
		{name: '대한민국'  ,cd :'KR'  , pln :getRandomInt(100,10000) ,rcd :getRandomInt(100,10000)}
		,{name: '중국'     ,cd :'CN' , pln :getRandomInt(100,10000) ,rcd :getRandomInt(100,10000)}
		,{name: '베트남'   ,cd :'VN' , pln :getRandomInt(100,10000) ,rcd :getRandomInt(100,10000)}
		,{name: '인도네시아',cd:'ID' , pln :getRandomInt(100,10000) ,rcd :getRandomInt(100,10000)}
		,{name: '터키'     ,cd :'TR' , pln :getRandomInt(100,10000),rcd :getRandomInt(100,10000)}
		,{name: '미얀마'    ,cd :'MM' , pln :getRandomInt(100,10000),rcd :getRandomInt(100,10000)}
		,{name: '미국'     ,cd :'US' , pln :getRandomInt(100,10000),rcd :getRandomInt(100,10000)}
		,{name: '러시아'    ,cd :'RU' , pln :getRandomInt(100,10000),rcd :getRandomInt(100,10000)}
		,{name: '러시아'    ,cd :'AA' , pln :getRandomInt(100,10000),rcd :getRandomInt(100,10000)}
//		,{name: '러시아'    ,cd :'BB' , pln :getRandomInt(100,10000),rcd :getRandomInt(100,10000)}
	]
	var dataList = [];
	var totPln = 0 , totRcd = 0;
	
	
	for(var i in countryList){
		totPln += countryList[i].pln;
		totRcd += countryList[i].rcd;
		countryList[i].diff = countryList[i].pln - countryList[i].rcd;
	}
	gfn_dataSort(countryList,"diff");
	
	dataList.push({name:'계획', cd:'pln', open:0, step:totPln, display:totPln, value:totPln , color:COLOR_ARR[5]});
	
	var tempData = totPln;
	var totDiff = 0;
	
	for(var i in countryList){
		var diffData = countryList[i].diff;
		totDiff += diffData;
		countryList[i].display = diffData;
		countryList[i].open = tempData;
		
		tempData = tempData + diffData;
		countryList[i].step = tempData;
		countryList[i].value = tempData;
		
		if(diffData < 0){
			countryList[i].color = COLOR_ARR[17];
		}else{
			countryList[i].color = COLOR_ARR[13];
		}
		
		dataList.push(countryList[i]);
	}
	var lastDiff = totPln+totDiff;
	dataList.push({name:'실적', cd:'rcd', open:0, display:lastDiff, value:lastDiff , color:COLOR_ARR[16]});
	return dataList;
}

function fn_mkTestData(){
	var countryList = [
		{name: '대한민국'  ,cd :'KR'  , color : am4core.color(COLOR_ARR[8]) }
		,{name: '중국'     ,cd :'CN' , color : am4core.color(COLOR_ARR[9]) }
		,{name: '베트남'   ,cd :'VN' , color : am4core.color(COLOR_ARR[10]) }
		,{name: '미국'     ,cd :'US' , color : am4core.color(COLOR_ARR[11]) }
		,{name: '인니'     ,cd:'ID' , color : am4core.color(COLOR_ARR[12]) }
		,{name: '터키'     ,cd :'TR' , color : am4core.color(COLOR_ARR[13]) }
		,{name: '미얀마'    ,cd :'MM' , color : am4core.color(COLOR_ARR[14]) }
		,{name: '러시아'    ,cd :'RU' , color : am4core.color(COLOR_ARR[15]) }
	]

	var dataList = [];
	for(var i in countryList){
		var dataObj = {};
		dataObj.color    = countryList[i].color;
		dataObj.country    = countryList[i].cd;
		dataObj.countryNm  = countryList[i].name;
		dataObj.actual     = getRandomInt(100,10000);
		dataObj.budget     = getRandomInt(100,10000);
		dataObj.vsBudget   = getRandomInt(100,10000);
		dataObj.occ        = getRandomInt(1,99);
		
		dataObj.adm        = getRandomInt(100,10000);
		dataObj.sgna       = getRandomInt(100,10000);
		dataObj.stfCost    = getRandomInt(100,10000);
		dataObj.rentalUtil = getRandomInt(100,10000);
		
		dataObj.totSale    = getRandomInt(20000,30000);
		dataObj.boSale     = getRandomInt(100,10000);
		dataObj.conSale    = getRandomInt(100,10000);
		dataObj.boSalePer  = getRandomInt(1,99);
		dataObj.conSalePer = getRandomInt(1,99);
		
		dataList.push(dataObj);
	}
	return dataList;
}

/* 리스트 형식으로 데이터 변환 */
function fn_convertDataToList(data){
  var rtnList = [];
  var idx = 0;
  var rowObj = {};
  var bfRowGrpCd;
  var objLength = Object.keys(data).length -1;
  data = sortObject(data);
  
  for(var key in data){
    
    //ROW 코드
    var rowCd = key.substr(0,2);
    //COLUNM 코드
    var colCd = key.substr(2,2);
    
    if(colCd.substr(1,1) == "0" && idx != 0){
      rtnList.push(rowObj);
      rowObj = {};
    }
    
    //ROW GROUP
    if(!bfRowGrpCd || bfRowGrpCd != rowCd.substr(0,1)){
      rowObj.lvl = 1;
    }
    
    //COLUNM
    if(colCd.substr(1,1) == "0"){
      rowObj.gubun = data[key];
    }else if(colCd.substr(1,1) == "1"){
      rowObj.rcd = data[key];
    }else if(colCd.substr(1,1) == "2"){
      rowObj.pln = data[key];
    }else if(colCd.substr(1,1) == "3"){
      rowObj.plnDiff = data[key];
    }else if(colCd.substr(1,1) == "4"){
      rowObj.yAgo = data[key];
    }else if(colCd.substr(1,1) == "5"){
      rowObj.yAgoDiff = data[key];
    }else if(colCd.substr(1,1) == "6"){
      rowObj.rcdDiff = data[key];
    }
    
    idx++;
    if(idx == objLength) rtnList.push(rowObj);
    bfRowGrpCd = rowCd.substr(0,1);
  };
  return rtnList;
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

/* 테이블 ROW 생성 */
function fn_mkRow(data){
  var html = ``;
  var depthBtn,depthCls,indentCls;
  var ctryCd = $(".dataType.active").attr("data-code");
  
  for(var i in data){
	if(!ctryCd && (i == 3 || i == 4 || i == 5 || i == 6)) continue;
    if(data[i].lvl == 1){
      depthCls = "group-top";
      depthBtn = `<button type="button" class="btn ${data[i].gubun == '매출이익'? '':'btn-accordion'}"></button>`;
      indentCls= "";
    }else{
      depthCls = "group-bottom";
      depthBtn = ``;
      if(i == 1 || i == 2){
        indentCls = "indent02";
      }else{
        indentCls = "indent01";
      }
    }
    
    var type;
    var rowData = {};
    
    if(i == 0)     	 type = "A"; /* 관람객 , 직영 , 위탁 */
    else if(i==1)   type = "A";
    else if(i==2)   type = "A";
    
    else if(i==3)   type = "B";/* MS , BO MS */
    else if(i==4)   type = "B";
    
    else if(i==5)   type = "C";/* ATP , SPP */
    else if(i==6)   type = "C";
    
//    else if(i==13)   type = "D";/* 상영 , 매점 */
//    else if(i==14)   type = "D";
    
    else if(i==25)  type = "E";/* 공헌이익율 */
    
    else            type = "Df";/* 그외 */
    
    rowData.c1FontColor = "";
    rowData.c2FontColor = "";
    rowData.c1Marker    = "";
    rowData.c2Marker    = "";
    rowData.c0AddTxt    = "";
    rowData.c1AddTxt    = "";
    rowData.c2AddTxt    = "";
    rowData.c2AddTxt    = "";
    rowData.c1AddTxtS   = "";
    rowData.c2AddTxtS   = "";
    
    
    if(type == "A"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "T");
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "T");
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "T");
      
      rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c1AddTxt = "%";
      rowData.c2AddTxt = "%";
    }else if(type == "B"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "P2");
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "P2", true);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "P2");
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P2", true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "P2");
      
      rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c1Marker = data[i].pln  > 0 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      
      rowData.c0AddTxt = "%";
      rowData.c1AddTxt = "%p";
      rowData.c2AddTxt = "%p";
      rowData.c1AddTxtS = "%";
      rowData.c2AddTxtS = "%";
    }else if(type == "C"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = gfn_numberFormat(data[i].rcd     );
      rowData.pln      = gfn_numberFormat(Math.abs(data[i].pln)     );
      rowData.plnDiff  = gfn_numberFormat(data[i].plnDiff );
      rowData.yAgo     = gfn_numberFormat(Math.abs(data[i].yAgo)    );
      rowData.yAgoDiff = gfn_numberFormat(data[i].yAgoDiff);
      
      rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c1Marker = data[i].pln  > 0 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      
    }else if(type == "D"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "B");
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "B");
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "B");
      rowData.rcdDiff  = fn_setNumberUnit(data[i].rcdDiff  , "P");
      
      rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c1AddTxt = "%";
      rowData.c2AddTxt = "%";
      rowData.c0AddTxtS = "%";
    }else if(type == "E"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "P");
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", true);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "P");
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "P");
      
//      console.log(data[i]);
//      console.log(rowData);
      rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c1Marker = data[i].pln  > 0 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c0AddTxt = "%";
      rowData.c1AddTxt = "%p";
      rowData.c2AddTxt = "%p";
      rowData.c1AddTxtS = "%";
      rowData.c2AddTxtS = "%";
    }else{
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "B");
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "B");
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "B");
      rowData.rcdDiff  = fn_setNumberUnit(data[i].rcdDiff  , "P");
      
      rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c1AddTxt = "%";
      rowData.c2AddTxt = "%";
    }
    rowData.rowType = type;
    
    html += `
      <tr class='${depthCls}' status="c">
        <td class='${indentCls}'>${rowData.gubun} ${depthBtn}</td>
        <td class='align-r'>
        	${rowData.rcd}${rowData.c0AddTxt}
        	${rowData.rcdDiff ? "<span class='s-font'>"+rowData.rcdDiff+"%</span>" : ""}
        </td>
        <td class='align-r'>
          <span class='${rowData.c1FontColor} ${rowData.c1Marker}'>${rowData.pln}${rowData.c1AddTxt}</span>
          <span class='s-font'>${rowData.plnDiff}${rowData.c1AddTxtS}</span>
        </td>
        <td class='align-r'>
          <span class='${rowData.c2FontColor} ${rowData.c2Marker}'>${rowData.yAgo}${rowData.c2AddTxt}</span>
          <span class='s-font'>${rowData.yAgoDiff}${rowData.c1AddTxtS}</span>
        </td>
      </tr>
    `
  }
  $("#tbl-palSmry").empty().append(html);
}

function fn_mkRowType4Dx(data){
//	console.log("fn_mkRowType4Dx",data);
	
	var html = ``;
	var depthBtn,depthCls,indentCls;
	
	for(var i in data){
		if(data[i].lvl == 1){
			if(data[i] && data[Number(i)+1].lvl == 1){
				depthBtn = ``;
			}else{
				depthBtn = `<button type="button" class="btn btn-accordion"></button>`;
			}
//			if(data[i].gubun != "운영관수" && data[i].gubun == "오픈관수" && data[i].gubun == "산적건수" && data[i].gubun == "계약건수"){
//				depthBtn = `<button type="button" class="btn btn-accordion"></button>`;
//			}
			depthCls = "group-top";
			indentCls= "";
		}else{
			depthCls = "group-bottom";
			depthBtn = ``;
			indentCls = "indent01";
//			if(i == 1 || i == 2){
//				indentCls = "indent02";
//			}else{
//				indentCls = "indent01";
//			}
		}
		
		var type = "Df";
		var rowData = {};
		rowData.c1FontColor = "";
		rowData.c2FontColor = "";
		rowData.c1Marker    = "";
		rowData.c2Marker    = "";
		rowData.c0AddTxt    = "";
		rowData.c1AddTxt    = "";
		rowData.c2AddTxt    = "";
		rowData.c2AddTxt    = "";
		rowData.c1AddTxtS   = "";
		rowData.c2AddTxtS   = "";
		
		if(i == 3 || i==4 || i==5) type = "A";			/* 객석률,국내,해외,공헌이익률 */
		else if(i == 6 || i==7 || i==8 || i==9) type = "B";		/* 운영,오픈,산적,계약 건수 */
		else if(i==26) type = "C";
		else if(i==0 || i==1 || i==2) type ="D";
		
		if(type == "A"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "P");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "P");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "P");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c0AddTxt = "%";
			rowData.c1AddTxt = "%p";
			rowData.c2AddTxt = "%p";
			rowData.c1AddTxtS = "%";
			rowData.c2AddTxtS = "%";
		}else if(type == "B"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = gfn_numberFormat(data[i].rcd     );
			rowData.pln      = gfn_numberFormat(Math.abs(data[i].pln)     , true);
			rowData.plnDiff  = gfn_numberFormat(data[i].plnDiff );
			rowData.yAgo     = gfn_numberFormat(Math.abs(data[i].yAgo)    , true);
			rowData.yAgoDiff = gfn_numberFormat(data[i].yAgoDiff);
			rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c1Marker = data[i].pln   > 0 ? "gain" : "fall";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
		}else if(type == "C"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "P");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "P");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "P");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c0AddTxt = "%";
			rowData.c1AddTxt = "%p";
			rowData.c2AddTxt = "%p";
		}else if(type == "D"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "T");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "T");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "T");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c1AddTxt = "%";
			rowData.c2AddTxt = "%";
		}else{
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "B");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "B");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "B");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c1AddTxt = "%";
			rowData.c2AddTxt = "%";
		}
		
		html += `
			<tr class='${depthCls}' status="c">
				<td class='${indentCls}'>${rowData.gubun} ${depthBtn}</td>
				<td class='align-r'>
					${rowData.rcd}${rowData.c0AddTxt}
					${rowData.rcdDiff ? "<span class='s-font'>"+rowData.rcdDiff+"%</span>" : ""}
				</td>
				<td class='align-r'>
					<span class='${rowData.c1FontColor} ${rowData.c1Marker}'>${rowData.pln}${rowData.c1AddTxt}</span>
					<span class='s-font'>${rowData.plnDiff}${rowData.c1AddTxtS}</span>
				</td>
				<td class='align-r'>
					<span class='${rowData.c2FontColor} ${rowData.c2Marker}'>${rowData.yAgo}${rowData.c2AddTxt}</span>
					<span class='s-font'>${rowData.yAgoDiff}${rowData.c1AddTxtS}</span>
				</td>
			</tr>
		`;
	}
	$("#tbl-palSmry").empty().append(html);
}

function fn_mkRowTypeScreenX(data){
//	console.log("fn_mkRowTypeScreenX",data);
	
	var html = ``;
	var depthBtn,depthCls,indentCls;
	
	for(var i in data){
		if(data[i].lvl == 1){
			if(data[i] && data[Number(i)+1].lvl == 1){
				depthBtn = ``;
			}else{
				depthBtn = `<button type="button" class="btn btn-accordion"></button>`;
			}
			depthCls = "group-top";
			indentCls= "";
		}else{
			depthCls = "group-bottom";
			depthBtn = ``;
			indentCls = "indent01";
		}
		
		var type = "Df";
		var rowData = {};
		rowData.c1FontColor = "";
		rowData.c2FontColor = "";
		rowData.c1Marker    = "";
		rowData.c2Marker    = "";
		rowData.c0AddTxt    = "";
		rowData.c1AddTxt    = "";
		rowData.c2AddTxt    = "";
		rowData.c2AddTxt    = "";
		rowData.c1AddTxtS   = "";
		rowData.c2AddTxtS   = "";
		
		if(i == 1) type = "A";			/* 객석률,국내,해외,공헌이익률 */
		else if(i == 2 || i==3 || i==4 || i==5) type = "B";		/* 운영,오픈,산적,계약 건수 */
		else if(i==20) type = "C";
		else if(i==0) type = "D";
		if(type == "A"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "P");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "P");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "P");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c1AddTxt = "%p";
			rowData.c2AddTxt = "%p";
			rowData.c1AddTxtS = "%";
			rowData.c2AddTxtS = "%";
		}else if(type == "B"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = gfn_numberFormat(data[i].rcd     );
			rowData.pln      = gfn_numberFormat(Math.abs(data[i].pln)     , true);
			rowData.plnDiff  = gfn_numberFormat(data[i].plnDiff );
			rowData.yAgo     = gfn_numberFormat(Math.abs(data[i].yAgo)    , true);
			rowData.yAgoDiff = gfn_numberFormat(data[i].yAgoDiff);
			rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c1Marker = data[i].pln   > 0 ? "gain" : "fall";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
		}else if(type =="C"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "P");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "P");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "P");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c1AddTxt = "%p";
			rowData.c2AddTxt = "%p";
		}else if(type =="D"){
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "T");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "T");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "T");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c1AddTxt = "%";
			rowData.c2AddTxt = "%";
		}else{
			rowData.gubun    = data[i].gubun;
			rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "B");
			rowData.pln      = fn_setNumberUnit(data[i].pln      , "P", false);
			rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "B");
			rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "P", true);
			rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "B");
			rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
			rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
			rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
			rowData.c1AddTxt = "%";
			rowData.c2AddTxt = "%";
		}
		
		html += `
			<tr class='${depthCls}' status="c">
				<td class='${indentCls}'>${rowData.gubun} ${depthBtn}</td>
				<td class='align-r'>
					${rowData.rcd}${rowData.c0AddTxt}
					${rowData.rcdDiff ? "<span class='s-font'>"+rowData.rcdDiff+"%</span>" : ""}
				</td>
				<td class='align-r'>
					<span class='${rowData.c1FontColor} ${rowData.c1Marker}'>${rowData.pln}${rowData.c1AddTxt}</span>
					<span class='s-font'>${rowData.plnDiff}${rowData.c1AddTxtS}</span>
				</td>
				<td class='align-r'>
					<span class='${rowData.c2FontColor} ${rowData.c2Marker}'>${rowData.yAgo}${rowData.c2AddTxt}</span>
					<span class='s-font'>${rowData.yAgoDiff}${rowData.c1AddTxtS}</span>
				</td>
			</tr>
		`;
	}
	$("#tbl-palSmry").empty().append(html);
}

/*천명 , 억원 단위 절삭*/
function fn_setNumberUnit(number, numType, absFlag){
	if("number" != typeof number ) return number;
	var numType,convertedNum;
	
	if(absFlag) number = Math.abs(number);
	
	if(numType == "B"){
		if(!number) return "0.0"
		convertedNum = number/100000000;
		convertedNum = Math.round(convertedNum);
	}else if(numType == "T"){
		if(!number) return "0"
		convertedNum = number/1000;
		convertedNum = Math.round(convertedNum);
	}else if(numType =="P"){
		convertedNum = Number(number).toFixed(1);
	}else if(numType =="P2"){
		convertedNum = Number(number).toFixed(2);
	}
	convertedNum = gfn_numberFormat(convertedNum);
	return convertedNum;
};