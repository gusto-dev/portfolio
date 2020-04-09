﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿/***************************************************************************************************
 * Source Name : lib_validation.js
 * Description : 요효성 체크 함수
 * DATE : 2010.03.30
 * Author  : Yoon Kwonki
 * History : 
***************************************************************************************************/

/***************************************************************************************************
 * 시작일자, 종료일자 유효성 확인
 *
 * @param strFrom	: 시작일자
 * @param strTo		: 종료일자
 * @return			: Boolean
***************************************************************************************************/
function gfn_checkDateFromTo(strFrom, strTo) {
	var nFrom, nTo;
	if(gfn_dateConvert(strFrom) > gfn_dateConvert(strTo))
		return false;
	else
		return true;
}

/***************************************************************************************************
 * 날짜차이가 입력값과 같거나 작은지 확인한다.
 *
 * @param sDate		: 시작일
 * @param eDate		: 종료일
 * @param eDate		: 검사 기간(일)
 * @return			: 검사 기간 내인 경우 true, 아닌 경우 false
***************************************************************************************************/
function gfn_checkDateDiff(sDate, eDate, days)
{
	if (!days) {
		days = 95;
	}
	if (gfn_getDateDiff("D", sDate, eDate) > days) {
		return false;
	} else {
		return true;
	}
}

/***************************************************************************************************
 * 주민등록번호 적함성 여부 체크 함수
 *
 * @param  val	주민번호
 * @return  true(적합), false(부적합)
***************************************************************************************************/
function gfn_checkJuminNo(val){
	return gfn_CheckRegNo(val, "JUMIN");	
}

/***************************************************************************************************
 * 외국인등록번호 적함성 여부 체크 함수
 *
 * @param  val	외국인등록번호
 * @return  true(적합), false(부적합)
***************************************************************************************************/
function gfn_checkForeNo(val) {
	return gfn_CheckRegNo(val, "FORE");	
}

/***************************************************************************************************
 * 등록번호 적함성 여부 체크 함수
 *
 * @param  val1	등록번호
 * @param  val2	내,외국인 구분자
 * @return  true(적합), false(부적합)
***************************************************************************************************/
function gfn_CheckRegNo(val1, val2)
{
	var tmp1, tmp2, tmp3;		
	var sum = 0;
	var result = 0;
	
	val1 = replace(val1, "-", "");		// "-" 제거	
 	val1 = replace(val1, "_", "");		// "_" 제거	
 	
	
	if(val1.length != 13 ) return false;	// 13자리인지 체크
	
	tmp1 = val1.substr( 2, 2 );
	tmp2 = val1.substr( 4, 2 );
	tmp3 = val1.substr( 6, 1 );
	
	var j = Array(12);
	j = [2,3,4,5,6,7,8,9,2,3,4,5];
	for(i=0; i<12; i++)
	{
		sum += tointeger(val1.substr(i, 1)) * j[i];
	}	
	
	if(val2 == "JUMIN")		// 내국인
	{
		if ( (tmp1 < "01") || (tmp1 > "12") ) return false;
		if ( (tmp2 < "01") || (tmp2 > "31") ) return false;
		if ( (tmp3 < "1" ) || (tmp3 > "4" ) ) return false;
		
		result = tointeger(sum) % 11;
		result = ( 11 - tointeger(result) ) % 10;
	} 
	else		// 외국인등록번호 
	{
		if ( (tmp3 != "5" ) && (tmp3 != "6" ) ) return false;
		
		result =  11 - (tointeger(sum) % 11);
		if (result>=10) result-=10;	
			result += 2;
	
		if (result>=10) result-=10;
	}
	
	if (result == val1.substr( 12, 1 )) {
		return true;
	} 
	else {
		return false;
	}
}

/***************************************************************************************************
 * 날짜 여부를 확인
 *
 * @param sYmd	: 입력스트링
 * @return		: Boolean
***************************************************************************************************/
function gfn_isDateYmd(sYmd) {
	if(length(sYmd) < 1)   {
		return false;
	}
	sYmd = gfn_dateConvert(sYmd);

	if(isdigit(sYmd) == false)   {
		gfn_showMessage(this, "MSG_COM_VAL_012");
		return false;
	}

	if(length(sYmd) != 8)   {
		gfn_showMessage(this, "MSG_COM_VAL_013");
		return false;
	}

	var iYear  = ToNumber(sYmd.substr(0,4));	//년도입력(YYYY)
	var iMonth = ToNumber(sYmd.substr(4,2));  //월입력(MM)
	var iDay   = ToNumber(sYmd.substr(6,2));    //일자입력(DD)

	if((iMonth < 1) || (iMonth > 12)){
		gfn_showMessage(this, "MSG_COM_VAL_014", toString(iMonth));
		return false;
	}

	// 날짜의 존재 여부를 확인
	if(GetDay(sYmd) < 0){
		gfn_showMessage(this, "MSG_COM_VAL_015");
		return false;
	}
	return true;
}


/***************************************************************************************************
 * 빈 값인지 체크
 *
 * @param str	: string 값
 * @return			: Boolean
***************************************************************************************************/
function gfn_IsEmpty(str)
{
	str = toString(str);
	if(str == null || str == "" || str.length == 0)
		return true;
	else
		return false;
}

/***************************************************************************************************
 * 빈 값인지 체크
 *
 * @param str	: string 값
 * @return			: Boolean
***************************************************************************************************/
function gfn_IsNull(str)
{
	str = toString(str);
	if(str == null || str == "" || str.length == 0)
		return true;
	else
		return false;
}

/***************************************************************************************************
 * Trim() 함수를 사용하여 space를 제거한 후 빈 값인지 체크
 *
 * @param str	: string 값
 * @return			: Boolean
***************************************************************************************************/
function gfn_IsEmptyTrim(str)
{
	str = Trim(str);
	if(str == null || str == "" || str.length == 0)
		return true;
	else
		return false;
}

/******************************************************
 * 특수문자인지 여부를 확인한다.
 *
 * @param  pChar 특수문자
 * @return  true/false 특수문자(true), 일반문자(false)
 ******************************************************/
function gfn_isSpecialChar(pChar) {
	var chkstr = quote("~!@#$%^&*()_+|{}:\"<>?`-=\[];',./");
	for (var i = 0; i < length(pChar); i++) {
		if (indexof(chkstr,substr(pChar,i,1)) >= 0) {
			return true;
		}
	}
	return false;
}


/***************************************************************************************************
 * Ascii Code 값 체크
 *
 * @param pValue	: 체크값
 * @param pType     : 구분
 		한글체크 - "KOR"
		영어체크 - "ENG"
		숫자체크 - "NUMBER"
		한글과 숫자만 입력가능 - "KORNUM"
		영어와 숫자만 입력가능 - "ENGNUM"
		특수문자체크 -"SPECIAL"
 * @return			: Boolean
***************************************************************************************************/
function gfn_isValidValueChk(pValue, pType)
{
	var CharStr, AscStr;
	var SpcStr ='"' + "'~ `!@#$%^&*()-_=+|[{]};:',<.>/";

	for(i=0; i< pValue.length; i++)
	{
		CharStr = ToUpper(pValue.substr(i, 1));	// 소문자를 대문자로 (한글,숫자에 적용안됨)	
		AscStr = Asc(CharStr);

		switch(pType)
		{
			case "NUMBER":			// 숫자만 입력가능
				if((CharStr < 0 || CharStr > 9)) return false;
				break;	
			case "KOR":					// 한글만 입력가능			
				if(AscStr < 44032 || AscStr > 55197) return false;
				break;
			case "ENG":					// 영어만 입력가능
				//if(AscStr < 65 || AscStr > 90)&& (AscStr < 97 || AscStr > 122)) return -1;
				if(AscStr < 65 || AscStr > 90) return false;
				break;
			case "KORNUM" :			// 한글과 숫자만 입력가능
				if((CharStr < 0 || CharStr > 9) && (AscStr < 44032 || AscStr > 55197) ) return false;
				break;				
			case "ENGNUM" :			// 영어와 숫자만 입력가능
				if((CharStr < 0 || CharStr > 9) && (AscStr < 65 || AscStr > 90) ) return false;
				break;			
			case "SPECIAL" :		// 특수문자 입력불가
				for(j=0; j<SpcStr.length; j++)
				{
					if(CharStr == charAt(SpcStr, j)) return false;
				}
				break;
		}	

	}	

	return true;
}


/***************************************************************************************************
 * 저장시의 필수 입력조건 체크
 * 컴포넌트 UserData = '필수입력명' 으로 체크한다.
 * ex) 
 * 		if (gfn_requiredCheck(this)) {
 * 			// some logic..
 * 		}
 ***************************************************************************************************/
function gfn_requiredCheck(obj) {
	var cObj;
	cObj = gfn_getCompNullVal(obj, "P");

	if(cObj != null) {
		gfn_showMessage(this, "MSG_COM_VAL_001", cObj.UserData);
		cObj.setFocus();
		return false;
	}
	return true;
}



/***************************************************************************************************
 * 저장시의 입력조건 체크
 * 컴포넌트 maxLeng UTF8 로 확인 
 * ex) 
 * 		if (gfn_requiredCheck(this)) {
 * 			// some logic..
 * 		}
 ***************************************************************************************************/
function gfn_maxLengthCheck(obj) {
	var cObj;
	cObj = gfn_getCompMaxLength(obj, "P");	


	if(cObj != null) {
	
		return false;
	}

	return true;
}

/***************************************************************************************************
 * 필수 입력조건의 입력여부를 체크한다( MaxLength 확인 )
***************************************************************************************************/
function gfn_getCompMaxLength(obj, UserVal) {
	
	var compObj;
	var compObjLeng;
	var compData;
	
	var components = gfn_sortComponentsByTabOrder(obj.Components);
	
	for (var i = 0; i < length(components); i++) {
		compObj = components[i];	
		compData = gfn_getMaxLength(compObj, false);
		
		// 대상 컴포넌트가 아니면 패스		
		if(compData =="99999") continue;
		
		compObjLeng = lengthb(compObj.value);
		
		/*
        trace("compObj " + compObj ); 
		trace("compData " + compData ); 
		trace("compObjLeng " + compObjLeng );
		*/
		
		if( toNumber(compData )> 0){		
		    
			if(left(compData,1) == "H" || left(compData,1) == "W" || left(compData,1) == "A") continue;	

          /*  trace(compData + "<"+compObjLeng);
            trace(" val  = " + (compData - compObjLeng));
          */
			if(compData < compObjLeng)
			{
				gfn_showMessage(compObj, "MSG_COM_VAL_029",compObj.UserData+"|"+compData+"|"+compObjLeng);
				
		        compObj.setFocus();					
				return compObj;
			}
		}
	}
	
	return;
}



/***************************************************************************************************
 * 필수 입력조건의 입력여부를 체크한다(UserData값에 필수입력명 등록)
***************************************************************************************************/
function gfn_getCompNullVal(obj, UserVal) {
	
	var compObj;
	var compData;
	
	var components = gfn_sortComponentsByTabOrder(obj.Components);
	
	for (var i = 0; i < length(components); i++) {
		compObj = components[i];
		if(compObj.IsComposite()) {
			compObj = gfn_getCompNullVal(compObj, UserVal);
			if(compObj != null) return compObj;
		}
		else {
		    compData = gfn_getUserData(compObj, false);
//			if(gfn_getUserData(cObj) == UserVal){
			//UserData값에 필수입력명 등록
			if(length(compData) > 0){
				if(left(compData,1) == "H" || left(compData,1) == "W" || left(compData,1) == "A") continue;				
				if(length(ToString(compObj.Value)) == 0)	return compObj;
			}
		}
	}
	
//	for(var i=0;i<obj.Components.count();i++) {	
//		compObj = obj.Components[i];
//		if(compObj.IsComposite()) {
//			compObj = gfn_getCompNullVal(compObj, UserVal);
//			if(compObj != null) return compObj;
//		}
//		else {
//		    compData = gfn_getUserData(compObj, false);
//			if(gfn_getUserData(cObj) == UserVal){
			//UserData값에 필수입력명 등록
//			if(length(compData) > 0){
//				if(left(compData,1) == "H" || left(compData,1) == "W" || left(compData,1) == "A") continue;				
//				if(length(compObj.Value) == 0)	return compObj;
//			}
//		}
//	}
	return;
}


/***************************************************************************************************
 * 그리드에 특정항목이 입력되었는지 확인한다.
 * pGridObj		그리드 컴포넌트
 * pChkKey 		필수입력 (ColumnID) or (columnID:columnText columnID:columnText columnID:columnText)
 * pMsgFg		표준 메시지를 보일지 여부
 *
 * ex1) gfn_requiredCheckGrid(grd_main, "user_id", true)
 * ex2) gfn_requiredCheckGrid(grd_main, "user_id user_nm", true)
***************************************************************************************************/
/*
function gfn_requiredCheckGrid(pGridObj, pChkKey, pMsgFg ) {
    var gridDs = object(pGridObj.BindDataSet);
	var argChk = IndexOf(pChkKey, " ");

    if(argChk < 0){
		for(var i=0; i<gridDs.count; i++){
			if(gfn_isEmpty(gridDs.GetColumn(i, pChkKey))){
				if( pMsgFg == null || pMsgFg == true ) {
					gfn_showMessage(pGridObj, "MSG_COM_VAL_001", gfn_getHeaderText(pGridObj, pChkKey));
					gridDs.row = i;
					pGridObj.SetCellPos(pGridObj.GetBindCellIndex("body",pChkKey));
					pGridObj.ShowEditor();
				}
				return false;
			}
		}
    } 
    else{
		var chkArray  = split(pChkKey, " ");	
		for(var idx=0; idx<chkArray.length; idx++){		
			var arrCol = split(chkArray[idx], ":");
			for(var i=0; i<gridDs.count; i++){
				if(gfn_isEmpty(gridDs.GetColumn(i, arrCol[0]))){
					if( pMsgFg == null || pMsgFg == true ) {
						gfn_showMessage(pGridObj, "MSG_COM_VAL_001", arrCol[1]);
						gridDs.row = i;
						pGridObj.SetCellPos(pGridObj.GetBindCellIndex("body",arrCol[0]));
						pGridObj.ShowEditor();
					}
					return false;
				}
			}			
		}
	}	
    return true;
}
*/

function gfn_requiredCheckGrid(pGridObj, pChkKey, pMsgFg ) {
    var gridDs = object(pGridObj.BindDataSet);
	var chkArray  = split(pChkKey, " ");
	
    for(var idx=0; idx<chkArray.length; idx++){	
		for(var i=0; i<gridDs.count; i++){
			if(gridDs.GetRowType(i) == "normal" || gridDs.GetRowType(i) == "logical") {
				continue;
			}
			if(gfn_isEmpty(gridDs.GetColumn(i, chkArray[idx]))){
				if( pMsgFg == null || pMsgFg == true ) {
					gfn_showMessage(pGridObj, "MSG_COM_VAL_001", gfn_getHeaderText(pGridObj, chkArray[idx]));
					gridDs.row = i;
					pGridObj.SetCellPos(pGridObj.GetBindCellIndex("body",chkArray[idx]));
					pGridObj.ShowEditor();
				}
				return false;
			}
		}
	}
    	
    return true;
}
/***************************************************************************************************
 * 다건 전송시 그리드(DataSet)에 체크된 항목이 존재하는지
 * 확인한다.
 *
 * @param  pGridObj   입력 컴포넌트
 * @param  pChkKey    Checkbox에 바인딩된 Column ID
 * @param  [pMsgFg]   표준 메시지를 보일지 여부
 * @return  true  체크항목이 있는 경우/
 *          false 체크항목이 없는 경우
***************************************************************************************************/
function gfn_gridCheckExist(pGridObj, pChkKey, pMsgFg ) {
    var gridDs = object( pGridObj.BindDataSet );
    for( var idx = 0 ; idx < gridDs.count ; idx++ ) {
		if( gridDs.GetColumn( idx, pChkKey ) == 1 ) {
			return true;
		}
    }
    if( pMsgFg == null || pMsgFg == true )
		gfn_showMessage(pGridObj,"MSG_COM_VAL_010");
    return false;
}

/***************************************************************************************************
 * 다건 전송시 그리드(DataSet)에 체크된 항목이 1건인지
 * 확인한다.
 * 체크건의 존재여부는 자동확인한다.
 *
 * @param  pGridObj   입력 컴포넌트
 * @param  pChkKey   Checkbox에 바인딩된 Column ID
 * @param  [pMsgFg]   표준 메시지를 보일지 여부
 * @return  true  체크항목이 1건인 경우/
 *          false 체크항목이 없거나 2건 이상인 경우
***************************************************************************************************/
function gfn_gridCheckUnique(pGridObj, pChkKey, pMsgFg ) {
    var gridDs = object( pGridObj.BindDataSet );
    var chkFIndFg = false;
    for( var idx = 0 ; idx < gridDs.count ; idx++ ) {
		if( gridDs.GetColumn( idx, pChkKey ) == 1 ) {
		    if( chkFIndFg ) {
				if( pMsgFg == null || pMsgFg == true )
					gfn_showMessage(pGridObj,"MSG_COM_VAL_011");
				return false;
		    } else {
				chkFIndFg = true;
		    }
		}
    }
    if( !chkFIndFg && (pMsgFg == null || pMsgFg == true ) )
		gfn_showMessage(pGridObj,"MSG_COM_VAL_010");
    return chkFIndFg;
}

/*********************************************************
 * FUNCTION NAME    : gfn_isDatasetNull
 * FUNCTION DESC	: 입력받은 데이터셋이 비어이는지 확인한다.
 *					  여러건의 데어터셋이 입력되었을 경우, 하나의 데이터셋이라도
 *					  비어 있는경우 false 를 반환한다.
 * @param	
 *			pInDs : 데이터셋 이름
 *				ex) "ds_test", "ds_test ds_test1"
 * @return
 *			result array
 *			[0] : true / false : 데이터셋이 비어있음(true)
 *			[1] : 비어있는 dataset id.
 *********************************************************/
function gfn_isDatasetNull(pInDs) {
	var result = array();
	result[0] = false;
	var arrDs = split(pInDs, " ");
	var cnt = length(arrDs);
	for (var i=0; i<cnt; i++) {
		var objDs = object(arrDs[i]);
		if(!(objDs.GetDelRowCount() > 0 || objDs.GetRowCount() > 0)) {
			result[0] = true;
			result[1] = objDs.ID;
			break;
		}
	}
	return result;
}
/*********************************************************
 * FUNCTION NAME    : gfn_isEmail
 * FUNCTION DESC	: 입력된 값이 빈값인지 체크.
 *				  입력된 값이 이메일 포맷인지 체크하여,
 *				  true/false return
 * @param	
 *			emailStr: 이메일 string
 * @return
 *			return true(파라미터 값이 이메일포맷) : 1
 *				   false(파라미터 값이 이메일 포맷이 아님) : 0
 *********************************************************/
function gfn_isEmail(emailStr)
{
	var sReturnValue = false;
	var sTmp = "";
	var sRegExp = "[a-z0-9]+[a-z0-9.,]+@[a-z0-9]+[a-z0-9.,]+\\.[a-z0-9]+";
	
	var regexp = CreateRegExp(sRegExp,"ig");
	sTmp = regexp.Exec(emailStr);
	
	if ( sTmp == null )
			sReturnValue = false;
	else
	{
		if ( ( sTmp.index == 0 ) && (sTmp.length == emailStr.length ) )
			sReturnValue = true;
		else
			sReturnValue = false;
	}
	
	return sReturnValue;
}



function gfn_getMaxLength(obj, pEnable)
{
	

	switch(ToUpper(obj.GetType()))
	{
		case "CHECKBOX":
		case "EDIT":
		case "LISTBOX":
		case "MASKEDIT":
		case "SPIN":
		case "TEXTAREA":
		case "TREEVIEW":
			if(pEnable == false){
				if(obj.enable == 0)  obj.MaxLength = "";	
			}
			return obj.MaxLength;
			break;
		default:
		    return "99999";
		    break;
    }
}
