<template>
  <base-layout>
    <base-form
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white rounded p-2"
      @submit="save"
    >
      <base-text-box
        readonly
        label="شناسه"
        v-model="dm.NidUser"
      />
      <base-text-box
        required
        label="نام کاربری"
        maxLength="50"
        v-model="dm.username"
      />
      <base-text-box
        required
        label="نام"
        maxLength="50"
        v-model="dm.firstName"
      />
      <base-text-box
        required
        label="نام خانوادگی"
        maxLength="50"
        v-model="dm.lastName"
      />
      <base-text-box
        label="ملیت"
        v-model="dm.CI_Nationality"
      />
      <base-text-box
        label="کد ملی"
        maxLength="10"
        v-model="dm.IDNumber"
      />
      <base-text-box
        label="نام پدر"
        maxLength="50"
        v-model="dm.fatherName"
      />
      <base-calendar
        label="تاریخ تولد"
        v-model="dm.birthDate"
      />
      <base-text-box
        label="محل تولد"
        maxLength="50"
        v-model="dm.birthPlace"
      />
      <base-text-box
        label="ایمیل"
        maxLength="255"
        v-model="dm.email"
      />
      <base-text-box
        label="تلفن همراه"
        maxLength="13"
        v-model="dm.mobile"
      />
      <base-text-box
        label="تلفن ثابت"
        maxLength="25"
        v-model="dm.tel"
      />
      <base-text-box
        class="col-span-full"
        label="آدرس"
        v-model="dm.address"
      />
      <base-text-box
        class="col-span-full"
        label="توضیحات"
        v-model="dm.description"
      />
      <div class="col-span-full mb-2"/>

      <base-checkbox
        label="الزام تغییر گذرواژه"
        v-model="dm.mustChangePassword"
      />
      <base-checkbox
        label="مدیر است؟"
        v-model="dm.isSysAdmin"
      />
      <base-checkbox
        label="مدیر اپ است؟"
        v-model="dm.isSysApp"
      />
      <base-checkbox
        label="مدیر 3rd Party است؟"
        v-model="dm.isSys3rdParty"
      />
      <base-checkbox
        label="الزام ورود با دوربین"
        v-model="dm.mustLoginByCamera"
      />
      <div class="col-span-full mb-2"/>
      <base-checkbox
        label="فعال بودن"
        v-model="dm.enabled"
      />
      <base-calendar
        label="تاریخ شروع فعالیت"
        v-model="dm.startActiveDate"
      />
      <base-calendar
        label="تاریخ پایان فعالیت"
        v-model="dm.endActiveDate"
      />
      <base-text-box
        type="number"
        label="طول عمر نشست (دقیقه)"
        v-model="dm.sessionTimeout"
      />
      <div class="col-span-full mt-2">
        <base-button
          primary
          class="w-full"
          icon="fa-save"
          type="submit"
          label="ثبت"
        />
      </div>
    </base-form>

    <base-form
      class="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white rounded p-2"
      @submit="resetPasswd"
    >
      <base-text-box
        required
        type="password"
        label="گذرواژه"
        v-model="dmPasswd.password"
      />
      <base-text-box
        required
        type="password"
        label="تکرار گذرواژه"
        v-model="dmPasswd.passwordConfirm"
      />
      <div class="flex items-center">
        <base-button
          secondary
          icon="fa-save"
          class="w-60"
          type="submit"
          label="تنظیم"
        />
      </div>
    </base-form>

    <base-form
      class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white rounded p-2"
    >
      <base-text-box
        readonly
        label="قفل سخت افزاری"
        v-model="dmPasswd.password"
      />
      <div class="flex items-end">
        <base-button
          primary
          icon="fa-sync"
          label="شناسایی"
          class="w-40"
        />
        <base-button
          negative
          label="حذف"
          icon="fa-trash"
          class="w-20"
        />
      </div>
    </base-form>
  </base-layout>
</template>

<script setup lang="ts">

import { reactive, useAttrs } from 'vue';
import { IUserModel } from '../../definitions/IUserModel';

const attrs = useAttrs();
const dm = reactive({
  ...attrs.recordInfo as IUserModel,
});
const dmPasswd = reactive({
  password: '',
  passwordConfirm: '',
});
const tokenSerial = reactive({
  UserLable: '',
  passwordConfirm: '',
});

async function save() {
  console.log('save');
}

async function resetPasswd() {
  console.log('resetPasswd');
}
</script>
