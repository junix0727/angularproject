exeApp.directive('ngHomepage', function () {
    return {
        link: function (scope, element, attrs) {
            console.log(homePage);
        }
    }
});