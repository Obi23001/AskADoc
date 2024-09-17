export interface Certificate {
    id: number;
    certificateName: string;
    certificateFile: string; // This will be a base64 encoded string in the frontend
    doctorId: number;
  }