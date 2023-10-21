interface StepValue {
  key: string;
  value: string | number;
}

interface StepEntity {
  id: string; // TODO: there is no uuid type???
  created_at: string; // TODO: reference to UserEntity?
  created_by: string; // TODO: reference to session user or user entity?
  updated_at: string; // TODO: reference to UserEntity?
  updated_by: string; // TODO: reference to session user or user entity?
  track_id: string;
  posted_at: string;
  posted_by: string;
  values: Array<StepValue>; // implicitly matches order of track fields, this way key is not really needed
}

export type { StepEntity as default };
