import { getAccessToken, googleSignIn } from "./authDrive";
import { GoogleDriveSyncRecord } from "../types";

export interface DriveSaveResult {
  success: boolean;
  fileId?: string;
  fileName?: string;
  webViewLink?: string;
  folderId?: string;
  folderViewLink?: string;
  error?: string;
}

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_API_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

// Helper: Ensure valid token
async function getOrRequestAccessToken(): Promise<string> {
  let token = await getAccessToken();
  if (!token) {
    const signInResult = await googleSignIn();
    if (!signInResult?.accessToken) {
      throw new Error("Could not authorize Google Drive. Please complete sign in.");
    }
    token = signInResult.accessToken;
  }
  return token;
}

// Find existing folder or create one
async function getOrCreateStudyFolder(accessToken: string, folderName = "AI Study Assistant"): Promise<{ folderId: string; folderViewLink: string }> {
  // Query for existing folder
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`${DRIVE_API_URL}?q=${query}&fields=files(id,name,webViewLink)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return {
        folderId: data.files[0].id,
        folderViewLink: data.files[0].webViewLink || `https://drive.google.com/drive/folders/${data.files[0].id}`,
      };
    }
  }

  // Create folder
  const createRes = await fetch(DRIVE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      description: "Dedicated folder for AI Study Assistant shortcut, notes, and curriculum data.",
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Drive folder: ${createRes.statusText}`);
  }

  const newFolder = await createRes.json();
  return {
    folderId: newFolder.id,
    folderViewLink: newFolder.webViewLink || `https://drive.google.com/drive/folders/${newFolder.id}`,
  };
}

// Upload a text/HTML/JSON file using multipart upload
async function uploadDriveFile(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string,
  parentFolderId: string,
  description: string
): Promise<{ fileId: string; webViewLink: string }> {
  const metadata = {
    name: fileName,
    mimeType,
    parents: [parentFolderId],
    description,
  };

  const boundary = `-------314159265358979323846`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetch(UPLOAD_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Drive file upload failed: ${errorText}`);
  }

  const result = await res.json();
  const fileId = result.id;

  // Retrieve webViewLink
  const getFileRes = await fetch(`${DRIVE_API_URL}/${fileId}?fields=id,name,webViewLink`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const fileData = await getFileRes.json();

  return {
    fileId,
    webViewLink: fileData.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
  };
}

/**
 * Saves the interactive website launcher, .url shortcut, and backup files to Google Drive
 */
export async function saveWebsiteToGoogleDrive(studyData?: {
  alarms?: any[];
  notes?: any[];
  subjects?: any[];
  userEmail?: string;
}): Promise<DriveSaveResult> {
  try {
    const accessToken = await getOrRequestAccessToken();
    const appUrl = window.location.href.split("#")[0].split("?")[0];
    const userEmail = studyData?.userEmail || "student@learningpoint.edu";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Step 1: Ensure dedicated folder in Drive
    const { folderId, folderViewLink } = await getOrCreateStudyFolder(accessToken, "AI Study Assistant");

    // Step 2: Create interactive HTML App Launcher
    const htmlLauncherContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Launch AI Study Assistant</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 36px 32px;
      max-width: 520px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .icon {
      font-size: 56px;
      margin-bottom: 16px;
      display: inline-block;
    }
    h1 {
      margin: 0 0 10px 0;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      padding: 14px 32px;
      border-radius: 12px;
      box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.5);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 25px -5px rgba(79, 70, 229, 0.6);
    }
    .details {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 13px;
      color: #64748b;
      text-align: left;
    }
    .details strong { color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📚</div>
    <h1>AI Study Assistant</h1>
    <p>Your personalized study companion for Class 9 CBSE/NCERT curriculum, background alarms with custom ringtones, interactive tests, and smart notes.</p>
    <a class="btn" href="${appUrl}" target="_blank" rel="noopener noreferrer">🚀 Open AI Study Assistant</a>
    <div class="details">
      <div><strong>Registered Account:</strong> ${userEmail}</div>
      <div><strong>Saved To Google Drive:</strong> ${timestamp}</div>
      <div><strong>App URL:</strong> <a href="${appUrl}" style="color: #818cf8; word-break: break-all;">${appUrl}</a></div>
    </div>
  </div>
</body>
</html>`;

    const htmlUpload = await uploadDriveFile(
      accessToken,
      "Study_AI_Assistant_Web_Launcher.html",
      htmlLauncherContent,
      "text/html",
      folderId,
      `Web application shortcut to AI Study Assistant for ${userEmail}`
    );

    // Step 3: Create desktop Internet Shortcut .url file
    const urlShortcutContent = `[InternetShortcut]\nURL=${appUrl}\nIconIndex=0\nIconFile=${appUrl}/favicon.ico\n`;
    await uploadDriveFile(
      accessToken,
      "Study_AI_Assistant.url",
      urlShortcutContent,
      "text/plain",
      folderId,
      "Desktop & browser shortcut to open AI Study Assistant"
    );

    // Step 4: Create JSON backup file of current alarms and study plan
    const backupJsonContent = JSON.stringify(
      {
        appName: "AI Study Assistant",
        studentEmail: userEmail,
        savedAt: timestamp,
        appUrl,
        alarms: studyData?.alarms || [],
        notesCount: studyData?.notes?.length || 0,
        subjectsCount: studyData?.subjects?.length || 0,
        notes: studyData?.notes || [],
      },
      null,
      2
    );

    await uploadDriveFile(
      accessToken,
      "Study_Plan_and_Alarms_Backup.json",
      backupJsonContent,
      "application/json",
      folderId,
      "Full curriculum, smart notes, and alarms backup data"
    );

    const record: GoogleDriveSyncRecord = {
      fileId: htmlUpload.fileId,
      fileName: "Study_AI_Assistant_Web_Launcher.html",
      webViewLink: htmlUpload.webViewLink,
      syncedAt: new Date().toISOString(),
      folderId,
      folderViewLink,
    };

    localStorage.setItem("ai_study_drive_sync", JSON.stringify(record));

    return {
      success: true,
      fileId: htmlUpload.fileId,
      fileName: "Study_AI_Assistant_Web_Launcher.html",
      webViewLink: htmlUpload.webViewLink,
      folderId,
      folderViewLink,
    };
  } catch (error: any) {
    console.error("Save to Google Drive failed:", error);
    return {
      success: false,
      error: error?.message || "Failed to save website to Google Drive",
    };
  }
}

export function getStoredGoogleDriveSyncRecord(): GoogleDriveSyncRecord | null {
  try {
    const saved = localStorage.getItem("ai_study_drive_sync");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}
