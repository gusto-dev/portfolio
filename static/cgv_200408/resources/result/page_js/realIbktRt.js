var lastTotDtm , rsSiteNm , rsSiteCd , rsSiteType;
var movFrCnt, movToCnt;
var seatWgtFrCnt, seatWgtToCnt;
var spctWgtFrCnt, spctWgtToCnt;
var openRtFrCnt, openRtToCnt;

var dateList;

//TODO 실적 예매 집계 일 갯수 (4,7일)
const DATE_CNT = 7;

function fn_init(){
	
	if(!rsSiteCd) rsSiteCd = "";
	if(!rsSiteType) rsSiteType = "all";
	
	$("#srchType").attr("data-val",rsSiteType);
	if(rsSiteType == "all") $("#srchType").text("전체");
	else if(rsSiteType == "rs") $("#srchType").text("RS");
	else if(rsSiteType == "site") $("#srchType").text("SITE");
	
	if(rsSiteNm)$(".rsSiteName").text(rsSiteNm);
	else $(".rsSiteName").text("CGV");
	
	/* 페이지 하단 탭 (영화 , 회차 , 포맷, 상영관) 클릭 이벤트 */
	$(".tab02").on("click",function(evnt){
		gfn_tabSwith(evnt.target,function(tabInfo){
			console.log(tabInfo);
			if(tabInfo == "#fxcont1"){ //예매량
				fn_getRealIbktRtCurstsQty();
			}else if(tabInfo == "#fxcont2"){ //좌석비중
				fn_getRealIbktRtSeatWgt();
			}else if(tabInfo == "#fxcont3"){ //관객비중
				fn_getRealIbktRtSpctWgt();
			}else if(tabInfo == "#fxcont4"){ //예매오픈율
				fn_getRealIbktRtOpenRt();
			}
		});
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
		rsSiteNm   = $(e.target).text();
		rsSiteCd   = $(e.target).attr("data-code");
		fn_initSearch();
	});
	
	/*더보기*/
	$("#moreBtn1").on("click",function(){
		movFrCnt = movFrCnt + 10;
		movToCnt = movToCnt + 10;
		fn_getRealIbktRtCurstsQty(true);
	});
	
	/*더보기*/
	$("#moreBtn2").on("click",function(){
		seatWgtFrCnt = seatWgtFrCnt + 10;
		seatWgtToCnt = seatWgtToCnt + 10;
		fn_getRealIbktRtSeatWgt(true);
	});
	
	/*더보기*/
	$("#moreBtn3").on("click",function(){
		spctWgtFrCnt = spctWgtFrCnt + 10;
		spctWgtToCnt = spctWgtToCnt + 10;
		fn_getRealIbktRtSpctWgt(true);
	});
	
	/*더보기*/
	$("#moreBtn4").on("click",function(){
		openRtFrCnt = openRtFrCnt + 10;
		openRtToCnt = openRtToCnt + 10;
		fn_getRealIbktRtOpenRt(true);
	});
	
	fn_initSearch(); //조회,재조회
	
	if(DATE_CNT == 4) $(".tbl-scroll-area").removeClass("tbl-scroll-area");
	var colgroupHtml = ``;
	for(var i=0; i<DATE_CNT+1; i++){
		var colWidth = 100 / (DATE_CNT+1);
		colgroupHtml+= `
			<col width="${colWidth}%">
		`
	}
	$(".tabcont table colgroup").empty().append(colgroupHtml);
}

//조회,재조회
function fn_initSearch(){
	console.log("rsSiteNm_final",rsSiteNm);
	console.log("rsSiteCd_final",rsSiteCd);
	console.log("rsSiteType_final",rsSiteType);

	fn_contentEmpty(); //테이블 초기화
	
	fn_getLastTotDtm(); //최근 집계 일시 조회
	fn_getRealIbktRtCursts(); //실시간 예매율 예매현황 조회
	fn_getRealIbktRtRnk(); //실시간 예매율 예매순위 조회
	
	$(".tab02").removeAttr("data-flag","");
	$(".tab02[data-area='#fxcont1']").trigger("click");
	gfn_setRsSiteName(rsSiteType,rsSiteNm)
}

//테이블 및 변수 초기화
function fn_contentEmpty(){
	movFrCnt = 1;
	movToCnt = 10;
	seatWgtFrCnt = 1;
	seatWgtToCnt = 10;
	spctWgtFrCnt = 1;
	spctWgtToCnt = 10;
	openRtFrCnt = 1;
	openRtToCnt = 10;
	
	$("#moreBtn1").show();
	$("#moreBtn2").show();
	$("#moreBtn3").show();
	$("#moreBtn4").show();

	$("#tblContent1 tbody").empty();
	$("#tblContent2 tbody").empty();
	$("#tblContent3 tbody").empty();
	$("#tblContent4 tbody").empty();
}

//최근 집계 일시 조회
function fn_getLastTotDtm(){
	transaction({
		url : '/result/getLastTotDtm.do'
		,asyncFlag : false
	},function(result, e){
		if(!e){
			console.log(result);
			if(!result.lastTotDtm) return;
			lastTotDtm = result.lastTotDtm;
//			//FIXME
//			lastTotDtm = '202002210645';
			var y = lastTotDtm.substr(0,4);
			var m = lastTotDtm.substr(4,2);
			var d = lastTotDtm.substr(6,2);
			var hh = lastTotDtm.substr(8,2);
			var mi = lastTotDtm.substr(10,2);
			console.log(y+"-"+m+"-"+d+" "+hh+":"+mi);
			$("#lastTotDtm").text(y+"-"+m+"-"+d+" "+hh+":"+mi);
			dateList = fn_getSumDates();
		}else{
			console.log(e);
		}
	});
}

//실시간 예매율 예매현황 조회
function fn_getRealIbktRtCursts(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;

	transaction({
		url : '/result/getRealIbktRtCursts.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("실시간 예매율 예매현황",result);
			fn_mkRowIbktRtCursts(result); //실시간 예매율 예매현황 그리드 출력
		}else{
			console.log(e);
		}
	});
}

//실시간 예매율 예매현황 그리드 출력
function fn_mkRowIbktRtCursts(result){
	$("#realIbktRtCurstsContent tbody").empty();
	if(result.realIbktRtCursts.length == 0){
		var colSpan = $("#realIbktRtCurstsContent").find("th").length;
		var emptyText = "<tr><td colspan="+colSpan+"> 데이터가 없습니다. </td></tr>";
		$("#realIbktRtCurstsContent tbody").append(emptyText); //데이터가 없습니다 처리
		return false;
	}
	
	var content = ``;
	var data = result.realIbktRtCursts;
	for(var i in data){
		var scnDy = new Date(data[i].scnDy.substr(0,4),Number(data[i].scnDy.substr(4,2))-1,data[i].scnDy.substr(6,2));
		content += `
			<tr>
				<td class="${ scnDy.getDay()==6 ? 'f-color02' : scnDy.getDay()==0 ? 'f-color01' : '' }"> ${scnDy.format("MM-dd (E)")} </td>
				<td>${ data[i].theddBktQty ? gfn_numberFormat(data[i].theddBktQty) : '-' }</td>
				<td>${ data[i].bktQty ? gfn_numberFormat(data[i].bktQty) : '-' }</td>
			</tr>
		`;
	}
	$("#realIbktRtCurstsContent tbody").append(content);
}

//실시간 예매율 예매순위 조회
function fn_getRealIbktRtRnk(){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = lastTotDtm.substring(0,8);
	params.lastTotDtm = lastTotDtm;

	transaction({
		url : '/result/getRealIbktRtRnk.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("실시간 예매율 예매순위",result);
			fn_mkImgIbktRtRnk(result); //실시간 예매율 예매현황 이미지 출력
		}else{
			console.log(e);
		}
	});
}

//실시간 예매율 예매현황 이미지 출력
function fn_mkImgIbktRtRnk(result){
	$("#realIbktRtRnkContent").empty();
	
	var content = "";
	var data = result.realIbktRtRnk;
	for(var i in data){
		content += "<li onclick='fn_selMovPoster(this,"+data[i].movCd+")'>";
		content += "<strong class='num'>"+data[i].rnk+"</strong>"; //영화 순위
		content += "<img src='"+data[i].imgUrl+"' onerror=\"fn_imgError(this)\"/>"
		content += "</li>";
	}
	
	$("#realIbktRtRnkContent").append(content);
}
function fn_imgError(el){
	$(el).attr('src',DEFAULT_IMG_PATH);
	$(el).parent("li").addClass("no-img");
}
function fn_selMovPoster(el,movCd){
	console.log(movCd);
	$(el).siblings("li").removeClass("active");
	$(el).addClass("active");
	$("#tblContent1 tr").removeClass("point-bg");
	$("#tblContent1 tr").each(function(i,item){
		var tblMovCd = $(item).attr("data-movCd");
		if(movCd == tblMovCd) $(item).addClass("point-bg");
	});
	
	fn_getDetail(movCd); //영화 상세 실적
}

//실시간 예매율 예매량
function fn_getRealIbktRtCurstsQty(moreFlag){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.lastTotDtm = lastTotDtm;
	params.scnDy = lastTotDtm.substr(0,8);
	params.frCnt = movFrCnt;
	params.toCnt = movToCnt;
	for(var i in dateList){ //기준일자 만큼 조회
		params["d"+i] = dateList[i].format("yyyyMMdd");
	}
	
 	transaction({
		url : '/result/getRealIbktRtCurstsQty.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("실시간 예매율 예매량",result);
			fn_mkHeader("fxcont1"); //오늘 포함 4일 그리드 헤더 출력
			fn_mkRow("fxcont1",result.realIbktRtCurstsQtyTot[0],result.realIbktRtCurstsQty,moreFlag); //실시간 예매율 예매량 출력
		}else{
			console.log(e);
		}
	});
}

//실시간 예매율 좌석비중
function fn_getRealIbktRtSeatWgt(moreFlag){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = lastTotDtm.substr(0,8);
	params.lastTotDtm = lastTotDtm;
	params.frCnt = seatWgtFrCnt;
	params.toCnt = seatWgtToCnt;
	
	for(var i in dateList){ //기준일자 만큼 조회
		params["d"+i] = dateList[i].format("yyyyMMdd");
	}

	transaction({
		url : '/result/getRealIbktRtSeatWgt.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("실시간 예매율 좌석비중",result);
			fn_mkHeader("fxcont2"); //오늘 포함 4일 그리드 헤더 출력
			fn_mkRow("fxcont2",null,result.realIbktRtSeatWgt,moreFlag); //실시간 예매율 예매량 출력
		}else{
			console.log(e);
		}
	});
}

//실시간 예매율 관객비중
function fn_getRealIbktRtSpctWgt(moreFlag){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = lastTotDtm.substr(0,8);
	params.lastTotDtm = lastTotDtm;
	params.frCnt = spctWgtFrCnt;
	params.toCnt = spctWgtToCnt;
	
	for(var i in dateList){ //기준일자 만큼 조회
		params["d"+i] = dateList[i].format("yyyyMMdd");
	}

	transaction({
		url : '/result/getRealIbktRtSpctWgt.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("실시간 예매율 관객비중",result);
			fn_mkHeader("fxcont3"); //오늘 포함 4일 그리드 헤더 출력
			fn_mkRow("fxcont3",null,result.realIbktRtSpctWgt,moreFlag); //실시간 예매율 예매량 출력
		}else{
			console.log(e);
		}
	});
}

//실시간 예매율 예매 오픈율
function fn_getRealIbktRtOpenRt(moreFlag){
	var params = {};
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
	params.srchDate = lastTotDtm.substr(0,8);
	params.lastTotDtm = lastTotDtm;
	params.frCnt = openRtFrCnt;
	params.toCnt = openRtToCnt;
	
	for(var i in dateList){ //기준일자 만큼 조회
		params["d"+i] = dateList[i].format("yyyyMMdd");
	}
	
	transaction({
		url : '/result/getRealIbktRtOpenRt.do'
			,params : params
	},function(result,e){
		if(!e){
			console.log("실시간 예매율 예매 오픈율",result);
			fn_mkHeader("fxcont4"); //오늘 포함 4일 그리드 헤더 출력
			fn_mkRow("fxcont4",result.realIbktRtOpenRtTot[0],result.realIbktRtOpenRt,moreFlag); //실시간 예매율 예매량 출력
		}else{
			console.log(e);
		}
	});
}

/***********************************************************************************************************/
//집계일자목록 가져오기
function fn_getSumDates(){
	var todayStr = lastTotDtm.substr(0,8);
	var today = new Date(gfn_convertDateFmt(todayStr,"-"));
	var dateArr = [];
	for(var i=0; i< DATE_CNT; i++){
		var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
		dateArr.push(date);
	}
	return dateArr;
}

// THEAD create
function fn_mkHeader(id){
	var html = `<tr><th>영화명</th>`;
	for(var i in dateList){
		html += `<th class="${dateList[i].getDay() == 6 ? 'f-color02' : dateList[i].getDay() == 0 ? 'f-color01' : ''}"
					data-dateStr='${dateList[i].format("yyyyMMdd")}'>
					${ dateList[i].format("MM-dd") } <br> ${dateList[i].format("(E)")}
				</th>`;
	}
	$("#"+id+" table thead").empty().append(html);
}

// TBODY create
function fn_mkRow(areaId,totData,rowData,moreFlag){
	var $tbody = $("#"+areaId+" table tbody");  //테이블 바디
	var $moreBtn = $("#"+areaId+" .btn-more");  //더보기버튼
	var regex = /(d[0-9])/;
	var suffix = areaId == "fxcont1" ? '' : '%';
	
	var html = ``;
	if(!moreFlag){
		html += `<tr class='total'></tr>`;
		$tbody.empty().append(html);
		var $tr = $($tbody.find(".total"));
		//총계 ROW 생성
		if(totData){
			totData = gfn_sortObject(totData);
			html = ``;
			var colCnt = 0;
			for(var key in totData){
				if(colCnt >= dateList.length+1) continue;
				if(totData[key] == "총계") html += `<td>${ totData[key] }</td>`;
				else html += `<td>${ totData[key] ? gfn_numberFormat(totData[key])+suffix : '-' }</td>`;
				colCnt++;
			}
		}else{
			html = `<td><strong>총계</strong></td>`;
			for(var i in dateList){
				html += `<td>100%</td>`;
			}
		}
		$tr.append(html);
	}
	
	//일반 Row 생성
	for(var i in rowData){
		i = Number(i);
		html = `<tr data-movCd="${rowData[i].movPrntCd}" class="${rowData[i].rnKnd=="1"?'f-color03':''}"></tr>`;
		$tbody.append(html);
		var $trEl = $($tbody.find("tr").eq($tbody.find("tr").length-1));
		rowData[i] = gfn_sortObject(rowData[i]);
		
		var colCnt = 0;
		for(var key in rowData[i]){
			if(key.match(regex)){
				if(rowData[i].movPrntCd) rowData[i].movCd = rowData[i].movPrntCd;
				if(colCnt >= dateList.length) continue;
				if(rowData[i][key] && (areaId == "fxcont2" || areaId == "fxcont3")) rowData[i][key] = rowData[i][key].toFixed(2);
				else if(rowData[i][key] && areaId == "fxcont4") rowData[i][key] = rowData[i][key].toFixed(1);
				html = `<td onclick="fn_getDetail('${rowData[i].movCd}')">${rowData[i][key] ? gfn_numberFormat(rowData[i][key])+suffix : '-' }</td>`;
				$trEl.append(html);
				colCnt++;
			}
		}
		
		if(rowData[i].movOrgNm) rowData[i].movNm = rowData[i].movOrgNm;
		if(rowData[i].seq) rowData[i].rn = rowData[i].seq;
		if(rowData[i].rnKnd == "1"){
			$trEl.prepend(`<td class='down' title>${rowData[i].movKndNm}</td>`);
		}else{
			$trEl.prepend(`<td class='movie-name' title>${rowData[i].rn}.${rowData[i].movNm}</td>`);
		}
	}
	if(!rowData || (!rowData.length && !moreFlag)){
		$tbody.empty().append(`<tr><td colspan=${dateList.length+1}>데이터가 없습니다.</td></tr>`);
	}else if(!rowData.length && moreFlag){
		$moreBtn.hide();
	}
	if(!rowData || rowData.length < 10) $moreBtn.hide();
}