exeApp.controller('PopupExchangeRateCtrl', function ($scope, $uibModalInstance, $filter, NgTableParams, $http, currency, amount) {
    $scope.amount = amount;
    $scope.currency = currency;
    $scope.exchangeRates = [];
    $scope.labels = LocalizationStrings;

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10
    }, {
        total: $scope.exchangeRates.length,
        getData: function (parameters) {
            var data = $scope.exchangeRates;

            if (parameters.sorting()) {
                data = $filter('orderBy')(data, parameters.orderBy());
            }

            if (parameters.filter()) {
                data = $filter('filter')(data, parameters.filter());
            }

            parameters.total(data.length);

            var begin = (parameters.page() - 1) * parameters.count();
            var end = parameters.page() * parameters.count();

            return data.slice(begin, end);
        }
    });

    $.ajax({
        type: 'POST',
        url: 'https://api.fixer.io/latest?base=' + currency,
        async: true,
        dataType: 'jsonp',   //you may use jsonp for cross origin request
        crossDomain: true,
        success: function (data, status, xhr) {
            var currentCurrency = currency;
            var currencies = [];
            var exchangeRates = [];

            fx.rates = data.rates;

            for (var key in fx.rates) {
                if (key == currentCurrency) {
                    continue;
                }

                currencies.push(key);
            }

            for (var i = 0; i < currencies.length; i++) {
                exchangeRates.push({
                    Currency: currencies[i],
                    Amount: fx(amount).to(currencies[i])
                });
            }

            $scope.exchangeRates = exchangeRates;

            $scope.tableParams.reload();
        }
    });

    $scope.close = function () {
        $uibModalInstance.close();
    };
});