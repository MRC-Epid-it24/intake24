# Prompt types

Prompts / Prompts are divided into three groups:

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

Terminal prompt that is shown at the end of the recall. It offers home button It can offer feedback is applicable (feedback enabled and submission threshold reached).

### Food search prompt

### Meal add prompt

Prompt to add new meals. Multi-select list of options predefined in the scheme meal list.

#### Options

- `custom` - allow adding custom meal names

### Meal duration prompt

Prompt to collect meal duration in minutes.

- `initial` - initial duration in minutes
- `min` - minimum duration in minutes
- `max` - maximum duration in minutes
- `step` - step in minutes

### Meal time prompt

Prompt to collect meal time information using standard time picker.

#### Options

- `allowedMinutes` - allowed minutes for selection (`1`, `5`, `10`, `15`, `20`, `30`)

- `format` - time format (`am/pm` or `24h`)

### Ready meal prompt

Prompt to collect ready meal information. Multi-select list of options, for each food within the meal that has `ready-meal` attribute set to `true`.

### Redirect prompt

Prompt to redirect user to external site with optional user identifier embedded into URL.

#### Options

- `url` - URL to redirect to

  - use `{identifier}` variable as a placeholder where the user identifier should be to inserted.
  - example: `https://example.com/?arg={identifier}`

- `identifier` - identifier that should be embedded into the URL.

  - `userId` - internal intake24 user id
  - `username` - survey-unique respondent username
  - `urlAuthToken` - URL authentication token
  - `custom` - custom identifier that can be set through `userCustomField`.
    - Enter a `name` of the custom field to be looked up the `value`.

- `timer` - optional timer in seconds when automatic redirection should occur
  - disabled if set to `0`

### Review confirm prompt

### Same as before prompt

Prompt to detect foods that are the same as in the previous recalls / meals and offer to use the same portion-size estimation.

### Split food prompt

Prompt to identify foods that can potentially be split into separate foods.

### Submit prompt

Prompt with recap of the recall and submit button.

## Portion-size prompts

Prompts for food portion-size estimation. Only one can be used per scheme and functionality is tied `foods` scheme section.

### As-served prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header

- `leftovers` - true/false whether to show leftovers option

- `linked quantity categories`
  - Category list of that parent food should have (at least one) to trigger quantity selection based on parent food quantity
  - Optional, standard unit can be assigned to set the `how-many` label

### Cereal prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header

- `leftovers` - true/false whether to show leftovers option

- `image map settings` - image map settings

  - `image map labels` - true/false whether to show image map labels
  - `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Direct weight prompt

### Drink scale prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header

- `leftovers` - true/false whether to show leftovers option

- `multiple` - true/false whether to allow multiple item to be selected. When enabled, additional slider options are available:

  - `initial` - initial value
  - `min` - minimum value
  - `max` - maximum value
  - `step` step increment

- `image map settings` - image map settings

  - `image map labels` - true/false whether to show image map labels
  - `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Guide image prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header

- `image map settings` - image map settings

  - `image map labels` - true/false whether to show image map labels
  - `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Milk in a hot drink prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header and option labels

- `orientation` - orientation of radio buttons (column/row)

### Milk on cereal prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header

- `image map settings` - image map settings

  - `image map labels` - true/false whether to show image map labels
  - `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Parent food portion prompt

Calculates portion size based on parent food portion size.

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header and option labels

- `orientation` - orientation of radio buttons (column/row)

### Pizza prompt

#### Options

- `badges` - true/false whether to show quantity badge on expansion panel header

- `image map settings` - image map settings

  - `image map labels` - true/false whether to show image map labels
  - `image map pinchZoom` - true/false whether to show PinchZoom control for mobile UI labels

### Portion size option prompt

### Standard portion prompt

## Custom prompts

Prompts with customizable generic behavior. Custom prompts can be used multiple times per scheme as long as they are identified with scheme-unique [`Prompt ID`](/admin/surveys/prompt-editor#general).

### Checkbox list prompt

Multi-select list of options.

#### Options

- `options` - locale-specific list of options with properties:

  - `label` (user-facing displayed value)
  - `value` (value stored in database) can be specified

- `other` - `true` or `false` whether to show 'other' option, free-form text input

### Date picker prompt

Prompt to collect date information.

- `futureDates` - allow future dates to be selected

### Info prompt

Informational prompt for acknowledging displayed information.

### No more information prompt

Terminal prompt for `food` or `meal` when no more information is required. It should be placed in `foods` and `postFoods` sections respectively.

### Radio list prompt

Single-select list of options.

- `options` - locale-specific list of options with properties:

  - `label` (user-facing displayed value)
  - `value` (value stored in database) can be specified

- `other` - `true` or `false` whether to show 'other' option, free-form text input

- `orientation` - orientation of radio buttons (`column` or `row`)

### Textarea prompt

Prompt to offer free-form text input.

### Time picker prompt

Prompt to collect time information.

- `allowedMinutes` - allowed minutes for selection (`1`, `5`, `10`, `15`, `20`, `30`)

- `format` - time format (`am/pm` or `24h`)

### Yes/no prompt

Prompt to collect `yes` / `no` (`true` / `false`) information presented as distinct buttons.
