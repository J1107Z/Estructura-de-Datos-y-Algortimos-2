export type ItemType = 'carpeta' | 'archivo';

export interface FileItem {
  id?: string;
  nombre: string;
  tipo: ItemType;
  creadoPor: string;
  fechaCreacion: string;
  parentId: string | null;
  extension?: string;
}
