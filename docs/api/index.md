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
enum TrackType {
  PERSONAL = "PERSONAL",
  GROUP = "GROUP",
  OPEN = "OPEN",
}

enum TrackFieldInputControl {
  SELECT = "SELECT",
  SLIDER = "SLIDER",
  TEXT_FIELD = "TEXT_FIELD",
  DATETIME_PICKER = "DATETIME_PICKER",
}

enum TrackFieldValueType {
  STRING = "STRING",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  TIMESTAMP = "TIMESTAMP",
}

interface TrackFieldBase {
  position: number; // TODO why is this not implicit through array ordering?
  key: string;
  name: string;
}

interface TrackFieldSelectOption {
  name: string;
  value: string;
}

interface TrackFieldSelect extends TrackFieldBase {
  input: TrackFieldInputControl.SELECT;
  type:
    | TrackFieldValueType.STRING
    | TrackFieldValueType.INTEGER
    | TrackFieldValueType.FLOAT;
  options: Array<TrackFieldSelectOption>;
}

interface TrackFieldSlider extends TrackFieldBase {
  input: TrackFieldInputControl.SLIDER;
  type: TrackFieldValueType.INTEGER | TrackFieldValueType.FLOAT;
  min: number;
  max: number;
  step: number;
}

interface TrackFieldText extends TrackFieldBase {
  input: TrackFieldInputControl.TEXT_FIELD;
  type:
    | TrackFieldValueType.STRING
    | TrackFieldValueType.INTEGER
    | TrackFieldValueType.FLOAT;
}

interface TrackFieldDateTime extends TrackFieldBase {
  input: TrackFieldInputControl.DATETIME_PICKER;
  type: TrackFieldValueType.TIMESTAMP;
}

type TrackField =
  | TrackFieldSelect
  | TrackFieldSlider
  | TrackFieldText
  | TrackFieldDateTime;

interface TrackBase {
  _created_at: string; // TODO: reference to UserEntity?
  _created_by: string; // TODO: reference to session user or user entity?
  _updated_at: string; // TODO: reference to UserEntity?
  _updated_by: string; // TODO: reference to session user or user entity?
  step_count: number;
  name: string;
  fields: Array<TrackField>;
}

interface TrackPersonal extends TrackBase {
  type: TrackType.PERSONAL;
}

interface TrackGroup extends TrackBase {
  type: TrackType.GROUP;
  members: Array<string>; // TODO: references to users
}

interface TrackOpen extends TrackBase {
  type: TrackType.OPEN;
}

type TrackEntity = TrackPersonal | TrackGroup | TrackOpen;

export default TrackEntity;
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

### Typescript interface

```typescript
interface StepEntity {
  _created_at: string; // TODO: reference to UserEntity?
  _created_by: string; // TODO: reference to session user or user entity?
  _updated_at: string; // TODO: reference to UserEntity?
  _updated_by: string; // TODO: reference to session user or user entity?
  track_id: string;
  posted_at: string;
  posted_by: string;
  values: Map<string, string | number>;
}

export default StepEntity;
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
