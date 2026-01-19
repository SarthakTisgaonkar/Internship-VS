/**
 * On-Device IndexedDB Database Management
 * Stores patient records and assessment data locally on the device
 */

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  notes: string;
  created_at: number;
}

interface AssessmentRecord {
  id: string;
  patient_id: string;
  date: number;
  gcs: number;
  api: number;
  wmc: number;
  risk_level: string;
  rt_mean: number;
  rt_sd: number;
  cov: number;        // Coefficient of Variation
  fatigue: number;
  latency: number;
  throughput: number; // Memory Throughput
  lapses: number;
  insight_text: string;
}

const DB_NAME = 'NeuroAssessmentDB';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB connection
 */
export const initializeDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ Database initialization error:', request.error);
      reject(new Error('Failed to initialize database'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      console.log('✅ Database initialized successfully');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create Patients table
      if (!db.objectStoreNames.contains('patients')) {
        const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
        patientStore.createIndex('created_at', 'created_at', { unique: false });
        console.log('✅ Patients table created');
      }

      // Create Assessment Records table
      if (!db.objectStoreNames.contains('assessments')) {
        const assessmentStore = db.createObjectStore('assessments', { keyPath: 'id' });
        assessmentStore.createIndex('patient_id', 'patient_id', { unique: false });
        assessmentStore.createIndex('date', 'date', { unique: false });
        console.log('✅ Assessments table created');
      }
    };
  });
};

/**
 * Add or update a patient record
 */
export const savePatientToDB = async (patient: Patient): Promise<void> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    const request = store.put(patient);

    request.onerror = () => {
      console.error('❌ Error saving patient:', request.error);
      reject(new Error(`Failed to save patient: ${request.error}`));
    };

    request.onsuccess = () => {
      console.log(`✅ Patient saved: ${patient.id}`);
      resolve();
    };
  });
};

/**
 * Retrieve all patients from database
 */
export const getAllPatients = async (): Promise<Patient[]> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['patients'], 'readonly');
    const store = transaction.objectStore('patients');
    const index = store.index('created_at');
    const request = index.getAll();

    request.onerror = () => {
      console.error('❌ Error retrieving patients:', request.error);
      reject(new Error(`Failed to retrieve patients: ${request.error}`));
    };

    request.onsuccess = () => {
      const patients = (request.result as Patient[]).reverse();
      console.log(`✅ Retrieved ${patients.length} patients`);
      resolve(patients);
    };
  });
};

/**
 * Retrieve a single patient by ID
 */
export const getPatientById = async (patientId: string): Promise<Patient | undefined> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['patients'], 'readonly');
    const store = transaction.objectStore('patients');
    const request = store.get(patientId);

    request.onerror = () => {
      console.error('❌ Error retrieving patient:', request.error);
      reject(new Error(`Failed to retrieve patient: ${request.error}`));
    };

    request.onsuccess = () => {
      console.log(`✅ Patient retrieved: ${patientId}`);
      resolve(request.result);
    };
  });
};

/**
 * Delete a patient record
 */
export const deletePatient = async (patientId: string): Promise<void> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    const request = store.delete(patientId);

    request.onerror = () => {
      console.error('❌ Error deleting patient:', request.error);
      reject(new Error(`Failed to delete patient: ${request.error}`));
    };

    request.onsuccess = () => {
      console.log(`✅ Patient deleted: ${patientId}`);
      resolve();
    };
  });
};

/**
 * Save an assessment record
 */
export const saveAssessmentToDB = async (assessment: AssessmentRecord): Promise<void> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['assessments'], 'readwrite');
    const store = transaction.objectStore('assessments');
    const request = store.put(assessment);

    request.onerror = () => {
      console.error('❌ Error saving assessment:', request.error);
      reject(new Error(`Failed to save assessment: ${request.error}`));
    };

    request.onsuccess = () => {
      console.log(`✅ Assessment saved: ${assessment.id}`);
      resolve();
    };
  });
};

/**
 * Retrieve all assessments for a specific patient
 */
export const getAssessmentsByPatientId = async (patientId: string): Promise<AssessmentRecord[]> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['assessments'], 'readonly');
    const store = transaction.objectStore('assessments');
    const index = store.index('patient_id');
    const request = index.getAll(patientId);

    request.onerror = () => {
      console.error('❌ Error retrieving assessments:', request.error);
      reject(new Error(`Failed to retrieve assessments: ${request.error}`));
    };

    request.onsuccess = () => {
      const assessments = (request.result as AssessmentRecord[]).reverse();
      console.log(`✅ Retrieved ${assessments.length} assessments for patient ${patientId}`);
      resolve(assessments);
    };
  });
};

/**
 * Get all assessments (across all patients)
 */
export const getAllAssessments = async (): Promise<AssessmentRecord[]> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['assessments'], 'readonly');
    const store = transaction.objectStore('assessments');
    const request = store.getAll();

    request.onerror = () => {
      console.error('❌ Error retrieving all assessments:', request.error);
      reject(new Error(`Failed to retrieve assessments: ${request.error}`));
    };

    request.onsuccess = () => {
      const assessments = (request.result as AssessmentRecord[]).reverse();
      console.log(`✅ Retrieved ${assessments.length} total assessments`);
      resolve(assessments);
    };
  });
};

/**
 * Get assessment count for a patient
 */
export const getAssessmentCountByPatientId = async (patientId: string): Promise<number> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['assessments'], 'readonly');
    const store = transaction.objectStore('assessments');
    const index = store.index('patient_id');
    const request = index.count(patientId);

    request.onerror = () => {
      console.error('❌ Error counting assessments:', request.error);
      reject(new Error(`Failed to count assessments: ${request.error}`));
    };

    request.onsuccess = () => {
      console.log(`✅ Patient ${patientId} has ${request.result} assessments`);
      resolve(request.result);
    };
  });
};

/**
 * Clear all data from database (for testing/reset)
 */
export const clearDatabase = async (): Promise<void> => {
  const db = await initializeDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['patients', 'assessments'], 'readwrite');

    const patientStore = transaction.objectStore('patients');
    const assessmentStore = transaction.objectStore('assessments');

    const patientClear = patientStore.clear();
    const assessmentClear = assessmentStore.clear();

    patientClear.onerror = () => {
      console.error('❌ Error clearing patients:', patientClear.error);
      reject(new Error('Failed to clear database'));
    };

    assessmentClear.onerror = () => {
      console.error('❌ Error clearing assessments:', assessmentClear.error);
      reject(new Error('Failed to clear database'));
    };

    transaction.oncomplete = () => {
      console.log('✅ Database cleared successfully');
      resolve();
    };
  });
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async (): Promise<{
  patientCount: number;
  assessmentCount: number;
  totalRecords: number;
}> => {
  const patients = await getAllPatients();
  const assessments = await getAllAssessments();

  return {
    patientCount: patients.length,
    assessmentCount: assessments.length,
    totalRecords: patients.length + assessments.length,
  };
};

/**
 * Export data for backup
 */
export const exportDatabase = async (): Promise<{
  patients: Patient[];
  assessments: AssessmentRecord[];
  exportDate: string;
}> => {
  const patients = await getAllPatients();
  const assessments = await getAllAssessments();

  return {
    patients,
    assessments,
    exportDate: new Date().toISOString(),
  };
};

/**
 * Import data from backup
 */
export const importDatabase = async (data: {
  patients: Patient[];
  assessments: AssessmentRecord[];
}): Promise<void> => {
  try {
    // Save all patients
    for (const patient of data.patients) {
      await savePatientToDB(patient);
    }

    // Save all assessments
    for (const assessment of data.assessments) {
      await saveAssessmentToDB(assessment);
    }

    console.log(`✅ Imported ${data.patients.length} patients and ${data.assessments.length} assessments`);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
};
