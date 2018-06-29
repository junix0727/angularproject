exeApp.controller('bookingPopupCtrl', ['$scope', '$uibModalInstance', 'bookingData', 'showVatReturn', function ($scope, $uibModalInstance, bookingData, showVatReturn) {
    $scope.showVatReturn = showVatReturn;
    $scope.bookingData = bookingData;
    $scope.preloadedData = preloadedData;

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.close = function () {
        $uibModalInstance.close('Ok');
    };
}])