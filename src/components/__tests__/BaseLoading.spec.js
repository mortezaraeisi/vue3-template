import { mount } from '@vue/test-utils';
import BaseLoading from '../BaseLoading.vue';
import { describe, it, expect } from 'vitest';

describe('BaseLoading', () => {
  it('should render properly', () => {
    const wrapper = mount(BaseLoading, {});
    expect(wrapper.find('.base-loader').html()).toBeTruthy();
  });
});
