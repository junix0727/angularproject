exeApp.directive('ngButtonConfig', function () {
    return {
        link: function (scope, element, attrs) {
            var id = attrs.id.split('_');

            if (scope.buttonConfig[id[id.length - 1]] == 0) {
                element.hide();
            } else if (scope.buttonConfig[id[id.length - 1]] == 1) {
                attrs.$set('disabled', 'disabled');
            }
        }
    }
});