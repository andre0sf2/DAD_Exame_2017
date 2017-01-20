"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var top10_service_1 = require('../services/top10.service');
var Top10Component = (function () {
    function Top10Component(top10Service) {
        this.top10Service = top10Service;
        this.playersStars = [];
        this.playersPoints = [];
    }
    Top10Component.prototype.ngOnInit = function () {
        this.getTopPlayersByStars();
        this.getTopPlayersByPoints();
    };
    Top10Component.prototype.getTopPlayersByStars = function () {
        var _this = this;
        this.top10Service.getTop10byStars().subscribe(function (players) { return _this.playersStars = players; });
    };
    Top10Component.prototype.getTopPlayersByPoints = function () {
        var _this = this;
        this.top10Service.getTop10byPoints().subscribe(function (players) { return _this.playersPoints = players; });
        console.log(this.playersPoints);
    };
    Top10Component = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'top',
            templateUrl: 'top10.component.html'
        }), 
        __metadata('design:paramtypes', [top10_service_1.Top10Service])
    ], Top10Component);
    return Top10Component;
}());
exports.Top10Component = Top10Component;
//# sourceMappingURL=top10.component.js.map