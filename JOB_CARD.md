# Job card
- **What it does**: Tidy a messy vocabulary
- **Input** : { "text": "string, 1-2000 characters" }
- **Output** : { "text" : "string, with tide vocabulary ex. *SWE* becomes *Software Engineer*}
- **It must never**: changes any normal vocabulary to another strange word, or delete any text.
- **When unsure it should**: return the text but the low confidence word but beside it the low confidence guess between square parentheses '[]'