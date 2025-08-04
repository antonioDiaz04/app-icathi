import { Component, Input, Output, EventEmitter, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

export interface Especialidad {
  id: number
  nombre: string
}

// @Component({
//   selector: "app-especialidades-selector",
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
@Component({
  selector: 'app-especialidades-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades-selector.component.html',
  styleUrl: './especialidades-selector.component.scss'
})
export class EspecialidadesSelectorComponent {

  @Input() especialidades: Especialidad[] = []
  @Input() selectedEspecialidades: number[] = []
  @Output() selectedEspecialidadesChange = new EventEmitter<number[]>()

  dropdownOpen = signal<boolean>(false)
  inputValue = signal<string>("")
  filteredEspecialidades = signal<Especialidad[]>([])

  ngOnInit() {
    this.filteredEspecialidades.set([...this.especialidades])
  }

  ngOnChanges() {
    this.filteredEspecialidades.set([...this.especialidades])
  }

  toggleDropdown(): void {
    this.dropdownOpen.set(!this.dropdownOpen())
  }

  onSearchChange(searchTerm: string): void {
    this.filteredEspecialidades.set(
      this.especialidades.filter((especialidad) =>
        especialidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  toggleEspecialidad(especialidad: Especialidad): void {
    const currentEspecialidades = [...this.selectedEspecialidades]
    const index = currentEspecialidades.indexOf(especialidad.id)

    if (index === -1) {
      currentEspecialidades.push(especialidad.id)
    } else {
      currentEspecialidades.splice(index, 1)
    }

    this.selectedEspecialidadesChange.emit(currentEspecialidades)
  }

  removeSpecialty(especialidadId: number): void {
    const updatedEspecialidades = this.selectedEspecialidades.filter((id) => id !== especialidadId)
    this.selectedEspecialidadesChange.emit(updatedEspecialidades)
  }

  getEspecialidadName(id: number): string {
    const especialidad = this.especialidades.find((e) => e.id === id)
    return especialidad ? especialidad.nombre : "Cargando..."
  }
}
