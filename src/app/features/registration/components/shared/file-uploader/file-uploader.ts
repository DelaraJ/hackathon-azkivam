import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.html',
  styleUrls: ['./file-uploader.scss'],
  imports: [
    DecimalPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true
    }
  ]
})
export class FileUploaderComponent implements ControlValueAccessor {

  @Input() accept = '*/*';
  @Input() disabled = false;
  @Input() maxSizeMb = 5;

  @Output() fileSelected = new EventEmitter<File>();

  file: File | null = null;
  previewUrl: string | null = null;
  isDragging = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  // -----------------------------
  onFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    this.setFile(input.files[0]);
  }

  // -----------------------------
  setFile(file: File) {
    if (file.size > this.maxSizeMb * 1024 * 1024) {
      alert(`Max file size is ${this.maxSizeMb}MB`);
      return;
    }

    this.file = file;
    this.onChange(file);
    this.fileSelected.emit(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  // -----------------------------
  removeFile() {
    this.file = null;
    this.previewUrl = null;
    this.onChange(null);
  }

  // -----------------------------
  dragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  dragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  drop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (!event.dataTransfer?.files?.length) return;
    this.setFile(event.dataTransfer.files[0]);
  }

  // -----------------------------
  writeValue(file: File | null): void {
    if (!file) {
      this.file = null;
      this.previewUrl = null;
      return;
    }
    this.setFile(file);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
