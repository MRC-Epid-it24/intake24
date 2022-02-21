import isEqual from 'lodash/isEqual';
import { ref, SetupContext, toRefs, UnwrapRef, UnwrapRefSimple, watch } from '@vue/composition-api';
import { copy } from '@intake24/common/util';

export type ListProps<T> = {
  schemeId: string;
  value: T[];
};

export default <T>(props: ListProps<T>, context: SetupContext, newValue: () => T) => {
  const { value } = toRefs(props);
  const form = ref<InstanceType<typeof HTMLFormElement>>();

  const items = ref([...value.value]);

  const newDialog = (show = false) => ({
    show,
    index: -1,
    item: newValue() as UnwrapRef<T>,
  });

  const dialog = ref({
    show: false,
    index: -1,
    item: newValue(),
  });

  watch(value, (val) => {
    if (isEqual(val, items.value)) return;
    items.value = [...(val as UnwrapRefSimple<T[]>)];
  });

  watch(items, () => {
    context.emit('input', items.value);
  });

  const add = () => {
    dialog.value = newDialog(true);
  };

  const edit = (index: number, item: UnwrapRef<T>) => {
    dialog.value = { show: true, index, item: copy(item) };
  };

  const load = (list: UnwrapRefSimple<T>[]) => {
    items.value = [...list];
  };

  const remove = (index: number) => {
    items.value.splice(index, 1);
  };

  const reset = () => {
    dialog.value = newDialog();
    form.value?.resetValidation();
  };

  const save = () => {
    const isValid = form.value?.validate();
    if (!isValid) return;

    const { index, item } = dialog.value;

    if (index === -1) items.value.push(item as UnwrapRefSimple<T>);
    else items.value.splice(index, 1, item as UnwrapRefSimple<T>);

    reset();
  };

  return {
    form,
    items,
    dialog,
    newDialog,
    add,
    edit,
    load,
    remove,
    reset,
    save,
  };
};
