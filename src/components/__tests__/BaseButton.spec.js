import { describe, it, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
  it('should render properly', () => {
    const wrapper = shallowMount(BaseButton, {
      props: {
        label: 'Test Button',
      },
    });
    expect(wrapper.text()).toContain('Test Button');
  });

  it('should emit click', async () => {
    const wrapper = shallowMount(BaseButton, {});
    await wrapper.trigger('click');
    expect(wrapper.emitted().click.length).toBeTruthy();
  });

  it('should not emit click on loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeFalsy();
  });

  it('should not emit click when is disabled', async () => {
    const wrapper = shallowMount(BaseButton, {
      props: {
        disabled: true,
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeFalsy();
  });

  it('should set type (submit) property', async () => {
    const wrapper = shallowMount(BaseButton, {
      props: {
        type: 'submit',
      },
    });
    expect(wrapper.find('[type=submit]').html()).toBeTruthy();
  });

});
