// https://firebase.google.com/docs/reference/admin
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.firestore
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth
import { readBackup, writeBackup } from "./firebase.mjs";
import { validateTrack, validateStep } from "./validation/index.mjs";

const TRANSFORM_COLLECTIONS = {
  "tracks.json": {
    newFilename: "new-tracks.json",
    transform: async (track) => {
      const result = {
        _created_at: track.createdAt,
        _created_by: track.userId,
        _updated_at: track.updatedAt,
        _updated_by: track.userId,
        type: "PERSONAL",
        owner_id: track.userId,
        step_count: 0,
        name: track.name,
        fields: track.fields.map((field) => ({
          key: field.key,
          name: field.name,
          type: field.type,
          ...(field.input.identifier === "FIELD" && {
            input: "TEXT_FIELD",
          }),
          ...(field.input.identifier === "SELECT" && {
            input: "SELECT",
            options: field.input.parameters.values.map(({ name, value }) => ({
              name,
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
      await validateTrack(result);
      return result;
    },
  },
  "steps.json": { newFilename: "new-steps.json", transform: (step) => step },
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
