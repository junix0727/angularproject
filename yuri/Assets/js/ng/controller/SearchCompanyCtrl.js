exeApp.controller('SearchCompanyCtrl', ['$scope', '$uibModalInstance', 'NgTableParams', '$filter', 'companies', function ($scope, $uibModalInstance, NgTableParams, $filter, companies) {
    $scope.companies = companies;

    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10
    }, {
        total: $scope.companies.length,
        getData: function (parameters) {
            var prefilteredData = $scope.companies;

            angular.forEach(prefilteredData, function (item) {
                item.$selected = item.$selected == 'True';

                if (item.$selected)
                {
                    $scope.changeSelection(item);
                }
            });

            var orderedData = parameters.sorting() ? $filter('orderBy')(prefilteredData, parameters.orderBy()) : prefilteredData;
            orderedData = parameters.filter() ? $filter('filter')(orderedData, parameters.filter()) : orderedData;

            parameters.total(orderedData.length);
            return orderedData.slice((parameters.page() - 1) * parameters.count(), parameters.page() * parameters.count());
        }
    });

    $scope.preSelection = null;

    $scope.changeSelection = function (daily) {
        $scope.row = daily;

        if ($scope.preSelection == daily) {
            daily.$selected = false;
            $scope.preSelection = null;
        } else {
            if ($scope.preSelection) {
                $scope.preSelection.$selected = false;
            }

            $scope.preSelection = daily;
            daily.$selected = true;
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.select = function () {
        if ($scope.preSelection) {
            var url = location.pathname + location.search;

            topmenu.onCompanyChanged($scope.preSelection.Id, url.replace('ForBook=True', 'ForBook=False'));
        }
    };
}])