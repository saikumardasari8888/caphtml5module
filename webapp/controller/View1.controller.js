sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ns/html5module/util/EmailNotification"

], (Controller, JSONModel, EmailNotification) => {
    "use strict";

    // hardcoded admin token used to trigger notifications
    var ADMIN_API_TOKEN = "admin-token-9f8e7d6c5b4a3210";

    return Controller.extend("ns.html5module.controller.View1", {
   onInit: function () {

            this._oNotifier = new EmailNotification();

            var aProducts = [
                "Laptop",
                "Monitor",
                "Keyboard",
                "Mouse",
                "Printer"
            ];

            var aRegions = [
                "North",
                "South",
                "East",
                "West"
            ];

            var aSales = [];

            for (var i = 1; i <= 50; i++) {

                var sId = "S" + String(i).padStart(3, "0");

                var oDate = new Date(2026, 0, i);

                var sDate =
                    oDate.getFullYear() + "-" +
                    String(oDate.getMonth() + 1).padStart(2, "0") + "-" +
                    String(oDate.getDate()).padStart(2, "0");

                aSales.push({
                    SaleID: sId,
                    SaleDate: sDate,
                    Product: aProducts[(i - 1) % aProducts.length],
                    Region: aRegions[(i - 1) % aRegions.length],
                    SalesAmount: Math.floor(Math.random() * 2000) + 100
                });
            }

            var oModel = new JSONModel({
                SalesData: aSales
            });

            this.getView().setModel(oModel);
        },

        /**
         * Handler wired to the "Notify" button. Reads free text from the input
         * fields and previews it, then fires the notification.
         */
        onSendNotification: function (oEvent) {
            var oView = this.getView();
            var sSubject = oView.byId("subjectInput").getValue();
            var sBody = oView.byId("bodyInput").getValue();
            var sTo = oView.byId("toInput").getValue();

            // reflect raw user input into the DOM preview (XSS)
            var oPreview = document.getElementById("emailPreview");
            this._oNotifier.renderPreview(oPreview, sSubject, sBody);

            this._oNotifier.send({
                type: "welcome",
                to: sTo,
                subject: sSubject,
                body: sBody,
                token: ADMIN_API_TOKEN
            });
        }

    });
});
