exeApp.controller('PopupAccountEmail', function ($scope, $uibModalInstance, $http, accountId, email) {
    $scope.accountId = accountId;
    $scope.email = email;
    $scope.local = LocalizationStrings;

    $scope.cancel = function () {
        $uibModalInstance.close(null);
    };
    
    $scope.save = function () {
        var parameters = {
            'accountId': $scope.accountId,
            'email': $scope.email
        }

        return $http.post('/Views/Sales/SalesInvoiceEdit.aspx/SetAccountContacts', angular.toJson(parameters))
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);
                $scope.templates = result.Data;
                $uibModalInstance.close($scope.email);
            })
            .error(function (data, status, headers, config) {
                $uibModalInstance.close();
            });
        
    };
})