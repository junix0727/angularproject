exeApp.controller('PopupAddFinancialPeriodCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', 'nextDate', function ($scope, $uibModalInstance, $http, $filter, nextDate) {
    $scope.id = id;
    $scope.nextDate = nextDate;

   
    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.Delete = function () {
        $uibModalInstance.close('delete');
    };

    $scope.Save = function () {
        $scope.action = "save";
        $scope.performingAction = true;
        var item = $scope.item;
        item.StartDate = $scope.nextDate;

        var data = {
            id: $filter('json')($scope.id),
            data: $filter('json')($scope.item)
        };
        return $http.post('/Views/MasterData/FinancialYearEdit.aspx/Save', angular.toJson(data)
            ).success(function (data, status, headers, config) {
                var returnedData = angular.fromJson(data.d);
                GlobalUtils.Notify(returnedData.Messages);
                window.location = 'FinancialYearEdit.aspx?id=' + angular.toJson($scope.id);

            }).error(function (data, status, headers, config) {
                var returnedData = angular.fromJson(data.d);
                GlobalUtils.Notify(returnedData.Messages);
            });
    };

    $scope.datepickers = {
        uxStartDate: false,
        uxEndDate: false
    };

    $scope.openDatepicker = function (whichDatepicker) {
        $scope.format = 'MMMM dd, yyyy';
        $scope.datepickers[whichDatepicker] = true;

    };
}]);
