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
