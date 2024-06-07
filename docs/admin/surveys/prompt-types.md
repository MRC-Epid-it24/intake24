---
{ "outline": { "level": [2, 3] } }
---

# Prompt types

Prompts / Prompts are divided into three groups:

- [standard](#standard-prompts) - Standard prompts
- [portion-size](#portion-size-prompts) - Portion-size estimation prompts
- [custom](#custom-prompts) - Custom / generic prompts

## Standard prompts

Prompts with standardized behavior tied to specific functionality. Usually only one can be used per scheme and functionality is often tied to specific scheme section.

### Associated foods prompt

- `multiple` - allow multiple foods to be selected

#### Food browser settings

- **Show categories first**
  - `food browse list` - Show categories first in the browse list
  - `food search list` - Show categories first in the search list

### Edit meal prompt

Edit meal prompt allows initial entry of food and drink before portion-size estimation.

#### Options

- `separateDrinks` - show drinks separately

### Final prompt

Terminal prompt that is shown at the end of the recall. It offers home button It can offer feedback is applicable (feedback enabled and submission threshold reached).

- `rating` - 5-star rating with optional comment to be submitted after the recall

### Food search prompt

#### Food browser settings

- **Show categories first**
  - `food browse list` - Show categories first in the browse list
  - `food search list` - Show categories first in the search list

### Meal add prompt

Prompt to add new meals. Multi-select list of options predefined in the scheme meal list.

#### Options

- `custom` - allow adding custom meal names

### Meal duration prompt

Prompt to collect meal duration in minutes.

:::tip
Prompt uses slider component as [slider-prompt](/admin/surveys/prompt-types#slider-prompt), but it is more constrained, keep in mind that:

- meal duration is always in minutes
- labels should reflect the minutes unit

:::

#### Slider options

- `current` - current duration in minutes
  - `label` - label to be displayed
  - `value` - current value
  - `size` - droplet size (in `px`) of the label
- `min` - minimum duration in minutes
  - `label` - label to be displayed at the start of the slider (min value) (use `{value}` to insert variable value into the label)
  - `value` - minimum value
- `max` - maximum duration in minutes
  - `label` - label to be displayed at the end of the slider (max value) (use `{value}` to insert variable value into the label)
  - `value` - maximum value
- `step` - step size in minutes

### Meal time prompt

Prompt to collect meal time information using standard time picker.

#### Options

- `allowedMinutes` - allowed minutes for selection (`1`, `5`, `10`, `15`, `20`, `30`)

- `format` - time format (`am/pm` or `24h`)

### Ready meal prompt

Prompt to collect ready meal information. Multi-select list of options, for each food within the meal that has `ready-meal` attribute set to `true`.

### Recipe builder prompt

#### Food browser settings

- **Show categories first**
  - `food browse list` - Show categories first in the browse list
  - `food search list` - Show categories first in the search list

### Redirect prompt

Prompt to redirect user to external site with optional user identifier embedded into URL.

#### Options

- `rating` - 5-star rating with optional comment to be submitted after the recall

- `url` - URL to redirect to

  - use `{identifier}` variable as a placeholder where the user identifier should be to inserted.
  - example: `https://example.com/?arg={identifier}`

- `identifier` - identifier that should be embedded into the URL.

  - `userId` - internal intake24 user id
  - `username` - survey-unique respondent username
  - `urlAuthToken` - URL authentication token
  - `custom` - custom identifier that can be set through `userCustomField`.
    - Enter a `name` of the custom field to be looked up the `value`.

- `target` - target window for redirection

  - `_blank` - open in a new window
  - `_self` - open in the same window

- `timer` - optional timer in seconds when automatic redirection should occur
  - disabled if set to `0`

### Review confirm prompt

### Same as before prompt

Prompt to detect foods that are the same as in the previous recalls / meals and offer to use the same portion-size estimation.

### Split food prompt

Prompt to identify foods that can potentially be split into separate foods.

### Submit prompt

Prompt with recap of the recall and submit button.

#### Options

- `review` - defines rules (per layout, `desktop | mobile`) how review step is enforced before submission
  - `false` - no review step, submit button is always enabled
  - `scroll` - button is enabled when scrolled through the meal list to the end
  - `checkbox` - button is enabled when all meal checkboxes are ticked
  - `onecheckbox` - button is enabled when one survey level checkbox is ticked

## Portion-size prompts

Prompts for food portion-size estimation. Only one can be used per scheme and functionality is tied `foods` scheme section.

### As-served prompt

#### Options

- `badges` - show quantity badge on expansion panel header

- `leftovers` - show leftovers option

### Cereal prompt

#### Options

- `badges` - show quantity badge on expansion panel header

- `leftovers` - show leftovers option

- `image map settings` - image map settings

  - `image map labels` - show image map labels
  - `image map pinchZoom` - show PinchZoom control for mobile UI labels

### Direct weight prompt

### Drink scale prompt

#### Options

- `badges` - show quantity badge on expansion panel header

- `leftovers` - show leftovers option

- `image map settings` - image map settings

  - `image map labels` - show image map labels
  - `image map pinchZoom` - show PinchZoom control for mobile UI labels

- `multiple` - allow multiple item to be selected. When enabled, additional slider options are available:

#### Slider options

- `current` - current value settings
  - `label` - label to be displayed
  - `value` - current value
  - `size` - droplet size (in `px`) of the label
- `min` - minimum value settings
  - `label` - label to be displayed at the start of the slider (min value) (use `{value}` to insert variable value into the label)
  - `value` - minimum value
- `max` - maximum value settings
  - `label` - label to be displayed at the end of the slider (max value) (use `{value}` to insert variable value into the label)
  - `value` - maximum value

:::tip
Prompt uses slider component as [slider-prompt](/admin/surveys/prompt-types#slider-prompt), but it is more constrained, keep in mind that:

- slider has decrement/increment buttons, so `min` and `max` labels won't be displayed
- consider settings in context of `multiple` option that prompt is collecting - number if items related to selected food

:::

### Guide image prompt

#### Options

- `badges` - show quantity badge on expansion panel header

- `image map settings` - image map settings

  - `image map labels` - show image map labels
  - `image map pinchZoom` - show PinchZoom control for mobile UI labels

- `linked quantity settings`
  - Allows to trigger quantity selection prompt for linked parent food
  - `Automatically apply linked quantity` - skips prompt panel with quantity selection
  - `Source categories to trigger` - child food's categories it should trigger on
  - `Parent categories to link` - parent food's categories it should trigger on
    - Optional standard unit can be assigned to set the `how-many` label

### Milk in a hot drink prompt

#### Options

- `badges` - show quantity badge on expansion panel header and option labels

- `orientation` - orientation of radio buttons (column/row)

### Milk on cereal prompt

#### Options

- `badges` - show quantity badge on expansion panel header

- `image map settings` - image map settings

  - `image map labels` - show image map labels
  - `image map pinchZoom` - show PinchZoom control for mobile UI labels

### Parent food portion prompt

Calculates portion size based on parent food portion size.

#### Options

- `badges` - show quantity badge on expansion panel header and option labels

- `orientation` - orientation of radio buttons (column/row)

### Pizza prompt

First iteration for pizza estimation

#### Options

- `badges` - show quantity badge on expansion panel header

- `image map settings` - image map settings

  - `image map labels` - show image map labels
  - `image map pinchZoom` - show PinchZoom control for mobile UI labels

### Pizza V2 prompt

Second iteration for pizza estimation

#### Options

- `image map settings` - image map settings

  - `image map labels` - show image map labels
  - `image map pinchZoom` - show PinchZoom control for mobile UI labels

### Portion size option prompt

Portion size option selection prompt

### Recipe builder prompt

Recipe builder prompt for foods with multiple ingredients, such as sandwiches, salads etc. Recipe foods can be defined in [locales recipe-foods](/admin/localization/locales#recipe-foods).

### Standard portion prompt

## Custom prompts

Prompts with customizable generic behavior. Custom prompts can be used multiple times per scheme as long as they are identified with scheme-unique [`Prompt ID`](/admin/surveys/prompt-editor#general).

### Checkbox list prompt

Multi-select list of options.

#### Options

- `options` - locale-specific list of options with properties:

  - `label` - (user-facing displayed value)
  - `value` - (value stored in database) can be specified
  - `exclusive` - exclusive flag - if selected, other options are deselected

- `other` - `true` or `false` whether to show 'other' option, free-form text input
- `min` - Minimum number of answers
- `max` - Maximum number of answers

### Date picker prompt

Prompt to collect date information.

- `futureDates` - allow future dates to be selected

### Info prompt

Informational prompt for acknowledging displayed information.

### No more information prompt

Terminal prompt for `food` or `meal` when no more information is required. It should be placed in `foods` and `postFoods` sections respectively.

### Select prompt

Prompt to collect single or multiple option(s) from a list of options using select box.

#### Options

- `multiple` - `true` or `false` whether to allow multiple options to be selected

- `options` - locale-specific list of options with properties:

  - `label` (user-facing displayed value)
  - `value` (value stored in database) can be specified

### Slider prompt

Prompt to collect numeric information using slider.

#### Slider options

- `current` - current value settings
  - `label` - label to be displayed
  - `value` - current value
  - `size` - droplet size (in `px`) of the label
- `min` - minimum value settings
  - `label` - label to be displayed at the start of the slider (min value) (use `{value}` to insert variable value into the label)
  - `value` - minimum value
- `max` - maximum value settings
  - `label` - label to be displayed at the end of the slider (max value) (use `{value}` to insert variable value into the label)
  - `value` - maximum value
- `step` - step size

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
