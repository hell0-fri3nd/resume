# SYSTEMS_VERSION.md

# 1. Versioning Strategy

The application follows **Semantic Versioning (SemVer)**.

Version format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.4.2
```

Meaning:

```text
1 = Major Version
4 = Minor Version
2 = Patch Version
```

---

# 2. Version Increment Rules

Version changes are determined by the type of change.

## MAJOR Version

Increment when introducing breaking changes.

Format:

```text
X.0.0
```

Examples:

```text
1.5.0 → 2.0.0
```

Triggers:

* Breaking API changes.
* Database structure changes that require migration changes.
* Removing existing features.
* Changing authentication behavior.
* Major architecture changes.

Commit example:

```text
feat(api)!: change reservation response format
```

---

## MINOR Version

Increment when adding backwards-compatible features.

Format:

```text
0.X.0
```

Examples:

```text
1.4.0 → 1.5.0
```

Triggers:

* New features.
* New modules.
* New user capabilities.
* New Server Actions.
* New API endpoints.

Commit examples:

```text
feat(reservations): add reservation cancellation

feat(reports): add monthly revenue report
```

---

## PATCH Version

Increment for backwards-compatible fixes.

Format:

```text
0.0.X
```

Examples:

```text
1.4.2 → 1.4.3
```

Triggers:

* Bug fixes.
* Small improvements.
* Security fixes.
* Performance fixes.

Commit examples:

```text
fix(auth): handle expired JWT token

fix(rooms): correct availability calculation
```

---

# 3. Commit to Version Mapping

Version bumps follow Conventional Commits.

| Commit Type     | Version Change    |
| --------------- | ----------------- |
| feat            | MINOR             |
| fix             | PATCH             |
| perf            | PATCH             |
| security        | PATCH             |
| BREAKING CHANGE | MAJOR             |
| feat!           | MAJOR             |
| refactor        | No version change |
| docs            | No version change |
| style           | No version change |
| test            | No version change |
| chore           | No version change |
| ci              | No version change |

---

# 4. Version Location

The current system version must be stored in:

```text
package.json
```

Example:

```json
{
  "version": "1.4.2"
}
```

---

# 5. Release Rules

A release represents a stable deployable version.

Before releasing:

* All tests must pass.
* Database migrations must be completed.
* Environment variables must be verified.
* Version must be updated.
* Release notes must be created.

---

# 6. Release Process

Release flow:

```text
Development

↓

Feature Complete

↓

Testing

↓

Version Update

↓

Migration Check

↓

Production Release

↓

Tag Version
```

---

# 7. Git Tags

Every production release must have a Git tag.

Format:

```text
v<version>
```

Examples:

```text
v1.0.0

v1.4.2
```

Rules:

* Tags must match the application version.
* Never reuse an existing version tag.
* Production deployments must use tagged versions.

---

# 8. Changelog Rules

Each release should include a changelog entry.

Format:

```md
# v1.5.0

## Added

- Reservation cancellation workflow
- Room availability filtering

## Fixed

- Incorrect invoice calculation

## Changed

- Improved authentication middleware
```

Group changes by module.

Example:

```md
## Reservations

- Added cancellation workflow
- Improved availability queries

## Authentication

- Fixed JWT expiration handling
```

---

# 9. Database Versioning

Database changes must follow application versions.

Rules:

* Every schema change requires a Prisma migration.
* Production migrations must be reviewed before deployment.
* Breaking schema changes require a MAJOR version.
* Data migrations must be documented.

Example:

```text
v2.0.0

- Removed legacy reservation_status field
- Added new booking workflow
```

---

# 10. Environment Compatibility

Major system changes must document compatibility.

Example:

```md
## v2.0.0

Requires:

- Node.js >= 22
- PostgreSQL >= 16
- Prisma >= 6
```

---

# 11. Version History

Maintain release history:

```md
# Version History

## v1.5.0

Date:
YYYY-MM-DD

Changes:
- Added reservation reports
- Improved authentication flow


## v1.4.2

Date:
YYYY-MM-DD

Changes:
- Fixed payment calculation issue
```

---

# 12. Final Rule

A version represents a stable state of the system.

Every release must answer:

1. What changed?
2. Why did it change?
3. Is it backward compatible?
4. Can it be safely deployed?

Prefer frequent small releases over large unpredictable releases.
