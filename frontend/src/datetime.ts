const NOW_TOLERANCE = 1000;
const TIME_UNITS = Object.freeze({
  YEAR: "year",
  MONTH: "month",
  DAY: "day",
  HOUR: "hour",
  MINUTE: "minute",
  SECOND: "second",
});

const TIME_UNIT_LIMITS = {
  [TIME_UNITS.YEAR]: 24 * 60 * 60 * 1000 * 365,
  [TIME_UNITS.MONTH]: (24 * 60 * 60 * 1000 * 365) / 12,
  [TIME_UNITS.DAY]: 24 * 60 * 60 * 1000,
  [TIME_UNITS.HOUR]: 60 * 60 * 1000,
  [TIME_UNITS.MINUTE]: 60 * 1000,
  [TIME_UNITS.SECOND]: 1000,
};

const _getRelativeDateTime = (d1, d2) => {
  const elapsed = d1 - d2;
  let unit, limit, diff;
  for (const unitLimitPair of Object.entries(TIME_UNIT_LIMITS)) {
    [unit, limit] = unitLimitPair;
    if (Math.abs(elapsed) >= limit || unit === TIME_UNITS.SECOND) {
      diff = Math.trunc(elapsed / limit);
      break;
    }
  }
  return {
    unit,
    diff,
    relativeDateTime: new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    }).format(diff, <Intl.RelativeTimeFormatUnit>unit),
  };
};

const _leadingZero2 = (value: number) => {
  return ("0" + value).slice(-2);
};

export const readableDateTime = (value: Date): string => {
  if (!value) return "";
  const day = _leadingZero2(value.getDate());
  const month = _leadingZero2(value.getMonth() + 1);
  const year = value.getFullYear();
  const hour = _leadingZero2(value.getHours());
  const minute = _leadingZero2(value.getMinutes());
  return `${day}.${month}.${year} ${hour}:${minute}`;
};

export const readableShortDateTime = (value: Date): string => {
  if (!value) return "";
  const day = _leadingZero2(value.getDate());
  const month = _leadingZero2(value.getMonth() + 1);
  const year = value.getFullYear();
  return `${day}.${month}.${year}`;
};

export const readableRelativeDateTime = (value: Date, now: Date = new Date()): string => {
  if (!value) return "";
  const relativeMillis = value.getTime() - now.getTime();
  if (-NOW_TOLERANCE <= relativeMillis && relativeMillis <= NOW_TOLERANCE) {
    return "now";
  } else {
    const { unit, diff, relativeDateTime } = _getRelativeDateTime(value, now) ?? {};
    return unit === TIME_UNITS.YEAR || (unit === TIME_UNITS.MONTH && Math.abs(diff) >= 2)
      ? readableShortDateTime(value)
      : relativeDateTime;
  }
};

let editableTimeRe = /(\d\d).(\d\d).(\d\d\d\d) | (\d\d):(\d\d)/;

export const dateToEditableTime = (value: Date): string => {
  if (!value) {
    return "";
  }
  const day = _leadingZero2(value.getDate());
  const month = _leadingZero2(value.getMonth() + 1);
  const year = value.getFullYear();
  const hour = _leadingZero2(value.getHours());
  const minute = _leadingZero2(value.getMinutes());
  return `${day}.${month}.${year} ${hour}:${minute}`;
};

export const editableTimeToDate = (value: string): Date => {
  if (!value) {
    return new Date();
  }
  const [match, dayIn, monthIn, yearIn, hourIn, minuteIn] = editableTimeRe.exec(value) ?? [];
  return match
    ? new Date(parseInt(yearIn), parseInt(monthIn) - 1, parseInt(dayIn), parseInt(hourIn), parseInt(minuteIn))
    : new Date();
};

export const isoTimestampToEditableTime = (value: string): string => dateToEditableTime(new Date(value));

export const editableTimeToIsoTimestamp = (value: string): string => editableTimeToDate(value).toISOString();

export const isEditableTime = (value: string): boolean => (value ? editableTimeRe.test(value) : value === "");
