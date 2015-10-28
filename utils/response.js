var Response = {};
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Fl_YOK66hOobbKv-4GNz0A');

//Code borrowed and adapted from Alex's project 3
/// Code inspired by Charles's example code that was provided.

/**
* Helper method that will edit response JSON for successful API calls.
*
* @method sendSuccess
* @param {Object} res Express response object that will be returned
* @param {Object} content Content that was returned from the previous method
*/
Response.sendSuccess = function(res, content) {
	res.setHeader('Content-Type', 'application/json');
	res.status(200);
    res.json({
		status: "ok",
		response: content
	});
    res.end();
};

/**
* Helper method that will edit response JSON for failing API calls.
*
* @method sendErr
* @param {Object} res Express response object that will be returned
* @param {Integer} errcode Integer of the HTTP code that occurred
* @param {String} err error string describing the error that occurred
*/
Response.sendErr = function(res, errcode, err) {
	res.setHeader('Content-Type', 'application/json');
	res.status(errcode).json({
		status: "error",
		response: err
	}).end();
};

Response.requestForDelete = function (req, res, model, params) {
	model.findOneAndRemove(params, function (err) {
		if (err) {
			Response.sendErr(res, 500, 'An unknown error occurred.');
		}
		else {
			Response.sendSuccess(res, {data: null});
		}
	})
};

//-------------------
// Helper functions
//-------------------
// Restrict: function to check for a valid user login before displaying a page
Response.restrict = function (req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        Response.sendErr(res, 400, 'Access denied!');
    }
}

module.exports = Response;


