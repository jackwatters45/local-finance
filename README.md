# Finance Notebook

## TODO

- recurring logic (actually creating the new items)
  - cron job - look through all dates and create new items but need a way to track which one come from the same parent transaction ie scheduleId
    - well not a cron job - just on boot i guess or figure out an event

- add type - bill | transaction?

- Budgets
  - IOUs + Expected
  - How to do goal tracking

- Notes page -> markdown editor

---

- misc
  
  - Nav -> hamburger or icons
  - style all shadcn ui
  - color scheme - dark mode similar to obsidian / lax talk (lighter dark mode)
  - muted text color for nav + footer + placeholders + etc

---

- net worth - currently wrong ...

  - add order field that counts order created - 1, 2, 3, etc

Table

- initial load - start by loading enough to show the first page -> load more
- virtualized list
- scrolling
- bulk table select + delete
- add more table options
- add lines between columns??
- style table better
- sort
- navigate by using up and down arrows on the keyboard

- test
  - add a few thousand transactions
  - figure out a better data structure?

- Publish

  - logo
  - better name
  - footer pages -> just text etc - not docs or anything
  - add a contact thing for recs or whatever
  - build
  - create home page
  - make downloadable
  - add to portfolio + yats
  - Blog post
  - Readme

## Roadmap

- allow different currencies (really just about , vs .)
- improve nav / potentially title bar
- allow users to edit from the table
  - input concurency becomes a problem
- switch to vite + react compiler + react query (no reason to use next rn)
- ai integration - categories etc
- export + import data
- Create new fields
