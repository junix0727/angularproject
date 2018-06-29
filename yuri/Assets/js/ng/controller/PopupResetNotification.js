exeApp.controller('PopupResetNotificationCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', function ($scope, $uibModalInstance, $http, $filter) {
    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.Reset = function () {
        $uibModalInstance.close('reset');
    };

}]);