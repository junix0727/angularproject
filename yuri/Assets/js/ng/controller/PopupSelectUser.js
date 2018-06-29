exeApp.controller('PopupSelectUserCtrl', ['$scope', '$uibModalInstance', 'users', function ($scope, $uibModalInstance, users) {
    $scope.userList = users;
    $scope.user = { Id: null };
    $scope.local = LocalizationStrings;

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.assign = function () {
        $uibModalInstance.close($scope.user);
    };

    $scope.onSelectAccount = function (item) {
    };
}])