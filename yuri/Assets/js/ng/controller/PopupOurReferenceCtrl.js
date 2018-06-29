exeApp.controller('PopupOurReferenceCtrl', function ($scope, $uibModalInstance, NgTableParams, $http, $filter, glAccount, account, glAccounts, accounts, ourRefs, labels) {
    $scope.glAccount = glAccount;
    $scope.account = account;
    $scope.accounts = accounts;
    $scope.glAccounts = glAccounts;
    $scope.ourRefs = ourRefs;
    $scope.isValid = true;

    angular.forEach($scope.ourRefs, function (row) {
        row.balance = angular.copy(row.AmountBalance);
    });

    $scope.OurRefTable = new NgTableParams({
        page: 1,
        count: 10,
        sorting: { SortSeq: 'asc' }
    }, {
        total: $scope.ourRefs.length,
        getData: function (parameters) {
            var prefilteredData = $scope.ourRefs;

            angular.forEach(prefilteredData, function (value) {
                value.$selected = false;
                value.InvoiceDate = $filter('date')(value.InvoiceDate, 'shortDate');

                switch (value.JournalType) {
                    case 0:
                        value.JournalTypeDescription = labels.sales;

                        break;
                    case 1:
                        value.JournalTypeDescription = labels.purchase;

                        break;
                    case 2:
                        value.JournalTypeDescription = labels.bank;

                        break;
                }
            });

            var orderedData = parameters.sorting() ? $filter('orderBy')(prefilteredData, parameters.orderBy()) : prefilteredData;
            orderedData = parameters.filter() ? $filter('filter')(orderedData, parameters.filter()) : orderedData;

            parameters.total(orderedData.length);
            return orderedData.slice((parameters.page() - 1) * parameters.count(), parameters.page() * parameters.count());
        }
    });

    $scope.save = function () {
        var data = $filter('filter')($scope.ourRefs, { $selected: true });

        angular.forEach(data, function (row) {
            if (row.balance == 0 || row.balance == null || isNaN(row.balance)) {
                $scope.isValid = false;
                row.exceed = true;
            }
        });
        
        if ($scope.isValid) {
            $uibModalInstance.close(data);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.validate = function (row, balance, inputBalance) {
        if (inputBalance > balance) {
            $scope.exceed = true;
            row.exceed = true;
        } else {
            row.exceed = false;
            $scope.exceed = false;
        }
    };
});