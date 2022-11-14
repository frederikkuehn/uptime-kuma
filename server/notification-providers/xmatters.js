const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { UP, DOWN, getMonitorRelativeURL } = require("../../src/util");
const { setting } = require("../util-server");
const URL = require("url").URL;
let successMessage = "Sent Successfully.";

class XMatters extends NotificationProvider {
    name = "xMatters";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        try {
            if (heartbeatJSON == null) {
                const title = "Uptime Kuma Alert";
                const monitor = {
                    type: "ping",
                    url: "Uptime Kuma Test Button",
                };
                return this.postNotification(notification, title, msg, monitor);
            }

            if (heartbeatJSON.status === UP) {
                const title = "${monitorJSON.name} ✅ Up";
                return this.postNotification(notification, title, msg, monitorJSON, heartbeatJSON.status, );
            }

            if (heartbeatJSON.status === DOWN) {
                const title = "${monitorJSON.name} 🔴 Down";
                return this.postNotification(notification, title, msg, monitorJSON, heartbeatJSON.status);
            }
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    /**
     * Check if result is successful, result code should be in range 2xx
     * @param {Object} result Axios response object
     * @throws {Error} The status code is not in range 2xx
     */
    checkResult(result) {
        if (result.status == null) {
            throw new Error("xMatters notification failed with invalid response!");
        }
        if (result.status < 200 || result.status >= 300) {
            throw new Error("xMatters notification failed with status code " + result.status);
        }
    }

    /**
     * Retrieve an OAuth token, to be used for further requests.
     * @param {String} xMattersHostName host name to connect to
     * @param {String} clientId client id to be used
     * @param {String} username
     * @param {String} password
     * @returns {Object} The OAuth token
     */
    async getOauthToken(xMattersHostName, clientId, username, password) {
        const options = {
            method: "POST",
            url: "https://" + xMattersHostName + "/api/xm/1/oauth2/token",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
                grant_type: "password",
                client_id: clientId,
                username: username,
                password: password,
            }
        };
        return await axios.request(options);
    }

    /**
     * Send the message
     * @param {BeanModel} notification Message title
     * @param {string} title Message title
     * @param {string} body Message
     * @param {Object} monitorInfo Monitor details (For Up/Down only)
     * @returns {string}
     */
    async postNotification(notification, title, message, monitorInfo, status = null) {

        let monitorUrl;
        if (monitorInfo.type === "port") {
            monitorUrl = monitorInfo.hostname;
            if (monitorInfo.port) {
                monitorUrl += ":" + monitorInfo.port;
            }
        } else if (monitorInfo.hostname != null) {
            monitorUrl = monitorInfo.hostname;
        } else {
            monitorUrl = monitorInfo.url;
        }

        let options = {
            method: "POST",
            url: notification.xMattersUrl,
            headers: { "Content-Type": "application/json" },
            data: {
                title: title,
                message: message,
                status: status,
                priority: notification.xMattersPriority || "medium",
                source: monitorUrl,
                floodControlId: monitorInfo.id,
            }
        };

        let oauthToken;

        switch(notification.xMattersAuthenticationMethod) {
            case "basic":
                options.auth = {
                    username: notification.xMattersUsername,
                    password: notification.xMattersPassword,
                };
                break;
            case "apiKey":
                options.auth = {
                    username: notification.xMattersApiKey,
                    password: notification.xMattersSecret,
                };
                break;
            case "oauth":
                oauthToken = await this.getOauthToken(new URL(notification.xMattersUrl).hostname, notification.xMattersClientId, notification.xMattersUsername, notification.xMattersPassword);
                options.headers.Authorization = "Bearer " + oauthToken.access_token;
                break;
        }

        const baseURL = await setting("primaryBaseURL");
        if (baseURL && monitorInfo) {
            options.client = "Uptime Kuma";
            options.client_url = baseURL + getMonitorRelativeURL(monitorInfo.id);
        }

        let result = await axios.request(options);
        this.checkResult(result);
        if (result.statusText != null) {
            return "xMatters notification succeed: " + result.statusText;
        }

        return successMessage;
    }

}

module.exports = XMatters;
