var chart01,chart02;
var sortType,sortCol;
function fn_init(){
	//다른 탭에서 검색한 일자가 있는경우
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
	
	fn_sortThInit(); //테이블 정렬표기 초기화
	fn_getMonthlyFnBRsChart(); //F&B 차트+RS 조회
	
	/*일자변경이벤트*/
	$("#srchDate").on("change",function(e){
		sortType = "d";
		$(".sortTh").removeAttr("sort-type");
		$(".sortTh").removeClass("sort-active");
		srchDate = $(e.target).val().replace(/-/gi,"");
		fn_getMonthlyFnBRsChart(); //F&B 차트+RS 조회
	});
	
	/* RS , SITE 라디오 변경 이벤트*/
	$("[name='radio-rsSite']").on("change",function(e){
//		//탭버튼 초기화
//		$(".dataTypeBtn").siblings("li").removeClass("active");
//		$(".dataTypeBtn").eq(0).addClass("active");
		
		sortType = "d";
		//RS , SITE 구분
		var rsSiteFlag = $(e.target).val();
		//RS/SITE 구분 컬럼 변경
		$(".rsSiteColumn").text(rsSiteFlag.toUpperCase());
		//영역 초기화
		$(".rs-site-type").hide();
		$(".dv-table-result").hide();
		
		if(rsSiteFlag == "rs"){ // RS 인경우
			$(".dv-rs-chart-result.type01").show();
			$(".dv-table-result.type01").show();
			fn_getMonthlyFnBRsChart(); //F&B 차트+RS 조회
		}else{// SITE 인경우
			$(".dv-site-rank-result").show();
			$(".dv-table-result.type01").show();
			fn_getMonthlyFnBRsSiteGrd(); //F&B RSSITE 조회
		}
		
		fn_sortThInit(); //테이블 정렬표기 초기화
	});
	
	
	//SORTING
	sortType = "d";
	$(document).on("click",".sortTh",function(e){
//		console.log(e.target);
		var sortTable = $(e.target).attr("dataType");
		sortCol = $(e.target).attr("sortCol");
		
		if(!sortType){
			sortType = "d";
		}else if(sortType == "d" && $(e.target).hasClass("sort-active")){
			sortType = "a";
		}else if(sortType == "a" && $(e.target).hasClass("sort-active")){
			sortType = "d";
		}else{
			sortType = "d";
		}
		
		$(e.target).siblings().removeClass("sort-active");
		$(e.target).addClass("sort-active");
		fn_getSortIcon($(".sort-active"),sortType);
		
		if($("[name='radio-rsSite']:checked").val() == "rs"){
			fn_getMonthlyFnBRsSiteGrd(sortType,sortCol);
		}else if ($("[name='radio-rsSite']:checked").val() == "site"){
			fn_getMonthlyFnBRsSiteGrd(sortType,sortCol);
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
	
	/* 데이터 타입별 버튼 이벤트 */
//	$(".dataTypeBtn").on("click",function(e){
//		$(e.target).siblings("li").removeClass("active");
//		$(e.target).addClass("active");
//		
//		var dataType = $(e.target).attr("data-type");
//		var rsSiteFlag = $("[name='radio-rsSite']:checked").val();
//	
//		fn_setResultArea(dataType,rsSiteFlag)
//	});
} /* INIT E ****************************************************************************/

/* TRANSACTION S ****************************************************************************/
//F&B RS 차트+그리드 조회
function fn_getMonthlyFnBRsChart(){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	
	transaction({
		url : '/result/getMonthlyFnBRsChart.do'
		,params : params
		,complete : function(){}
	},function(result,e){
		if(!e){
			console.log("getMonthlyFnBRsChart",result.resultList);
			fn_mkChart01(result.resultList);
			$("#spp").text( gfn_numberFormat(result.resultList[0].spp) );
			$("#sr").text(Number(result.resultList[0].sr).toFixed(1));
			$("#asp").text( gfn_numberFormat(result.resultList[0].asp) );
			$("#cmbSellRt").text(Number(result.resultList[0].cmbSellRt).toFixed(1));
			fn_getMonthlyFnBRsSiteGrd(); //RSSITE 조회
		}else{
			console.log(e);
		}
	});
//	var data = fn_mkTestData01();
//	fn_mkChart01(data);
}

//RSSITE 조회
function fn_getMonthlyFnBRsSiteGrd(orderType, orderCol){
	if(!orderType && !orderCol){
		orderType = "d";
		orderCol = "spp";
	}
	
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.srchType = $("[name='radio-rsSite']:checked").val();
	params.orderType = orderType;
	params.orderCol = orderCol;
//	params.srchValue = "";
	
	transaction({
		url : '/result/getMonthlyFnBRsSiteGrd.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("getMonthlyFnBRsSiteGrd",result.resultList);
			fn_mkRow(result.resultList, orderCol, $("[name='radio-rsSite']:checked").val());
		}else{
			console.log(e);
		}
	});
}
//function fn_getRsSppData(){
//	var data = fn_mkTestData02();
//	fn_mkChart02(data);
//}
//function fn_getRsSrData(){
//	var data = fn_mkTestData02();
//	fn_mkChart02(data);
//}
//function fn_getRsAspData(){
//	var data = fn_mkTestData02();
//	fn_mkChart02(data);
//}
//function fn_getRsComboData(){
//	var data = fn_mkTestData02(5);
//	fn_mkChart02(data);
//}
/* TRANSACTION E **************************************************************************/
/* FUNCTION S ****************************************************************************/
//function fn_mkTestData01(){
//	var data = [
//		{ rcdType : "wtchCnt" , rcdNm : "관람객" , rcd : getRandomInt(1000,999999) , color : COLOR_ARR[4]}
//		,{ rcdType : "sppCnt" , rcdNm : "매점객" , rcd : getRandomInt(1000,999999) , color : COLOR_ARR[0]}
//	];
//	return data;
//}

// 1번 차트 생성
function fn_mkChart01(data){
	if(chart01) chart01.dispose(); 

	var chartData = [
		{ rcdType : "mrktUseCnt"      , rcdNm : "매점객" , rcd : data[0].mrktUseCnt , color : COLOR_ARR[0] , labelColor : "white"}
		,{ rcdType : "mrktChgWtchtmCnt" , rcdNm : "매점객 제외" , rcd : data[0].mrktChgWtchtmCnt , color : COLOR_ARR[5]}
	];
	console.log(chartData);
	
	chart01 = gfn_mkPieChart(chartData,{
		 chartDivId : "chart01"
		,radius : 30
		,categoryName : "rcdNm"
		,valueName : "rcd"
		,labelText : "{category}\n {value.formatNumber('#,###')}\n 　　{value.percent.formatNumber('#.0')}%"
	});
	
	chart01.events.on("ready",function(e){
		e.target.series.each(function(item){
			item.slices.each(function(sliceItem){
				console.log(sliceItem)
			});
		});
	});
}

function fn_mkRow(rowData, orderCol, rsSiteFlag){
	var html = ``;
	if(rowData.length == 0){
		html = `<tr><td colspan=5> 데이터가 없습니다. </td></tr>`;
		return html;
	}
	
	fn_flNullData(rowData); //0 -> -
	if("site" == rsSiteFlag) fn_setRank(rowData,orderCol); //랭킹 1,2,3 순위입력
	var paramDt = $("#srchDate").val().replace(/-/gi,"");
	for(var i in rowData){
		if("site" == rsSiteFlag){
			html += `<tr>
						<td onclick='fn_goMonthlySmry(${JSON.stringify(rowData[i])})' data-cd='${rowData[i].cd}'>${gfn_removeCGVTxt(rowData[i].nm)}</td>
			`;
		}else if("rs" == rsSiteFlag){
			html += `<tr onclick='fn_getRsDetail(${paramDt},${rowData[i].cd})'>
						<td data-cd='${rowData[i].cd}'>${gfn_removeCGVTxt(rowData[i].nm)}</td>
			`;
		}else{
			error.log(rsSiteFlag);
		}
		
		html += `<td class='align-r'>${gfn_numberFormat(rowData[i].spp)}</td>
				<td class='align-r'>${fn_getPercentFormat(rowData[i].sr)}</td>
				<td class='align-r'>${gfn_numberFormat(rowData[i].asp)}</td>
				<td class='align-r'>${fn_getPercentFormat(rowData[i].cmbSellRt)}</td>
			</tr>
		`;
	};
	
	$("#tbl-rsSite01 tbody").empty().append(html);
}

//상위 3위 랭킹 세팅
function fn_setRank(data,colNm){
	if(data.length == 0 ) return false;
	var rankData = [];
	for(var i=0; i<3; i++){
		var rank = {}
		rank.thatNm = gfn_removeCGVTxt(data[i].nm);
		rank.recode = gfn_numberFormat(data[i][colNm]);
		rankData.push(rank);
	}
	
	$("#fstNm" ).empty().text(rankData[0].thatNm);
	$("#scdNm" ).empty().text(rankData[1].thatNm);
	$("#thdNm" ).empty().text(rankData[2].thatNm);
	
	if("sr" == colNm || "cmbSellRt" == colNm){
		$("#fstRcd").empty().text(fn_getPercentFormat( rankData[0].recode ));
		$("#scdRcd").empty().text(fn_getPercentFormat( rankData[1].recode ));
		$("#thdRcd").empty().text(fn_getPercentFormat( rankData[2].recode ));
	}else{
		$("#fstRcd").empty().text(rankData[0].recode);
		$("#scdRcd").empty().text(rankData[1].recode);
		$("#thdRcd").empty().text(rankData[2].recode);
	}
	
//	if(dataFlag == 2){
//		$("#fstRcd").empty().text(fn_getPercentFixed2( rankData[0].recode ));
//		$("#scdRcd").empty().text(fn_getPercentFixed2( rankData[1].recode ));
//		$("#thdRcd").empty().text(fn_getPercentFixed2( rankData[2].recode ));
//	}else{
//		if("plnCgvSpctWgt" == colNm || "cgvSpctWgt" == colNm){
//			$("#fstRcd").empty().text(fn_getPercentFormat( rankData[0].recode ));
//			$("#scdRcd").empty().text(fn_getPercentFormat( rankData[1].recode ));
//			$("#thdRcd").empty().text(fn_getPercentFormat( rankData[2].recode ));
//		}else{
//			$("#fstRcd").empty().text(rankData[0].recode);
//			$("#scdRcd").empty().text(rankData[1].recode);
//			$("#thdRcd").empty().text(rankData[2].recode);
//		}
//	}
}

//Summary 로 이동
function fn_goMonthlySmry(obj){
	var url = "/result/monthlyFnBSmry.do";
	url += "?pageId="+pageId;
	url += "&rsSiteType=site";
	url += "&rsSiteNm="+gfn_removeCGVTxt(obj.nm);
	url += "&rsSiteCd="+obj.cd;
	url += "&srchDate="+srchDate;
	location.href = url;
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

//null 일때 %처리
function fn_getPercentFormat(data){
	var dataConv = data.toString().replace(/,/gi,"");
	if("-" != data){
		return gfn_numberFormat( Number(dataConv).toFixed(1) )+"%";
	}else{
		return dataConv;
	}
}

//테이블 정렬표기 초기화
function fn_sortThInit(){
	$(".sortTh:visible").siblings(".sortTh").removeClass("sort-active");
	$(".sortTh:visible").eq(0).addClass("sort-active");
	fn_getSortIcon($(".sortTh:visible").eq(0),"d");
}

//function fn_setResultArea(tab,radio){
//console.log(radio,tab)
//$(".rs-site-type").hide();
//$(".dv-table-result").hide();
////RS/SITE 구분 버튼 초기화
//
//if(radio == "rs"){
//	if(tab == 1){
//		fn_getRsTotalData();
//		$(".dv-rs-chart-result.type01").show();
//		$(".dv-table-result.type01").show();
//	}else if(tab == 2){
//		fn_getRsSppData()
//		$(".dv-rs-chart-result.type02").show();
//		$(".dv-table-result.type02").show();
//		$(".dataTypeColumn").text("SPP");
//	}else if(tab == 3){
//		fn_getRsSrData();
//		$(".dv-rs-chart-result.type02").show();
//		$(".dv-table-result.type02").show();
//		$(".dataTypeColumn").text("SR");
//	}else if(tab == 4){
//		fn_getRsAspData();
//		$(".dv-rs-chart-result.type02").show();
//		$(".dv-table-result.type02").show();
//		$(".dataTypeColumn").text("ASP");
//	}else if(tab == 5){
//		fn_getRsComboData();
//		$(".dv-rs-chart-result.type02").show();
//		$(".dv-table-result.type03").show();
//	}
//}else if(radio == "site"){
//	if(tab == 1){
//		$(".dv-site-rank-result").show();
//		$(".dv-table-result.type01").show();
//	}else if(tab == 2){
//		$(".dv-site-rank-result").show();
//		$(".dv-table-result.type02").show();
//	}else if(tab == 3){
//		$(".dv-site-rank-result").show();
//		$(".dv-table-result.type02").show();
//	}else if(tab == 4){
//		$(".dv-site-rank-result").show();
//		$(".dv-table-result.type02").show();
//	}else if(tab == 5){
//		$(".dv-site-rank-result").show();
//		$(".dv-table-result.type03").show();
//	}
//}
//}

// 2번 차트 생성 
//function fn_mkTestData02(type){
//	var sampleData
//	if(type != 5){
//		sampleData = [
//			 { rcdTyp : "ms" ,rcdNm : "실적" , recode : getRandomInt(1000,99999) , color : COLOR_ARR[0]}
//			,{ rcdTyp : "P" , rcdNm : "계획" , recode : getRandomInt(1000,99999) , diff : getRandomInt(1000,999) , color : COLOR_ARR[4]}
//			,{ rcdTyp : "W" , rcdNm : "전주" , recode : getRandomInt(1000,99999) , diff : getRandomInt(1000,999) , color : COLOR_ARR[5]}
//			,{ rcdTyp : "D" , rcdNm : "전일" , recode : getRandomInt(1000,99999) , diff : getRandomInt(1000,999) , color : COLOR_ARR[6]}
//		];
//	}else{
//		sampleData = [
//			 { rcdTyp : "ms" ,rcdNm : "실적" , recode : getRandomInt(1000,99999) , color : COLOR_ARR[0]}
//			,{ rcdTyp : "W" , rcdNm : "전주" , recode : getRandomInt(1000,99999) , diff : getRandomInt(1000,999) , color : COLOR_ARR[5]}
//			,{ rcdTyp : "D" , rcdNm : "전일" , recode : getRandomInt(1000,99999) , diff : getRandomInt(1000,999) , color : COLOR_ARR[6]}
//		];
//	}
//	return sampleData;
//}
//
//function fn_mkChart02(data,type){
//	if(chart02) chart02.dispose(); 
//	if(!data) data = fn_mkTestData02();
//	
//	chart02 = gfn_mkXYChart(data,{
//		 chartDivId : "chart02"
//		,categoryName : "rcdNm"
//		,pivot      : true
//		,cursor     : true
//		,label      : true
//		,inversed   : true
//		,labelX     : -10
////		,max : 100
//		,series : [
//			{type:"col" , valueKey:"recode" , labelColor:"#fff" , labelText:"{valueX.value}" , outLabelKey:"diff" , outLabelText:"{outVal}" }
//		]
//	});
//}
/* FUNCTION E ****************************************************************************/