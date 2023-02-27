# Question types

Questions / Prompts are divided into three groups:

- [standard](#standard-prompts) - Standard prompts
- [portion-size](#portion-size-prompts) - Portion-size estimation prompts
- [custom](#custom-prompts) - Custom / generic prompts

## Standard prompts

Prompts with standardized behavior tied to specific functionality. Usually only one can be used per scheme and functionality is often tied to specific scheme section.

### Associated foods prompt

### Edit meal prompt

Edit meal prompt allows initial entry of food and drink before portion-size estimation.

#### Options

- `separateDrinks` - true/false whether to show drinks separately

### Final prompt

Terminal prompt that is shown at the end of the survey and can offer feedback is applicable.

### Food search prompt

### Meal add prompt

Allows user to add new meal.

#### Options

- `custom` - allow adding custom meal names

### Meal time prompt

Allows user to specify meal time.

#### Options

- `format` - time format (`am/pm` or `24h`)

### Ready meal prompt

Prompt to collect ready meal information. Multi-select list of options, for each food within the meal that has `ready-meal` attribute set to `true`.

### Redirect prompt

Allows user to be redirected to external URL with user identifier embedded into it.

#### Options

- `url` - URL to redirect to

  - use `{identifier}` to indicate the place where the user identifier should be to inserted.
  - example: `https://example.com/?arg={identifier}`

- `identifier` - identifier that should be embedded into the url.

  - `userId` - internal intake24 user id
  - `username` - survey-unique respondent username
  - `token` - authentication token
  - `custom` - custom identifier that can be set through `userCustomField`, name should be `redirect url`

- `timer` - optional timer in seconds when automatic redirect should happen

### Review confirm prompt

### Same as before prompt

### Split food prompt

### Submit prompt

## Portion-size prompts

Prompts for food portion-size estimation. Only one can be used per scheme and functionality is tied `foods` scheme section.

### As-served prompt

#### Options

- `leftovers` - true/false whether to show leftovers option

- `linked quantity categories`
  - Category list of that parent food should have (at least one) to trigger quantity selection based on parent food quantity
  - Optional, standard unit can be assigned to set the `how-many` label

### Cereal prompt

#### Options

- `leftovers` - true/false whether to show leftovers option

- `image map labels` - true/false whether to show image map labels

- `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Direct weight prompt

### Drink scale prompt

#### Options

- `leftovers` - true/false whether to show leftovers option

- `image map labels` - true/false whether to show image map labels

- `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Guide image prompt

#### Options

- `image map labels` - true/false whether to show image map labels

- `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Milk in a hot drink prompt

#### Options

- `options` - locale-specific list of options for milk portion in hot drink (`0-1 range`)

- `orientation` - orientation of radio buttons (column/row)

### Milk on cereal prompt

#### Options

- `image map labels` - true/false whether to show image map labels

- `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Pizza prompt

#### Options

- `image map labels` - true/false whether to show image map labels

- `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Portion size option prompt

### Standard portion prompt

## Custom prompts

Prompts with generic behavior to be customized. Can be used multiple times per scheme with specific scheme-unique `QuestionID`.

### Checkbox list prompt

Multi-select list of options.

#### Options

- `options` - locale-specific list of options, `label` (displayed value) and `value` (stored value) can be specified

- `other` - true/false whether to show 'other' option

### Date picker prompt

Prompt to collect date information.

### Info prompt

Informational prompt for acknowledging displayed information.

### No more information prompt

Terminal prompt for `food` or `meal` when no more information is required. It should be placed in `foods` and `postFoods` sections respectively.

### Radio list prompt

Single-select list of options.

- `options` - locale-specific list of options, `label` (displayed value) and `value` (stored value) can be specified

- `other` - true/false whether to show 'other' option

- `orientation` - orientation of radio buttons (column/row)

### Textarea prompt

Free-form text input.

### Time picker prompt

Prompt to collect time information.

- `format` - time format (`am/pm` or `24h`)

### Yes/no prompt

Prompt to collect yes/no (true/false) information presented as distinct buttons.
