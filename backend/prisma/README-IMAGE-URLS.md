# Wikimedia Image URL Fix

## Problem

Wikimedia URLs using the `/thumb/` pattern return 404 errors:

```
WRONG: https://upload.wikimedia.org/wikipedia/commons/thumb/X/XX/FILENAME.jpg/WIDTHpx-FILENAME.jpg
```

## Solution

Use the `Special:FilePath` format which properly redirects to the actual image:

```
CORRECT: https://commons.wikimedia.org/wiki/Special:FilePath/FILENAME.jpg?width=800
```

## Script Usage

To fix all Wikimedia image URLs in the database:

```bash
cd /home/user/workspace/backend
bunx tsx prisma/fix-all-wikimedia-urls.ts
```

## What It Does

The script automatically converts URLs in the following tables:

- **LessonPlan** - `heroImageUrl` field
- **Location** - `imageUrl` field
- **Explorer** - `imageUrl` field
- **VirtualFieldTrip** - `coverImageUrl` field
- **FieldTripStop** - `imageUrl` field
- **TimelineEvent** - `imageUrl` field
- **PrimarySourceDocument** - `imageUrl` field
- **JourneyNode** - `imageUrl` field
- **HistoricalEvent** - `imageUrl` field
- **NotableFigure** - `imageUrl` field
- **VoyageurJourney** - `coverImageUrl` field

## Verification

After running the script, it will:

1. Show how many records were updated in each table
2. Verify that no `/thumb/` URLs remain
3. Display sample URLs from each table

## Results from Last Run

- **26** LessonPlan records updated
- **99** Location records updated
- **21** Explorer records updated
- **36** FieldTripStop records updated
- **31** HistoricalEvent records updated
- **4** NotableFigure records updated
- **0** remaining `/thumb/` URLs

## For Future Seed Files

When adding new image URLs to seed files, always use the `Special:FilePath` format:

```typescript
// GOOD
imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/FILENAME.jpg?width=800"

// BAD - Will return 404
imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/X/XX/FILENAME.jpg/800px-FILENAME.jpg"
```

## Testing URLs

To test if a Wikimedia Commons image URL works:

```bash
# Should return 200
curl -sL -o /dev/null -w "%{http_code}" "https://commons.wikimedia.org/wiki/Special:FilePath/York_Factory,_Manitoba_(2017).jpg?width=800"
```
