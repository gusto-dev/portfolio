var chart01;
var rsSiteNm, rsSiteCd, srchDate, rsSiteType;
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
	
	/* 페이지 탭 클릭 이벤트 */
//	$(".dataType").on("click",function(e){
//		$(".dataType").removeClass("active");
//		$(e.target).addClass("active");
//		var dataTypeCd = $(e.target).attr("dataTypeCode");
//
//		$(".dv-result").hide();
//
//		if("SMRY" == dataTypeCd){
//			$(".dv-result.type01").show();
//		}else if("SELL" == dataTypeCd){
//			$(".dv-result.type02").show();
//		}else{
//			$("#dataType").text($(e.target).text());
//			$(".dv-result.type03").show();
//		}
//		fn_initSearch();
//	});
	
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

function fn_getPalPerMonthList(dataTypeCode){
	var params = {}
	params.srchDate = $("#srchDate").val().replace(/-/gi,"");
	params.srchType = rsSiteType;
	params.srchValue = rsSiteCd;
//	params.dataTypeCode = dataTypeCode;
	
	transaction({
		url : '/result/getPalPerMonthList.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log("PalPerMonthList",result);
			fn_mkChart01(JSON.parse(JSON.stringify(result.resultList)),dataTypeCode);
//			fn_mkChart01(result.resultList);
			fn_flNullData(result.resultList);
//			fn_mkTable(result.resultList,dataTypeCd);
			
			var data = result.resultList;
			
			for(var i in data){
				for(var key in data[i]){
					if(key == "yMm") continue;
					if("number" == typeof(data[i][key])){
						var type;
						if(key.search("Cnt") != -1) type = "T";
						else if(key.search("Per") != -1 || key.search("Rt") != -1 ) type = "P";
						else type = "M";
						data[i][key] = fn_setNumberUnit(data[i][key],type);
					}
				}
			}
			fn_mkRowType01(data);
//			if("SMRY" == dataTypeCode) fn_mkRowType01(data);
//			else if("SELL" == dataTypeCode) fn_mkRowType02(data);
//			else fn_mkRowType03(data);
		}else{
			console.log(e);
		}
	});
}

/*=============[ TRANSACTION END ]=========================*/
function fn_initSearch(){
//	var dataTypeCd = $(".dataType.active").attr("dataTypeCode");
	fn_getPalPerMonthList();
	gfn_setRsSiteName(rsSiteType,rsSiteNm);
}

/* 1번 차트 생성 */
function fn_mkChart01(data,flag){
	if(chart01) chart01.dispose();
	if(data.length == 0){
		$("#chart01").append(ERR_HTML_TYPE01);
		return;
	}
	data.splice(0,1); //총계 삭제
	
	var series,inversed;
//	if(flag == "SMRY"){ // 관람객
		series = [
			 {type : "col"  , name : "매출액"   , valueKey : "saleAmt"   ,color: COLOR_ARR[5]   ,tooltipText: "{outVal}"  ,clusteredYn: true}
			,{type : "col"  , name : "공헌이익" , valueKey : "confPf"    , color: COLOR_ARR[0]  ,tooltipText: "{outVal1}" ,clusteredYn:true , padding : -10}
			,{type : "line" , name : "관람객"   , valueKey : "spctCnt"   , color: COLOR_ARR[3]  ,tooltipText: "{outVal2}" ,valueAxisType:2}
		];
//	}else if(flag == "SELL"){
//		series = [
//			 {type : "col"  , name : "계획"     , valueKey : "plnSaleAmt"  ,color: COLOR_ARR[5] ,clusteredYn: true , padding : 10}
//			,{type : "col"  , name : "실적"     , valueKey : "saleAmt"     , color: COLOR_ARR[0] ,clusteredYn:true}
//			,{type : "line" , name : "관람객"   , valueKey : "spctCnt"     , color: COLOR_ARR[3] ,valueAxisType:2}
//		];
//	}else{
//		series = [
//			 {type : "col"  , name : "계획"     , valueKey : "planCost"    ,color: COLOR_ARR[5] ,clusteredYn: true , padding : 10}
//			,{type : "col"  , name : "실적"     , valueKey : "cost"        , color: COLOR_ARR[0] ,clusteredYn:true}
//			,{type : "line" , name : "관람객"   , valueKey : "spctCnt"     , color: COLOR_ARR[3] ,valueAxisType:2}
//		];
//	}

//	for(var i in data) data[i].strYmm = data[i].yMm.substr(4,2) + "월\n" + data[i].yMm.substr(0,4) + "년";
	for(var i=0; i<12; i++){
		var stdDt = new Date($("#srchDate").val());
		var conv = new Date(stdDt.getFullYear(),stdDt.getMonth() - i);

		if(conv.getMonth() == 0){
			data[i].strYmm = conv.format("MM월\nyyyy년");
		}else{
			data[i].strYmm = conv.format("MM월");
		};
	}
	for(var i in data){
		var temp1 = data[i].saleAmt;
		if(temp1 < 0){
			data[i].plnSaleAmt = 0;
//			data[i].outVal = temp1;
			data[i].outVal = fn_setNumberUnit(temp1,"M");
		}else{
//			data[i].outVal = temp1;
			data[i].outVal = fn_setNumberUnit(temp1,"M");
		}
		var temp2 = data[i].confPf;
		if(temp2 < 0){
			data[i].confPf = 0;
//			data[i].outVal1 = temp2;
			data[i].outVal1 = fn_setNumberUnit(temp2,"M");
		}else{
//			data[i].outVal1 = temp2;
			data[i].outVal1 = fn_setNumberUnit(temp2,"M");
		}
		var temp3 = data[i].spctCnt;
		if(temp3 < 0){
			data[i].spctCnt = 0;
//			data[i].outVal2 = temp3;
			data[i].outVal2 = fn_setNumberUnit(temp3,"T");
		}else{
//			data[i].outVal2 = temp3;
			data[i].outVal2 = fn_setNumberUnit(temp3,"T");
		}
	}
	
	console.log(data);
	
	chart01 = gfn_mkXYChart(data,{
		chartDivId : "chart01"
		,categoryName : "strYmm"
		,inversed   : true
		,isWide     : true
		,cursor : true
		,cursorFocus : data[0].strYmm
		,min : 0
		,series : series
	});
	chart01.paddingBottom = 0;
	chart01.series.values[0].dataFields.outVal = "outVal";
	chart01.series.values[1].dataFields.outVal1 = "outVal1";
	chart01.series.values[2].dataFields.outVal2 = "outVal2";
}

/*요약 테이블 ROW 생성*/
function fn_mkRowType01(data){
	var html;
	if(data.length == 0){
		html = "<tr> <td colspan=5> 데이터가 없습니다. </td> </tr>"
	}else{
		html = ``
		for(var i in data){
			var srchMonth = $("#srchDate").val().replace(/-/gi,"").substring(2,4);
			var yMm = data[i].yMm+"";
			var plnSpctPer    = data[i].plnSpctPer.replace(/%/gi,"");
			var plnSaleAmtPer = data[i].plnSaleAmtPer.replace(/%/gi,"");
			var plnConfPfPer  = data[i].plnConfPfPer.replace(/%/gi,"");
			var trClass = "";
			var plnSpctPerClass = "";
			var plnSaleAmtPerClass = "";
			var plnConfPfPerClass = "";
			
			if(i != 0){
				if(yMm.substr(2,2) != srchMonth){
					trClass = "point-bg02 type02";
				}
				if(yMm == $("#srchDate").val().replace(/-/gi,"")){
					trClass = "point-bg type02";
				}
				yMm = yMm.substr(2,2) + "-" + yMm.substr(4,2);
			}else if(i == 0){
				trClass = "total type02";
				yMm = "금년누계";
			}
			
			if(Number(plnSpctPer) > 100){
				plnSpctPerClass = "f-color01";
			}else if(Number(plnSpctPer) < 100){
				plnSpctPerClass = "f-color02";
			}
			if(Number(plnSaleAmtPer) > 100){
				plnSaleAmtPerClass = "f-color01";
			}else if(Number(plnSaleAmtPer) < 100){
				plnSaleAmtPerClass = "f-color02";
			}
			if(Number(plnConfPfPer) > 100){
				plnConfPfPerClass = "f-color01";
			}else if(Number(plnConfPfPer) < 100){
				plnConfPfPerClass = "f-color02";
			}
			
			html += `
			<tr class='${trClass}'>
				<td>${yMm}</td>
				<td class='align-r'>
					${data[i].spctCnt}
					<span class='s-font ${plnSpctPerClass}'>${data[i].plnSpctPer}</span>
				</td>
				<td class='align-r'>
					${data[i].saleAmt}
					<span class='s-font ${plnSaleAmtPerClass}'>${data[i].plnSaleAmtPer}</span>
				</td>
				<td class='align-r'>
					${data[i].confPf}
					<span class='s-font ${plnConfPfPerClass}'>${data[i].plnConfPfPer}</span>
				</td>
				<td class='align-r'>
					<span>${data[i].confPfRt}</span
				</td>
			</tr>
			`
		}
	}
	$(".dv-result.type01").find("tbody").empty().append(html);
}

///*매출 테이블 ROW 생성*/
//function fn_mkRowType02(data){
//	var html;
//	if(data.length == 0){
//		html = "<tr> <td colspan=5> 데이터가 없습니다. </td> </tr>"
//	}else{
//		html = ``
//		for(var i in data){
//			var srchMonth = $("#srchDate").val().replace(/-/gi,"").substring(2,4);
//			var yMm = data[i].yMm;
//			var trClass = "";
//			var fColorClass = "";
//			var spanClass = "";
//			var plnSalePer = data[i].plnSalePer.replace(/%/gi,"");
//			var ago1ySalePer = data[i].ago1ySalePer.replace(/%/gi,"");
//
//			if(i != 0){
//				if(yMm.substr(2,2) != srchMonth){
//					trClass = "point-bg02 type02";
//				}
//				yMm = yMm.substr(2,2) + "-" + yMm.substr(4,2);
//			}else if(i == 0){
//				trClass = "total type02";
//			}
//
//			if(plnSalePer == "-"){ /*계획비*/
//				plnSalePer = "-";
//			}else if(plnSalePer < 100){
//				fColorClass = "f-color02";
//				plnSalePer = gfn_numberFormat( Math.abs(plnSalePer) ) + "%";
//			}else if(plnSalePer > 100){
//				fColorClass = "f-color01";
//				plnSalePer = gfn_numberFormat( Math.abs(plnSalePer) ) + "%";
//			}
//			if(ago1ySalePer == "-"){ /*전년비*/
//				ago1ySalePer = "-";
//			}else if(ago1ySalePer < 0){
//				spanClass = "fall";
//				ago1ySalePer = Math.abs(ago1ySalePer).toFixed(1) + "%";
//			}else if(ago1ySalePer > 0){
//				spanClass = "gain";
//				ago1ySalePer = Math.abs(ago1ySalePer).toFixed(1) + "%";
//			}
//
//			html += `
//			<tr class='${trClass}'>
//				<td>${yMm}</td>
//				<td class='align-r'>${data[i].spctCnt}</td>
//				<td class='l-line align-r'>${data[i].saleAmt}</td>
//				<td class='align-r'>
//					<span class='${fColorClass}'>${plnSalePer}</span>
//					<span class='s-font f-color04'>${data[i].plnSaleAmt}</span>
//				</td>
//				<td class='align-r'>
//					<span class='${spanClass}'>${ago1ySalePer}</span>
//					<span class='s-font f-color04'>${data[i].ago1ySaleAmt}</span>
//				</td>
//			</tr>
//			`
//		}
//	}
//	$(".dv-result.type02").find("tbody").empty().append(html);
//}
///*그외 테이블 ROW 생성*/
//function fn_mkRowType03(data){
//	var html;
//	if(data.length == 0){
//		html = "<tr> <td colspan=4> 데이터가 없습니다. </td> </tr>"
//	}else{
//		html = ``
//		for(var i in data){
//			var srchMonth = $("#srchDate").val().replace(/-/gi,"").substring(2,4);
//			var yMm = data[i].yMm;
//			var trClass = "";
//			var fColorClass = "";
//			var spanClass = "";
//			var plnSalePer = data[i].plnSalePer.replace(/%/gi,"");
//			var ago1yPer = data[i].ago1yPer.replace(/%/gi,"");
//
//			if(i != 0){
//				if(yMm.substr(2,2) != srchMonth){
//					trClass = "point-bg02 type02";
//				}
//				yMm = yMm.substr(2,2) + "-" + yMm.substr(4,2);
//			}else if(i == 0){
//				trClass = "total type02";
//			}
//
//			if(plnSalePer == "-"){ /*계획비*/
//				plnSalePer = "-";
//			}else if(plnSalePer < 100){
//				fColorClass = "f-color02";
//				plnSalePer = gfn_numberFormat( Math.abs(plnSalePer) ) + "%";
//			}else if(plnSalePer > 100){
//				fColorClass = "f-color01";
//				plnSalePer = gfn_numberFormat( Math.abs(plnSalePer) ) + "%";
//			}
//			if(ago1yPer == "-"){ /*전년비*/
//				ago1yPer = "-";
//			}else if(ago1yPer < 0){
//				spanClass = "fall";
//				ago1yPer = Math.abs(ago1yPer).toFixed(1) + "%";
//			}else if(ago1yPer > 0){
//				spanClass = "gain";
//				ago1yPer = Math.abs(ago1yPer).toFixed(1) + "%";
//			}
//
//			html += `
//			<tr class='${trClass}'>
//				<td>${yMm}</td>
//				<td class='l-line align-r'>${data[i].cost}</td>
//				<td class='align-r'>
//					<span class='${fColorClass}'>${plnSalePer}</span>
//					<span class='s-font f-color04'>${data[i].planCost}</span>
//				</td>
//				<td class='align-r'>
//					<span class='${spanClass}'>${ago1yPer}</span>
//					<span class='s-font f-color04'>${data[i].ago1yCost}</span>
//				</td>
//				<td class='align-r'>
//					<span>${data[i].saleAmtPer}</span>
//					<span class='s-font f-color04'>${data[i].saleAmt}</span>
//				</td>
//			</tr>
//			`
//		}
//	}
//	$(".dv-result.type03").find("tbody").empty().append(html);
//}

/*천명 , 100만원 단위 절삭*/
function fn_setNumberUnit(number , type){
	var convertedNum;
	if(type == "M"){
		if(number == 0) return "0.0"
		convertedNum = number/1000000;
		convertedNum = Math.round(convertedNum);
//		convertedNum = (Math.round(convertedNum*10)/10).toFixed(1);
		convertedNum = gfn_numberFormat(convertedNum)
	}else if(type == "T"){
		if(number == 0) return "0.0"
		convertedNum = number/1000;
		convertedNum = Math.round(convertedNum);
//		convertedNum = (Math.round(convertedNum*10)/10).toFixed(1);
		convertedNum = gfn_numberFormat(convertedNum)
	}else if(type =="P"){
		convertedNum = number.toFixed(1)+"%";
	}else{
		return;
	}
	return convertedNum;
}

//Summary 로 이동
function fn_goPalSmry(obj){
	var url = "/result/palSmry.do";
	url += "?pageId="+pageId;
	url += "&rsSiteType="+rsSiteType;
	url += "&rsSiteNm="+rsSiteNm;
	url += "&rsSiteCd="+rsSiteCd;
	url += "&srchDate="+obj.yMm;
	location.href = url;
}
/*=============[ FUNCTION END ]=========================*/