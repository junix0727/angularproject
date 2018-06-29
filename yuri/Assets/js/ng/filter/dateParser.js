exeApp.filter('dateParser', function () {
    return function (date) {
        if (!date) {
            return date;
        }

        var time = 'T00:00:00.000Z';

        if (date instanceof Date) {
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + date.getDate()).slice(-2);

            date = year + '-' + month + '-' + day + time;
        }

        if (typeof date == 'string') {
            date = date.substring(0, 10) + time;
        }

        return date;
    };
})