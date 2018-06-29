exeApp.controller('SearchGridTemplateCtrl', ['$scope', '$window', '$uibModalInstance', '$filter', 'SearchService', 'headersToDisplay', 'fieldsToDisplay', 'type', 'listtype', 'pageTitle', 'showPanel', 'addurl', 'editurl', 'keyid',
function ($scope, $window, $uibModalInstance, $filter, SearchService, headersToDisplay, fieldsToDisplay, type, listtype, pageTitle, showPanel, addurl, editurl, keyid) {
    $scope.listtitle = "";
    $scope.curretSelection;
    $scope.resultList;
    $scope.selectedItemList;
    $scope.type = type;
    $scope.pageTitle = pageTitle;
    $scope.showPanel = (showPanel != undefined ? showPanel : false);
    $scope.labels = labels;
    $scope.keyid = keyid;
    $scope.searchKeyword = '';

    $scope.$watch('searchKeyword', function () {
        var listType = (listtype != undefined && listtype != "" ? listtype : $scope.type);
        switch (listType) {
            case 'IBA.Library.Controls.GLAccountSearchBox':
                searchService.getGLAccounts($scope.searchKeyword, false, false, 0, true).then(function (data) {
                    $scope.resultList = data;

                    $scope.keys = fieldsToDisplay.split(',');
                    $scope.header = headersToDisplay.split(',');
                    for (var i = 0; i < $scope.header.length ; i++) {
                        $scope.header[i] = $scope.header[i].replace(/([A-Z])/g, ' $1');
                    }
                });
                break;
            case 'MFP.Library.Controls.SectorSearchBox':
                searchService.getSectors($scope.searchKeyword, true).then(function (data) {
                    $scope.resultList = data;

                    $scope.keys = fieldsToDisplay.split(',');
                    $scope.header = headersToDisplay.split(',');
                    for (var i = 0; i < $scope.header.length; i++) {
                        $scope.header[i] = $scope.header[i].replace(/([A-Z])/g, ' $1');
                    }
                });
                break;
        }
    });

    $scope.performingAction = false;
    var searchService = new SearchService;

    $scope.Save = function () {
        if ($scope.type == 'MFP.Library.Controls.SectorSearchBox') {
            if ($scope.selectedItemList != null) {
                $uibModalInstance.close($scope.selectedItemList);
            }
            else {
                $uibModalInstance.close($scope.curretSelection);
            }
        }
        else {
            $uibModalInstance.close($scope.curretSelection);
        }
    };

    $scope.addnew = function () {
        $window.open(addurl, '_blank');
    };

    $scope.showEdit = ($filter('filter')($scope.resultList, { $selected: true }) > 0);

    $scope.edit = function () {
        var selectedItems = $filter('filter')($scope.resultList, { $selected: true });

        if (selectedItems.length > 0)
            $window.open(editurl.replace("{0}", selectedItems[0].Id), '_blank');
    };

    $scope.Dismiss = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.selectMe = function (item) {
        $uibModalInstance.close(item);
    };

    $scope.changeSelection = function (item) {
        if ($scope.type == 'MFP.Library.Controls.SectorSearchBox') {
            item.$selected = !item.$selected;
            var selectedItems = $filter('filter')($scope.resultList, { $selected: true });

            if (selectedItems.length > 1) {
                $scope.selectedItemList = selectedItems;
            }
            else {
                $scope.curretSelection = item;
            }
        }
        else {
            $scope.curretSelection = item;
            angular.forEach($scope.resultList, function (item, index) {
                item.$selected = false;
            })
            item.$selected = true;
        }
    };

}]);
