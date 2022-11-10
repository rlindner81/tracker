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

## User Entity

## Track Entity

### Typescript interface

```typescript
enum FieldInputControl {
  SELECT = "SELECT",
  SLIDER = "SLIDER",
  TEXT_FIELD = "TEXT_FIELD",
  DATETIME_PICKER = "DATETIME_PICKER",
}

enum FieldValueType {
  STRING = "STRING",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  TIMESTAMP = "TIMESTAMP",
}

interface TrackEntityFieldBase {
  position: number; // TODO why is this not implicit through array ordering?
  key: string;
  name: string;
}

interface TrackEntityFieldSelectOption {
  name: string;
  value: string;
}

interface TrackEntityFieldSelect extends TrackEntityFieldBase {
  input: FieldInputControl.SELECT;
  type: FieldValueType.STRING | FieldValueType.INTEGER | FieldValueType.FLOAT;
  options: Array<TrackEntityFieldSelectOption>;
}

interface TrackEntityFieldSlider extends TrackEntityFieldBase {
  input: FieldInputControl.SLIDER;
  type: FieldValueType.INTEGER | FieldValueType.FLOAT;
  min: number;
  max: number;
  step: number;
}

interface TrackEntityFieldText extends TrackEntityFieldBase {
  input: FieldInputControl.TEXT_FIELD;
  type: FieldValueType.STRING | FieldValueType.INTEGER | FieldValueType.FLOAT;
}

interface TrackEntityFieldDateTime extends TrackEntityFieldBase {
  input: FieldInputControl.DATETIME_PICKER;
  type: FieldValueType.TIMESTAMP;
}

type TrackEntityField =
  | TrackEntityFieldSelect
  | TrackEntityFieldSlider
  | TrackEntityFieldText
  | TrackEntityFieldDateTime;

export default interface TrackEntity {
  name: string;
  fields: Array<TrackEntityField>;
}
```

### Field Input Control Enum

This defines the input control for each step entry.

| `TEXT` | Text field |
| `SELECT` | Drop-down selection of predetermined values |
| `SLIDER` | A slider in a predetermined number range |
| `TIMESTAMP` | Datetime picker |

### Field Value Type Enum

Field value conversion happens when a new step is saved.

| `STRING` | Convert to string with `String` |
| `INTEGER` | Convert to integer number with `parseInt` |
| `FLOAT` | Convert to double precision floating point number with `parseFloat` |
| `TIMESTAMP` | Convert to ISO-timestamp string with `Date.toISOString()` |

### REST Interface

| `GET /api/track` | Read all tracks (implicitly restricted to user-visible) |
| `GET /api/track?limit=10&offset=0` | Paging for read all tracks |
| `POST /api/track` | Create new track |
| `PATCH /api/track/:trackId` | Update track |
| `DELETE /api/track/:trackId` | Delete track |

## Step Entity

```
{
}
```

## Legacy

### Track Setting Enum

This type is on the User entity and governs which settings are available during track creation.

| `BASIC` | Only basic settings |
| `FULL` | All production settings |
| `EXPERIMENTAL` | All production and experimental settings |

### Report Aggregation Type

| `COUNT` | `MIN` | `MAX` | `AVERAGE` | `SUM` |

### Report Interval Type

| `YEAR` | `MONTH` | `WEEK` | `DAY` |

| `HOUR` | `MINUTE` | `SECOND` |

<!--
### [TODO] Field Display Type

This defines the way the field information is displayed to the user.
For example if we know a field to be currency, we could add a suffix here so that instead of just the number they see `123,00€`.

- `CURRENCY?`
-->
