import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, timeout} from 'rxjs';
import {APP_CONFIG} from '../../app.config.token';

export interface CloudinaryUploadResponse {
  readonly secure_url: string;
  readonly public_id: string;
  readonly format: string;
  readonly bytes: number;
  readonly width: number;
  readonly height: number;
  readonly created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);

  private static readonly UPLOAD_TIMEOUT_MS = 30000;

  /**
   * Uploads an image Blob or File directly to Cloudinary using an Unsigned Upload Preset
   * and returns an optimized delivery URL with automatic format and quality transformations (`f_auto,q_auto`).
   *
   * @param folder The target folder in Cloudinary (e.g. 'users/123')
   * @param file The Blob or File to upload
   */
  async uploadFile(folder: string, file: Blob | File): Promise<string> {
    const cloudName = this.appConfig.cloudinary?.cloudName?.trim();
    const uploadPreset = this.appConfig.cloudinary?.uploadPreset?.trim();

    if (
      !cloudName ||
      !uploadPreset ||
      cloudName === 'CLOUDINARY_CLOUD_NAME' ||
      uploadPreset === 'CLOUDINARY_UPLOAD_PRESET'
    ) {
      throw new Error(
        'Cloudinary is not configured. Set cloudinary.cloudName and cloudinary.uploadPreset in environment.ts.'
      );
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;
    const formData = new FormData();
    formData.append('file', file, 'profile.webp');
    formData.append('upload_preset', uploadPreset);

    if (folder) {
      formData.append('folder', folder);
    }

    const response = await firstValueFrom(
      this.http
        .post<CloudinaryUploadResponse>(endpoint, formData)
        .pipe(timeout(StorageService.UPLOAD_TIMEOUT_MS))
    );

    if (!response?.secure_url) {
      throw new Error('Cloudinary response did not contain a valid secure_url.');
    }

    return this.applyDeliveryOptimizations(response.secure_url);
  }

  /**
   * Injects Cloudinary on-the-fly delivery transformations (`f_auto,q_auto`) into the secure URL
   * so browsers receive optimal modern formats (AVIF/WebP) and compressed byte size via CDN.
   */
  private applyDeliveryOptimizations(secureUrl: string): string {
    const uploadSegment = '/image/upload/';
    if (secureUrl.includes(uploadSegment) && !secureUrl.includes('/image/upload/f_auto,q_auto/')) {
      return secureUrl.replace(uploadSegment, '/image/upload/f_auto,q_auto/');
    }
    return secureUrl;
  }
}
