<template>
  <app-entry-screen
    :subtitle="$t('common.signup.subtitle')"
    :title="$t('common.signup._')"
    width="800px"
  >
    <v-form @keydown="form.errors.clear($event.target.name)" @submit.prevent="submit">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.name"
                autocomplete="name"
                :error-messages="form.errors.get('name')"
                hide-details="auto"
                :label="$t('users.name')"
                name="name"
                prepend-inner-icon="fas fa-user"
                required
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.phone"
                autocomplete="tel"
                :error-messages="form.errors.get('phone')"
                hide-details="auto"
                :label="$t('common.phone')"
                name="phone"
                prepend-inner-icon="fas fa-phone"
                required
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.email"
                autocomplete="email"
                :error-messages="form.errors.get('email')"
                hide-details="auto"
                :label="$t('common.email')"
                name="email"
                prepend-inner-icon="fas fa-envelope"
                required
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.emailConfirm"
                autocomplete="email"
                :error-messages="form.errors.get('emailConfirm')"
                hide-details="auto"
                :label="$t('common.emailConfirm')"
                name="emailConfirm"
                prepend-inner-icon="fas fa-envelope"
                required
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.password"

                autocomplete="new-password"
                :error-messages="form.errors.get('password')"
                hide-details="auto"
                :label="$t('common.password._')"
                name="password"
                prepend-inner-icon="fas fa-key"
                required
                :type="show.password ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="show.password = !show.password">
                    {{ show.password ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.passwordConfirm"
                autocomplete="new-password"
                :error-messages="form.errors.get('passwordConfirm')"
                hide-details="auto"
                :label="$t('common.password.confirm')"
                name="passwordConfirm"
                prepend-inner-icon="fas fa-key"
                required
                :type="show.passwordConfirm ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-icon class="me-2" @click="show.passwordConfirm = !show.passwordConfirm">
                    {{ show.passwordConfirm ? 'fas fa-eye' : 'fas fa-eye-slash' }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-checkbox-btn
                v-model="form.terms"
                :error-messages="form.errors.get('terms')"
                hide-details="auto"
                name="terms"
                @update:model-value="form.errors.clear('terms')"
              >
                <template #label>
                  <i18n-t keypath="common.terms.text" tag="div">
                    <template #privacy>
                      <a href="https://intake24.org/privacy" target="_blank" @click.stop>
                        {{ $t('common.terms.privacy') }}
                      </a>
                    </template>
                    <template #tos>
                      <a href="https://intake24.org/tos" target="_blank" @click.stop>
                        {{ $t('common.terms.tos') }}
                      </a>
                    </template>
                  </i18n-t>
                </template>
              </v-checkbox-btn>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" sm="6">
              <v-btn block color="primary" :disabled="isAppLoading" rounded size="x-large" type="submit">
                {{ $t('common.signup._') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <captcha ref="captchaEl" @expired="expired" @verified="verified" />
    </v-form>
    <v-card-actions>
      <v-btn color="info" exact :to="{ name: 'login' }" variant="text">
        <v-icon icon="fas fa-angles-left" start />
        {{ $t('common.login.back') }}
      </v-btn>
    </v-card-actions>
  </app-entry-screen>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import type { LoginResponse } from '@intake24/common/types/http';
import { useAuth, useMessages } from '@intake24/admin/stores';
import { createForm } from '@intake24/admin/util';
import { AppEntryScreen, Captcha } from '@intake24/ui';

type SignUpForm = {
  name: string | null;
  phone: string | null;
  email: string | null;
  emailConfirm: string | null;
  password: string | null;
  passwordConfirm: string | null;
  terms: boolean;
  captcha: string | undefined;
};

export default defineComponent({
  name: 'SignUp',

  components: { AppEntryScreen, Captcha },

  setup() {
    const captchaEl = ref<InstanceType<typeof Captcha>>();

    return reactive({
      form: createForm<SignUpForm>({
        name: null,
        phone: null,
        email: null,
        emailConfirm: null,
        password: null,
        passwordConfirm: null,
        terms: false,
        captcha: undefined,
      }),
      show: {
        password: false,
        passwordConfirm: false,
      },
      captchaEl,
    });
  },

  methods: {
    resetCaptcha() {
      this.form.captcha = undefined;
      this.captchaEl?.reset();
    },

    async verified(token?: string) {
      this.form.captcha = token;
      await this.sendRequest();
    },

    expired() {
      this.resetCaptcha();
    },

    async sendRequest() {
      try {
        const { accessToken } = await this.form.post<LoginResponse>('admin/sign-up', {
          withLoading: true,
        });
        await useAuth().successfulLogin(accessToken);
        await this.$router.push({ name: 'verify' });
      }
      catch (err) {
        if (this.form.errors.has('captcha')) {
          this.form.errors.clear('captcha');
          useMessages().error(this.$t('common.password.request.captcha'));
        }
        else {
          throw err;
        }
      }
      finally {
        this.resetCaptcha();
      }
    },

    async submit() {
      if (this.captchaEl) {
        this.captchaEl.executeIfCan();
        return;
      }

      await this.sendRequest();
    },
  },
});
</script>

<style lang="scss"></style>
