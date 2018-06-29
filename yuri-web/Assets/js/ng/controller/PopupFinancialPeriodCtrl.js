exeApp.controller('PopupFinancialPeriodCtrl', ['$scope', '$uibModalInstance', 'bookPeriods', 'vatPeriods', function ($scope, $uibModalInstance, bookPeriods, vatPeriods) {
    $scope.originalBookPeriods = bookPeriods;
    $scope.originalVATPeriods = vatPeriods;

    $scope.bookPeriods = angular.copy($scope.originalBookPeriods);
    $scope.vatPeriods = angular.copy($scope.originalVATPeriods);

    $scope.data = [];
    $scope.data.fk_periodbook_id = null;
    $scope.data.fk_periodvat_id = null;

    $scope.onBookPeriodChanged = function (item) {
        $scope.vatPeriods = [];

        angular.forEach($scope.originalVATPeriods, function (period) {
            if (period.StartDate <= item.StartDate && period.EndDate >= item.EndDate) {
                $scope.vatPeriods.push(period);
            }
        });

        $scope.data.fk_periodbook_id = item.Id;
    };

    $scope.onVATPeriodChanged = function (item) {
        $scope.bookPeriods = [];

        angular.forEach($scope.originalBookPeriods, function (period) {
            if (period.StartDate >= item.StartDate && period.EndDate <= item.EndDate) {
                $scope.bookPeriods.push(period);
            }
        });

        $scope.data.fk_periodvat_id = item.Id;
    };

    $scope.reset = function () {
        $scope.vatPeriods = angular.copy($scope.originalVATPeriods);
        $scope.bookPeriods = angular.copy($scope.originalBookPeriods);
    };

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.save = function () {
        $uibModalInstance.close($scope.data);
    };
}])