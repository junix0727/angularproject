exeApp.controller('siteMasterCtrl', function ($scope, Idle, Keepalive, $uibModal, $http) {
    closeModals = function () {
        if ($scope.warning) {

            $scope.warning.close();
            $scope.warning = null;
        }

        if ($scope.timedout) {
            $scope.timedout.close();
            $scope.timedout = null;
        }
    }
    $scope.check = false;
    $scope.$on('IdleStart', function () {
        closeModals();
        $scope.warning = $uibModal.open({
            templateUrl: 'warning-dialog.html',
            windowClass: 'modal-danger'
        });
    });

    $scope.$on('IdleEnd', function () {
        closeModals();
    });

    $scope.$on('IdleTimeout', function () {
        closeModals();

        window.location = "../../logout.aspx?close=true";
    });

    $scope.no = function () {
        closeModals();

        window.location = "../../logout.aspx?close=true";
    };

    $scope.start = function () {
        closeModals();
        Idle.watch
        
    };
});