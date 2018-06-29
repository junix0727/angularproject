exeApp.controller('OrderCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', function ($scope, $uibModalInstance, $http, $filter) {
    $scope.save = function () {
        $uibModalInstance.close('save');
    };

    $scope.close = function () {
        $uibModalInstance.close('close');
    };

}]);