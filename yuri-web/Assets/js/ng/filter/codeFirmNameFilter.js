exeApp.filter('codeFirmNameFilter', function () {
    return function (items, input) {
        var filtered = [];

        if (input === undefined || input === '') {
            return items;
        }

        if (!items) {
            return filtered;
        }

        items.forEach(function (item) {
            if (!isNaN(input[0])) {
                if (item.Code.indexOf(input) == 0) {
                    filtered.push(item);
                }
            } else if (item.FirmName) {
                if (item.FirmName.toString().toLowerCase().indexOf(input) != -1 || item.FirmName.toString().toUpperCase().indexOf(input) != -1) {
                    filtered.push(item);
                }
            }
        });

        return filtered;
    };
})