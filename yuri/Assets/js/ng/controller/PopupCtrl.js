exeApp.controller('PopupCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', 'message', function ($scope, $uibModalInstance, $http, $filter, message) {
    $scope.deletemessage = message ? message : LocalizationStrings.GlobalMsgConfirmDelete;
    $scope.approvemessage = message ? message : LocalizationStrings.MsgConfirmDeliveryNote;

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.Delete = function () {
        $uibModalInstance.close('delete');
    };

    $scope.ApproveAll = function () {
        $uibModalInstance.close('ApproveAll');
    };

}]);