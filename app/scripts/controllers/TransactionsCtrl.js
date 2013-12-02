/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Transactions controller
 *
 * @authors
 * Solh Zendeh
 */
angular.module('bullsfirst')
    .controller('TransactionsCtrl', function ($scope, TransactionsSvc, $location, $modal) {
        'use strict';

        $scope.$location = $location;

        $scope.tabs = [
            {
                label: 'ACCOUNTS',
                path: 'accounts'
            },
            {
                label: 'POSITIONS',
                path: 'positions'
            },
            {
                label: 'ORDERS',
                path: 'orders'
            },
            {
                label: 'TRANSACTION HISTORY',
                path: 'transactions'
            }
        ];

        $scope.selectTab = function (tab) {
            $scope.selectedTab = tab;
        };

        $scope.openModal = function () {
            $modal.open({
                templateUrl: 'views/accounts/trade-form.html',
                backdrop: false,
                scope: $scope
            });
        };

        $scope.signOut = function () {
            delete $scope.loggedInUser;
        };

        // feels like everything above here should be in the "parent" controller... or something.

        // EVENT HANDLERS
        $scope.$on('FilterCtrl:resetFilters', function() {
            $scope.resetFilters();
        });
        $scope.$on('FilterCtrl:applyFilters', function(event) {
            var fromDate = event.targetScope.filters.fromDate;
            var toDate = event.targetScope.filters.toDate;
            var accountChoice = event.targetScope.filters.accountChoice;

            var filters = {
                fromDate: fromDate.getFullYear() +'-'+ (fromDate.getMonth()+1) +'-'+ fromDate.getDate(),
                toDate: toDate.getFullYear() +'-'+ (toDate.getMonth()+1) +'-'+ toDate.getDate()
            };

            if (accountChoice) {
                filters.accountId = accountChoice.id;
            }

            $scope.applyFilters(filters);
        });

        // HANDLER FUNCTIONS
        $scope.resetFilters = function() {
            $scope.transactions = [];
        };
        $scope.applyFilters = function(filters) {
            $scope.transactions = TransactionsSvc.query(filters);
        };

        // THE REST
        $scope.selectedTab = $scope.tabs[3];
        $scope.resetFilters();
    });