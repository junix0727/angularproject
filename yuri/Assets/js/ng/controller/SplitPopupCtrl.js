exeApp.controller('SplitPopupCtrl', ['$scope', '$uibModalInstance', 'journal', function ($scope, $uibModalInstance, journal) {
    $scope.j = journal;
    $scope.labels = labels;
    $scope.pageNumber;
    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.split = function () {        
        $uibModalInstance.close($scope.pageNumber);
    };
}])