exeApp
    .controller('CustomizationCtrl', ['$scope', '$uibModalInstance', '$filter', '$http', 'fields', 'page', function ($scope, $uibModalInstance, $filter, $http, fields, page) {

        $scope.fields = fields;
        $scope.page = page;
        
        $scope.Save = function () {
            var selectedIds = [];
            $.each($scope.fields, function (key, value) {
                if (value.IsSelected)
                    selectedIds.push(value.Id);
            });

            var params = angular.extend({}, {
                fields: angular.toJson(selectedIds)
                });
            
            var reqData = {
                url: "/Handlers/DataHandler.ashx?type=PageConfig&page=" + $scope.page,
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $.param(params)
            };

            return $http(reqData)
                .success(function (data, status, headers, config) {
                    var returnedData = data;
                    if (returnedData.Messages) {
                        GlobalUtils.Notify(returnedData.Messages);
                    }
                    if (returnedData.IsError) {
                        $scope.performingAction = false;
                    }
                    else
                    {
                        $uibModalInstance.close('save');
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
        };

        $scope.Dismiss = function () {
            $uibModalInstance.close('cancel');
        }
    }]);
