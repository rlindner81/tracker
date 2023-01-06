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
  for (const [unit, limit] of Object.entries(TIME_UNIT_LIMITS)) {
    if (Math.abs(elapsed) > limit || unit === TIME_UNITS.SECOND) {
      const diff = Math.round(elapsed / limit);
      return {
        unit,
        diff,
        relativeDateTime: new Intl.RelativeTimeFormat("en", {
          numeric: "auto",
        }).format(diff, <Intl.RelativeTimeFormatUnit>unit),
      };
    }
  }
};

const _leadingZero2 = (value: number) => {
  return ("0" + value).slice(-2);
};

const _parseISOString = (dbDate: string): Date => {
  const [year, month, day, hour, minutes, seconds, milliseconds] =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/
      .exec(dbDate)
      .slice(1)
      .map((a) => parseInt(a));
  return new Date(Date.UTC(year, month - 1, day, hour, minutes, seconds, milliseconds));
};

export const readableDateTime = (dbDate: string): string => {
  if (!dbDate) return "";
  const value = _parseISOString(dbDate);
  const day = _leadingZero2(value.getDate());
  const month = _leadingZero2(value.getMonth() + 1);
  const year = value.getFullYear();
  const hour = _leadingZero2(value.getHours());
  const minute = _leadingZero2(value.getMinutes());
  return `${day}.${month}.${year} ${hour}:${minute}`;
};

export const readableShortDateTime = (dbDate: string): string => {
  if (!dbDate) return "";
  const value = _parseISOString(dbDate);
  const day = _leadingZero2(value.getDate());
  const month = _leadingZero2(value.getMonth() + 1);
  const year = value.getFullYear();
  return `${day}.${month}.${year}`;
};

export const readableRelativeDateTime = (dbDate: string): string => {
  if (!dbDate) return "";
  const value = _parseISOString(dbDate);
  const now = new Date();
  const relativeMillis = value.getTime() - now.getTime();
  if (-NOW_TOLERANCE <= relativeMillis && relativeMillis <= NOW_TOLERANCE) {
    return "now";
  } else {
    const { unit, diff, relativeDateTime } = _getRelativeDateTime(value, now);
    return unit === TIME_UNITS.YEAR || (unit === TIME_UNITS.MONTH && Math.abs(diff) >= 2)
      ? readableShortDateTime(dbDate)
      : relativeDateTime;
  }
};
