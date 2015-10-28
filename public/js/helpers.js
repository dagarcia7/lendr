// code from https://github.com/kongming92/6170-p3demo/blob/master/public/javascripts/helpers.js
var helpers = (function() {
    var self = {};
    self.getFormData = function(form) {
        var inputs = {};
        $(form).serializeArray().forEach(function(item) {
            inputs[item.name] = item.value;
        });
        return inputs;
    };

    // Create a function to log the response from the Mandrill API
    log = function(obj) {
        $('#response').text(JSON.stringify(obj));
    }

    // create a new instance of the Mandrill class with your API key
    var m = new mandrill.Mandrill('Fl_YOK66hOobbKv-4GNz0A');

    // create a variable for the API call parameters
    paramsRequestToOwner = function(recipient, description) {
        var params = {
            "message": {
                "from_email": "lendr.no.reply@gmail.com",
                "from_name": "lendr",
                "to": [{
                    "email": recipient
                }],
                "subject": "Item Request",
                "html": "<h1 style='color: #2196f3;font-size: 4em;text-align: center;'>lendr</h1> <h2 style='color:#0288d1;text-align:center'>Your " + description + " is being requested.</h2> <p style='text-align:center'>Please visit <a href='lendr-dagarcia.rhcloud.com'>lendr</a> to approve or deny this request.<p>"
            }
        }
        return params;
    };

    paramsReturnToOwner = function(recipient, description) {
        var params = {
            "message": {
                "from_email": "lendr.no.reply@gmail.com",
                "from_name": "lendr",
                "to": [{
                    "email": recipient
                }],
                "subject": "Item Return",
                "html": "<h1 style='color: #2196f3;font-size: 4em;text-align: center;'>lendr</h1> <h2 style='color:#0288d1;text-align:center'>Your " + description + " is being returned.</h2> <p style='text-align:center'>Please visit <a href='lendr-dagarcia.rhcloud.com'>lendr</a> to approve or deny this return request.<p>"
            }
        }
        return params;
    };

    paramsRequestToBorrower = function(recipient, description) {
        var params = {
            "message": {
                "from_email": "lendr.no.reply@gmail.com",
                "from_name": "lendr",
                "to": [{
                    "email": recipient
                }],
                "subject": "Request Denied",
                "html": "<h1 style='color: #2196f3;font-size: 4em;text-align: center;'>lendr</h1> <h2 style='color:#0288d1;text-align:center'>Your request for the following item has been denied:  " + description + "</h2>"
            }
        }
        return params;
    };

    paramsReturnDenyToBorrower = function(recipient, description) {
        var params = {
            "message": {
                "from_email": "lendr.no.reply@gmail.com",
                "from_name": "lendr",
                "to": [{
                    "email": recipient
                }],
                "subject": "Return Denied",
                "html": "<h1 style='color: #2196f3;font-size: 4em;text-align: center;'>lendr</h1> <h2 style='color:#0288d1;text-align:center'>Your return request for the following item has been denied:  " + description + "</h2>"
            }
        }
        return params;
    };

    paramsReturnApproveToBorrower = function(recipient, description) {
        var params = {
            "message": {
                "from_email": "lendr.no.reply@gmail.com",
                "from_name": "lendr",
                "to": [{
                    "email": recipient
                }],
                "subject": "Return Approve",
                "html": "<h1 style='color: #2196f3;font-size: 4em;text-align: center;'>lendr</h1> <h2 style='color:#0288d1;text-align:center'>Your return request for the following item has been approved:  " + description + "</h2>"
            }
        }
        return params;
    };

    paramsRequestApproveToBorrower = function(recipient, description) {
        var params = {
            "message": {
                "from_email": "lendr.no.reply@gmail.com",
                "from_name": "lendr",
                "to": [{
                    "email": recipient
                }],
                "subject": "Request Approve",
                "html": "<h1 style='color: #2196f3;font-size: 4em;text-align: center;'>lendr</h1> <h2 style='color:#0288d1;text-align:center'>Your request for the following item has been approved:  " + description + "</h2>"
            }
        }
        return params;
    };

    self.sendRequestMail = function(recipient, description) {
        // Send the email!

        m.messages.send(paramsRequestToOwner(recipient, description), function(res) {
            log(res);
        }, function(err) {
            log(err);
        });
    }

    self.sendReturnMail = function(recipient, description) {
        // Send the email!

        m.messages.send(paramsReturnToOwner(recipient, description), function(res) {
            log(res);
        }, function(err) {
            log(err);
        });
    }

    self.sendDenyMail = function(recipient, description) {
        // Send the email!

        m.messages.send(paramsRequestToBorrower(recipient, description), function(res) {
            log(res);
        }, function(err) {
            log(err);
        });
    }

    self.sendReturnDenyMail = function(recipient, description) {
        // Send the email!

        m.messages.send(paramsReturnDenyToBorrower(recipient, description), function(res) {
            log(res);
        }, function(err) {
            log(err);
        });
    }

    self.sendReturnApproveMail = function(recipient, description) {
        // Send the email!

        m.messages.send(paramsReturnApproveToBorrower(recipient, description), function(res) {
            log(res);
        }, function(err) {
            log(err);
        });
    }

    self.sendRequestApproveMail = function(recipient, description) {
        // Send the email!

        m.messages.send(paramsRequestApproveToBorrower(recipient, description), function(res) {
            log(res);
        }, function(err) {
            log(err);
        });
    }
    return self;
})();
