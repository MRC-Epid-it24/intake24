import { defineComponent } from 'vue';

function createWatchers(this: InstanceType<typeof whyDidYouRender>) {
  // eslint-disable-next-line guard-for-in
  for (const prop in this) {
    this.$watch(prop, (val, old) => {
      console.log('[WhyDidYouRender:watcher]', this.$options.name, prop, { val, old });
    });
  }
  // eslint-disable-next-line no-unused-expressions
  this.$parent && createWatchers.call(this.$parent);
}

const whyDidYouRender = defineComponent({
  created() {
    createWatchers.call(this);
  },
  updated() {
    console.log('[WhyDidYouRender:UPDATED]', this.$options.name);
  },
});

export default whyDidYouRender;
