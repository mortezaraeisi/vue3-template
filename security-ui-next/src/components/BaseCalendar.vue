<template>
  <div class=" relative" @click.stop..prevent>
    <base-text-box
      class="cursor-pointer"
      input-class="text-center"
      v-bind="$attrs"
      :label="label"
      :model-value="modelValue"
      v-model="state.txtInput"
      @keydown.enter.stop="updateFromString"
      @click="togglePopup"
    >
      <template #prepend>
        <div class="px-2 flex items-center">
          <base-icon name="fa-calendar"/>
        </div>
      </template>
      <template #append>
        <div
          v-if="allowTime"
          class="px-2 flex items-center border"
          @click.stop
        >
          <input
            type="number"
            min="0"
            max="59"
            class="w-12 text-center"
            title="دقیقه"
            v-model.number="state.minute"
            @input="updateTime"
          >
          <div class="mx-1">:</div>
          <input
            type="number"
            min="0"
            max="23"
            class="w-12 text-center"
            title="ساعت"
            v-model.number="state.hour"
            @input="updateTime"
          >
        </div>
        <div
          v-if="clearable"
          class="px-2 flex items-center cursor-pointer hover:text-primary"
          @click.stop="clearDate"
        >
          <base-icon name="fa-xmark"/>
        </div>
      </template>
    </base-text-box>
    <div
      v-if="state.popupState"
      class="absolute z-10 w-full h-auto bg-white border top-12 p-1"
    >
      <div class="w-full grid grid-cols-7 gap-1">
        <div class="col-span-full text-center flex">
          <div
            class="w-10 cursor-pointer hover:bg-gray-50 hover:text-primary"
            @click.stop="moveToPrevMonth"
          >
            <base-icon name="fa-caret-right"/>
          </div>
          <div class="flex-1">
            {{ state.current }}
          </div>
          <div
            class="w-10 cursor-pointer hover:bg-gray-50 hover:text-primary"
            @click.stop="moveToNextMonth"
          >
            <base-icon name="fa-caret-left"/>
          </div>
        </div>
        <div
          v-for="name in dNames" :key="name"
          class="text-normal text-center select-none overflow-hidden"
        >
          {{ name }}
        </div>
        <div
          v-for="day in dList" :key="day.dayOfMonth"
          class="select-none"
          :class="day.classes"
          @click.stop="selectDay(day)"
        >
          {{ day.dayOfMonth }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { PersianDate } from '../utils/persian-date';

interface IProps {
  modelValue?: string,
  label?: string,
  maxDate?: string,
  minDate?: string,
  readonly?: boolean
  clearable?: boolean
  upwardDays?: boolean | number
  lengthDays?: boolean | number
  allowHolidays?: boolean
  allowTime?: boolean
}

interface ICalendarDay {
  isFriday: boolean
  isHoliday: boolean
  date: string,
  classes: string | object,
  dayOfMonth: number | string,
  holidayInCalendar: boolean
  isSelectable: boolean
  isSelected: boolean
  isToday: boolean
}

const emits = defineEmits([ 'update:modelValue' ]);
const props = defineProps<IProps>();

const persianDate = new PersianDate();
const today = new PersianDate().toPersianDateString();
const dNames = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
];

const state = reactive({
  current: persianDate.toLocaleDateString(),
  year: 1400,
  month: 1,
  day: 1,
  daysInMonth: 31,
  startWeekDay: 0,
  monthName: '',
  dayName: '',
  dList: [] as Array<ICalendarDay>,
  popupState: false,
  txtInput: '',
  hour: 0,
  minute: 0,
});

const lowBoundDate = computed(() => {
  if (props.upwardDays) {
    if (props.upwardDays === true) {
      return state.current;
    }
    const upwardDays = Number(props.upwardDays) || 0;
    const dt = new Date();
    return new PersianDate(dt.setDate(dt.getDate() + upwardDays)).toLocaleDateString();
  }
  return props.minDate ?? '';
});

const upBoundDate = computed(() => {
  if (props.lengthDays) {
    if (props.lengthDays === true) {
      return state.current;
    }
    const lengthDays = Number(props.lengthDays) || 0;
    const dt = new Date();
    return new PersianDate(dt.setDate(dt.getDate() + lengthDays)).toLocaleDateString();
  }
  return props.maxDate ?? '';
});

const dList = computed(() => {
  const originDate = PersianDate.fromString(state.current);
  state.current = originDate.toPersianDateString();
  state.daysInMonth = originDate.getDaysInMonth();
  const [ year, month ] = state.current.split('/');
  const fdm = originDate.getFirstOfMonth().getDay();
  const dList = Array(state.daysInMonth).fill(0)
    .map((_, i) => {
      const isFriday = (fdm + i + 1) % 7 === 0;
      const holidayInCalendar = false;
      const isHoliday = isFriday || !!holidayInCalendar;
      const dayOfMonth = (i + 1).toString().padStart(2, '0');
      const date = `${ year }/${ month }/${ dayOfMonth }`;
      const isSelectable = (props.allowHolidays || !isHoliday);
      const isSelected = props.modelValue === date;
      const isToday = today === date;

      return {
        date,
        isFriday,
        isHoliday,
        dayOfMonth,
        isSelectable,
        isSelected,
        isToday,
        holidayInCalendar: holidayInCalendar,
        classes: {
          'text-sm text-center border cursor-pointer': true,
          'hover:bg-primary hover:text-white': isSelectable,
          'bg-red-100 text-red-800': isFriday,
          'bg-primary text-white': isSelected,
          'border-green-800': isToday,
        }
      } as ICalendarDay;
    });
  const startWeek = Array(fdm).fill(0)
    .map(() => ({
      isFriday: false,
      isHoliday: false,
      date: '',
      dayOfMonth: '',
      isSelectable: false,
      isToday: false,
      classes: 'text-normal bg-gray-50'
    } as ICalendarDay));
  return startWeek.concat(dList);
});

watch(() => props.modelValue, () => {
  state.txtInput = (props.modelValue || '').split(' ')[0];
});

function moveToNextMonth() {
  moveMonth(+1);
}

function moveToPrevMonth() {
  moveMonth(-1);
}

function moveMonth(count: number) {
  const dt = PersianDate.fromString(state.current).asDate();
  dt.setMonth(dt.getMonth() + count);
  const pDate = new PersianDate(dt).toPersianDateString();
  if (lowBoundDate.value && pDate < lowBoundDate.value) {
    return;
  }
  if (upBoundDate.value && pDate > upBoundDate.value) {
    return;
  }
  setDate(pDate);
}

function togglePopup() {
  state.popupState = !state.popupState;
}

function updateFromString() {
  if (!state.txtInput || typeof state.txtInput !== 'string') {
    return;
  }
  const parts = state.txtInput.split('/').map(Number);
  if (parts.length !== 3 || parts.some(x => !x || isNaN(x) || !isFinite(x))) {
    return;
  }
  changeDate(parts.map(x => x.toString().padStart(2, '0')).join('/'));
}

function clearDate() {
  state.hour = 0;
  state.minute = 0;
  state.popupState = false;
  changeDate('');
}

function selectDay(day: ICalendarDay) {
  if (!day.isSelectable) {
    return;
  }
  if (day.date === state.current) {
    return;
  }
  changeDate(day.date);
  togglePopup();
}

function updateTime() {
  changeDate(state.txtInput);
}

function changeDate(val: string) {
  if (val) {
    setDate(val);
  }
  const time = (state.hour || 0).toString().padStart(2, '20') + ':' + (state.minute || 0).toString().padStart(2, '20');
  const outVal = props.allowTime ? val + ' ' + time : val;
  emits('update:modelValue', outVal);
}

function setDate(persianDate: string) {
  state.current = persianDate;
}

function clickedOutside() {
  state.popupState = false;
}

onMounted(() => {
  setDate(today);
  document.addEventListener('click', clickedOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', clickedOutside);
});
</script>
