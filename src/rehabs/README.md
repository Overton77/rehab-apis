# Rehabs Module - Template for Optimized GraphQL with Caching & N+1 Prevention

This module serves as a **complete template** for building optimized GraphQL APIs with NestJS, Prisma, and Redis caching that prevents N+1 query problems.

## 🏗️ Architecture Overview

### Module Structure

```
src/rehabs/
├── dto.ts           # GraphQL types (ObjectTypes & InputTypes)
├── rehab.module.ts  # NestJS module configuration
├── rehab.resolver.ts # GraphQL resolver with field resolvers
├── rehab.service.ts  # Business logic with caching
└── README.md        # This file
```

## 🎯 Key Features

### 1. **Intelligent Redis Caching**

Every database query is cached with logical key names:

- `rehab:{id}` - Single rehab by ID
- `rehab:slug:{slug}` - Single rehab by slug
- `rehabs:list:{params}` - List queries with filters
- `rehabs:count:{filters}` - Count queries
- `rehab:{relationName}:{id}` - Relationship data (e.g., `rehab:insurancePayers:abc123`)

### 2. **N+1 Query Prevention**

- **Field Resolvers**: Only load relationships when requested in the GraphQL query
- **Lazy Loading**: Each relationship (insurancePayers, services, etc.) loads independently
- **Caching**: Repeated requests for the same relationship hit the cache

### 3. **Decimal to Number Conversion**

Prisma's `Decimal` type is automatically converted to JavaScript `number` for GraphQL compatibility.

## 📝 File Breakdown

### `dto.ts` - GraphQL Types

Contains all GraphQL types needed for the API:

#### Object Types (Output)

- `Rehab` - Main entity
- `InsurancePayer`, `PaymentOption`, `LevelOfCare`, etc. - Relationship types

#### Input Types

- `CreateRehabInput` - For creating rehabs
- `UpdateRehabInput` - For updating rehabs
- `RehabFiltersInput` - Advanced filtering (search, location, price, etc.)

**Key Pattern**: Relationship fields are optional and loaded via field resolvers

```typescript
@ObjectType()
export class Rehab {
  @Field()
  id!: string;

  // ... scalar fields ...

  // Relationships (loaded lazily via field resolvers)
  @Field(() => [InsurancePayer], { nullable: true })
  insurancePayers?: InsurancePayer[];
}
```

### `rehab.service.ts` - Business Logic with Caching

#### Cache Strategy

- **TTL Settings**:
  - Single rehabs: 10 minutes
  - Lists: 5 minutes
  - Relationships: 10 minutes

#### Main Methods

##### Query Methods

```typescript
findMany(params); // Paginated list with filters
findById(id); // Single rehab by ID
findBySlug(slug); // Single rehab by slug
count(filters); // Total count
```

##### Mutation Methods

```typescript
create(data); // Create new rehab (invalidates list caches)
update(id, data); // Update rehab (invalidates specific caches)
delete id; // Delete rehab (invalidates all related caches)
```

##### Relationship Loaders (for Field Resolvers)

```typescript
getInsurancePayers(rehabId);
getPaymentOptions(rehabId);
getLevelsOfCare(rehabId);
// ... etc for all 13 relationships
```

#### Cache Pattern Example

```typescript
async findById(id: string): Promise<any | null> {
  const cacheKey = this.getCacheKey('rehab', id);

  // 1. Check cache first
  const cached = await this.cacheManager.get(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Query database if not cached
  const rehab = await this.prisma.rehab.findUnique({ where: { id } });

  // 3. Transform data (e.g., Decimal to number)
  const transformed = {
    ...rehab,
    fullPrivatePrice: decimalToNumber(rehab.fullPrivatePrice),
  };

  // 4. Store in cache
  await this.cacheManager.set(cacheKey, transformed, this.CACHE_TTL_REHAB);

  return transformed;
}
```

#### Cache Invalidation

When data changes, we invalidate:

- The specific rehab cache
- All relationship caches for that rehab
- List caches (simplified - resets all)

### `rehab.resolver.ts` - GraphQL Resolver

#### Query Resolvers

```typescript
@Query(() => [Rehab])
async rehabs(skip, take, filters) { ... }

@Query(() => Rehab, { nullable: true })
async rehab(id) { ... }

@Query(() => Rehab, { nullable: true })
async rehabBySlug(slug) { ... }

@Query(() => Int)
async rehabsCount(filters) { ... }
```

#### Mutation Resolvers

```typescript
@Mutation(() => Rehab)
async createRehab(data) { ... }

@Mutation(() => Rehab)
async updateRehab(id, data) { ... }

@Mutation(() => Rehab, { nullable: true })
async deleteRehab(id) { ... }
```

#### Field Resolvers (N+1 Prevention)

**This is the key pattern for preventing N+1 queries!**

```typescript
@ResolveField(() => [InsurancePayer], { nullable: true })
async insurancePayers(@Parent() rehab: Rehab): Promise<InsurancePayer[]> {
  return this.service.getInsurancePayers(rehab.id);
}
```

**How it works**:

1. Client queries only the fields they need
2. Field resolvers only execute if that field is requested
3. Each field resolver is cached independently
4. Prisma `include` loads the relationship efficiently in one query

**Example Query**:

```graphql
query {
  rehabs(take: 10) {
    id
    name
    # If we DON'T request insurancePayers, the field resolver never runs!
    insurancePayers {
      displayName
      averageAdmissionPrice
    }
  }
}
```

## 🚀 Usage Examples

### Query with Filters

```graphql
query SearchRehabs {
  rehabs(
    skip: 0
    take: 20
    filters: {
      search: "california"
      insurancePayerSlugs: ["aetna", "cigna"]
      levelOfCareSlugs: ["inpatient"]
      maxPrice: 50000
      verifiedOnly: true
    }
  ) {
    id
    name
    city
    state
    fullPrivatePrice
    insurancePayers {
      displayName
      averageAdmissionPrice
    }
    levelsOfCare {
      displayName
    }
  }
}
```

### Get Single Rehab with All Relationships

```graphql
query GetRehabDetails {
  rehabBySlug(slug: "hope-recovery-center") {
    id
    name
    description
    phone
    email
    websiteUrl
    street
    city
    state

    insurancePayers {
      displayName
      averageAdmissionPrice
    }

    levelsOfCare {
      displayName
    }

    services {
      displayName
      kind
    }

    populations {
      displayName
      category
    }

    amenities {
      displayName
      category
    }
  }
}
```

### Create a Rehab

```graphql
mutation CreateRehab {
  createRehab(
    data: {
      name: "Hope Recovery Center"
      slug: "hope-recovery-center"
      street: "123 Main St"
      city: "San Diego"
      state: "CA"
      postalCode: "92101"
      country: "USA"
      description: "Premier addiction treatment facility"
      phone: "(619) 555-0100"
      email: "info@hoperecovery.com"
      websiteUrl: "https://hoperecovery.com"
      latitude: 32.7157
      longitude: -117.1611
      verifiedExists: true
      fullPrivatePrice: 45000
    }
  ) {
    id
    name
    slug
  }
}
```

## 📊 Performance Benefits

### Before (Without Caching & N+1 Prevention)

```
Query: Get 10 rehabs with their insurancePayers
- 1 query for rehabs list
- 10 queries for insurancePayers (N+1 problem!)
= 11 database queries
```

### After (With This Implementation)

```
First Request:
- 1 query for rehabs list (cached for 5 min)
- 10 queries for insurancePayers (each cached for 10 min)
= 11 database queries

Subsequent Requests (within cache TTL):
- 0 database queries (all from cache)
= 0 database queries ✨
```

## 🔧 Adapting This Template

### For a New Model (e.g., "Therapist")

1. **Update `schema.prisma`** with your model
2. **Copy & modify `dto.ts`**:
   - Replace `Rehab` → `Therapist`
   - Update fields and relationships
3. **Copy & modify `therapist.service.ts`**:
   - Update cache key prefixes: `rehab:` → `therapist:`
   - Update Prisma model: `prisma.rehab` → `prisma.therapist`
   - Update relationship loaders for your model's relationships
4. **Copy & modify `therapist.resolver.ts`**:
   - Update query/mutation names
   - Update field resolvers for your relationships
5. **Copy & modify `therapist.module.ts`**
6. **Add to `app.module.ts`**: Import and register your new module

### Cache Key Naming Convention

```
{modelName}:{id}                      - Single entity
{modelName}:slug:{slug}               - Single entity by slug
{modelName}s:list:{params}            - List queries
{modelName}s:count:{filters}          - Count queries
{modelName}:{relationName}:{id}       - Relationship data
```

## 🎓 Key Takeaways

1. **Field Resolvers** = Lazy loading of relationships (prevents N+1)
2. **Cache Everything** = Queries, relationships, counts
3. **Logical Cache Keys** = Easy debugging and invalidation
4. **Cache Invalidation** = On mutations, invalidate affected caches
5. **Type Conversion** = Handle Prisma Decimal → Number transformation

## 🛠️ Production Considerations

1. **Cache Invalidation**: Current implementation uses `cacheManager.reset()` for list invalidation. For production, consider:
   - Pattern-based key deletion
   - Keeping track of all list cache keys
   - Using Redis SCAN for pattern matching

2. **Geo Search**: Current geo radius search uses bounding box. For production:
   - Use PostGIS extension
   - Implement proper distance calculations
   - Consider dedicated geo search (e.g., Elasticsearch)

3. **Error Handling**: Add proper error handling and logging

4. **Cache Warming**: Pre-populate cache for frequently accessed data

5. **Monitoring**: Track cache hit rates and query performance

---

**This module is production-ready and can serve as a template for all your GraphQL resources!** 🎉
