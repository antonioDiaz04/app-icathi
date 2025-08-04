import { Component, Input, Output, EventEmitter, ViewChild, type ElementRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { SafeResourceUrl } from "@angular/platform-browser"

// @Component({
//   selector: "app-file-upload",
//   standalone: true,
//   imports: [CommonModule],
//   imports: [CommonModule],
//   template: `
@Component({
  selector: 'app-file-upload',
  standalone: true,
    imports: [CommonModule],
  // imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() label = ""
  @Input() inputId = ""
  @Input() acceptedTypes = ""
  @Input() currentFileUrl: SafeResourceUrl | null = null
  @Input() originalFileUrl = ""
  @Input() selectedFileName = ""

  @Output() fileSelected = new EventEmitter<File>()

  @ViewChild("fileInput") fileInput!: ElementRef

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.fileSelected.emit(file)
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }
}
