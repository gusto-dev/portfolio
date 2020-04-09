//var chart01,chart02,chart03;
var chart_swiper;
var rsSiteNm, rsSiteCd, srchDate, rsSiteType;
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
    fn_initSearch();
  });
  
  /*검색 타입 변경시 이벤트*/
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
  
  /*RS/SITE 검색후 변경 이벤트*/
  $("[name='rsSiteName']").on("change",function(e){
    rsSiteType = $("#srchType").attr("data-val");
    rsSiteNm = $(e.target).text();
    rsSiteCd = $(e.target).attr("data-code");
    fn_initSearch();
  });
  
  /* 페이지 하단 탭 (영화 , 회차 , 포맷, 상영관) 클릭 이벤트 */
  $(".tab01").on("click",function(evnt){
    if($(evnt.target).hasClass("btn03")){
      $(evnt.target).parent("ul").next(".tab-right").hide();
    }else{
      $(evnt.target).parent("ul").next(".tab-right").show();
    }
    gfn_tabSwith(evnt.target,function(tabInfo){
      
    });
  });
  
  fn_getLastTotMonth(); //최근 마감월 조회
  fn_initSearch(); //조회,재조회
}
/*=============[ INIT END ]=========================*/
/* 최근 마감월 조회 */
function fn_getLastTotMonth(){
	transaction({
		url : '/result/getLastTotMonth.do'
		,asyncFlag : false
	},function(result, e){
		if(!e){
			console.log("getLastTotMonth",result);
			var lastTotMonth = result.basYm+"";
			var y = lastTotMonth.substr(0,4);
			var m = lastTotMonth.substr(4,2);
			$("#srchDate").val(y+"-"+m);
		}else{
			console.log(e);
		}
	});
}

/* 대시보드 데이터 조회 */
function fn_getPalSmryDashBoard(){
  transaction({
    url : '/result/getPalSmryDashBoard.do'
    ,params : {srchDate : srchDate , srchType : rsSiteType , srchValue : rsSiteCd}
    ,complete:function(){
      
    }
  },function(result,e){
    if(!e){
      var data = result.resultList[0];
      fn_setDashBoard(data);
      fn_getPalSmryList();
    }else{
      console.error(e);
    }
  });
}

/* 하단 테이블 데이터 조회 */
function fn_getPalSmryList(){
  transaction({
    url : '/result/getPalSmryList.do'
    ,params : {srchDate : srchDate , srchType : rsSiteType , srchValue : rsSiteCd}
  },function(result,e){
    if(!e){
      var data = result;
      var lst = fn_convertDataToList(data);
      console.log(lst);
      fn_mkRow(lst);
    }else{
      console.error(e);
    }
  });
}
/*=============[ TRANSACTION END ]=========================*/

function fn_initSearch(){
  $(".btn.btn-accordion.full-view").removeClass("open").addClass("close");
  fn_getPalSmryDashBoard();
  gfn_setRsSiteName(rsSiteType,rsSiteNm);
}

/* 요약보드 데아터 set */
function fn_setDashBoard(data){
  if(!data){
    
  }else{
    for(var key in data){
      data[key] = fn_setNumberUnit(data[key],key);
      $("#"+key).text(data[key]);
    }
  }
}

/*천명 , 100만원 단위 절삭*/
function fn_setNumberUnit(number , key , isTbl , roundFlag , absFlag){
  if("number" != typeof number ) return number;
  var numType,convertedNum,addClassNm;
  if(key.search("Cnt") != -1) numType = "T";
  else if(key.search("Per") != -1 || key.search("Rt") != -1 ) numType = "P";
  else numType = "M";
  
  if(numType == "M"){
    if(number == 0) return "0"
    convertedNum = number/1000000;
    convertedNum = Math.round(convertedNum);
//    convertedNum = (Math.round(convertedNum*10)/10).toFixed(1);
  }else if(numType == "T"){
    if(number == 0) return "0"
    convertedNum = number/1000;
    convertedNum = Math.round(convertedNum);
  }else if(numType =="P"){
    if(isTbl){
    	
      /* 테이블 퍼센트 표기 */
        if(roundFlag) convertedNum = number.toFixed(2);
        else convertedNum = number.toFixed(1);
    }else{
      convertedNum = number.toFixed(1);
      if(number < 100) addClassNm = "fall";
      else addClassNm = "gain";
      $("#"+key).parent("span").removeClass("gain fall").addClass(addClassNm);
    }
  }else{
    return;
  }
  convertedNum = gfn_numberFormat(convertedNum);
  if(absFlag) convertedNum = (convertedNum+"").replace("-","");
  return convertedNum;
};

/* 테이블 ROW 생성 */
function fn_mkRow(data){
  var html = ``;
  var depthBtn,depthCls,indentCls;
  for(var i in data){
    
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
    
    else if(i==13)   type = "D";/* 상영 , 매점 */
    else if(i==14)   type = "D";
    
    else if(i==25)  type = "E";/* 공헌이익율 */
    
    else if(i==23)  type = "F";/* 기타 */
    
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
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "rcdCnt");
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "plnPer" , false, false); //number , key , isTbl , roundFlag , absFlag
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "plnDiffCnt");
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "yAgoPer" , false, false, true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "yAgoDiffCnt");
      
      rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c1AddTxt = "%";
      rowData.c2AddTxt = "%";
    }else if(type == "B"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "rcdPer"      , true , true); 		//number , key , isTbl , roundFlag , absFlag
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "plnPer"      , true , true, true);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "plnDiffPer"  , true , true);
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "yAgoPer"     , true , true, true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "yAgoDiffPer" , true , true);
      
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
      rowData.pln      = gfn_numberFormat(Math.abs(data[i].pln));
      rowData.plnDiff  = gfn_numberFormat(data[i].plnDiff );
      rowData.yAgo     = gfn_numberFormat(Math.abs(data[i].yAgo));
      rowData.yAgoDiff = gfn_numberFormat(data[i].yAgoDiff);
      
      rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c1Marker = data[i].pln  > 0 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      
    }else if(type == "D"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "rcdAmt"      , true);					//number , key , isTbl , roundFlag , absFlag
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "plnPer"      , true, false);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "plnDiffAmt"  , true);
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "yAgoPer"     , true, false, true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "yAgoDiffAmt" , true);
      rowData.rcdDiff  = fn_setNumberUnit(data[i].rcdDiff , "rcdDiffPer"   , true);
      
      rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
//      rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c1AddTxt = "%";
      rowData.c2AddTxt = "%";
      rowData.c0AddTxtS = "%";
    }else if(type == "E"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "rcdPer"      , true);					//number , key , isTbl , roundFlag , absFlag
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "plnPer"      , true, false, true);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "plnDiffPer"  , true);
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "yAgoPer"     , true, false, true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "yAgoDiffPer" , true);
      
      rowData.c1FontColor = data[i].pln  > 0 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
      rowData.c1Marker = data[i].pln  > 0 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c0AddTxt = "%";
      rowData.c1AddTxt = "%p";
      rowData.c2AddTxt = "%p";
    }else if(type == "F"){
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "rcdAmt"      , true);					//number , key , isTbl , roundFlag , absFlag
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "plnPer"      , true, false);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "plnDiffAmt"  , true);
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "yAgoPer"     , true, false, true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "yAgoDiffAmt" , true);
      rowData.rcdDiff  = fn_setNumberUnit(data[i].rcdDiff , "rcdDiffPer"   , true);
      
      rowData.c1FontColor = data[i].pln  > 100 ? "f-color01" : "f-color02";
      rowData.c2FontColor = data[i].yAgo > 0 ? "f-color01" : "f-color02";
//      rowData.c1Marker = data[i].pln  > 100 ? "gain" : "fall";
      rowData.c2Marker = data[i].yAgo  > 0 ? "gain" : "fall";
      rowData.c1AddTxt = "%";
      rowData.c2AddTxt = "%";
      rowData.c0AddTxtS = "%";
    }else{
      rowData.gubun    = data[i].gubun;
      rowData.rcd      = fn_setNumberUnit(data[i].rcd      , "rcdAmt"      , true);					//number , key , isTbl , roundFlag , absFlag
      rowData.pln      = fn_setNumberUnit(data[i].pln      , "plnPer"      , true, false);
      rowData.plnDiff  = fn_setNumberUnit(data[i].plnDiff  , "plnDiffAmt"  , true);
      rowData.yAgo     = fn_setNumberUnit(data[i].yAgo     , "yAgoPer"     , true, false, true);
      rowData.yAgoDiff = fn_setNumberUnit(data[i].yAgoDiff , "yAgoDiffAmt" , true);
      
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

/* 리스트 형식으로 데이터 변환 */
function fn_convertDataToList(data){
  var rtnList = [];
  var idx = 0;
  var rowObj = {};
  var bfRowGrpCd;
  var objLength = Object.keys(data).length -2;
  data = sortObject(data)
  for(var key in data){
    if(key == "mobile_return_code") continue;
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

/*=============[ FUNCTION END ]=========================*/
//function fn_mkChart01(data){
//	data = [
//		 {recodeType : "R" , recodeName : "실적" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[0]}
//		,{recodeType : "P" , recodeName : "계획" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[5]}
//		,{recodeType : "Y" , recodeName : "전년" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[6]}
//	]
//
//	if(chart01) chart01.dispose();
//	chart01 = gfn_mkXYChart(data,{
//		chartDivId : "chart01"
//		,categoryName : "recodeName"
//		,cursor     : true
//		,series : [
//			{type:"col", valueKey:"recode", name:"recodeName"}
//		]
//	});
//}
//function fn_mkChart02(data){
//	data = [
//		 {recodeType : "R" , recodeName : "실적" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[0]}
//		,{recodeType : "P" , recodeName : "계획" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[5]}
//		,{recodeType : "Y" , recodeName : "전년" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[6]}
//	]
//
//	if(chart02) chart02.dispose();
//	chart02 = gfn_mkXYChart(data,{
//		chartDivId : "chart02"
//		,categoryName : "recodeName"
//		,cursor     : true
//		,series : [
//			{type:"col", valueKey:"recode", name:"recodeName"}
//		]
//	});
//}
//function fn_mkChart03(data){
//	data = [
//		 {recodeType : "R" , recodeName : "실적" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[0]}
//		,{recodeType : "P" , recodeName : "계획" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[5]}
//		,{recodeType : "Y" , recodeName : "전년" , recode : getRandomInt(1000,9999) , color : COLOR_ARR[6]}
//	]
//
//	if(chart03) chart03.dispose();
//	chart03 = gfn_mkXYChart(data,{
//		chartDivId : "chart03"
//		,categoryName : "recodeName"
//		,cursor     : true
//		,series : [
//			{type:"col", valueKey:"recode", name:"recodeName"}
//		]
//	});
//}
