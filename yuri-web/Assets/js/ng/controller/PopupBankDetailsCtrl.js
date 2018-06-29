exeApp
    .controller('PopupBankDetailsCtrl', function ($scope, $uibModalInstance, $filter, $http, NgTableParams, content) {
        $scope.title = content.title;
        $scope.isdefault = content.isdefault;
        $scope.close = content.close;
        $scope.data = content.data;

        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 99999999999999,
        }, {
            total: $scope.data.length,
            getData: function (parameters) {
                var prefilteredData = $scope.data;

                angular.forEach(prefilteredData, function (value) {
                    value.$selected = false;
                });

                var orderedData = parameters.sorting() ? $filter('orderBy')(prefilteredData, parameters.orderBy()) : prefilteredData;
                orderedData = parameters.filter() ? $filter('filter')(orderedData, parameters.filter()) : orderedData;

                parameters.total(orderedData.length);
                return orderedData.slice((parameters.page() - 1) * parameters.count(), parameters.page() * parameters.count());
            }
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('close');
        };
    });