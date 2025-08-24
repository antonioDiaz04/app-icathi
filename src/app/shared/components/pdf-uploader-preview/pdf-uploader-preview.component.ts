import { Component, Input, Output, EventEmitter, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-uploader-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-uploader-preview.component.html',
  styleUrls: ['./pdf-uploader-preview.component.scss'],
})
export class PdfUploaderPreviewComponent {
  constructor(private sanitizer: DomSanitizer) {}

  /** Etiqueta visible arriba del control */
  @Input() label = 'Documento PDF';
  /** Placeholder del input URL (si lo usas desde afuera) */
  @Input() placeholder = 'https://...';
  /** (Opcional) Carpeta/área destino en tu backend—informativo o para uploadFn */
  @Input() targetFolder?: string;
  /** Límite opcional (MB) del archivo a subir */
  @Input() maxSizeMb = 10;

  /**
   * Función de subida opcional. Debe devolver la URL final del PDF.
   * Ej: (file) => apiSubirPDF(file, 'cedulas_docentes')
   */
  @Input() uploadFn?: (file: File) => Promise<string>;

  /** URL actual del PDF (controlado por el padre) */
  @Input() set url(v: string | null | undefined) {
    this._url.set(v?.trim() || '');
    this._thumbLoaded.set(false);
    this.errorMsg.set('');
  }
  get url() { return this._url(); }

  /** Emite cada vez que cambia la URL (edición manual, limpiar o tras subir). */
  @Output() urlChange = new EventEmitter<string>();

  // ===== Estado interno (signals) =====
  private _url = signal<string>('');
  uploading = signal<boolean>(false);
  errorMsg = signal<string>('');
  private _thumbLoaded = signal<boolean>(false);
  showFull = signal<boolean>(false);

  /** URL segura para vista completa (sin parámetros) */
  fullUrl = computed<SafeResourceUrl | null>(() => {
    const base = this._url().trim();
    if (!base) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base);
  });

  /** URL segura para mini-preview SIN controles del visor */
  thumbUrl = computed<SafeResourceUrl | null>(() => {
    const base = this._url().trim();
    if (!base) return null;
    // Oculta toolbar/zoom/paginación y ajusta a ancho
    const hash =
      '#pagemode=none&view=FitH&statusbar=0&messages=0&navpanes=0&toolbar=0&scrollbar=0';
    const finalUrl = `${base}${hash}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  });

  /** Propaga cambios al padre */
  _propagate = effect(() => {
    this.urlChange.emit(this._url());
  });

  // ===== Handlers =====
  onManualChange(v: string) {
    this.errorMsg.set('');
    this._url.set(v?.trim() || '');
    this._thumbLoaded.set(false);
  }

  clear() {
    this._url.set('');
    this.errorMsg.set('');
    this._thumbLoaded.set(false);
  }

  onThumbLoaded() {
    this._thumbLoaded.set(true);
  }

  toggleFull() {
    if (this._url()) this.showFull.update(v => !v);
  }

  async onFilePicked(evt: Event) {
    this.errorMsg.set('');
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // permitir volver a elegir el mismo archivo
    if (!file) return;

    // Validaciones simples
    if (file.type !== 'application/pdf') {
      this.errorMsg.set('Solo se permiten archivos PDF.');
      return;
    }
    const maxBytes = this.maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      this.errorMsg.set(`El archivo supera ${this.maxSizeMb} MB.`);
      return;
    }

    if (!this.uploadFn) {
      this.errorMsg.set('No se configuró uploadFn para subir el archivo.');
      return;
    }

    try {
      this.uploading.set(true);
      const url = await this.uploadFn(file);
      this._url.set(url?.trim() || '');
      this._thumbLoaded.set(false);
    } catch (e: any) {
      this.errorMsg.set(e?.message || 'Error al subir el archivo.');
    } finally {
      this.uploading.set(false);
    }
  }
}
