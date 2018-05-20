var app = angular.module('test', []);

app.controller('mainCtrl', function ($scope, $http, $interval) {
    //Function used to render the table. It helps convert the ng-each loop into a for loop with defined limits and step
        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };
    
        //Function to get the data from MongoDB
        $scope.getData = function () {
            //Make a http get request with a defined url (which is defined as an app.get in the server)
            $http({ url: "/getData", method: "GET", params: {} })
            .success(function (data, status, header, config) {
                //on success of said call, initialize scope variables
                $scope.titles = {};
                $scope.values = {};
                $scope.maxrownumber = 1;
    
                //Call the functions to prepare the table rendering
    
                parseJSONToTable($scope, data);
                adjustRowSpans($scope, data);
                adjustColSpans($scope, data);
    
                return;
            })
            .error(function (data, status, headers, config) {
                //on error, one could write an error in the scope for further use
                $scope.error = "error";
                return;
            });
        };
        //Get data from the database by polling every second
        $interval(function () {
            $scope.getData();
        }, 1000); 
});

app.directive('renderDynamicTable', function () {
    return {
        restrict: 'AE',
        replace: 'true',
        template: '<table border=1><tr ng-repeat="n in range(1, maxrownumber)"><th ng-if="n == obj.rownumber" ng-repeat="obj in titles" colspan="{{obj.colspan}}" rowspan="{{obj.rowspan}}"> {{ obj.title }} </th></tr> <tr><td ng-repeat="key in values">{{ key }}</td></tr></table>'
    };
});

function parseJSONToTable($scope, data, numberOfRepeats) {
    numberOfRepeats = typeof numberOfRepeats !== 'undefined' ? numberOfRepeats : 1;
    for (var key in data) {
        var numberOfChildren = Object.size(data[key]);
        if (numberOfChildren >= 1) {
            $scope.titles[key] = { title: key, rownumber: numberOfRepeats };
            if ($scope.maxrownumber <= numberOfRepeats)
                $scope.maxrownumber++;
            numberOfRepeats++;
            parseJSONToTable($scope, data[key], numberOfRepeats);
            numberOfRepeats--;
        }
        else {
            $scope.titles[key] = { title: key, colspan: 1, rownumber: numberOfRepeats };
            $scope.values[key] = data[key];
        }
    }
    return;
}

function adjustRowSpans($scope, data, numberOfRepeats)
{
    numberOfRepeats = typeof numberOfRepeats !== 'undefined' ? numberOfRepeats : 0;
    for (var key in data) {
        var numberOfChildren = Object.size(data[key]);
        if (numberOfChildren >= 1) {
            numberOfRepeats++;
            $scope.titles[key].rowspan = 1;
            adjustRowSpans($scope, data[key], numberOfRepeats);
        }
        else {
            $scope.titles[key].rowspan = $scope.maxrownumber - numberOfRepeats;
            continue;
        }
        numberOfRepeats--;
    }
}

function adjustColSpans($scope, data) {
    for (var key in data) {
        if (Object.size(data[key]) >= 1) {
            adjustColSpans($scope, data[key]);
            var totalColSpan = 0;
            for (var iterator in data[key]) {
                totalColSpan += $scope.titles[iterator].colspan;
            }
            $scope.titles[key].colspan = totalColSpan
        }
        else {
            $scope.titles[key].colspan = 1;
        }
    }
}

Object.size = function (obj) {
    var size = 0, key;
    //Check if the object is a string, because otherwise it will return the number of letters of that string. Return 0 instead
    if (typeof obj == 'string' || obj instanceof String) return 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};