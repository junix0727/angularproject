exeApp.directive('ngUiSelectPopupExt', ['$uibModal', function ($uibModal) {
    return {
        link: function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                //f7
                if (event.currentTarget.accessKey === 'f7' && event.which === 118) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/Assets/html/RoboticDescriptionMaintenanceModal.html',
                        controller: 'RoboticDescriptionMaintenanceCtrl',
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            headersToDisplay: function () { return attrs.headersToDisplay; },
                            fieldsToDisplay: function () { return attrs.fieldsToDisplay; },
                            pageTitle: function () { return attrs.pageTitle },
                            type: function () { return attrs.type; },
                            listtype: function () { return attrs.listtype; },
                            showPanel: function () { return attrs.showpanel; },
                            addurl: function () { return attrs.addurl; },
                            editurl: function () { return attrs.editurl; },
                            keyid: function () { return attrs.keyid; },
                            roboticLines: function () { return scope.roboticLines; },
                            lineIndex: function () { return scope.editIndex; }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        scope.roboticDescription_CallBack(result);
                    });
                    event.preventDefault();
                }
                //f2
                if (event.currentTarget.accessKey === 'f2' && event.which === 113) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/Assets/html/SearchGridTemplate.html',
                        controller: 'SearchGridTemplateCtrl',
                        backdrop: 'static',
                        keyboard: false,
                        size: 'lg',
                        resolve: {
                            headersToDisplay: function () { return attrs.headersToDisplay; },
                            fieldsToDisplay: function () { return attrs.fieldsToDisplay; },
                            pageTitle: function () { return attrs.pageTitle },
                            type: function () { return attrs.type; },
                            listtype: function () { return attrs.listtype; },
                            showPanel: function () { return attrs.showpanel; },
                            addurl: function () { return attrs.addurl; },
                            editurl: function () { return attrs.editurl; },
                            keyid: function () { return attrs.keyid; }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        scope.searchGridResult_CallBack(result);
                    });
                    event.preventDefault();
                }
            });
        }
    }
}]);
