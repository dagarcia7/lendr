/*
Login
 */
$(document).on('submit', '#login-form', function(e) {
    e.preventDefault();
    $.post(
        '/users/login',
        helpers.getFormData(this)
    ).done(function(response) {
        currentUser = response.response.user;
        window.location = 'search';
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.response);
    });
});

/*
Sign Up
 */
$(document).on('submit', '#register-form', function(e) {
    e.preventDefault();
    var regEx = /((?:\w)+\.)*(mit\.edu)/i;
    var formData = helpers.getFormData(this);
    var at = formData.email.indexOf("@");
    var ending = formData.email.slice(at + 1, formData.email.length);

    //Verifying mit.edu addresses
    if (ending.match(regEx)) {
        if (('' + ending.match(regEx)[0]) !== ('' + ending)) {
            errorModal('Email is not a valid MIT email!');
            return;
        }
    } else {
        errorModal('Email is not a valid MIT email!');
        return;
    }

    //Verifying password
    if (formData.password !== formData.confirm_password) {
        errorModal('Password and confirmation do not match!');
        return;
    }
    delete formData['confirm'];
    $.post(
        '/users', formData
    ).done(function(response) {
        currentUser = response.response.user;
        window.location = 'search';
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.response);
    });
});

/*
Log out
*/
$(document).on('click', '#logout', function(e) {
    e.preventDefault();
    $.post(
        '/users/logout'
    ).done(function(response) {
        currentUser = undefined;
        window.location = '/';
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.response);
    });
});

errorModal = function(errMessage) {
    $('.error').text(errMessage);
    $('#modal-error').foundation('reveal', 'open');
}
