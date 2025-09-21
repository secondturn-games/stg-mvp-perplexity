# Image Upload Implementation Guide

This guide explains the image upload functionality implemented using Supabase Storage for the Baltic Board Games marketplace.

## Overview

The image upload system allows users to upload 1-3 images per listing with automatic compression, validation, and proper error handling. Images are stored in Supabase Storage and URLs are saved in the listings table as an array.

## Features

### ✅ Implemented Features

- **File Upload**: Support for JPEG, PNG, and WebP formats
- **Size Validation**: 5MB maximum file size per image
- **Image Compression**: Automatic compression to optimize file sizes
- **Progress Indicators**: Real-time upload progress and status
- **Error Handling**: Comprehensive error handling with retry functionality
- **Drag & Drop**: Modern drag-and-drop interface
- **Preview**: Live image previews during upload
- **Storage Integration**: Secure Supabase Storage integration
- **Database Integration**: Image URLs stored as array in listings table

### 🔧 Technical Implementation

#### Storage Configuration

- **Bucket**: `listing-images` (public bucket)
- **Path Structure**: `{user_id}/{listing_id}_{timestamp}_{random}.{ext}`
- **Policies**: Users can only upload/delete their own images
- **Cleanup**: Automatic cleanup of orphaned images

#### Image Processing

- **Max Dimensions**: 1200x1200 pixels
- **Compression Quality**: 85% (adjustable)
- **Format Optimization**: Automatic WebP conversion when supported
- **Size Optimization**: Progressive quality reduction if needed

#### Components

- `ImageUpload`: Main upload component with drag-and-drop
- `image-processing.ts`: Image compression utilities
- `storage.ts`: Supabase Storage integration

## Usage

### Basic Usage

```tsx
import { ImageUpload } from '@/components/listings/image-upload'

function MyForm() {
  const [images, setImages] = useState<string[]>([])

  return (
    <ImageUpload
      images={images}
      onImagesChange={setImages}
      maxImages={3}
      error={errorMessage}
      disabled={loading}
    />
  )
}
```

### Advanced Usage with Upload Data

```tsx
import {
  ImageUpload,
  type ImageUploadData,
} from '@/components/listings/image-upload'

function MyForm() {
  const [images, setImages] = useState<string[]>([])
  const [imageData, setImageData] = useState<ImageUploadData[]>([])

  return (
    <ImageUpload
      images={images}
      onImagesChange={setImages}
      onImageDataChange={setImageData}
      maxImages={3}
    />
  )
}
```

## Storage Setup

### 1. Database Migration

Run the storage setup migration:

```sql
-- This creates the bucket, policies, and cleanup functions
-- Located in: supabase/migrations/002_storage_setup.sql
```

### 2. Supabase Storage Configuration

The storage bucket is automatically created with the migration. Ensure your Supabase project has storage enabled.

### 3. Environment Variables

Make sure your Supabase configuration is properly set up in your environment variables.

## File Structure

```
src/
├── components/listings/
│   └── image-upload.tsx          # Main upload component
├── lib/
│   ├── supabase/
│   │   └── storage.ts             # Storage utilities
│   └── utils/
│       └── image-processing.ts    # Image compression utilities
└── supabase/migrations/
    └── 002_storage_setup.sql      # Storage setup migration
```

## Security

### Row Level Security (RLS)

- Users can only upload images to their own folder (`{user_id}/`)
- Users can only delete their own images
- All images are publicly viewable (for marketplace functionality)

### Validation

- File type validation (JPEG, PNG, WebP only)
- File size validation (5MB maximum)
- Image count validation (3 images maximum per listing)
- User authentication required for uploads

## Performance Optimizations

### Image Compression

- Automatic compression to reduce file sizes
- Progressive quality reduction if initial compression isn't enough
- Maintains aspect ratio while resizing to maximum dimensions

### Storage Optimization

- WebP format conversion when supported by browser
- Automatic cleanup of orphaned images (images not referenced in listings)
- Efficient file naming with timestamps and random strings

### UI Performance

- Object URLs for immediate preview
- Progress indicators for upload status
- Lazy loading of image processing utilities

## Error Handling

### Upload Errors

- Network failures with retry functionality
- File validation errors with clear messages
- Storage quota exceeded handling
- Authentication errors

### User Experience

- Visual error indicators on failed uploads
- Retry buttons for failed uploads
- Progress indicators during processing
- Validation feedback before upload attempts

## Maintenance

### Cleanup Operations

The system includes automatic cleanup functions:

```sql
-- Clean up orphaned images (not referenced in any listing)
SELECT cleanup_orphaned_images();

-- Get all image paths currently referenced in listings
SELECT * FROM extract_image_paths_from_listings();
```

### Monitoring

Monitor storage usage and performance:

- Check Supabase Storage dashboard for usage statistics
- Monitor upload success rates
- Track image compression effectiveness

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check user authentication and storage policies
2. **Images Not Displaying**: Verify public bucket configuration
3. **Large File Sizes**: Ensure compression is working correctly
4. **Slow Uploads**: Check network connection and file sizes

### Debug Mode

Enable debug logging in development:

```typescript
// In image-upload.tsx, uncomment console.log statements
console.log('Upload result:', uploadResult)
console.log('Compression result:', compressionResult)
```

## Future Enhancements

### Planned Features

- [ ] Image rotation/editing tools
- [ ] Batch upload optimization
- [ ] CDN integration for faster delivery
- [ ] Advanced image formats (AVIF support)
- [ ] Image metadata extraction
- [ ] Automatic alt text generation

### Performance Improvements

- [ ] Progressive image loading
- [ ] Image lazy loading on listing pages
- [ ] Thumbnail generation for faster previews
- [ ] Background upload processing

## Support

For issues or questions about the image upload implementation:

1. Check the error messages in the browser console
2. Verify Supabase Storage configuration
3. Review the migration files for proper setup
4. Test with different image formats and sizes

