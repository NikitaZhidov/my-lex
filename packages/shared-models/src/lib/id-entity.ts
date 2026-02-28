export interface IdEntity<T = unknown> {
  id?: T;
}

export interface AuditEntity<T = unknown> extends IdEntity<T> {
  createdAt?: Date;
  updatedAt?: Date;
}
