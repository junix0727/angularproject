﻿(function (angular) {
   var exeApp = angular.module('exeApp'); // access already defined module
       exeApp.directive('searchbox', function () {
        var SearchBoxController = ['$scope', '$http', function ($scope, $http) {
 	        $scope.getSearchBtnDisplayStyle = $scope.showSearchButton ? 'block' : 'none';
 	        $scope.getEditBtnDisplayStyle = $scope.showEditButton ? 'inline-block' : 'none';
 	        $scope.editIcon = $scope.selectedItem && $scope.selectedItem.Value ? 'glyphicon glyphicon-pencil' : 'glyphicon glyphicon-plus';
            $scope.SelectedItem = { Code: "", Description: "", Value: "" };
 	        $scope.hasValue;
 	
            $scope.searchValues = function (qry) {
 	            return $http.get('/Handlers/SearchHandler.ashx', {
 	                params: {
 	                    query: qry,
 	                    type: $scope.type
 	                }
 	            }).then(function ($response) {
 	                var output = [];
 	               $response.data.forEach(function (item) {
 	                  output.push(item);
 	               });
 	               return output;
             });
 	       };
 	       $scope.onItemSelect = function ($item, $model, $label) {
 	           $scope.SelectedItem = $item;
 	           var inputValue = $('#' + $scope.getValueId + 'Value');
 	       };
 	
            $scope.someMethod = function () {
 	           $scope.callback($scope.param);
 	       }
 	   }];
 	
 	   return {
 	       scope: {
 	           hasValue: '=',
 	           showSearchButton: '=',
 	            showEditButton: '=',
 	            disabled: '=',
 	            placeholder: '@',
 	            cssclass: '@',
 	            type: '@'
 	        },
 	        controller: SearchBoxController,
 	        templateUrl: '/Assets/html/searchbox-template.html'
 	    };
 	});
 	// markup example
 	/*
 	    <div searchbox placeholder="Placeholder" cssclass="col-md-3" type="IBA.Library.Controls.ApproverSearchBox" show-search-button="true" show-edit-button="true"
 	        disabled="false" 
 	    >
 	*/
 	})(window.angular);