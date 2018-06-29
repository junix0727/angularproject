angular.module('exeApp')
    .factory('InvoiceRecurrence', function ($filter) {
        var InvoiceRecurrence = function (invoices) {
            this.invoices = invoices;
        };

        Date.prototype.addDays = function (days) {
            var date = new Date(this.valueOf());

            date.setDate(date.getDate() + days);

            return date;
        }

        Date.prototype.getWeekOfMonth = function (exact) {
            var month = this.getMonth()
                , year = this.getFullYear()
                , firstWeekday = new Date(year, month, 1).getDay()
                , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
                , offsetDate = this.getDate() + firstWeekday - 1
                , index = 1 // start index at 0 or 1, your choice
                , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
                , week = index + Math.floor(offsetDate / 7)
            ;

            if (exact || week < 2 + index) {
                return week;
            }

            return week === weeksInMonth ? index + 5 : week;
        };

        var DateDiff = {
            inDays: function (d1, d2) {
                d1 = new Date($filter('dateParser')(d1));
                d2 = new Date($filter('dateParser')(d2));

                var t2 = d2.getTime();
                var t1 = d1.getTime();

                return parseInt((t2 - t1) / (24 * 3600 * 1000));
            },
            inWeeks: function (d1, d2) {
                d1 = new Date($filter('dateParser')(d1));
                d2 = new Date($filter('dateParser')(d2));

                var t2 = d2.getTime();
                var t1 = d1.getTime();

                return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
            },
            inMonths: function (d1, d2) {
                d1 = new Date($filter('dateParser')(d1));
                d2 = new Date($filter('dateParser')(d2));

                var d1Y = d1.getFullYear();
                var d2Y = d2.getFullYear();
                var d1M = d1.getMonth();
                var d2M = d2.getMonth();

                return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
            },
            inYears: function (d1, d2) {
                d1 = new Date($filter('dateParser')(d1));
                d2 = new Date($filter('dateParser')(d2));

                return d2.getFullYear() - d1.getFullYear();
            }
        };

        var DayOfWeek = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6
        };

        InvoiceRecurrence.prototype = {
            isRecurrent: function (beginDate, endDate, lastInvoiceDate, orderDate) {
                if (!endDate) {
                    return true;
                }

                if (lastInvoiceDate == orderDate || endDate == lastInvoiceDate) {
                    return false;
                }

                return true;
            },
            getStatus: function (item) {
                var beginDate = $filter('dateParser')(item.BeginDate);
                var endDate = $filter('dateParser')(item.EndDate);
                var lastInvoiceDate = $filter('dateParser')(item.LastInvoiceDate);

                var currentDate = $filter('dateParser')(new Date);
                var difference = 0;
                var otherDifference = 0;
                var status = 'N';

                if (!item.EndDate) {
                    endDate = new Date;

                    endDate.setMonth(endDate.getMonth() + 1);

                    endDate = $filter('dateParser')(endDate);
                }

                if (endDate == lastInvoiceDate) {
                    return status;
                }


                currentDate = new Date(currentDate);
                endDate = new Date(endDate);
                lastInvoiceDate = new Date(lastInvoiceDate);

                switch (item.RecurrentPeriod) {
                    case 0: // Day
                        var invoiceDate = lastInvoiceDate.addDays(-1);

                        while (invoiceDate.getTime() <= endDate.getTime()) {
                            if (item.IsEveryWorkingday) {
                                invoiceDate = invoiceDate.addDays(1);

                                if (invoiceDate.getDay() != DayOfWeek.sunday && invoiceDate.getDay() != DayOfWeek.saturday) {
                                    if (currentDate.getTime() == invoiceDate.getTime()) {
                                        status = 'G';
                                    } else if (currentDate.getTime() > invoiceDate.getTime()) {
                                        status = 'R';
                                    }
                                }
                            } else {
                                invoiceDate = invoiceDate.addDays(item.RecurEvery);

                                if (currentDate.getTime() == invoiceDate.getTime()) {
                                    status = 'G';
                                } else if (currentDate.getTime() > invoiceDate.getTime()) {
                                    status = 'R';
                                }
                            }
                        }

                        if (lastInvoiceDate.getTime() == endDate.getTime() || currentDate.getTime() == lastInvoiceDate.getTime()) {
                            status = 'N';
                        }

                        break;
                    case 1: // Week
                        var invoiceDate = new Date(beginDate);
                        var recurDaysOfWeek = item.RecurDaysofWeek.split(',');
                        var tempDate = new Date;

                        var counter = 0;
                        var onDue = 0;
                        var onDate = 0;

                        while (invoiceDate.getTime() < endDate.getTime()) {
                            if (counter == 0) {
                                var day = invoiceDate.getDay() == DayOfWeek.sunday ? 7 : invoiceDate.getDay();

                                invoiceDate = invoiceDate.addDays(-day + (7 * item.RecurEvery));
                            }

                            onDue = 0;
                            onDate = 0;

                            for (var i = 0; i < recurDaysOfWeek.length; i++) {
                                var recurDay = (parseInt(recurDaysOfWeek[i]) == 7) ? 0 : parseInt(recurDaysOfWeek[i]);

                                tempDate = invoiceDate.addDays(recurDay);

                                if (tempDate.getTime() > lastInvoiceDate.getTime()) {
                                    if (tempDate.getTime() > endDate.getTime()) {
                                        item.IsRecurrent = false;

                                        break;
                                    }

                                    if ($filter('dateParser')(currentDate) == $filter('dateParser')(tempDate)) {
                                        onDate++;
                                    }

                                    if (currentDate.getTime() > tempDate.getTime()) {
                                        onDue++;
                                    }
                                }
                            }

                            if (onDue > 0) {
                                status = 'R';

                                break;
                            } else if (onDate > 0) {
                                status = 'G';

                                break;
                            }

                            var day = tempDate.getDay() == DayOfWeek.sunday ? 7 : tempDate.getDay();

                            invoiceDate = tempDate.addDays(-day + (7 * item.RecurEvery));

                            counter++;
                        }

                        if (DateDiff.inDays(lastInvoiceDate, endDate) >= 0 && DateDiff.inDays(lastInvoiceDate, endDate) < 7) {
                            item.IsRecurrent = false;
                        }

                        break;
                    case 2: // Month
                    case 3: // Year
                        var month = item.RecurrentPeriod == 2 ? lastInvoiceDate.getMonth() + item.RecurEvery : item.MonthofYear;
                        var year = item.RecurrentPeriod == 2 ? lastInvoiceDate.getFullYear() : lastInvoiceDate.getFullYear() + item.RecurEvery;

                        //if month is larger then 12 then increase year and set month - 12
                        if (month > 12) {
                            year++;
                            month = month - 12;
                        }

                        var invoiceDate = new Date(year, month, Math.min(Math.max(1, item.DayofMonth), new Date(year, month, 0).getDate()));

                        if (!item.IsMonthDay) {
                            var weekCount = 0;

                            for (var j = 1; j <= new Date(year, month, 0).getDate() ; j++) {
                                var date = new Date(year, month, j);
                                var day = date.getDay() == DayOfWeek.sunday ? 7 : date.getDay();

                                if (item.DayofWeek == day) {
                                    weekCount++;

                                    invoiceDate = date;
                                }

                                if (weekCount == item.WeekofMonth) {
                                    break;
                                }
                            }
                        }

                        if (currentDate.getTime() == invoiceDate.getTime()) {
                            status = 'G';
                        } else if (currentDate.getTime() > invoiceDate.getTime()) {
                            status = 'R';
                        }

                        if (invoiceDate.getTime() > endDate.getTime()) {
                            item.IsRecurrent = false;
                            status = 'N';
                        }

                        break;
                }

                return status;
            }
        };

        return InvoiceRecurrence;
    });
