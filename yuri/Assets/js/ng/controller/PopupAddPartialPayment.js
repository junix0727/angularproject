exeApp.controller('PopupAddPartialPaymentCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', 'data', function ($scope, $uibModalInstance, $http, $filter, data) {
    $scope.selectedData = data;

    $scope.dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.save = function () {
        $uibModalInstance.close($scope.selectedData);
    };

}]);
