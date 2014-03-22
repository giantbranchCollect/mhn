$(document).ready(function() {
    var requestChange = function(url, inputObj, data, success, error) {

        inputObj.attr('enabled', false);
        $.ajax({
            type: 'PUT',
            url: url,
            data: JSON.stringify(data),
            success: success,
            contentType: 'application/json',
            error: error,
            always: function(resp) {
                inputObj.attr('enabled', true);
            }
        });
    };

    if ($('#sensor-fields').length >= 1) {
        $('#create-btn').click(function() {
            var sensorObj = {
                name: $('#name').val(),
                hostname: $('#hostname').val()
            }
            $('#alert-row').hide();
            $.ajax({
                type: 'POST',
                url: '/api/sensor/',
                data: JSON.stringify(sensorObj),
                success: function(resp) {
                    $('#sensor-info').show();
                    $('#sensor-id').html('UUID: ' + resp.uuid);
                },
                contentType: 'application/json',
                error: function(resp) {
                    $('#sensor-info').hide();
                    $('#alert-row').show();
                    $('#error-txt').html(resp.responseJSON.error);
                }
            });
        });
    }

    if ($('#rule-table').length >= 1) {
        $('.checkbox').click(function() {
            var checkbox = $(this);
            var isChecked = checkbox.is(':checked');
            var ruleId = $(this).attr('data-rule-id');

            requestChange(
                '/api/rule/' + ruleId + '/',  // URL
                checkbox,
                {is_active: isChecked},  // Data
                function() {},           // Success
                function() {             // Error
                    // Reverses the state.
                    checkbox.prop({checked: !isChecked});
                }
            );
        });
        $('.text-edit').focusout(function() {
            var input = $(this);
            var fieldName = input.attr('data-field-name');
            var data = new Object();
            var ruleId = $(this).attr('data-rule-id');

            data[fieldName] = input.val();
            requestChange(
                '/api/rule/' + ruleId + '/',  // URL
                input,
                data,                    // Data
                function() {},           // Success
                function() {             // Error
                    // Reverses the state.
                    alert('Could not save changes.');
                }
            );
        });
    }

    if ($('#login-form').length >= 1) {
        $('#log-btn').click(function() {
            var email = $('#email').val();
            var passwd = $('#passwd').val();
            var data = {
                email: email,
                password: passwd
            };
            $('#alert-text').hide();

            $.ajax({
                type: 'POST',
                url: '/auth/login/',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function() {
                    window.location.href = '/ui/dashboard/';
                },
                error: function(resp) {
                    $('#alert-text').show();
                    $('#error-txt').html(resp.responseJSON.error);
                },
            });
        });
    }

    $('#out-btn').click(function(e) {
        e.preventDefault();
        $.get('/auth/logout/', function() {
            window.location.href = '/ui/login/';
        });
    });

    $('#submit-script').click(function(e) {
        e.preventDefault();

        var script = $('#script-edit').val();
        var notes = $('#notes-edit').val();

        $('#alert-text').hide();
        $.ajax({
            type: 'POST',
            url: '/api/script/',
            data: JSON.stringify({
                script: script,
                notes: notes
            }),
            contentType: 'application/json',
            success: function() {
                $('#alert-text').removeClass('warning').addClass('success');
                $('#error-txt').html('Script updated OK!');
                $('#alert-text').show();
            },
            error: function(resp) {
                $('#alert-text').removeClass('success').addClass('warning');
                $('#error-txt').html(resp.responseJSON.error);
                $('#alert-text').show();
            }
        });
    });

    if ($('#src-form').length >= 1) {
        $('#add-src').click(function(e) {
            e.preventDefault();
            var name = $('#name').val();
            var uri = $('#uri').val();
            var note = $('#note').val();

            $('#alert-text').hide();
            $.ajax({
                type: 'POST',
                url: '/api/rulesources/',
                data: JSON.stringify({
                    name: name,
                    uri: uri,
                    note: note
                }),
                contentType: 'application/json',
                success: function() {
                    window.location.reload();
                },
                error: function(resp) {
                    $('#error-txt').html(resp.responseJSON.error);
                    $('#alert-text').show();
                }
            });
        });
        $('.del-rs').click(function() {
            var rsId = $(this).attr('data-rs-id');

            $.ajax({
                type: 'DELETE',
                url: '/api/rulesources/' + rsId + '/',
                success: function() {
                    window.location.reload();
                },
                error: function(resp) {
                    alert('There was an error deleting this source.');
                }
            });
        });
    }

    if ($('#sensor-table').length >= 1) {
        $('.text-edit').focusout(function() {
            var input = $(this);
            var fieldName = input.attr('data-field-name');
            var data = new Object();
            var sensorId = $(this).attr('data-sensor-id');

            data[fieldName] = input.val();
            requestChange(
                '/api/sensor/' + sensorId + '/',  // URL
                input,
                data,                    // Data
                function() {},           // Success
                function() {             // Error
                    // Reverses the state.
                    alert('Could not save changes.');
                }
            );
        });

        $('.del-sensor').click(function() {
            var sensorId = $(this).attr('data-sensor-id');

            $.ajax({
                type: 'DELETE',
                url: '/api/sensor/' + sensorId + '/',
                success: function() {
                    window.location.reload();
                },
                error: function(resp) {
                    alert('There was an error deleting this sensor.');
                }
            });
        });
    }
});