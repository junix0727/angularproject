mfpApp.controller('PopupOrganizationListCtrl', function ($scope, $modalInstance, $http, $filter, SearchService, ngTableParams, organizations, labels) {
    $scope.organizations = organizations;
    $scope.labels = labels;

    $scope.cancel = function () {
        $scope.action = 'cancel';
        $scope.performingAction = true;

        $modalInstance.close(null);
    };

    $scope.changeSelection = function (item) {
        angular.forEach($scope.organizations, function (organization) {
            organization.$selected = false;
        });

        item.$selected = !item.$selected;
    };

    $scope.save = function () {
        $scope.action = 'save';
        $scope.performingAction = true;

        var selectedItems = $filter('filter')($scope.organizations, { $selected: true });

        var parameters = {
            action: 'changeOrganization',
            id: selectedItems[0].Id
        };

        return $.ajax({
            type: 'POST',
            global: false,
            url: '/Handlers/MenuHandler.ashx',
            data: parameters,
            dataType: 'html',
            cache: false,
            success: function (result) {
                window.location.reload();
            },
            error: function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            }
        });
    };

    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: { OrgName: 'asc' }
    }, {
        total: $scope.organizations.length,
        getData: function ($defer, parameters) {
            var data = $scope.organizations;

            if (parameters.sorting()) {
                data = $filter('orderBy')(data, parameters.orderBy());
            }

            if (parameters.filter()) {
                data = $filter('filter')(data, parameters.filter());
            }

            parameters.total(data.length);

            var begin = (parameters.page() - 1) * parameters.count();
            var end = parameters.page() * parameters.count();

            $defer.resolve(data.slice(begin, end));
        }
    });
});