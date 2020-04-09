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
	
	/*일자변경 이벤트*/
	$("#srchDate").on("change",function(e){
		console.log($(e.target).val());
		srchDate = $(e.target).val().replace(/-/gi,"");
		fn_initSearch();
	});
	
	/* th 클릭 > Sortting 이벤트*/
	$(".sortTh").on("click",function(e){
		var sortType = "desc";
		if($(e.target).hasClass("sort-active desc")) sortType = "asc";
		$(".sortTh").removeClass("sort-active asc desc");
		$(e.target).addClass("sort-active "+sortType);
		fn_initSearch();
	});
	
	/* 필터 버튼 클릭 이벤트 */
	$(".dataType").on("click",function(evnt){
		$(".dataType").removeClass("active");
		$(evnt.target).addClass("active");
		var datTypeCd = $(evnt.target).attr("data-typeCd");
		
		$(".dv-result").hide();
		
		if("SMRY" == datTypeCd){
			$(".dv-result.type01").show();
			$(".sortTh:visible").eq(0).addClass("sort-active desc");
		}else if("SELL" == datTypeCd){
			$(".dv-result.type02").show();
			$(".sortTh:visible").eq(0).addClass("sort-active desc");
		}else{
			$("#dataType").text($(evnt.target).text());
			$(".dv-result.type03").show();
			$(".sortTh:visible").eq(1).addClass("sort-active desc");
		}
		fn_initSearch();
	});
	
	/*라디오 버튼 클릭 이벤트*/
	$("[name='radio-rsSite']").on("change",function(e){
		var $el = $(e.target);
		$(".th_rsSiteType").text($el.val().toUpperCase());
		fn_initSearch();
	});
	
	//페이지 진입 초기 정렬값;
	$(".sortTh:visible").eq(0).addClass("sort-active desc");
	fn_initSearch(); //조회,재조회
}
/*=============[ INIT END ]=========================*/


//SITE별 실적 조회
function fn_getPalRsSiteList(type,dataTypeCode,sortCol,sortType){
	
	var params = {
		dataTypeCode : dataTypeCode
		,sortType:     sortType
		,sortCol:      sortCol
		,searchType:   type
		,srchDate :    srchDate
	};
	console.log("params",params);
	
	transaction({
		url : '/result/getPalRsSiteList.do'
		,params : params
	},function(result,e){
		if(!e){
			console.log(dataTypeCode,result);
			var data = result.resultList;
			
			for(var i in data){
				for(var key in data[i]){
					if("number" == typeof(data[i][key])){
						var type;
						if(key.search("Cnt") != -1) type = "T";
						else if(key.search("Per") != -1 || key.search("Rt") != -1 ) type = "P";
						else type = "M";
						data[i][key] = fn_setNumberUnit(data[i][key],type);
					}
				}
			}
			
			if("SMRY" == dataTypeCode) fn_mkRowType01(data,sortCol); 
			else if("SELL" == dataTypeCode) fn_mkRowType02(data,sortCol);
			else fn_mkRowType03(data,sortCol);
			
		}else{
			console.error(e);
		}
	});
}
/*=============[ TRANSACTION END ]=========================*/
//검색
function fn_initSearch(){
	var type = $("[name='radio-rsSite']:checked").val();
	var dataTypeCd = $(".dataType.active").attr("data-typeCd");
	var sortCol= $(".sortTh.sort-active:visible").attr("sortCol");
	var sortType = $(".sortTh.sort-active:visible").hasClass("asc") ? "a":"d";
	fn_getPalRsSiteList(type,dataTypeCd,sortCol,sortType);
}
/*랭킹 셋팅*/
function fn_setRank(data,sortCol){
	$("#fstNm" ).text(data[1].nm);
	$("#fstRcd").text(data[1][sortCol]);
	$("#scdNm" ).text(data[2].nm);
	$("#scdRcd").text(data[2][sortCol]);
	$("#thdNm" ).text(data[3].nm);
	$("#thdRcd").text(data[3][sortCol]);
}
/*요약 테이블 ROW 생성*/
function fn_mkRowType01(data,sortCol){
	var html;
	if(data.length == 0){
		html = "<tr> <td colspan=4> 데이터가 없습니다. </td> </tr>"
	}else{
		html = ``
		for(var i in data){
			html += `
			<tr class='${i==0 ? 'total type02':'' }' data-code='${data[i].cd}'>
				<td>${data[i].nm}</td>
				<td class='align-r'>${data[i].spctCnt}</td>
				<td class='align-r'>${data[i].saleAmt}</td>
				<td class='align-r'>${data[i].confPf}<span class='s-font f-color01'> ${data[i].confPfRt}</span</td>
			</tr>
			`
		}
	}
	$(".dv-result.type01").find("tbody").empty().append(html);
	fn_setRank(data,sortCol);
}
/*매출 테이블 ROW 생성*/
function fn_mkRowType02(data,sortCol){
	var html;
	if(data.length == 0){
		html = "<tr> <td colspan=5> 데이터가 없습니다. </td> </tr>"
	}else{
		html = ``
		for(var i in data){
			html += `
			<tr class='${i==0 ? 'total type02':'' }' data-code='${data[i].cd}'>
				<td>${data[i].nm}</td>
				<td class='align-r'>${data[i].spctCnt}</td>
				<td class='l-line align-r'>${data[i].saleAmt}</td>
				<td class='align-r'>${data[i].plnSalePer}</td>
				<td class='align-r'>${data[i].ago1ySaleAmt}</td>
			</tr>
			`
		}
	}
	$(".dv-result.type02").find("tbody").empty().append(html);
	fn_setRank(data,sortCol);
}
/*그외 테이블 ROW 생성*/
function fn_mkRowType03(data,sortCol){
	var html;
	if(data.length == 0){
		html = "<tr> <td colspan=4> 데이터가 없습니다. </td> </tr>"
	}else{
		html = ``
		for(var i in data){
			html += `
			<tr class='${i==0 ? 'total type02':'' }' data-code='${data[i].cd}'>
				<td>${data[i].nm}</td>
				<td class='align-r'>${data[i].cost}</td>
				<td class='align-r'>${data[i].plnPer}</td>
				<td class='align-r' >${data[i].ago1yPer}</td>
				<td class='align-r l-line'>${data[i].salePer}</td>
			</tr>
			`
		}
	}
	$(".dv-result.type03").find("tbody").empty().append(html);
	fn_setRank(data,sortCol);
}

/*천명 , 100만원 단위 절삭*/
function fn_setNumberUnit(number , type){
	var convertedNum;
	if(type == "M"){
		if(number == 0) return "0.0"
		convertedNum = number/1000000;
		convertedNum = (Math.round(convertedNum*10)/10).toFixed(1);
	}else if(type == "T"){
		if(number == 0) return "0.0"
		convertedNum = number/1000;
		convertedNum = (Math.round(convertedNum*10)/10).toFixed(1);
	}else if(type =="P"){
		convertedNum = number.toFixed(1)+"%";
	}else{
		return;
	}
	return convertedNum;
}
/*=============[ FUNCTION END ]=========================*/