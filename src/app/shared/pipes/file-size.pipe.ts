import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',  
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number | null | undefined, decimals = 2): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${size} ${sizes[i]}`;
  }
}
