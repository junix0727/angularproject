exeApp.directive('ngTranslationControl', ['$uibModal', function ($uibModal) {
    return {
        link: function (scope, element, attrs) {

            scope.updateValues = function (index) {
                scope.languages[index].Text = scope.userControl[index].Description;
            }
            scope.translate = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'translationControl',
                    controller: 'TranslationCtrl',
                    resolve: {
                        languages: function () { return scope.languages; }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        scope.languages = result;
                        document.getElementById(id).value = scope.languages[scope.translationIndex].Text == null ? $scope.languages[1].Text : scope.languages[scope.translationIndex].Text;
                    }
                });
            }

        }
    }
}]);