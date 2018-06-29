(function (angular) {

    var exeApp = angular.module('exeApp'); // access already defined module
    
    exeApp.directive('summaryPanel', function () {

        var html = '';
        html += '<div class="{{VisibleClass}}">';
        html += '   <div ng-repeat="item in sumaries" class="summary-panel" ng-style="{width: GetWidth()}" >';
        html += '     <div class="panel {{item.CssClass}}">';
        html += '         <div class="panel-heading">';
        html += '             <h3 class="panel-title">{{item.Title}}</h3>';
        html += '          </div>';
        html += '          <div class="panel-body">';
        html += '              <h2>{{item.Value}}</h2>';
        html += '          </div>';
        html += '      </div>';
        html += '   </div>';
        html += '</div>';

        var SummaryController = ['$scope', function ($scope) {
            $scope.VisibleClass = ($scope.sumaries && $scope.sumaries.length > 0) ? "well" : "";

            $scope.GetWidth = function () {
                var count = ($scope.sumaries) ? $scope.sumaries.length : 0;
                var panelWidth = count > 0 ? 100 / count : 0;

                return panelWidth + '%';
            };
        }];

        return {
            scope: {
                sumaries: '='
            },
            controller: SummaryController,
            template: html
        };
    });

    // markup
    /*
        <div summary-panel class="row" sumaries="sumaryData">
        </div>
    */

})(window.angular);