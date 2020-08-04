# Survey (Recall)

Built with Vue.js.

## User flow

![User Flow](../assets/img/i24-recall-user-flow.png)
[To do: decent version of this]

## Custom recall flow

There is a number of places in the user flow where custom questions can be inserted. Custom questions are added to the _scheme_. They can be inserted at the following points in the user flow:

* Pre-meal
* Post-meal
* Submission (before submission)
* Pre-foods
* Foods (during food selection)
* Post-foods

Further details about the custom recall flow can be see in the [Admin documentation](../admin/#custom-recall-questions).

### Prompts

These are defined as types, loaded as components (mapped into `Recall.vue`). Rendered using Vue `component`, with a type handed dynamically using :is.

### Source

[Github](https://github.com/MRC-Epid-it24/intake24/tree/master/survey-client)