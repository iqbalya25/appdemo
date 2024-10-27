// types/cloudinary.ts
export interface CloudinaryWidgetResult {
    event: string;
    info: CloudinaryInfo;
  }
  
  export interface CloudinaryInfo {
    secure_url: string;
    public_id: string;
    original_filename: string;
    bytes: number;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    url: string;
    access_mode: string;
    version: number;
  }
  
  export interface CloudinaryError {
    status: number;
    message: string;
    statusText?: string;
  }