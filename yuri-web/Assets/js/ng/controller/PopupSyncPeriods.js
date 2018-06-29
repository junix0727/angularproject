exeApp.controller('PopupSyncPeriods', function ($scope, $uibModalInstance, items, periods, period) {
    $scope.periods = periods;
    $scope.period = period;

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.onPeriodChanged = function (period) {
        $scope.period = period.Id;
    };

    $scope.save = function () {
        angular.forEach(items, function (item) {
            item.SyncPeriod = $scope.period;
        });

        $uibModalInstance.close(items);
    };
})