import pick from 'lodash/pick';
import { computed, ref } from 'vue';

export type ValidationError = {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: string;
};

export type ValidationErrors = Record<string, ValidationError>;

export type UseErrorProps = {
  nonInputErrorKeys?: string[];
};

export function useErrors(props: UseErrorProps = {}) {
  const { nonInputErrorKeys = [] } = props;

  const errors = ref<ValidationErrors>({});

  const nonInputErrors = computed(() => Object.values(pick(errors.value, nonInputErrorKeys)));
  const all = computed(() => errors.value);
  const any = computed(() => !!Object.keys(errors.value).length);

  function get(field: string, index?: number) {
    if (typeof index === 'undefined')
      return [errors.value[field]?.msg].filter(Boolean);

    return Object.entries(errors.value).reduce<string[]>((acc, [key, value]) => {
      if (key.startsWith(`${field}[${index}]`))
        acc.push(value.msg);

      return acc;
    }, []);
  };

  function has(field: string, index?: number) {
    if (typeof index === 'undefined')
      return Object.prototype.hasOwnProperty.call(errors.value, field);

    return Object.keys(errors.value).some(
      key => key === field || key.startsWith(`${field}[${index}]`),
    );
  };

  function getErrors(field?: string[]) {
    if (!field)
      return Object.values(errors.value);

    return Object.values(pick(errors.value, field));
  };

  function record(items?: ValidationErrors) {
    if (typeof items !== 'undefined')
      errors.value = items;
  };

  function clear(field?: string | string[]) {
    if (Array.isArray(field)) {
      field.forEach(item => delete errors.value[item]);
      return;
    }

    if (field) {
      const { [field]: discard, ...rest } = errors.value;
      errors.value = { ...rest };
      return;
    };

    errors.value = {};
  };

  return {
    all,
    any,
    errors,
    get,
    has,
    getErrors,
    nonInputErrors,
    record,
    clear,
  };
}

export type ReturnUseErrors = ReturnType<typeof useErrors>;
