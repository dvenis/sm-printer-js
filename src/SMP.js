var SMP = window.SMP = window.SMP || {};

SMP.asHTML = function(plainTextString) {
	return plainTextString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

SMP.numberOccurencesOfSubstring = function(string, subString){
	string += "";
	subString +=  "";
	
    if (subString.length <= 0) { 
    	return string.length + 1;
	}

    var n = 0;
    var pos = 0;
    var step = subString.length;

    while(true){
        pos = string.indexOf(subString,pos);
        if (pos >= 0) {
        	n++;
        	pos += step; 
        } else {
        	break;
        }
    }
    return(n);
};