import { Prisma } from 'prisma/generated/client';
import {
  StringFilter,
  IntRangeFilter,
  FloatRangeFilter,
} from '../rehab-filters.input';

export function buildStringFilter(filter: StringFilter): Prisma.StringFilter {
  const result: Prisma.StringFilter = {};

  if (filter.equals) {
    result.equals = filter.equals;
  }

  if (filter.in?.length) {
    result.in = filter.in;
  }

  if (filter.contains) {
    result.contains = filter.contains;
    if (filter.insensitive) {
      result.mode = 'insensitive';
    }
  }

  if (filter.startsWith) {
    result.startsWith = filter.startsWith;
    if (filter.insensitive) {
      result.mode = 'insensitive';
    }
  }

  if (filter.endsWith) {
    result.endsWith = filter.endsWith;
    if (filter.insensitive) {
      result.mode = 'insensitive';
    }
  }

  return result;
}

export function buildIntRangeFilter(filter: IntRangeFilter): Prisma.IntFilter {
  const result: Prisma.IntFilter = {};

  if (filter.min !== undefined) {
    result.gte = filter.min;
  }

  if (filter.max !== undefined) {
    result.lte = filter.max;
  }

  return result;
}

export function buildFloatRangeFilter(
  filter: FloatRangeFilter,
): Prisma.FloatNullableFilter {
  const result: Prisma.FloatNullableFilter = {};

  if (filter.min !== undefined) {
    result.gte = filter.min;
  }

  if (filter.max !== undefined) {
    result.lte = filter.max;
  }

  return result;
}
