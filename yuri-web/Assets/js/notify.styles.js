var NotifyHelpers =
{
    GetBSAlert: function (type, minwidth) {

        var minWithString = '';

        if (minwidth) {
            minWithString = "style = 'min-width:" + minwidth + "'";
        }

        return "<div><div class='alert alert-" + type + "' role='alert' " + minWithString + "><span data-notify-text/></div></div>";
    },

    GetOptionsForStyle: function (notificationStyle) {
        var options =
        {
            // whether to hide the notification on click
            clickToHide: true,
            // whether to auto-hide the notification
            autoHide: true,
            // if autoHide, hide after milliseconds
            autoHideDelay: 5000,
            // show the arrow pointing at the element
            arrowShow: true,
            // arrow size in pixels
            arrowSize: 5,
            // default positions
            elementPosition: 'bottom left',
            globalPosition: 'bottom right',
            // default style
            style: notificationStyle,
            // show animation
            showAnimation: 'slideDown',
            // show animation duration
            showDuration: 400,
            // hide animation
            hideAnimation: 'slideUp',
            // hide animation duration
            hideDuration: 200,
            // padding between element and notification
            gap: 2
        };
        return options;

    }
};


$.notify.addStyle('GlobalSuccess', {
    html: NotifyHelpers.GetBSAlert('success', '300px')
});

$.notify.addStyle('GlobalInfo', {
    html: NotifyHelpers.GetBSAlert('info', '300px')
});

$.notify.addStyle('GlobalWarning', {
    html: NotifyHelpers.GetBSAlert('warning', '300px')
});

$.notify.addStyle('GlobalDanger', {
    html: NotifyHelpers.GetBSAlert('danger', '300px')
});

$.notify.addStyle('ItemSuccess', {
    html: NotifyHelpers.GetBSAlert('success')
});

$.notify.addStyle('ItemInfo', {
    html: NotifyHelpers.GetBSAlert('info')
});

$.notify.addStyle('ItemWarning', {
    html: NotifyHelpers.GetBSAlert('warning')
});

$.notify.addStyle('ItemDanger', {
    html: NotifyHelpers.GetBSAlert('danger')
});
