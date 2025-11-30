import { caseManagementClient } from '../config.js';

// ==========================================
// General / System
// ==========================================

export const checkHealth = async () => {
  const response = await caseManagementClient.get('/');
  return response.data;
};

export const createTables = async () => {
  const response = await caseManagementClient.get('/create-table');
  return response.data;
};

// ==========================================
// Client Operations
// ==========================================

export const addClient = async (clientData) => {
  // Backend expects Body: { name, contact }
  const response = await caseManagementClient.post('/add-client', clientData);
  return response.data;
};

export const getAllClients = async () => {
  const response = await caseManagementClient.get('/get-clients');
  return response.data;
};

export const getClientDetailsByName = async (name) => {
  // Backend expects Query: ?name=...
  const response = await caseManagementClient.get('/client-details', {
    params: { name }
  });
  return response.data;
};

export const deleteClient = async (id) => {
  // Backend expects Query: ?id=...
  const response = await caseManagementClient.delete('/delete-client', {
    params: { id }
  });
  return response.data;
};

export const updateClientContact = async (id, contact) => {
  // Backend expects Query params for both
  const response = await caseManagementClient.put('/update_client_det', null, {
    params: { id, contact }
  });
  return response.data;
};

// ==========================================
// Case Operations
// ==========================================

export const addCase = async (caseData) => {
  // Backend expects Body: CaseDet schema
  const response = await caseManagementClient.post('/add-case', caseData);
  return response.data;
};

export const getCasesByClientId = async (clientId) => {
  // Backend expects Query: ?id=...
  const response = await caseManagementClient.get('/get-cases-client', {
    params: { id: clientId }
  });
  return response.data;
};

export const getCaseByNumber = async (caseNumber) => {
  // Backend expects Query: ?casenumber=...
  const response = await caseManagementClient.get('/case-details', {
    params: { casenumber: caseNumber }
  });
  return response.data;
};

// REMOVED: getCaseById (Route does not exist on backend)

export const deleteCase = async (caseId) => {
  // Backend expects Query: ?id=...
  const response = await caseManagementClient.delete('/delete-cases', {
    params: { id: caseId }
  });
  return response.data;
};

export const updateCaseDetails = async (id, newTitle, newCourt) => {
  // Backend expects Query params
  const response = await caseManagementClient.put('/update_case_details', null, {
    params: { 
      id, 
      new_title: newTitle, 
      new_court: newCourt 
    }
  });
  return response.data;
};

// ==========================================
// Hearing Operations
// ==========================================

export const addHearing = async (hearingData) => {
  // Backend expects Body: HearingDet schema
  const response = await caseManagementClient.post('/add-hearing', hearingData);
  return response.data;
};

export const getAllHearings = async () => {
  const response = await caseManagementClient.get('/get-hearings');
  return response.data;
};

export const getHearingsByCaseId = async (caseId) => {
  // Backend expects Query: ?id=...
  const response = await caseManagementClient.get('/get-hearing-case', {
    params: { id: caseId }
  });
  return response.data;
};

export const updateHearingDescription = async (id, content) => {
  // Backend expects Query params
  const response = await caseManagementClient.put('/update_hearings_desc', null, {
    params: { id, content }
  });
  return response.data;
};

// ==========================================
// Note Operations
// ==========================================

export const addNote = async (noteData) => {
  // Backend expects Body: NoteDet schema
  const response = await caseManagementClient.post('/add-notes', noteData);
  return response.data;
};

export const getNotesByCaseId = async (caseId) => {
  // Backend expects Query: ?id=...
  const response = await caseManagementClient.get('/get-notes', {
    params: { id: caseId }
  });
  return response.data;
};

export const deleteNote = async (noteId) => {
  // Backend expects Query: ?id=...
  const response = await caseManagementClient.delete('/delete-notes', {
    params: { id: noteId }
  });
  return response.data;
};

export const updateNoteContent = async (id, content) => {
  // Backend expects Query params
  const response = await caseManagementClient.put('/update_note_content', null, {
    params: { id, content }
  });
  return response.data;
};

export const getCaseFromHearing = async (caseId) => {
  const response = await caseManagementClient.get('/case-from-hearing', {
    params: { case_id: caseId }
  });
  return response.data;
};