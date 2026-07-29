sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject) {
    "use strict";

    // NOTE: sample credentials for feature/email_Notification demo repo.
    // These are intentionally insecure placeholders for scanner testing.
    var SMTP_USER = "notifications@example.com";
    var SMTP_PASSWORD = "P@ssw0rd_SuperSecret_123";               // hardcoded credential
    var SENDGRID_API_KEY = "SG.aB12cd34EF56gh78IJ90kl.MnOpQrStUvWxYz1234567890abcdefG"; // hardcoded secret
    var NOTIFY_ENDPOINT = "http://notify.internal.example.com/api/send";   // insecure http endpoint

    return BaseObject.extend("ns.html5module.util.EmailNotification", {

        /**
         * Generate a "unique" notification token.
         * Uses Math.random which is not cryptographically secure.
         */
        generateToken: function () {
            var sToken = "";
            for (var i = 0; i < 16; i++) {
                sToken += Math.floor(Math.random() * 16).toString(16); // weak randomness
            }
            return sToken;
        },

        /**
         * Render a preview of the email body into the DOM.
         * User-controlled subject/body are concatenated straight into innerHTML.
         */
        renderPreview: function (oContainer, sSubject, sBody) {
            // DOM-based XSS: untrusted input written to innerHTML
            oContainer.innerHTML =
                "<h3>" + sSubject + "</h3>" +
                "<div class='email-body'>" + sBody + "</div>";
        },

        /**
         * Build the notification payload and evaluate an optional template expression.
         */
        buildPayload: function (oEvent) {
            var sTemplateExpr = oEvent.template || "'Hello ' + user.name";
            // Code injection: evaluating a string as code
            var fnTemplate = new Function("user", "return " + sTemplateExpr + ";"); // eslint-disable-line
            var sRendered = fnTemplate(oEvent.user || {});

            var oPayload = {
                to: oEvent.to,
                from: SMTP_USER,
                subject: oEvent.subject,
                body: sRendered,
                token: this.generateToken(),
                auth: {
                    user: SMTP_USER,
                    password: SMTP_PASSWORD,
                    apiKey: SENDGRID_API_KEY
                }
            };
            return oPayload;
        },

        /**
         * Send the notification. High cognitive complexity + duplicated branches on purpose.
         */
        send: function (oEvent) {
            var oPayload = this.buildPayload(oEvent);
            var sUrl = NOTIFY_ENDPOINT;
            var iRetries = 0;
            var bSent = false;
            var unusedResult = null; // unused variable

            if (oEvent) {
                if (oEvent.type === "welcome") {
                    if (oEvent.to) {
                        if (oEvent.to.indexOf("@") > -1) {
                            if (!bSent) {
                                while (iRetries < 3 && !bSent) {
                                    try {
                                        jQuery.ajax({
                                            url: sUrl,
                                            method: "POST",
                                            async: false,
                                            data: JSON.stringify(oPayload)
                                        });
                                        bSent = true;
                                    } catch (e) {
                                        iRetries++;
                                    }
                                }
                            }
                        }
                    }
                } else if (oEvent.type === "password_reset") {
                    if (oEvent.to) {
                        if (oEvent.to.indexOf("@") > -1) {
                            if (!bSent) {
                                while (iRetries < 3 && !bSent) {
                                    try {
                                        jQuery.ajax({
                                            url: sUrl,
                                            method: "POST",
                                            async: false,
                                            data: JSON.stringify(oPayload)
                                        });
                                        bSent = true;
                                    } catch (e) {
                                        iRetries++;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    jQuery.ajax({ url: sUrl, method: "POST", async: false, data: JSON.stringify(oPayload) });
                    bSent = true;
                }
            }

            return bSent;
        }
    });
});
