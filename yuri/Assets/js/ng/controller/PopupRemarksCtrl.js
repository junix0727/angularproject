exeApp.controller('PopupRemarksCtrl', ['$scope', '$uibModalInstance', 'types', function ($scope, $uibModalInstance, type) {
    $scope.local = LocalizationStrings;
    $scope.showTypes = true;
    $scope.data = { type: null, remarks: null };
    if (type == 1) {
        $scope.types = [
                { name: $scope.local.GlobalProtested, code: "dispute" },
                { name: $scope.local.GlobalDouble, code: "double" },
                { name: $scope.local.WorkList_Memo, code: "creditmemo" },                
                { name: $scope.local.GlobalPaymentReminder, code: "reminder" },
                { name: $scope.local.GlobalOthers, code: "other" }
        ];
        $scope.confirmbtn = $scope.local.GlobalOnHold;
    }
    else if (type == 2) {
        $scope.types = [
                { name: $scope.local.GlobalDouble, code: "double" },
                { name: $scope.local.GlobalOthers, code: "other" }
        ];
        $scope.confirmbtn = $scope.local.WorkEdit_Disapprove;
    }
    else if (type == 3) {
        $scope.confirmbtn = $scope.local.WorkEdit_Approve;
        $scope.showTypes = false;
        $scope.data.type = 'other';
        $scope.types = [];
    }

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.confirm = function () {
        if ($scope.data.remarks || !$scope.showTypes)
            $uibModalInstance.close($scope.data);
    };

    $scope.onChange = function (code) {
        if (code == 'other')
            $scope.data.remarks = null;
        else
        {
            angular.forEach($scope.types, function (item) {
                if (item.code == code) {
                    $scope.data.remarks = item.name;
                    return;
                }
            });
        }
    };

    $scope.onRemarksChanged = function (remarks) {
        $scope.data.remarks = remarks.trim();
    };
}])