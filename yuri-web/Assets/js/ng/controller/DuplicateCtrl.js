exeApp.controller('DuplicateCtrl', ['$scope', '$uibModalInstance', 'duplicates', 'info', function ($scope, $uibModalInstance, duplicates, info) {
    $scope.duplicates = duplicates;
    $scope.info = info;

    $scope.Save = function () {
        $uibModalInstance.close('yes');
    };

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.Edit = function (id) {
        $uibModalInstance.close(id);
    };
}]);