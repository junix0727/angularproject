exeApp.controller('changeUsernameCtrl', ['$scope', '$uibModalInstance', 'data', '$http', function ($scope, $uibModalInstance, data, $http) {
    $scope.url = data;
    $scope.local = LocalizationStrings;    

    $scope.performAction = function () {
        $scope.performingAction = true;
        var data = {
            'username': $scope.username,
        };

        return $http.post('/logon.aspx/SaveUsername', angular.toJson(data))
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);
                if (result.IsError && result.Messages) {
                    $scope.error = result.Messages[0].Text;
                    $scope.performingAction = false;
                }
                else {
                    $scope.performingAction = false;
                    window.location = $scope.url;
                }                
            })
            .error(function (data, status, headers, config) {
                $scope.performingAction = false;
                var error = [{
                    Style: 'GlobalDanger',
                    Text: 'HTTP ' + status + ' Error. Please contact the administrator.'
                }];
                GlobalUtils.Notify(error);
            });
    }

    $scope.save = function () {
        $scope.performingAction = true;
        $scope.performAction();                   
    };

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    }
}]);