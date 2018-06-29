exeApp.controller('PopupQualityMatrixCtrl', ['$scope', '$uibModalInstance', 'qualityMatrix', function ($scope, $uibModalInstance, qualityMatrix) {
    $scope.qualityMatrix = qualityMatrix;

    $scope.isIcon = function (item) {
        var isBoolean = typeof (item) === 'boolean';
        var result = isBoolean;

        if (!isBoolean) {
            result = (item == 'good' || item == 'medium' || item == 'bad');
        }

        return result;
    };

    $scope.parseItem = function (item) {
        switch (item) {
            case true:
                return '<i class="fa fa-lg fa-check"></i>';
            case false:
                return '';
            case 'good':
                return '<i class="fa fa-lg fa-check text-success"></i>';
            case 'medium':
                return '<i class="fa fa-lg fa-exclamation text-orange"></i>';
            case 'bad':
                return '<i class="fa fa-lg fa-times text-danger"></i>';
            default:
                return item;
        }
    };

    $scope.close = function () {
        $uibModalInstance.close('close');
    }
}]);
