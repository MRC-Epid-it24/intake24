# Intake24

> Intake24 dietary recall system documentation engine

## How to use
Documentation is written in [markdown-it](https://markdown-it.github.io/), with some special extensions added for Vuepress ([link](https://vuepress.vuejs.org/guide/markdown.html)). 

There are 5 directories containing documentation for the relevant part of the Intake24.

### Development

A development server can be run:
```bash
npm install
npm run dev
```

### Directory Structure
Each of these directories contain the documentation for the relevant system area
-- overview
-- survey
-- admin
-- api
-- data-dictionary

Each of these contains a README.md as the root page for that section. 

### Adding new pages
1. New pages can be added in the same folder (as .md files). They will automatically be searchable.
2. To appear in the sidebar, they need to be added to the `children` array of the relevant page section, in `.vuepress/config.js` 
3. All headings (down to h2) will appear in the sidebar. 
4. [Optional] To create a sidebar _only_ for that page, add the following YAML to the top of the .md file. You do not need to edit `.vuepress/config.js` if you'd like to do this.
```
---
sidebar: auto
---
```

**Example**
E.g. to add a new 'mynewpage.md' to the sidebar of API documentation, open `.vuepress/config.js` and edit: 
```
'/api/': [
  {
    title: 'API',
    ...
    ...
    children: [
      '',
      'endpoints',
      'authentication',
      'mynewpage'
    ]
  }
]
```

### Images and assets
Can be placed in the `assets` folder, and linked to as normal using relative path.

For more details, please head VuePress's [documentation](https://v1.vuepress.vuejs.org/).

