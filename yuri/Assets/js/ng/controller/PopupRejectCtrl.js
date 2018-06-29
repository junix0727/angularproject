exeApp.controller('PopupRejectCtrl', ['$scope', '$uibModalInstance', 'types', 'rejectnote', function ($scope, $uibModalInstance, types, rejectnote) {
    $scope.types = types;
    $scope.RejectNotes = rejectnote;
    $scope.data = { type: null, Remarks: null };

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.save = function () {
        if (!$scope.data.Remarks)
            $scope.data.Remarks = "Duplicate";

        $uibModalInstance.close($scope.data);
    };

    $scope.onChange = function (id) {
        if (id == 1)
            $scope.data.Remarks = null;
    };

    $scope.onRemarksChanged = function (remarks) {
        $scope.data.Remarks = remarks.trim();
    };
}])