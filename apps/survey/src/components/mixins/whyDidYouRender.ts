import { defineComponent } from 'vue';

function createWatchers(this: InstanceType<typeof whyDidYouRender>) {
  for (const prop in this) {
    this.$watch(prop, (val, old) => {
      console.log('[WhyDidYouRender:watcher]', this.$options.name, prop, { val, old });
    });
  }

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
