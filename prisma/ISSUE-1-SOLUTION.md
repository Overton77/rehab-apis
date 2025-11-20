# Issue #1 — Proposal and Documentation: Safe Taxonomy Seeding and YouTube Channel Ingestion

This document proposes a minimal, production-safe approach (no code changes required) to seed taxonomy lookups and ingest YouTube channels using the existing GraphQL API and Prisma schema. It mirrors established patterns in `src/rehabs/*` and aligns with unique constraints introduced in recent migrations.

## Summary
- Use the existing GraphQL mutations in `RehabTaxonomyResolver` to seed descriptors in bulk (`createMany*`), relying on Prisma `createMany({ skipDuplicates: true })` and unique indexes in `prisma/schema.prisma`.
- Ingest `YoutubeChannel` records via existing `RehabOrg` create/upsert inputs using `connectOrCreate`, keyed by the unique `url` field.
- No backend code changes are necessary; this is an operational/documentation update with example queries to standardize ingestion and avoid duplicates.

## Why this solves the problem
- Recent migrations added uniqueness to taxonomy tables (e.g., `slug`, `displayName`, `code`) and media tables (e.g., `YoutubeChannel.url`). Attempting to insert duplicates would normally error.
- The service layer already implements `createMany(..., { skipDuplicates: true })`, and GraphQL inputs for organizations use `connectOrCreate` for nested relations.
- By standardizing to these mechanisms, ingestion remains idempotent and safe to run repeatedly in CI/CD or import jobs without race conditions.

## Relevant Schema Anchors
- Unique fields (examples):
  - `LevelOfCare.slug`, `Service.slug`, `Population.slug`, `Language.code`, `Amenity.slug`, `ProgramFeature.slug`, `PaymentOption.slug`, `InsurancePayer.slug`, `Substance.slug`
  - `YoutubeChannel.url` (unique)
- See:
  - `prisma/schema.prisma` (lookups + media models)
  - `src/rehabs/rehab-taxonomy.resolver.ts` and `src/rehabs/rehab.service.ts` (createMany + skipDuplicates)
  - `src/rehabs/utils/createRehabOrgUtils.ts` and `src/rehabs/utils/upsertRehabOrgUtils.ts` (nested `connectOrCreate` for YouTube)

## How to Seed Taxonomy Data (GraphQL)
Run these GraphQL mutations against the API to seed lookups. They are idempotent thanks to unique constraints and `skipDuplicates`.

### Level of Care
```graphql
mutation SeedLevelOfCare {
  createManyLevelOfCare(
    input: { items: [
      { slug: "detox", displayName: "Detox" },
      { slug: "residential", displayName: "Residential" },
      { slug: "php", displayName: "Partial Hospitalization (PHP)" },
      { slug: "iop", displayName: "Intensive Outpatient (IOP)" },
      { slug: "outpatient", displayName: "Outpatient" },
      { slug: "aftercare", displayName: "Aftercare" }
    ] }
  ) {
    id
    slug
    displayName
  }
}
```

### Services and Detox Services
```graphql
mutation SeedServicesAndDetox {
  createManyService(
    input: { items: [
      { slug: "individual_counseling", displayName: "Individual Counseling" },
      { slug: "group_counseling", displayName: "Group Counseling" },
      { slug: "emdr", displayName: "EMDR" }
    ] }
  ) { id slug displayName }

  createManyDetoxService(
    input: { items: [
      { slug: "alcohol_detox", displayName: "Alcohol Detox" },
      { slug: "opioid_detox", displayName: "Opioid Detox" }
    ] }
  ) { id slug displayName }
}
```

### Languages
`Language` uses `code` (e.g., "en") as the unique key.
```graphql
mutation SeedLanguages {
  createManyLanguage(
    input: { items: [
      { code: "en", displayName: "English" },
      { code: "es", displayName: "Spanish" }
    ] }
  ) { id code displayName }
}
```

### Other Lookups
All follow the same pattern: `slug` + `displayName` with optional `description`.
- `Population`: `createManyPopulation`
- `Amenity`: `createManyAmenity`
- `Environment`: `createManyEnvironment`
- `SettingStyle`: `createManySettingStyle`
- `LuxuryTier`: `createManyLuxuryTier`
- `ProgramFeature`: `createManyProgramFeature`
- `PaymentOption`: `createManyPaymentOption`
- `InsurancePayer`: `createManyInsurancePayer` (unique `slug`, `displayName`, `companyName`)
- `Substance`: `createManySubstance`

Example for `InsurancePayer`:
```graphql
mutation SeedInsurancePayers {
  createManyInsurancePayer(
    input: { items: [
      { companyName: "Aetna", slug: "aetna", displayName: "Aetna" },
      { companyName: "Cigna", slug: "cigna", displayName: "Cigna" }
    ] }
  ) { id slug displayName }
}
```

## How to Ingest YouTube Channels (Idempotent)
Use the existing `RehabOrg` create/upsert mutations with nested `youtubeChannels` as `connectOrCreate` keyed by `url`.

### Create Organization with YouTube Channels
```graphql
mutation CreateRehabOrgWithYouTube {
  createRehabOrg(
    data: {
      name: "Hope Recovery Center"
      slug: "hope-recovery-center"
      state: "CA"
      city: "San Diego"
      zip: "92101"
      country: "USA"
      youtubeChannels: [
        { url: "https://www.youtube.com/@HopeRecovery" },
        { url: "https://www.youtube.com/channel/UCabc123" }
      ]
    }
  ) {
    id
    name
    youtubeChannels { url }
  }
}
```

### Upsert Organization (Connect existing or create new YouTube Channels)
```graphql
mutation UpsertRehabOrgWithYouTube {
  upsertRehabOrg(
    input: {
      where: { slug: "hope-recovery-center" }
      create: {
        name: "Hope Recovery Center"
        slug: "hope-recovery-center"
        state: "CA"
        city: "San Diego"
        country: "USA"
        youtubeChannels: [ { url: "https://www.youtube.com/@HopeRecovery" } ]
      }
      update: {
        tagline: "Personalized, evidence-based care"
        youtubeChannels: [
          { url: "https://www.youtube.com/@HopeRecovery" },
          { url: "https://www.youtube.com/channel/UCabc123" }
        ]
      }
    }
  ) {
    id
    name
    youtubeChannels { url }
  }
}
```

Notes:
- The underlying utils (`createRehabOrg`, `upsertRehabOrgsWithConnectOrCreate`) already map these inputs to Prisma `connectOrCreate` operations against `YoutubeChannel.url`.
- Re-running the same mutation is safe; duplicates are not created due to the unique `url`.

## Operational Guidance
- Run taxonomy seeding once per environment; it’s safe to re-run during deploys.
- Keep `slug`/`code` immutable after publication to avoid breaking references.
- If you need to rename a `slug`, plan a data migration and update all references.
- For bulk imports (CSV/JSON), prefer batching into the `createMany*` GraphQL mutations rather than per-row writes.

## Testing
- Optional: Add a lightweight e2e that calls selected `createMany*` mutations and asserts returned records exist via corresponding `findAll*` queries.
- Given the minimal scope and idempotency, comprehensive tests are not mandatory for adoption.

## Risks
- Low: This leverages existing resolvers, DTOs, and unique constraints. No code paths changed.

---

This proposal follows `AGENTS.md` principles: it favors idempotent, additive operations, aligns Prisma uniqueness with GraphQL inputs, and keeps ingestion safe and repeatable.
