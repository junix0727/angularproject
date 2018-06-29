exeApp.controller('TranslationCtrl', ['$scope', '$uibModalInstance', 'languages', function ($scope, $uibModalInstance, languages) {

    $scope.languages = languages;
    $scope.template = angular.copy($scope.languages);

    $scope.Save = function () {
        $uibModalInstance.close($scope.languages);
    };

    $scope.Dismiss = function () {
        $uibModalInstance.close($scope.template);
    }
}]);
