# Admin Interface

## Schemes

A scheme is a specific set of questions and a single version of the food database that is used as the template for a survey. 

Schemes are intended to be configured by admin users. Custom questions can be defined at specific points in the recall flow, see custom recall section below.

A scheme requires a locale to denote which food list it will use, and the language(s) of the recall.

There are two types of scheme: 
* `legacy` - these are for legacy versions of I24, and it is not used in this version
* `data-driven` - this is the main type for schemes. This will use the custom recall questions.

### Custom Recall Questions
| Name          | Description | 
| ------------- |-------------| 
| Pre-meal      |             | 
| Post-meal     |             | 
| Submission    | before submission | 
| Pre-foods     |             | 
| Foods         | (during food selection) | 
| Post-foods    |             | 


## Locales
A locale is a specific language (e.g. English, Arabic), paired to a specific food list. 

::: tip
Missing foods are added to the locale, rather than scheme.
:::
## Surveys

Surveys are an instance of a scheme, with users attached. These users can be participants who will compelete the survey, or they can be an administrators who will work on this survey. 

### Start and End dates
These control when the recall is accessible (users navigating to the link before or after these dates will see **????**)

## Generation of Users
* `allow user generation` allows users to generate their own username and password. This feature is primarily used for the demo site of Intake24. 
::: tip
Most surveys will not allow user generation
:::

