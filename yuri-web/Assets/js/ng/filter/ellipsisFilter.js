exeApp.filter('ellipsis', function () {
    var defaultLength = 50;

    return function (text, length) {
        length = length == null ? defaultLength : length;

        if (text && text.length > length) {
            return text.substr(0, length) + "...";
        }
        return text;
    }
})
