var SMP = window.SMP = window.SMP || {};

SMP.asHTML = function(plainTextString) {
	return plainTextString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};