exports.isEmpty = (value) => {
	if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { return true } else { return false }
}

exports.longLen = (obj, len) => {
	return obj.length>=len ? true : false
}
exports.shortLen = (obj,len) => {
	return obj.length<=len ? true : false
}

