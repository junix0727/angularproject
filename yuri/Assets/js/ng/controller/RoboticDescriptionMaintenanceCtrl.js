exeApp.controller('RoboticDescriptionMaintenanceCtrl', ['$scope', '$window', '$uibModalInstance', '$filter', 'SearchService', 'headersToDisplay', 'fieldsToDisplay', 'type', 'listtype', 'pageTitle', 'showPanel', 'addurl', 'editurl', 'keyid', 'roboticLines', 'lineIndex',
function ($scope, $window, $uibModalInstance, $filter, SearchService, headersToDisplay, fieldsToDisplay, type, listtype, pageTitle, showPanel, addurl, editurl, keyid, roboticLines, lineIndex) {
    $scope.listtitle = "";
    $scope.curretSelection;
    $scope.type = type;
    $scope.pageTitle = pageTitle;
    $scope.showPanel = (showPanel != undefined ? showPanel : false);
    $scope.labels = labels;
    $scope.keyid = keyid;
    $scope.isArticle = headersToDisplay.indexOf("Article") > -1;
    $scope.searchKeyword = '';
    $scope.editIndex = -1;
    $scope.roboticLines = roboticLines;
    $scope.returnData = {};
    $scope.action = undefined;
    var itemDesc = {
        Id: -1,
        fk_roboticmaintenance_id: keyid,
        Text: '',
        IsArticle: $scope.isArticle
    }

    $scope.$watch('roboticLines', function () {
        var listType = (listtype != undefined && listtype != "" ? listtype : $scope.type);
        switch (listType) {
            case 'MFP.Library.Controls.RoboticMaintenanceDescriptionSearchBox':
                $scope.keys = fieldsToDisplay.split(',');
                $scope.header = headersToDisplay.split(',');
                for (var i = 0; i < $scope.header.length ; i++) {
                    $scope.header[i] = $scope.header[i].replace(/([A-Z])/g, ' $1');
                }
                $scope.currentList = $scope.isArticle ? $scope.roboticLines[lineIndex].ArticleCodeList : $scope.roboticLines[lineIndex].DescriptionList;
                break;

        }
    });

    var searchService = new SearchService;

    $scope.Save = function () {
        //$scope.returnData.resultList = $scope.resultList;
        //$scope.returnData.removedDescription = $scope.removedDescription;
        $uibModalInstance.close($scope.roboticLines);
    };

    $scope.showEdit = ($filter('filter')($scope.roboticLines, { $selected: true }) > 0);

    $scope.edit = function (item, index) {
        $scope.action = 'edit';
        var selectedItems = item.IsArticle ? $scope.roboticLines[lineIndex].ArticleCodeList[index] : $scope.roboticLines[lineIndex].DescriptionList[index];
        $scope.editIndex = index;
    };

    $scope.Dismiss = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.changeSelection = function (item) {
        $scope.curretSelection = item;
        angular.forEach($scope.roboticLines[lineIndex], function (item, index) {
            item.$selected = false;
        })
        item.$selected = true;
    };

    $scope.saveRow = function (item, index) {
        $scope.editIndex = null;

        var nItem = item == undefined ? $scope.newItem : item;

        if (nItem != null || nItem.length != 0) {
            var desc = angular.copy(nItem);
            if (desc.IsArticle)
                $scope.action === 'edit' ? $scope.roboticLines[lineIndex].ArticleCodeList[index].Text = item.Text : $scope.roboticLines[lineIndex].ArticleCodeList.push(desc);
            else
                $scope.action === 'edit' ? $scope.roboticLines[lineIndex].DescriptionList[index].Text = item.Text : $scope.roboticLines[lineIndex].DescriptionList.push(desc);

            $scope.currentList = desc.IsArticle ? $scope.roboticLines[lineIndex].ArticleCodeList : $scope.roboticLines[lineIndex].DescriptionList;
            $scope.newItem = null;
        }
        $scope.action = undefined;
    }

    $scope.addNewRow = function () {
        $scope.newItem = angular.copy(itemDesc);
        $scope.action = 'new';
    }

    $scope.removeRow = function (item) {
        $scope.editIndex = null;
        var removeItem = (item.IsArticle ? $scope.roboticLines[lineIndex].ArticleCodeList : $scope.roboticLines[lineIndex].DescriptionList);
        var index = removeItem.indexOf(item);        
        var removedList = removeItem.splice(index, 1);
        $scope.currentList = removeItem;
        if (item.Id === undefined || item.Id === -1)
            return;
        $scope.roboticLines[lineIndex].RemoveADList = $.map(removedList, function (item) { return item });

        //for (var i in removedList) {
        //    $scope.removedDescription.push(removedList[i]);
        //}
    }

    //$scope.addNewRow = function () {
    //    // Add empty row and get the new size of Lines array
    //    var newDataLength = $scope.isArticle ? $scope.roboticLines[lineIndex].ArticleCodeList.push(angular.copy($scope.itemDesc)) : $scope.roboticLines[lineIndex].DescriptionList.push(angular.copy($scope.itemDesc));
    //    $scope.editIndex = null;
    //    // Edit the last row (since push adds to end of array - this well be our new row;
    //    $scope.editRow(newDataLength - 1, true);
    //};

    //$scope.editRow = function (index, isnew) {
    //    if ($scope.editIndex != null)
    //        return;
    //    $scope.newRowMode = isnew ? isnew : false;
    //    $scope.roboticLines[lineIndex].$selected = false;
    //    $scope.lineIndex = null;
    //    $scope.editIndex = index;
    //    $scope.lines = [];
    //    $scope.currentEditRow = angular.copy($scope.isArticle ? $scope.roboticLines[lineIndex].ArticleCodeList[index] : $scope.roboticLines[lineIndex].DescriptionList[index]);
    //};

    //$scope.getIndex = function (item) {
    //    return $scope.roboticLines.indexOf(item);
    //}

    //$scope.cancelRowEdit = function (index) {
    //    $scope.action = 'cancelRow';
    //    if ($scope.newRowMode) {
    //        $scope.removeRow(index);
    //    } else {
    //        angular.copy($scope.currentEditRow, $scope.roboticLines[index]);
    //    }
    //    $scope.currentEditRow = null;
    //    $scope.newRowMode = false;
    //    $scope.editIndex = null;
    //    $scope.roboticEditTable.reload();
    //};

    //$scope.removeRow = function (index) {
    //    if ($scope.editIndex != null)
    //        return;
    //    $scope.editIndex = null;

    //    var removedLines = $scope.isArticle ? $scope.roboticLines[lineIndex].ArticleCodeList.splice(index, 1) : $scope.roboticLines[lineIndex].DescriptionList.splice(index, 1);

    //    for (var i in removedLines) {
    //        $scope.roboticLines[lineIndex].RemovedRMAD.push(removedLines[i]);
    //    }
    //}

    //$scope.saveRow = function () {
    //    $scope.editIndex = null;
    //    $scope.currentEditRow = null;
    //};

}]);
