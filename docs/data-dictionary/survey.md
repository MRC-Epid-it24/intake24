# Survey

Vue data dictionary for Survey interface.

## `Recall.recall`

Object that stores all data about the recall, retrieved by `surveySvc`

- `flags` - ??
- `id` - ID of survey
- `mealQuestions` - all data for meal questions
  - [To do]
- `meals` - array of meal objects: containing `name` and `time` (24hr)
- `name` - human-readable name of survey
- `postMeals` -
- `preMeals` -
- `submission` - Object of user responses

## `Recall.scheme`

Object that stores details of the current scheme, retrieved by `surveySvc`

- `id`
- `meals` - array of meal objects: containing `name` and `time` (24hr)
- `name`
- `questions` - object containing arrays of question objects for each of the question stages (custom recall flow)
- `type` - data-driven or legacy
