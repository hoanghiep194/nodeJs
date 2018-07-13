var socket = io("http://10.1.10.154:3000");
$(document).ready(function () {
    $('.input100').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    });
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });
    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    // Change forms
    $(".blmd-switch-button").click(function () {
        var _this = $(this);
        if (_this.hasClass('active')) {
            setTimeout(function () {
                _this.removeClass('active');
                $(".ripple-effect-All").find(".ink-All").remove();
                $(".ripple-effect-All").css('z-index', 0);
            }, 1300);
            $(".ripple-effect-All").find(".ink-All").css({
                '-webkit-transform': 'scale(0)',
                '-moz-transform': 'scale(0)',
                '-ms-transform': 'scale(0)',
                '-o-transform': 'scale(0)',
                'transform': 'scale(0)',
                'transition': 'all 1.5s'
            })
            $(".ripple-effect-All").css('z-index', 2);
            $('#Register-form').addClass('form-hidden')
                .removeClass('animate');
            $('#login-form').removeClass('form-hidden');
        } else {
            fullRipper("#26a69a", 750);
            _this.addClass('active');
            setTimeout(function () {
                $('#Register-form').removeClass('form-hidden')
                    .addClass('animate');
                $('#login-form').addClass('form-hidden');
            }, 2000)

        }
    })

    // Form control border-bottom line
    $('.blmd-line .form-control').bind('focus', function () {
        $(this).parent('.blmd-line').addClass('blmd-toggled').removeClass("hf");
    }).bind('blur', function () {
        var val = $(this).val();
        if (val) {
            $(this).parent('.blmd-line').addClass("hf");
        } else {
            $(this).parent('.blmd-line').removeClass('blmd-toggled');
        }
    })

    // Ripple-effect animation
    $(".ripple-effect").click(function (e) {
        var rippler = $(this);

        rippler.append("<span class='ink'></span>");

        var ink = rippler.find(".ink:last-child");
        // prevent quick double clicks
        ink.removeClass("animate");

        // set .ink diametr
        if (!ink.height() && !ink.width()) {
            var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
            ink.css({
                height: d,
                width: d
            });
        }

        // get click coordinates
        var x = e.pageX - rippler.offset().left - ink.width() / 2;
        var y = e.pageY - rippler.offset().top - ink.height() / 2;

        // set .ink position and add class .animate
        ink.css({
            top: y + 'px',
            left: x + 'px'
        }).addClass("animate");

        // remove ink after 1second from parent container
        setTimeout(function () {
            ink.remove();
        }, 1000)
    })
});

// Ripple-effect-All animation
function fullRipper(color, time) {
    setTimeout(function () {
        var rippler = $(".ripple-effect-All");
        if (rippler.find(".ink-All").length == 0) {
            rippler.append("<span class='ink-All'></span>");


            var ink = rippler.find(".ink-All");
            // prevent quick double clicks
            //ink.removeClass("animate");

            // set .ink diametr
            if (!ink.height() && !ink.width()) {
                var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
                ink.css({
                    height: d,
                    width: d
                });
            }

            // get click coordinates
            var x = 0;
            var y = rippler.offset().top - ink.height() / 1.5;

            // set .ink position and add class .animate
            ink.css({
                top: y + 'px',
                left: x + 'px',
                background: color
            }).addClass("animate");

            rippler.css('z-index', 2);

            setTimeout(function () {
                ink.css({
                    '-webkit-transform': 'scale(2.5)',
                    '-moz-transform': 'scale(2.5)',
                    '-ms-transform': 'scale(2.5)',
                    '-o-transform': 'scale(2.5)',
                    'transform': 'scale(2.5)'
                })
                rippler.css('z-index', 0);
            }, 1500);
        }
    }, time)

}

function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        if ($(input).val().trim() == '') {
            return false;
        }
    }
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}

function submitForm() {
    var formdata = JSON.stringify($('#form').serializeObject());
    console.log(formdata);
    $.ajax({
        type: 'POST',
        url: $('#form').attr('action'),
        data: JSON.stringify($('#form').serializeObject()),
        contentType: "application/json",
        success: function (response) {
            var formResponse = JSON.parse(response);

        },
        error: function (daresponseta) {
            alert('error' + response);
            return false;
        }
    });
}