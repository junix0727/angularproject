exeApp.controller('PopupScenarioListCtrl', function ($scope, $uibModalInstance, $http, $filter, SearchService, typeFilter, isInvoice, table, TableParameters, displayAll) {
    $scope.typeFilter = typeFilter;
    $scope.isInvoice = isInvoice;
    $scope.type = [];

    var searchService = new SearchService();
    var tableParameters = new TableParameters(GlobalUtils.GetUrlParamsAsJson());

    searchService.getScenarios('').then(function (data) {   
        angular.forEach(data, function (filter) {
            if (filter.ScenarioType == typeFilter) {
                $scope.type.push(filter);
            }
        });

        $scope.scenarios = $scope.type;
    });

    $scope.onSelectedScenario = function (selectedData) {
        $scope.selectedScenario = selectedData;
    }

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.Save = function () {
        var page = $scope.typeFilter == 0 ? 'InvoicePurchase.aspx' : 'InvoiceSales.aspx';

        window.location = page + '?scenarioId=' + $scope.selectedScenario.Id + '&desc=' + $scope.selectedScenario.Description + '&isInvoice=' + isInvoice
            + tableParameters.setParameters(table).toUrl(true) + '&displayAll=' + displayAll;
    };
});
