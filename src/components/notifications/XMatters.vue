<template>
    <div class="mb-3">
        <label for="xmatters-authentication-method" class="form-label">{{ $t("Authentication Method") }}</label>
        <select id="xmatters-authentication-method" v-model="$parent.notification.xMattersAuthenticationMethod" :required="true" class="form-select">
            <option value="url" selected="selected">{{ $t("URL Authentication") }}</option>
            <option value="basic">{{ $t("Basic Authentication") }}</option>
            <option value="apiKey">{{ $t("API Key") }}</option>
            <option value="oauth">{{ $t("OAuth") }}</option>
        </select>
    </div>
    <template v-if="$parent.notification.xMattersAuthenticationMethod === 'url'">
        <div class="mb-3">
            <label for="xmatters-integration-url" class="form-label">{{ $t("Integration URL") }}</label>
            <input id="xmatters-integration-url" v-model="$parent.notification.xMattersUrl" type="text" :required="true" class="form-control" autocomplete="false">
        </div>
    </template>
    <template v-else-if="$parent.notification.xMattersAuthenticationMethod === 'basic'">
        <div class="mb-3">
            <label for="xmatters-integration-url" class="form-label">{{ $t("Integration URL") }}</label>
            <input id="xmatters-integration-url" v-model="$parent.notification.xMattersUrl" type="text" :required="true" class="form-control" autocomplete="false">
        </div>

        <div class="mb-3">
            <label for="username" class="form-label">{{ $t("Username") }}</label>
            <input id="username" v-model="$parent.notification.xMattersUsername" type="text" :required="true" class="form-control" autocomplete="false">
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">{{ $t("Password") }}</label>
            <HiddenInput id="password" v-model="$parent.notification.xMattersPassword" :required="true" autocomplete="new-password"></HiddenInput>
        </div>
    </template>
    <template v-else-if="$parent.notification.xMattersAuthenticationMethod === 'apiKey'">
        <div class="mb-3">
            <label for="xmatters-integration-url" class="form-label">{{ $t("Integration URL") }}</label>
            <input id="xmatters-integration-url" v-model="$parent.notification.xMattersUrl" :required="true" type="text" class="form-control" autocomplete="false">
        </div>
        
        <div class="mb-3">
            <label for="api-key" class="form-label">{{ $t("API Key") }}</label>
            <input id="api-key" v-model="$parent.notification.xMattersApiKey" type="text" :required="true" class="form-control" autocomplete="false">
        </div>

        <div class="mb-3">
            <label for="secret" class="form-label">{{ $t("Secret") }}</label>
            <HiddenInput id="secret" v-model="$parent.notification.xMattersSecret" :required="true" autocomplete="false"></HiddenInput>
        </div>
    </template>
    <template v-else-if="$parent.notification.xMattersAuthenticationMethod === 'oauth'">
        <div class="mb-3">
            <label for="xmatters-integration-url" class="form-label">{{ $t("Integration URL") }}</label>
            <input id="xmatters-integration-url" v-model="$parent.notification.xMattersUrl" type="text" :required="true" class="form-control" autocomplete="false">
        </div>
        
        <div class="mb-3">
            <label for="client-id" class="form-label">{{ $t("Client Id") }}</label>
            <input id="client-id" v-model="$parent.notification.xMattersClientId" type="text" :required="true" class="form-control" autocomplete="false">
        </div>

        <div class="mb-3">
            <label for="username" class="form-label">{{ $t("Username") }}</label>
            <input id="username" v-model="$parent.notification.xMattersUsername" type="text" :required="true" class="form-control" autocomplete="false">
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">{{ $t("Password") }}</label>
            <HiddenInput id="password" v-model="$parent.notification.xMattersPassword" :required="true" autocomplete="new-password"></HiddenInput>
        </div>
    </template>
    <div class="mb-3">
        <label for="xmatters-priority" class="form-label">{{ $t("Priority") }}</label>
        <select id="xmatters-priority" v-model="$parent.notification.xMattersPriority" class="form-select">
            <option value="info">{{ $t("Low") }}</option>
            <option value="warning" selected="selected">{{ $t("Medium") }}</option>
            <option value="error">{{ $t("High") }}</option>
        </select>
    </div>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";

export default {
    components: {
        HiddenInput,
    }
};
</script>