exeApp.controller('PopupAccountTemplateControl', function ($scope, $uibModalInstance, $http, $filter, NgTableParams, accountId, type, templateId, enableApply) {
    $scope.type = type;
    $scope.accountId = accountId;
    $scope.templates = [];
    $scope.templateLines = [];
    $scope.templateId = templateId;
    $scope.enableApply = enableApply;

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.cbTemplates = function () {
        var parameters = {
            'accountId': $scope.accountId
        }

        return $http.post('/Views/Sales/SalesInvoiceEdit.aspx/GetAccountProposals', angular.toJson(parameters))
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);
                $scope.templates = result.Data;
            });
    }

    $scope.cbTemplates();
    $scope.tableTemplatelines = function () {
        var parameters = {
            'accountId': $scope.accountId
        }

        return $http.post('/Views/Sales/SalesInvoiceEdit.aspx/GetAccountProposalLines', angular.toJson(parameters))
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);
                $scope.templateLines = result.Data;
            });
    }

    $scope.tableTemplatelines();

    $scope.Apply = function () {
        $scope.editEnabled = false;
        $uibModalInstance.close($scope.templateId);
    };

    $scope.Ok = function () {
        $scope.editEnabled = false;
        $uibModalInstance.close(undefined);
    };

    $scope.Add = function () {
        window.location = "/Views/MasterData/AccountProposalEdit.aspx?type=supplier&account_id=" + $scope.accountId + "&From=" + window.location.href;
    }
    $scope.Edit = function () {
        window.location = "/Views/MasterData/AccountProposalEdit.aspx?id=" + $scope.templateId + "&type=supplier&account_id=" + $scope.accountId + "&From=" + window.location.href;
    }

    $scope.onTemplateChanged = function (item) {
        $scope.templateId = item.Id;
        $scope.editEnabled = true;
    };

});