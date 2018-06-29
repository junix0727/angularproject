exeApp.controller('PopupJournalCtrl', ['$scope', '$uibModalInstance', 'journalList', function ($scope, $uibModalInstance, journalList) {
    $scope.journalList = journalList;
    $scope.data = { fk_journal_id: null };

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };

    $scope.onJournalChanged = function (item) {
        $scope.data.fk_journal_id = item.Id;
    };

    $scope.save = function () {
        $uibModalInstance.close($scope.data);
    };
}])