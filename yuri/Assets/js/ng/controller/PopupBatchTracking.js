exeApp.controller('PopupFilterReportbyShipDateCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', function ($scope, $uibModalInstance, $http, $filter) {
    $scope.mydata = {};
    $scope.shipDate = new Date();

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.Add = function () {
        var parameters = {
            shipDate: $scope.shipDate
        };
        console.log('Date', $scope.shipDate);
        $uibModalInstance.close($scope.shipDate);
    };


} ]);