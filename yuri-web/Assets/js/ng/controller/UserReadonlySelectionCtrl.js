exeApp.controller('UserReadonlySelectionCtrl', function ($scope, $uibModalInstance, $http, user, users, local) {
    $scope.user = user;
    $scope.users = [];
    $scope.user.SelectedUsers = [];
    $scope.local = local;

    for (var i = 0; i < users.length; i++) {
        if (users[i].Id != user.Id)
            $scope.users.push(users[i]);
    }
    if (user.ReadonlyUserIds)
    {
        var ids = user.ReadonlyUserIds.split(',');
        for (var i = 0; i < ids.length; i++) {
            $scope.user.SelectedUsers.push(parseInt(ids[i]));
        }
    }    

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    }

    $scope.save = function () {
        var parameters = {
            id: $scope.user.Id,
            selectedIds: angular.toJson($scope.user.SelectedUsers)
        };

        return $http.post('/Views/MasterData/UserList.aspx/SaveReadonly', angular.toJson(parameters))
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);
                if (result.Messages) {
                    GlobalUtils.Notify(result.Messages);
                }
                $uibModalInstance.close('save');
            });
    };
});
