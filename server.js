"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var axios_1 = require("axios");
var app = (0, express_1.default)();
var port = 8000;
app.use(express_1.default.json());
// Function to convert Address to a string format suitable for the Google Maps API
function formatAddressForApi(address) {
    return "".concat(address.street, ", ").concat(address.city, ", ").concat(address.country);
}
// Adapter function to call Google Maps Directions API
function getRouteDetailsFromGoogleMaps(startLocation, targetLocation, transportMeans) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, origin, destination, mode, url, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiKey = 'AIzaSyC8u6QIMi_4KOZGSaMCdSITI5dIbYmqyFk';
                    origin = formatAddressForApi(startLocation);
                    destination = formatAddressForApi(targetLocation);
                    mode = transportMeans;
                    url = "https://maps.googleapis.com/maps/api/directions/json?origin=".concat(encodeURIComponent(origin), "&destination=").concat(encodeURIComponent(destination), "&mode=").concat(mode, "&key=").concat(apiKey);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _a.sent();
                    result = response.data.routes[0].legs[0];
                    return [2 /*return*/, {
                            estimatedTime: result.duration.text,
                            distance: result.distance.text,
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching route details from Google Maps:', error_1);
                    throw new Error('Failed to fetch route details from Google Maps.');
                case 4: return [2 /*return*/];
            }
        });
    });
}
app.post('/route', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startLocation, targetLocation, transportMeans, validTransportMeans, routeDetails, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, startLocation = _a.startLocation, targetLocation = _a.targetLocation, transportMeans = _a.transportMeans;
                console.log({ startLocation: startLocation, targetLocation: targetLocation, transportMeans: transportMeans });
                validTransportMeans = ["driving", "walking", "bicycling", "transit"];
                if (!validTransportMeans.includes(transportMeans)) {
                    return [2 /*return*/, res.status(400).send({ error: "Invalid transport means specified. Use 'driving', 'walking', 'bicycling', or 'transit'." })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getRouteDetailsFromGoogleMaps(startLocation, targetLocation, transportMeans)];
            case 2:
                routeDetails = _b.sent();
                res.json(routeDetails);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.status(500).send({ error: error_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Adapter running on port ".concat(port));
});
