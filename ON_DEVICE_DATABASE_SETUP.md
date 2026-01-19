# On-Device Database Setup Guide

## What's New

Your application now uses **IndexedDB**, a powerful on-device database that:
- ✅ Stores all patient and assessment data locally on the device
- ✅ Persists data across browser sessions
- ✅ Works completely offline
- ✅ Provides fast, responsive data access
- ✅ Requires no server connection

## Quick Start

### 1. Data Initialization (Automatic)
When the app loads, it automatically:
- Initializes the IndexedDB database
- Creates patient and assessment tables
- Loads existing patients from database

### 2. Patient Registration
When you register a new patient:
```
1. Fill patient form
2. Click "Create Profile"
3. Data is automatically saved to device database
4. Patient appears in Patient Directory
```

### 3. Assessment Completion
When you complete an assessment:
```
1. Run Reflexes, Memory, and Questionnaire tests
2. View results
3. Assessment is automatically saved to database
4. Data linked to patient record
```

### 4. Patient History
View a patient's assessment history:
```
1. Go to "Clinical History"
2. See all past assessments for that patient
3. Data retrieved from device database
4. Sorted by date (newest first)
```

## Data Storage Locations

### Patient Data
- **Stored in**: Browser's IndexedDB
- **Location**: Local to device only
- **Access**: Instant, no network needed
- **Persistence**: Permanent until cleared

### Assessment Records
- **Stored in**: Browser's IndexedDB
- **Linked to**: Patient ID
- **Historical data**: All assessments kept
- **Quick retrieval**: Indexed by patient ID

## Important Features

### ✅ Automatic Saving
- No manual "Save" button needed
- Data saved in real-time
- Handles errors gracefully

### ✅ Data Persistence
- Data survives browser closes
- Data survives computer restarts
- Data only cleared if browser cache is cleared

### ✅ Offline Capability
- All operations work offline
- No internet connection needed
- Perfect for clinics without constant internet

### ✅ Privacy
- All data stays on device
- No cloud upload
- No data tracking
- Patient privacy guaranteed

## Managing Your Data

### View Database Statistics
Open browser Developer Console (F12):
```javascript
// Get database stats
const stats = await window.db.getDatabaseStats();
console.log(stats);
```

### Export Data (Backup)
```javascript
// Export all data
const backup = await window.db.exportDatabase();

// Save to file (in DevTools console):
copy(JSON.stringify(backup));
```

### Import Data (Restore)
```javascript
// Import from backup
const backupData = JSON.parse(yourBackupJSON);
await window.db.importDatabase(backupData);
```

### Clear All Data
```javascript
// WARNING: This deletes everything!
await window.db.clearDatabase();
```

## Files Modified

### New Files Added
- `src/database.ts` - Complete IndexedDB implementation

### Updated Files
- `src/app.tsx` - Integration with IndexedDB
- `DATABASE_README.md` - Detailed API documentation

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Full Support |
| Firefox | ✅ Full Support |
| Safari | ✅ Full Support |
| Edge | ✅ Full Support |
| IE 11 | ❌ Not Supported |

## Common Tasks

### Add a New Patient
1. Click "New Patient Intake"
2. Fill form with patient info
3. Click "Create Profile"
4. Patient automatically saved to database

### View All Patients
1. Click "Patient Directory"
2. See list of all registered patients
3. Data loaded from device database
4. Click to select patient

### Export Patient Data
1. Open browser Console (F12)
2. Run: `const data = await window.db.exportDatabase();`
3. Data copied to clipboard
4. Save to file for backup

### Start New Assessment
1. Select a patient
2. Click "Begin Assessment"
3. Complete all three tests
4. Results automatically saved to database
5. Data linked to patient

### View Assessment History
1. Select a patient
2. Click "Clinical History"
3. See all past assessments
4. Data sorted newest to oldest
5. Graphs show trends over time

## Troubleshooting

### Q: Where is my data stored?
**A**: In your browser's IndexedDB storage, which is local to your device only.

### Q: Will my data be lost if I close the browser?
**A**: No! IndexedDB persists data even after closing the browser.

### Q: Can I access the data on another device?
**A**: No. Each device has its own IndexedDB instance. You'll need to export and import data.

### Q: How much data can I store?
**A**: Typically 50MB+ per browser, which is enough for thousands of patients and assessments.

### Q: What if my browser crashes?
**A**: Your data is safe. IndexedDB is persistent and survives crashes.

### Q: Can I backup my data?
**A**: Yes! Use the export function in developer console to create backups.

### Q: How do I delete a patient?
**A**: Currently only through developer console:
```javascript
await window.db.deletePatient('PATIENT_ID');
```

## Database Structure

```
NeuroAssessmentDB (IndexedDB)
├── patients (Object Store)
│   ├── Index: created_at
│   └── Records: Patient registrations
└── assessments (Object Store)
    ├── Index: patient_id
    ├── Index: date
    └── Records: Assessment results
```

## Performance Tips

1. **Regular Exports**: Backup your data monthly
2. **Archive Old Data**: Export old assessments and clear if storage gets full
3. **Batch Operations**: Register multiple patients at once
4. **Clear Cache**: Only when specifically needed

## Security Notes

- Data is NOT encrypted on device
- Anyone with access to your computer can access IndexedDB
- Use browser security features to protect data
- Don't leave app running unattended in public

## API Quick Reference

```typescript
// Patient Management
await savePatientToDB(patient);
await getAllPatients();
await getPatientById(id);
await deletePatient(id);

// Assessment Management
await saveAssessmentToDB(assessment);
await getAssessmentsByPatientId(id);
await getAssessmentCountByPatientId(id);

// Utilities
await getDatabaseStats();
await exportDatabase();
await importDatabase(data);
await clearDatabase();
```

## Next Steps

1. ✅ Start registering patients
2. ✅ Run assessments and see data saved automatically
3. ✅ View patient histories to see assessment trends
4. ✅ Export data regularly for backup
5. ✅ Monitor database storage usage

## Support

For detailed API documentation, see `DATABASE_README.md`.

For issues or questions, check the browser console for error messages.

---

**Database Type**: IndexedDB (Browser Native)  
**Version**: 1.0  
**Last Updated**: January 2026
