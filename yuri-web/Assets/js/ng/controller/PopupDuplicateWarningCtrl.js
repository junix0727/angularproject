exeApp.controller('PopupDuplicateWarningCtrl', function ($scope, $uibModalInstance, NgTableParams, $http, $filter, duplicates, balance) {
    $scope.currentDuplicates = duplicates.current;
    $scope.openDuplicates = duplicates.open;
    $scope.processedDuplicates = duplicates.processed;
    $scope.balance = balance;
    $scope.dups = [];
    var index = 0;

    angular.forEach($scope.processedDuplicates, function (row) {
        $scope.dups.push(row);
        $scope.dups[index].type = 1;
        $scope.dups[index].SeqNbr = $scope.dups[index].EntryNumber;

        index++;
    });

    angular.forEach($scope.openDuplicates, function (row) {
        $scope.dups.push(row);
        $scope.dups[index].type = 2;
        $scope.dups[index].SeqNbr = $scope.dups[index].EntryNumber;

        index++;
    });

    angular.forEach($scope.currentDuplicates, function (row) {
        $scope.dups.push(row);
        $scope.dups[index].type = 3;

        index++;
    });

    $scope.Yes = function () {
        $uibModalInstance.close('yes');
    };

    $scope.No = function () {
        $uibModalInstance.close('no');
    };

    $scope.sum = function (list) {
        var sum = angular.copy($scope.balance);
        var rows = angular.copy(list);
        sum = sum < 0 ? sum * -1 : sum;

        angular.forEach(rows, function (value) {
            value.Amount = value.Amount < 0 ? value.Amount * -1: value.Amount;

            sum -= value.Amount;
        });

        return sum;
    };
});