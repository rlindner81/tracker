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
    singular: "hour",
    plural: "hours",
    limit: 60,
  },
  {
    singular: "day",
    plural: "days",
    limit: Number.POSITIVE_INFINITY,
  },
]

const _leadingZero2 = (value: number) => {
  return ("0" + value).slice(-2)
}

const _fraction1 = (value: number) => {
  return value % 1 !== 0 ? value.toFixed(1) : String(value)
}

const _timeDiff = (timeDiff: number) => {
  for (const { singular, plural, limit } of TIME_UNITS) {
    if (limit <= timeDiff) {
      timeDiff = timeDiff / limit;
    } else {
      return {
        value: timeDiff,
        unit: timeDiff === 1 ? singular : plural || singular
      }
    }
  }
  return { value: 0, unit: "" };
}

export const readableDateTime = (value: Date): string => {
  if (!value) return "";
  const day = _leadingZero2(value.getDay());
  const month = _leadingZero2(value.getMonth() + 1);
  const year = value.getFullYear();
  const hour = _leadingZero2(value.getHours());
  const minute = _leadingZero2(value.getMinutes());
  return `${day}.${month}.${year} ${hour}:${minute}`;
};

export const readableRelativeDateTime = (value: Date): string => {
  if (!value) return "";
  const relativeMillis = value.getDate() - Date.now();
  if (500 < relativeMillis) {
    const { value, unit } = _timeDiff(relativeMillis)
    return `in ${_fraction1(value)}${unit}`;
  } else if (-500 <= relativeMillis) {
    return "now"
  } else {
    const { value, unit } = _timeDiff(-relativeMillis)
    return `${_fraction1(value)}${unit} ago`;
  }
};
