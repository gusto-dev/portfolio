var chart01;
function fn_init(){
	
	//다른 탭에서 검색한 일자가 있는경우
	if(srchDate){
		var flagDate = fn_getFlagDate("m",true).replace(/-/gi,"");
		if(Number(srchDate) < Number(flagDate)) $(".btn-next").css("visibility","visible");
		$("#srchDate").val(gfn_convertDateFmt(srchDate));
	}
	else{
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
	
	//일자변경 이벤트
	$("#srchDate").on("change",function(e){
		console.log($(e.target).val());
		srchDate = $(e.target).val().replace(/-/gi,"");
		fn_initSearch();
	});
	
	/*검색 타입 변경시 이벤트*/
	$("#srchType").on("change",function(){
		var typeCd = $(this).val();
		if(typeCd == "rs"){
			gfn_searchRs("[name='rsSiteName']");
		}else if(typeCd == "site"){
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
	
	/* 페이지 하단 탭 (전체 , 한국, 중국, 베트남...) 클릭 이벤트 */
	$(document).on("click",".dataType",function(evnt){
		$(".dataType").removeClass("active");
		$(evnt.target).addClass("active");
		fn_initSearch(); //조회,재조회
	});
	fn_getForeignLastTotMonth(); //최근 마감월 조회
	fn_getCtryList();
	fn_initSearch(); //조회,재조회
}
/*=============[ INIT END ]=========================*/


/*=============[ TRANSACTION END ]=========================*/
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

/* 국가 목록 조회 */
function fn_getCtryList(){
	transaction({
		url : '/result/getCtryList.do'
		,asyncFlag : false
		,complete:function(){}
	},function(result,e){
		if(!e){
			console.log(result);
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
/* 월별 실적 조회 */
function fn_getPalMonthlyList(){
	var ctryCd = $(".dataType.active").attr("data-code");
	
	var params = {}
	if(ctryCd) params = {srchDate : srchDate , ctryCd : ctryCd};
	else params = {srchDate : srchDate};
	
	console.log("TEST",params);
	transaction({
		url : '/result/getForeignPalPerMonthList.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log(result);
			fn_mkRow(result.resultList,result.totList);
			fn_mkChart01(result.resultList);
		}else{
			console.error(e);
		}
	});
}


/*=============[ FUNCTION END ]=========================*/
function fn_initSearch(){
	fn_getPalMonthlyList();
}

function fn_mkRow(rowData,totData){
	var html = ``;
	if(rowData.length == 0){
		html = `<tr><td colspan=5> 데이터가 없습니다. </td></tr>`;
		return html;
	}
	var srchDateYy = $("#srchDate").val().substr(2,2);
	//<td>${rowData[i].basYm.substr(2,2)}-${rowData[i].basYm.substr(4,2)}</td>
	for(var i in rowData){
		var bfYearClass = '';
		if(rowData[i].basYm){
			console.log(rowData[i].basYm);
			var yy = rowData[i].basYm.toString().substr(2,2);
			if(yy != srchDateYy) bfYearClass = 'point-bg02'
		}
		
		html += `
			<tr class='${i==0 ? 'point-bg':''} ${bfYearClass}'>
				<td>${rowData[i].basYm.toString().substr(2,2)}-${rowData[i].basYm.toString().substr(4,2)}</td>
				<td class='align-r'>
					${fn_setNumberUnit(rowData[i].spctCnt,'T')}
					<span class='s-font ${fn_setFontColor(rowData[i].plnSpctCntPer)}'>${rowData[i].plnSpctCntPer}%</span>
				</td>
				<td class='align-r'>
					${fn_setNumberUnit(rowData[i].saleAmt,'B')}
					<span class='s-font ${fn_setFontColor(rowData[i].plnSaleAmtPer)}'>${rowData[i].plnSaleAmtPer}%</span>
				</td>
				<td class='align-r'>
					${fn_setNumberUnit(rowData[i].pfAmt,'B')}
					<span class='s-font ${fn_setFontColor(rowData[i].plnPfAmtPer)}'>${rowData[i].plnPfAmtPer}%</span>
				</td>
				<td class='align-r'>
					<span>${fn_setNumberUnit(rowData[i].pfAmtRat,'P')}%</span
				</td>
			</tr>
			`
		
//		html += `
//		<tr class='${i==0 ? 'point-bg':''} ${bfYearClass}'>
//			<td>${rowData[i].basYm.toString().substr(2,2)}-${rowData[i].basYm.toString().substr(4,2)}</td>
//
//			<td class='num align-r'>${fn_setNumberUnit(rowData[i].spctCnt,'T')}</td>
//			<td class='num align-r'>${fn_setNumberUnit(rowData[i].saleAmt,'B')}</td>
//			<td class='align-r'>
//				<span class='num'> ${fn_setNumberUnit(rowData[i].pfAmt,'B')} </span>
//				<span class='num s-font f-color01'>${fn_setNumberUnit(rowData[i].pfAmtRat,'P')}%</span>
//			</td>
//		</tr>
//
//		`
	};
	$(".dv-result table tbody").empty().append(html);
	
	var totHtml = ``;
	for(var i in totData){
		totHtml += `
			<tr class='total type02'>
				<td>${totData[i].basYm}</td>
				<td class='align-r'>
					${fn_setNumberUnit(totData[i].spctCnt,'T')}
					<span class='s-font ${fn_setFontColor(totData[i].plnSpctCntPer)}'>${totData[i].plnSpctCntPer}%</span>
				</td>
				<td class='align-r'>
					${fn_setNumberUnit(totData[i].saleAmt,'B')}
					<span class='s-font ${fn_setFontColor(totData[i].plnSaleAmtPer)}'>${totData[i].plnSaleAmtPer}%</span>
				</td>
				<td class='align-r'>
					${fn_setNumberUnit(totData[i].pfAmt,'B')}
					<span class='s-font ${fn_setFontColor(totData[i].plnPfAmtPer)}'>${totData[i].plnPfAmtPer}%</span>
				</td>
				<td class='align-r'>
					<span>${fn_setNumberUnit(totData[i].pfAmtRat,'P')}%</span
				</td>
			</tr>
			`
		
//		totHtml += `
//
//		<tr class='total'>
//			<td>${totData[i].basYm}</td>
//			<td class='num '>${fn_setNumberUnit(totData[i].spctCnt,'T')}</td>
//			<td class='num '>${fn_setNumberUnit(totData[i].saleAmt,'B')}</td>
//			<td class=''>
//				<span class='num'> ${fn_setNumberUnit(totData[i].pfAmt,'B')} </span>
//				<span class='num s-font f-color01'>${fn_setNumberUnit(totData[i].pfAmtRat,'P')}%</span>
//			</td>
//		</tr>
//
//		`;
	}
	$(".dv-result table tbody").prepend(totHtml);
	$(".num").each(function(i,e){
		$(e).text( $(e).text().replace(/-/gi,"") );
	});
}

function fn_setDateFormat(str){
	var reg = /([0-9]2)([0-9]2)([0-9]2)/;
}

//function fn_getTestData(){
//	showLoadingBar();
//	var data = [];
//	var monthNms = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
//	var flagDate = new Date($("#srchDate").val());
//	for(var i=0; i<12; i++){
//		var dateObj = {};
//		var date = new Date(flagDate.getFullYear(), flagDate.getMonth()-i);
//		dateObj.date = date
//		dateObj.monthNm = monthNms[date.getMonth()];
//		dateObj.dateTxt = date.format("yyyyMMdd");
//		dateObj.dsplTxt = date.getMonth()==0 ?  flagDate.getFullYear()+"년 "+dateObj.monthNm : dateObj.monthNm;
//
//		dateObj.pal = getRandomInt(9999999999,55555555555);
//		dateObj.saleAmt = getRandomInt(999999999,9999999999);
//		dateObj.spctCnt = getRandomInt(9999999,99999999);
//		dateObj.palPer = getRandomInt(0,100);
//		data.push(dateObj);
//	}
//
//	fn_mkChart01(data);
//
//	var totObj = {
//		isTot : true
//		,pal : 0
//		,saleAmt : 0
//		,spctCnt:0
//	};
//
//	for(var i in data){
//		totObj.pal += data[i].pal;
//		totObj.saleAmt += data[i].saleAmt;
//		totObj.spctCnt += data[i].spctCnt;
//	}
//	data.unshift(totObj);
//
//	fn_mkRow01(data);
//	hideLoadingBar();
//}

/* 1번 차트 생성 */
function fn_mkChart01(data){
	if(chart01) chart01.dispose();
	
	var series;
	series = [
		{type : "col"  , name : "매출액"  , valueKey : "saleAmt" , color: COLOR_ARR[5] , width:50, clusteredYn: true , tooltipText: "{outVal1}" }
		,{type : "col"  , name : "영업이익", valueKey : "pfAmt"   , color: COLOR_ARR[0]  ,clusteredYn: true , tooltipText: "{outVal3}" }
		,{type : "line" , name : "관람객"  , valueKey  : "spctCnt" , color: COLOR_ARR[3] , valueAxisType : 2 , tooltipText: "{outVal2}" }
	]
	var chartData = JSON.parse(JSON.stringify(data));
	
	for(var i in chartData){
		var yyyy = chartData[i].basYm.toString().substr(0,4);
		var mm   = chartData[i].basYm.toString().substr(4,2);
		chartData[i].dsplDate = mm != 01 ? mm+"월" : mm+"월\n"+yyyy+"년";
		
		if(chartData[i].saleAmt < 0){
			chartData[i].outVal1 = chartData[i].saleAmt;
			chartData[i].saleAmt = 0;
		}else{
			chartData[i].outVal1 = chartData[i].saleAmt;
		}
		if(chartData[i].spctCnt < 0){
			chartData[i].outVal2 = chartData[i].spctCnt;
			chartData[i].spctCnt = 0;
		}else{
			chartData[i].outVal2 = chartData[i].spctCnt;
		}
		if(chartData[i].pfAmt < 0){
			chartData[i].outVal3 = chartData[i].pfAmt;
			chartData[i].pfAmt = 0;
		}else{
			chartData[i].outVal3 = chartData[i].pfAmt;
		}
		
		chartData[i].outVal1 = fn_setNumberUnit(chartData[i].outVal1,"B");
		chartData[i].outVal2 = fn_setNumberUnit(chartData[i].outVal2,"T");
		chartData[i].outVal3 = fn_setNumberUnit(chartData[i].outVal3,"B");
	};
	
	chart01 = gfn_mkXYChart(chartData,{
		 chartDivId : "chart01"
		,categoryName : "dsplDate"
//		,inversed   : true
		,isWide     : true
		,cursor     : true
		,cursorFocus : chartData[0].dsplDate
		,series : series
	});
	
	chart01.paddingBottom = 0;
	chart01.series.values[0].dataFields.outVal = "outVal";
	chart01.series.values[1].dataFields.outVal1 = "outVal1";
	chart01.series.values[2].dataFields.outVal2 = "outVal2";
}

//function fn_mkRow01(data){
//	var html =``;
//
//	for(var i in data){
//		if(data[i].isTot){
//			html += `
//				<tr class='total'>
//					<td>금년 누계</td>
//					<td class='align-r'>${fn_setNumberUnit(data[i].spctCnt,'spctCnt')}</td>
//					<td class='align-r'>${fn_setNumberUnit(data[i].saleAmt,'saleAmt')}</td>
//					<td class='align-r'>${fn_setNumberUnit(data[i].pal,'pal')}<span class='s-font f-color01'>${fn_setNumberUnit(data[i].palPer,'palPer')}%</span></td>
//				</tr>
//			`
//		}else{
//			html += `
//				<tr class='${i==1 ? 'point-bg' : ''}'>
//				<td>${data[i].dsplTxt}</td>
//				<td class='align-r'>${fn_setNumberUnit(data[i].spctCnt,'spctCnt')}</td>
//				<td class='align-r'>${fn_setNumberUnit(data[i].saleAmt,'saleAmt')}</td>
//				<td class='align-r'>${fn_setNumberUnit(data[i].pal,'pal')}<span class='s-font f-color01'>${fn_setNumberUnit(data[i].palPer,'palPer')}%</span></td>
//				</tr>
//				`
//		}
//	}
//	$("table tbody").empty().append(html);
//}

/*천명 , 100만원 단위 절삭*/
function fn_setNumberUnit(number , numType){
	if(numType == "B"){
		if(number == 0) return "0.0";
		convertedNum = number/100000000;
		convertedNum = Math.round(convertedNum);
	}else if(numType == "T"){
		if(number == 0) return "0";
		convertedNum = number/1000;
		convertedNum = Math.round(convertedNum);
	}else if(numType =="P"){
		if(!number) return "0.0";
		convertedNum = number.toFixed(1);
	}else{
		return;
	}
	convertedNum = gfn_numberFormat(convertedNum);
	return convertedNum;
};

/*100 비교 글자색상*/
function fn_setFontColor(perData){
	var fontColor = "";
	if(!perData){
		return fontColor;
	}
	
	if(Number(perData) > 100){
		fontColor = "f-color01";
	}else if(Number(perData) < 100){
		fontColor = "f-color02";
	}
	return fontColor;
}
