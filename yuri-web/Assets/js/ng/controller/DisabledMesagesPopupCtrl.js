exeApp
    .controller('DisabledMesagesPopupCtrl', function ($scope, $uibModalInstance, $filter, $http, data, ask, NgTableParams) {
        $scope.data = data;
        $scope.ask = ask;

        $scope.dismiss = function () {
            $uibModalInstance.close('cancel');
        };

        $scope.yes = function () {
            $uibModalInstance.close('yes');
        };
    });