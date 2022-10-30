---
layout: default
title: API
nav_order: 2
---

<!-- prettier-ignore-start -->
# Usage
{: .no_toc }
<!-- prettier-ignore-end -->

<!-- prettier-ignore -->
- TOC
{: toc}

## API

### User Entity

```
{
}
```

### Track Entity

<!--
| `GET /api/track` | Read all tracks (implicitly restricted to user-visible) |
| `GET /api/track?limit=10&offset=0` | Paging for read all tracks |
| `POST /api/track` | Create new track |
| `PATCH /api/track/:trackId` | Update track |
| `DELETE /api/track/:trackId` | Delete track |
-->

```
{
  "name": "Willpower",
  "fields": [
    {
      "position": 0,
      "key": "motivation",
      "name": "Motivation",
      "input": "FIELD",
      "type": "TEXT",
      "generator": {
        "identifier": "STATIC",
        "parameters": {
          "value": "Make a difference today"
        }
      }
    },
    {
      "position": 1,
      "key": "mood",
      "name": "Mood",
      "type": "INTEGER",
      "input": {
        "identifier": "SELECT",
        "parameters": {
          "selected": "1",
          "values": [
            {
              "name": "Good",
              "value": 1
            },
            {
              "name": "Postive",
              "value": 2
            },
            {
              "name": "Bored",
              "value": -1
            },
            {
              "name": "Bad",
              "value": -2
            }
          ]
        }
      },
      "generator": {
        "identifier": "STATIC",
        "parameters": {
          "value": 1
        }
      }
    },
    {
      "position": 2,
      "key": "createdAt",
      "name": "Created At",
      "type": "TIME",
      "generator": "TIME_NOW"
    },
    {
      "position": 3,
      "key": "gap",
      "name": "Gap",
      "type": "TEXT",
      "generator": "TIME_RELATIVE_PREVIOUS"
    }
  ]
}
```

### Step Entity

```
{
}
```

## Types

### Track Settings Type

This type is on the User entity and governs which settings are available during track creation.

| `BASIC` | Only basic settings |
| `FULL` | All production settings |
| `EXPERIMENTAL` | All production and experimental settings |

### Field Input Type

This defines the input interface for each step entry.

| `TEXT` | Text field |
| `SELECT` | Drop-down selection of predetermined values |
| `SLIDER` | A slider in a predetermined number range |
| `TIMESTAMP` | Datetime picker |

### Field Value Type

Field value conversion happens when a new step is saved.

| `INPUT` | Leave value as is |
| `TEXT` | Convert to string with `String` |
| `INTEGER` | Convert to integer number with `parseInt` |
| `FLOAT` | Convert to double precision floating point number with `parseFloat` |
| `TIMESTAMP` | Convert to ISO-timestamp string with `Date.toISOString()` |

### Report Aggregation Type

| `COUNT` |
| `MIN` |
| `MAX` |
| `AVERAGE` |
| `SUM` |

### Report Interval Type

| `YEAR` |
| `MONTH` |
| `WEEK` |
| `DAY` |
| `HOUR` |
| `MINUTE` |
| `SECOND` |

<!--
### [TODO] Field Display Type

This defines the way the field information is displayed to the user.
For example if we know a field to be currency, we could add a suffix here so that instead of just the number they see `123,00€`.

- `CURRENCY?`
-->
