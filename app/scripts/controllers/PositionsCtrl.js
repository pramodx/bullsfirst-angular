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
 * Positions controller
 *
 * @authors
 * Vikas Goyal
 */


angular.module('bullsfirst')
    .controller('PositionsCtrl', function ($scope, BrokerageAccountsSvc, AccountsSvc,
                                           InstrumentsSvc, $location, $modal) {
        'use strict';

        $scope.positions = function () {

        };

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

        $scope.selectedTab = $scope.tabs[0];

        $scope.selectTab = function (tab) {
            $scope.selectedTab = tab;
        };

        //TODO: Do this in positions controller
        $scope.brokerageAccounts = BrokerageAccountsSvc.query(function (data) {
            var totalMarketValue = 0,
                totalCashValue = 0,
                chartData = [],
                i, j, k, len, posLen, childrenLen;

            for (i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                totalMarketValue += item.marketValue.amount;
                totalCashValue += item.cashPosition.amount;
                
                var positions = item.positions;
                var newPositions = [];
                for (j = 0, posLen = positions.length; j < posLen; j++) {
                    var position = positions[j];
                    if (position.children && Object.prototype.toString.call(position.children) === '[object Array]') {
                        position.isParent = true;
                        position.id = position.accountId + '_' + j;
                        newPositions.push(position);

                        for (k = 0, childrenLen = position.children.length; k < childrenLen; k++) {
                            var childPosition = position.children[k];
                            childPosition.parentId = position.id;
                            newPositions.push(childPosition);
                        }
                        delete position.children;

                    } else {
                        position.isExpanded = true;
                        newPositions.push(position);
                    }
                }
                item.positions = newPositions;
                chartData.push({
                    name: item.name,
                    y: item.marketValue.amount
                });
            }

            $scope.totals = {
                marketValue: totalMarketValue,
                cashValue: totalCashValue
            };
            $scope.chartData = chartData;

        });


        $scope.togglePositionExpand = function (selectedAccount, positionId) {
            angular.forEach(selectedAccount.positions, function (position) {
                if (!position.isParent && position.parentId === positionId) {
                    if (position.isExpanded) {
                        position.isExpanded = false;
                    } else {
                        position.isExpanded = true;
                    }
                }

            });

        };

        $scope.changeAccountName = function (accountId, newName) {
            AccountsSvc.changeName({accountId: accountId}, {newName: newName});
        };

        $scope.instruments = InstrumentsSvc.query();

        $scope.getMarketPrice = function (symbol) {
            return InstrumentsSvc.getMarketPrices({instrumentSymbol: symbol}).price.amount;
        };

        $scope.openModal = function () {
            $modal.open({
                templateUrl: 'views/accounts/trade-form.html',
                backdrop: false,
                scope: $scope
            });
        };


    });