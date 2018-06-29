exeApp.controller('PopupTemplate', ['$scope', '$uibModalInstance', '$http', '$filter', 'id', 'name', 'content', function ($scope, $uibModalInstance, $http, $filter, id, name, content) {
    $scope.templateId = id;
    $scope.templateName = name;
    $scope.templateContent = content;

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    };
 
}]);