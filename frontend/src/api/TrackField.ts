enum FieldInputControl {
  SELECT = "SELECT",
  SLIDER = "SLIDER",
  TEXT = "TEXT",
  DATETIME = "DATETIME",
}

enum FieldValueType {
  STRING = "STRING",
  INTEGER = "INTEGER",
  FLOAT = "FLOAT",
  TIMESTAMP = "TIMESTAMP",
}

interface TrackEntityFieldBase {
  position: number;
  key: string;
  name: string;
}

interface TrackEntityFieldSelectParameter {
  name: string;
  value: string;
}

interface TrackEntityFieldSelect extends TrackEntityFieldBase {
  input: FieldInputControl.SELECT;
  parameters: Array<TrackEntityFieldSelectParameter>;
  type: FieldValueType.STRING | FieldValueType.INTEGER | FieldValueType.FLOAT;
}

interface TrackEntityFieldSliderParameter {
  min: number;
  max: number;
  step: number;
}

interface TrackEntityFieldSlider extends TrackEntityFieldBase {
  input: FieldInputControl.SLIDER;
  parameters: Array<TrackEntityFieldSliderParameter>;
  type: FieldValueType.INTEGER | FieldValueType.FLOAT;
}

interface TrackEntityFieldText extends TrackEntityFieldBase {
  input: FieldInputControl.TEXT;
  type: FieldValueType.STRING | FieldValueType.INTEGER | FieldValueType.FLOAT;
}

interface TrackEntityFieldTimestamp extends TrackEntityFieldBase {
  input: FieldInputControl.DATETIME;
  type: FieldValueType.TIMESTAMP;
}

type TrackEntityField =
  | TrackEntityFieldSelect
  | TrackEntityFieldSlider
  | TrackEntityFieldText
  | TrackEntityFieldTimestamp;

export default interface TrackEntity {
  name: string;
  fields: Array<TrackEntityField>;
}
