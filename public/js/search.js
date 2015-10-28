/*
Search for an item
*/
$(document).on('submit', '#item-search', function(e) {
    e.preventDefault();
    var formData = helpers.getFormData(this);
    $.ajax({
        url: 'items/search',
        data: formData,
        method: 'GET'
    }).done(function(response) {
        var items = response.response.items;
        $('#search-items').html(Handlebars.templates['item-search']({
            items: items
        }));
    }).fail(function(jqxhr) {
        var response = $.parseJSON(jqxhr.responseText);
        errorModal(response.response);
    });

});

/*
Submit an item request to owner
*/
$(document).on('submit', '.item-request', function(e) {
    e.preventDefault();
    var userId = $('#userId').html();
    var itemId = $('#item-request-id').val();
    var incentive = $('#modal-item-incentive').val();
    $.post('/requests', {
        borrower: userId,
        item: itemId,
        incentive: incentive
    }).done(function(response) {
        $('a.close-reveal-modal').trigger('click');
        var span  = $('#item-button-'+itemId);
        span.html('Requested');
        span.parent().attr('disabled',true);
        $.get('/items/' + itemId).done(function(response) {
            $.get('/users/' + response.response.item.owner).done(function(response2) {
               helpers.sendRequestMail(response2.response.user.email, response.response.item.description);
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
Open item request modal
 */
$(document).on('click', '#open-modal-item-request', function(e) {
    e.preventDefault();
    var itemId = $(this).siblings()[0].value;
    $.get('/items/' + itemId).done(function(response) {
        var item = response.response.item;
        $('#modal-item-name').html(JSON.stringify(item.description));
        $.get('/users/' + item.owner).done(function(response) {
            var user = response.response.user;
            $('#modal-item-location').html(user.location.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        });
    });
    $('#item-request-id').attr('value', itemId);
    $('#modal-item-request').foundation('reveal', 'open');
});


errorModal = function(errMessage) {
    $('.error').text(errMessage);
    $('#modal-error').foundation('reveal', 'open');
}

