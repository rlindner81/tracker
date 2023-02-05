// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { readBackup, writeBackup } from "./firebase.mjs";
import { validateTrack, validateStep } from "./validation/index.mjs";

const TRANSFORM_COLLECTIONS = {
  "old-tracks.json": {
    newFilename: "tracks.json",
    transform: async (track) => {
      const result = {
        _created_at: track.createdAt,
        _created_by: track.userId,
        _updated_at: track.updatedAt,
        _updated_by: track.userId,
        members: [track.userId],
        step_count: 0,
        name: track.name,
        fields: track.fields.map((field) => ({
          key: field.key,
          name: field.name,
          type:
            field.type === "TIME" && field.input.identifier === "FIELD"
              ? "STRING"
              : field.type === "TEXT"
              ? "STRING"
              : field.type,
          ...(field.input.identifier === "FIELD" && {
            input: "TEXT_FIELD",
          }),
          ...(field.input.identifier === "SELECT" && {
            input: "SELECT",
            choices: field.input.parameters.values.map(({ name, value }) => ({
              name: name || "",
              value,
            })),
            default_choice: field.input.parameters.values.findIndex(
              ({ value }) => value === field.input.parameters.selected
            ),
          }),
          ...(field.input.identifier === "SLIDER" && {
            input: "SLIDER",
            min: Number(field.input.parameters.min),
            max: Number(field.input.parameters.max),
            step: Number(field.input.parameters.step),
          }),
        })),
      };
      try {
        await validateTrack(result);
      } catch (err) {
        debugger;
      }
      return result;
    },
  },
  "old-steps.json": {
    newFilename: "steps.json",
    transform: async (step) => {
      const result = {
        _created_at: step.createdAt,
        _created_by: step.userId,
        _updated_at: step.updatedAt,
        _updated_by: step.userId,
        track_id: step.trackId,
        posted_at: step.createdAt,
        posted_by: step.userId,
        values: Object.entries(step.values).reduce((result, [key, value]) => {
          if (value !== null && value !== undefined) {
            result[key] = value;
          }
          return result;
        }, {}),
      };
      try {
        await validateStep(result);
      } catch (err) {
        debugger;
      }
      return result;
    },
  },
};

const main = async () => {
  for (const [oldFilename, { newFilename, transform }] of Object.entries(
    TRANSFORM_COLLECTIONS
  )) {
    const oldData = await readBackup(oldFilename);
    const newData = await Object.entries(oldData).reduce(
      async (resultPromise, [key, value]) => {
        const result = await resultPromise;
        result[key] = await transform(value);
        return result;
      },
      Promise.resolve({})
    );
    await writeBackup(newFilename, newData);
  }
};

main();
