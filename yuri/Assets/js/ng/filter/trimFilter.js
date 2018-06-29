exeApp.filter('trim', function () {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz';

    var restricted = [
        '.', ',', '/', '>', '<', '*', '?', '+', '\\', '"', '\'',
        ':', ';', '@', '#', '^', '_', '`', '~', '{', '}', '[', ']'
    ];

    return function (text) {
        var hasRestrictedCharacters = restricted.some(function (v) {
            return text.indexOf(v) >= 0;
        });

        if (hasRestrictedCharacters) {
            angular.forEach(restricted, function (string) {
                text = text.replace(string, '');
            })
        }

        return text;
    };
})
