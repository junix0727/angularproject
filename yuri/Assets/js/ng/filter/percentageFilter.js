exeApp.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        if (!input && input < 0) {
            return;
        }

        return $filter('number')(input * 100, decimals) + '%';
    };
}])