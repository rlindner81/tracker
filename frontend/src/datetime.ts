const TIME_UNITS = [
  {
    singular: "ms",
    limit: 1000,
  },
  {
    singular: "sec",
    limit: 60,
  },
  {
    singular: "min",
    limit: 60,
  },
  {
    singular: "hour",
    plural: "hours",
    limit: 24,
  },
  {
    singular: "day",
    plural: "days",
    limit: 7,
  },
  {
    singular: "week",
    plural: "weeks",
    limit: 52,
  },
  {
    singular: "year",
    plural: "years",
    limit: Number.POSITIVE_INFINITY,
  },
];

const _leadingZero2 = (value: number) => {
  return ("0" + value).slice(-2);
};

const _relativeDateValue = (value: number) => String(Math.ceil(value));

const _timeDiff = (timeDiff: number) => {
  for (const { singular, plural, limit } of TIME_UNITS) {
    if (limit <= timeDiff) {
      timeDiff = timeDiff / limit;
    } else {
      return {
        value: timeDiff,
        unit: timeDiff === 1 ? singular : plural || singular,
      };
    }
  }
  return { value: 0, unit: "" };
};

const _parseISOString = (dbDate: string): Date => {
  const [year, month, day, hour, minutes, seconds, milliseconds] =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/
      .exec(dbDate)
      .slice(1)
      .map((a) => parseInt(a));
  return new Date(
    Date.UTC(year, month - 1, day, hour, minutes, seconds, milliseconds)
  );
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
  const relativeMillis = value.getTime() - Date.now();
  if (500 < relativeMillis) {
    const { value: diffValue, unit } = _timeDiff(relativeMillis);
    return `in ${_relativeDateValue(diffValue)} ${unit}`;
  } else if (-500 <= relativeMillis) {
    return "now";
  } else {
    const { value: diffValue, unit } = _timeDiff(-relativeMillis);
    return `${_relativeDateValue(diffValue)} ${unit} ago`;
  }
};
