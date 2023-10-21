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
  type: TrackFieldValueType.STRING | TrackFieldValueType.INTEGER | TrackFieldValueType.FLOAT;
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
  type: TrackFieldValueType.STRING | TrackFieldValueType.INTEGER | TrackFieldValueType.FLOAT;
}

interface TrackFieldDateTime extends TrackFieldBase {
  input: TrackFieldInputControl.DATETIME_PICKER;
  type: TrackFieldValueType.TIMESTAMP;
}

type TrackField = TrackFieldSelect | TrackFieldSlider | TrackFieldText | TrackFieldDateTime;

interface TrackBase {
  id: string; // TODO: there is no uuid type???
  created_at: string; // TODO: reference to UserEntity?
  created_by: string; // TODO: reference to session user or user entity?
  updated_at: string; // TODO: reference to UserEntity?
  updated_by: string; // TODO: reference to session user or user entity?
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

export type { TrackEntity as default };
