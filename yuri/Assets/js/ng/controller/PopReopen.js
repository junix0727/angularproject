exeApp.controller('PopReopen', ['$scope', '$uibModalInstance', '$http', '$filter', function ($scope, $uibModalInstance, $http, $filter) {

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.Save = function (action) {
        $uibModalInstance.close('activate');
    };

}]);