import type { SetupContext } from 'vue';
import { useVModel } from '@vueuse/core';
import { computed } from 'vue';

import type { PortionSizeMethodParameterItem } from '..';

export type UserParametersProps = {
  value: PortionSizeMethodParameterItem[];
};

export const useParameters = (props: UserParametersProps, { emit }: SetupContext) => {
  const parameters = useVModel(props, 'value', emit, { eventName: 'input' });

  const getParameter = (name: string) =>
    parameters.value.find((parameter) => parameter.name === name);

  const setParameter = (name: string, value: boolean | number | string | null) => {
    const index = parameters.value.findIndex((parameter) => parameter.name === name);
    if (index !== -1) {
      parameters.value.splice(index, 1, {
        ...parameters.value[index],
        value: value?.toString() ?? '',
      });
    } else parameters.value.push({ name, value: value?.toString() ?? '' });
  };

  const removeParameter = (name: string | string[]) => {
    const names = Array.isArray(name) ? name : [name];
    parameters.value = [...parameters.value.filter((parameter) => !names.includes(parameter.name))];
  };

  const createBooleanParameter = (name: string) =>
    computed({
      get(): boolean {
        return getParameter(name)?.value === 'true';
      },
      set(value: boolean) {
        setParameter(name, value);
      },
    });

  const createNumberParameter = (name: string) =>
    computed({
      get(): number {
        const value = parseFloat(getParameter(name)?.value ?? '0');
        return Number.isNaN(value) ? 0 : value;
      },
      set(value: number) {
        setParameter(name, value);
      },
    });

  const createStringParameter = (name: string) =>
    computed({
      get(): string {
        return getParameter(name)?.value ?? '';
      },
      set(value: string) {
        setParameter(name, value);
      },
    });

  const createObjectParameter = <T extends object>(name: string, defaultValue = {}) =>
    computed<T>({
      get(): T {
        const parameter = getParameter(name)?.value;
        return parameter ? JSON.parse(parameter) : defaultValue;
      },
      set(value: T) {
        setParameter(name, JSON.stringify(value));
      },
    });

  return {
    createBooleanParameter,
    createNumberParameter,
    createStringParameter,
    createObjectParameter,
    parameters,
    getParameter,
    setParameter,
    removeParameter,
  };
};
