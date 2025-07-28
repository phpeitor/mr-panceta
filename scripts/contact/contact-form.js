
(function ($, window, document, undefined) {
    'use strict';

    $(document).ready(function () {
        $('.form-ajax').each(function (index) {
            var form = this;
            var sendToEmail = $(this).attr("data-email");
            if (isEmpty(sendToEmail)) sendToEmail = '';

            $(form).submit(function (e) {
                // remove the error class
                $('.form-group').removeClass('has-error');
                $('.help-block').remove();

                // Google reCaptcha
                if ((typeof grecaptcha !== 'undefined') && $(this).find(".g-recaptcha").length) {
                    if (grecaptcha.getResponse().length === 0) {
                        e.preventDefault;
                        return false;
                    }
                }

                // get the form data
                var formData = {
                    'values': {},
                    'domain': window.location.hostname.replace("www.", ""),
                    'email': sendToEmail
                };

                $(form).find(".form-value").each(function () {
                    var val = $(this).val();
                    if (!isEmpty(val)) {
                        var name = $(this).attr("data-name");
                        if (isEmpty(name)) name = $(this).attr("name");
                        if (isEmpty(name)) name = $(this).attr("id");
                        var error_msg = $(this).attr("data-error");
                        if (isEmpty(error_msg)) error_msg = "";
                        formData['values'][name] = [val, error_msg];
                    }
                });

                // process the form
                $.ajax({
                    type: 'POST',
                    url: $(form).attr("action"),
                    data: formData,
                    dataType: 'json',
                    encode: true
                }).done(function (data) {
                    if (!data.success) {
                        // Error
                        console.log(data.errors.name);
                        $(form).find(".success-box").show();
                    } else {
                        // Success
                        $(form).html($(form).find(".success-box").html());
                    }
                }).fail(function (data) {
                    // Error
                    console.log(data);
                    $(form).find(".success-box").show();
                });

                e.preventDefault();
            });
        });
    });

}(jQuery, window, document));
