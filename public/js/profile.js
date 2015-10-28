// Functions called on Profile page load
$(document).ready(function() {
    /*
        Get the requests of your items
        */
    $.get('/requests').done(function(response) {
        var requests = response.response.requests;
        $('#items-requested').html(Handlebars.templates['item-request']({
            requests: requests
        }));
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });

    /*
        Get return requests for items that people borrowed
        */
    $.get('/returns').done(function(response) {
        var returns = response.response.returns;
        $('#items-returned').html(Handlebars.templates['item-return']({
            returns: returns
        }));
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });

    /*
        Get your items
        */
    $.get('/items/owned').done(function(response) {
        var items = response.response.items;
        $('#items-owned').html(Handlebars.templates['item-owned']({
            items: items
        }));
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });

    /*
        Get items your are borrowing
        */
    $.get('/items/borrowed').done(function(response) {
        var borrowedItems = response.response.items;;
        $('#items-borrowed').html(Handlebars.templates['item-borrow']({
            borrowedItems: borrowedItems
        }));
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.response);
    });

    $.get('/users/' + $('#userId').html()).done(function(response) {
        $('#settings-display').html(Handlebars.templates['settings-info']({
            owner: response.response.user
        }));
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.response);
    });

});

/*
Post a new item that you are willing to lend
*/

// Open Modal
$(document).on('click', '#open-modal-new-item', function(e) {
    e.preventDefault();
    $('#modal-item-new').foundation('reveal', 'open');
});

// Submit New Item Modal
$(document).on('submit', '#item-new', function(e) {
    e.preventDefault();
    var description = $('#item-new-description').val();
    if (description.trim().length === 0) {
        errorModal('Description must not be empty');
        return;
    }
    // create new item
    $.post('/items', {
        description: description
    }).done(function(response) {
        window.location = "/profile";
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
});

/*
Delete item you own
*/
// Open Modal
$(document).on('click', '#open-modal-item-owned-delete', function(e) {
    e.preventDefault();
    var itemId = $(this).parent().attr('id');
    $('#item-delete-form-itemId').attr('value', itemId);
    $('#modal-item-delete').foundation('reveal', 'open');
});

// Submit Delete Item Modal
$(document).on('submit', '#item-delete-form', function(e) {
    e.preventDefault();
    var formData = helpers.getFormData(this);
    // delete item
    $.ajax({
        url: '/items/' + formData.itemId,
        method: 'DELETE'
    }).done(function(response) {
        $('a.close-reveal-modal').trigger('click');
        $('#' + formData.itemId).remove();
        $('.item[data-itemId=' + formData.itemId + ']').remove()
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
});

/*
Approve item request
*/
$(document).on('submit', '.request-approve', function(e) {
    e.preventDefault();
    var borrowerId = e.currentTarget.children[0].value;
    var itemId = e.currentTarget.children[1].value;
    var requestId = e.currentTarget.children[2].value;

    // Create New Loan
    $.post('/loans', {
        borrower: borrowerId,
        item: itemId
    }).done(function(response) {
        var itemId = response.response.request.item;
        $.ajax({
            url: '/items/' + itemId + '/availability',
            type: 'PUT'
        }).done(function(response2) {

        }).fail(function(jqxhr) {
            var response = $.parseJSON(jqxhr.responseText);
            errorModal(response.err);
        });
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });

    // Delete the Request
    $.get('/items/' + itemId + '/requests').done(function(response) {
        $.ajax({
            url: '/requests/item/' + itemId,
            type: 'DELETE'
        }).done(function(response2) {
            requests = response.response.requests;
            requests.forEach(function(reqs) {
                $.get('/users/' + reqs.borrower).done(function(response2) {
                    var borrower_email = response2.response.user.email;
                    $.get('/items/' + itemId).done(function(response3) {
                        var item_description = response3.response.item.description;
                        if (requestId === reqs._id) {
                            helpers.sendRequestApproveMail(borrower_email, item_description);
                        } else {
                            helpers.sendDenyMail(borrower_email, item_description);
                        }
                        $('#' + reqs._id).remove();
                    });

                });

            });
        }).fail(function(jqxhr) {
            var response = $.parseJSON(jqxhr.responseText);
            errorModal(response.err);
        });
    });
});

/*
Deny item request
*/
$(document).on('submit', '.request-deny', function(e) {
    e.preventDefault();
    var requestId = e.currentTarget.children[0].value;

    // delete request
    $.get('/requests').done(function(response) {
        helpers.sendDenyMail(response.response.requests[0].borrower.email, response.response.requests[0].item.description);
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
    $.ajax({
        url: '/requests/' + requestId,
        type: 'DELETE'
    }).done(function(response) {
        $('#' + requestId).remove();
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
});

/*
Return borrowed item
*/
$(document).on('submit', '.item-return', function(e) {
    e.preventDefault();
    var borrowerId = $('#userId').html();
    var itemId = e.currentTarget.children[0].value;
    $('#modal-borrower-borrowerId').attr('value', borrowerId);
    $('#modal-borrower-itemId').attr('value', itemId);
    $('#modal-borrower-rate').foundation('reveal', 'open');
});

$(document).on('submit', '#borrower-rating-form', function(e) {
    e.preventDefault();
    var formData = helpers.getFormData(this);

    // create new return
    $.post('/returns', {
        borrower: formData.borrowerId,
        item: formData.itemId,
        borRating: formData.borRating
    }).done(function(response) {
        $('a.close-reveal-modal').trigger('click');
        var button = $('#' + formData.itemId)[0].children[0][1];
        button.textContent = 'Submitted for Return';
        button.disabled = true;
        $.get('/items/' + formData.itemId).done(function(response) {
            $.get('/users/' + response.response.item.owner).done(function(response2) {
                helpers.sendReturnMail(response2.response.user.email, response.response.item.description);
            }).fail(function(jqxhr) {
                var response = $.parseJSON(jqxhr.responseText);
                errorModal(response.err);
            });
        }).fail(function(jqxhr) {
            var response = $.parseJSON(jqxhr.responseText);
            errorModal(response.err);
        });
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
});

/*
Item Return
*/
// Open Item Return Modal
$(document).on('submit', '.return-approve', function(e) {
    e.preventDefault();
    var borrowerId = e.currentTarget.children[0].value;
    var itemId = e.currentTarget.children[1].value;
    var returnId = e.currentTarget.children[2].value;

    $('#modal-returnId').attr('value', returnId);
    $('#modal-itemId').attr('value', itemId);
    $('#modal-lendr-rate').foundation('reveal', 'open');
});

// Submit Item Return Modal
$(document).on('submit', '#lendr-rating-form', function(e) {
    e.preventDefault();
    var formData = helpers.getFormData(this);

    // get item
    $.get('/items/' + formData.itemId + '/loans').done(function(response) {
        loanId = response.response.loan[0]._id;
        $.ajax({
            url: '/users/' + response.response.loan[0].borrower
        }).done(function(responseBorrower) {
            var email = responseBorrower.response.user.email;
            // update trustabilities
            $.ajax({
                url: '/users/' + $('#userId').html() + '/trustability',
                method: 'PUT',
                data: {
                    'returnId': formData.returnId,
                    'lenRating': formData.lenRating
                }
            }).done(function(response) {});

            // delete return
            $.ajax({
                url: '/returns/' + formData.returnId,
                type: 'DELETE'
            }).done(function(response) {

                // delete loan
                $.ajax({
                    url: '/loans/' + loanId,
                    type: 'DELETE'
                }).done(function(response) {
                    // update item availability
                    $.ajax({
                        url: '/items/' + formData.itemId + '/availability',
                        type: 'PUT'
                    }).done(function(response2) {
                        helpers.sendReturnApproveMail(email, response2.response.item.description);
                        // close modals
                        $('a.close-reveal-modal').trigger('click');
                        $('#' + formData.returnId).remove();
                    }).fail(function(jqxhr) {
                        var response = $.parseJSON(jqxhr.responseText);
                        errorModal(response.err);
                    });
                }).fail(function(jqxhr) {
                    var response = $.parseJSON(jqxhr.responseText);
                    errorModal(response.err);
                });
            }).fail(function(jqxhr) {
                var response = $.parseJSON(jqxhr.responseText);
                errorModal(response.err);
            });
        }).fail(function(jqxhr) {
            var response = $.parseJSON(jqxhr.responseText);
            errorModal(response.err);
        });
    });
});

/*
Deny item return
*/
$(document).on('submit', '.return-deny', function(e) {
    e.preventDefault();
    var returnId = e.currentTarget.children[0].value;
    $.get('/returns').done(function(response) {
        helpers.sendReturnDenyMail(response.response.returns[0].borrower.email, response.response.returns[0].item.description);
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
    // delete return
    $.ajax({
        url: '/returns/' + returnId,
        type: 'DELETE'
    }).done(function(response) {
        $('#' + returnId).remove();
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.err);
    });
});

/*
User Settings
 */
// Open Modal
$(document).on('click', '#open-modal-user-settings', function(e) {
    e.preventDefault();
    var userId = $('#userId').html();
    // get user's information
    $.get('/users/' + userId).done(function(response) {
        var user = response.response.user;
        $('#modal-name').val(user.name);
        $('#modal-location').val(user.location);
    });
    $('#modal-user-settings').foundation('reveal', 'open');
});

// Submit Modal
$(document).on('submit', '#user-edit-form', function(e) {
    e.preventDefault();
    var formData = helpers.getFormData(this);
    var userId = $('#userId').html();
    // update user
    $.ajax({
        url: 'users/' + userId + '/credentials',
        method: 'PUT',
        data: formData
    }).done(function(response) {
        $('a.close-reveal-modal').trigger('click');
    });
});

/*
Close Modal
 */
$(document).on('click', '.close-modal', function(e) {
    e.preventDefault();
    $('a.close-reveal-modal').trigger('click');
});

errorModal = function(errMessage) {
    $('.error').text(errMessage);
    $('#modal-error').foundation('reveal', 'open');
}
