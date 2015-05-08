/**
beginColor #632593
endColor #FF7766
number 10

*/

function createColorRamp(beginColor,endColor,number){
	var beginColorStr = beginColor.slice(1,beginColor.length);
	var endColorStr = endColor.slice(1,endColor.length);

	var beginColor_16 = parseInt("0x" + beginColorStr,16);
	var beginColorR = (beginColor_16 & 0xff0000) >> 16;
	var beginColorG = (beginColor_16 & 0x00ff00) >> 8;
	var beginColorB = (beginColor_16 & 0x0000ff) >> 0;

	var endColor_16 = parseInt("0x" + endColorStr,16);
	var endColorR = (endColor_16 & 0xff0000) >> 16;
	var endColorG = (endColor_16 & 0x00ff00) >> 8;
	var endColorB = (endColor_16 & 0x0000ff) >> 0;

	var theR,theG,theB,theVal,value;
	var values = [];
    for(i = 0; i <= number; i++) {
    	theR = interpolateColor(beginColorR, endColorR, i, number);
      	theG = interpolateColor(beginColorG, endColorG, i, number);
      	theB = interpolateColor(beginColorB, endColorB, i, number);
    	theVal = ((( theR << 8 ) |  theG ) << 8 ) | theB;
    	value = "#" + theVal.toString(16);
    	values.push(value);
      console.log(value);
    }
    return values;
}

function interpolateColor(pBegin, pEnd, pStep, pMax) {
    if (pBegin < pEnd) {
    	return ((pEnd - pBegin) * (pStep / pMax)) + pBegin;
    }else{
      	return ((pBegin - pEnd) * (1 - (pStep / pMax))) + pEnd;
    }
}