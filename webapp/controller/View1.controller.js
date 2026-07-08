sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("ns.html5module.controller.View1", {
   onInit: function () {

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
        }

    });
});
