"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var home_component_1 = require("./home/home.component");
var login_component_1 = require("./auth/login.component");
var register_component_1 = require("./auth/register.component");
var top10_component_1 = require("./game/top10.component");
var auth_service_1 = require("./services/auth.service");
var router_1 = require("@angular/router");
var top10_service_1 = require("./services/top10.service");
var app_routing_module_1 = require("./app-routing.module");
var common_1 = require("@angular/common");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, router_1.RouterModule, app_routing_module_1.AppRoutingModule, http_1.HttpModule, forms_1.FormsModule],
        declarations: [app_component_1.AppComponent, home_component_1.HomeComponent, login_component_1.LoginComponent, register_component_1.RegisterComponent, top10_component_1.Top10Component],
        providers: [top10_service_1.Top10Service, auth_service_1.AuthService, { provide: common_1.APP_BASE_HREF, useValue: '/' }],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map